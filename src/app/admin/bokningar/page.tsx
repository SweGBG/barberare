'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import styles from './bokningar.module.css'

type Service = {
  id: string
  name: string
  price: number
  duration_minutes: number
}

type Booking = {
  id: string
  client_name: string | null
  client_email: string | null
  client_phone: string | null
  booking_date: string
  status: string
  duration_minutes: number | null
  price: number | null
  notes: string | null
  services: { name: string } | null
}

const STATUS_LABELS: Record<string, string> = {
  confirmed: 'Bekräftad',
  pending: 'Väntar',
  in_progress: 'Pågår',
  completed: 'Genomförd',
  cancelled: 'Avbokad',
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: styles.confirmed,
  pending: styles.pending,
  in_progress: styles.inProgress,
  completed: styles.completed,
  cancelled: styles.cancelled,
}

export default function BokningarPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'alla' | 'idag' | 'kommande' | 'historik'>('idag')
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    booking_date: '',
    booking_time: '',
    service_id: '',   // ← NY
    duration_minutes: '30',
    price: '',
    notes: '',
  })

  useEffect(() => {
    fetchBookings()
    fetchServices()
  }, [])

  // Hämta tjänster från Supabase direkt
  async function fetchServices() {
    const { data } = await supabase
      .from('services')
      .select('id, name, price, duration_minutes')
      .order('name')
    if (data) setServices(data)
  }

  async function fetchBookings() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/booking')
      const json = await res.json()
      setBookings(json.data ?? [])
    } catch (err) {
      console.error('fetchBookings error:', err)
      setBookings([])
    }
    setLoading(false)
  }

  // När tjänst väljs – fyll i pris och tid automatiskt
  function handleServiceChange(serviceId: string) {
    const svc = services.find(s => s.id === serviceId)
    setForm(prev => ({
      ...prev,
      service_id: serviceId,
      duration_minutes: svc ? String(svc.duration_minutes) : prev.duration_minutes,
      price: svc ? String(svc.price) : prev.price,
    }))
  }

  function getFiltered() {
    const now = new Date()
    const todayStr = now.toLocaleDateString('sv-SE', {
      year: 'numeric', month: '2-digit', day: '2-digit',
    })
    return bookings.filter(b => {
      const dStr = new Date(b.booking_date).toLocaleDateString('sv-SE', {
        year: 'numeric', month: '2-digit', day: '2-digit',
      })
      if (filter === 'idag') return dStr === todayStr
      if (filter === 'kommande') return dStr > todayStr
      if (filter === 'historik') return dStr < todayStr
      return true
    })
  }

  async function handleStatusChange(id: string, status: string) {
    await fetch('/api/admin/booking/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    fetchBookings()
  }

  async function handleDelete(id: string) {
    if (!confirm('Är du säker på att du vill radera denna bokning?')) return
    await fetch(`/api/admin/booking?id=${id}`, { method: 'DELETE' })
    fetchBookings()
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const booking_date = `${form.booking_date}T${form.booking_time}:00`

    await fetch('/api/admin/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_name: form.client_name,
        client_email: form.client_email,
        client_phone: form.client_phone,
        booking_date,
        service_id: form.service_id || null,   // ← NY
        duration_minutes: parseInt(form.duration_minutes),
        price: parseInt(form.price) || 0,
        notes: form.notes,
      }),
    })

    setSaving(false)
    setShowModal(false)
    setForm({
      client_name: '', client_email: '', client_phone: '',
      booking_date: '', booking_time: '', service_id: '',
      duration_minutes: '30', price: '', notes: '',
    })
    fetchBookings()
  }

  const filtered = getFiltered()

  return (
    <AdminLayout>
      <div className={styles.page}>

        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Bokningar</h1>
            <p className={styles.sub}>{filtered.length} bokningar</p>
          </div>
          <button className={styles.newBtn} onClick={() => setShowModal(true)}>
            + Ny bokning
          </button>
        </div>

        <div className={styles.filters}>
          {(['idag', 'kommande', 'historik', 'alla'] as const).map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className={styles.panel}>
          <div className={styles.tableHead}>
            <span>Klient</span>
            <span>Datum & Tid</span>
            <span>Tjänst</span>
            <span>Pris</span>
            <span>Status</span>
            <span>Åtgärd</span>
          </div>

          {loading ? (
            <div className={styles.empty}>Laddar...</div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>Inga bokningar</div>
          ) : (
            filtered.map(b => {
              const date = new Date(b.booking_date)
              const datum = date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })
              const tid = date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
              const svcName = (b.services as any)?.[0]?.name ?? (b.services as any)?.name ?? '–'

              return (
                <div key={b.id} className={styles.row}>
                  <div>
                    <p className={styles.clientName}>{b.client_name ?? '–'}</p>
                    <p className={styles.clientSub}>{b.client_phone ?? b.client_email ?? ''}</p>
                  </div>
                  <div>
                    <p className={styles.dateMain}>{datum}</p>
                    <p className={styles.dateSub}>{tid} · {b.duration_minutes ?? 30} min</p>
                  </div>
                  <div className={styles.service}>{svcName}</div>
                  <div className={styles.price}>
                    {b.price ? `${b.price.toLocaleString('sv-SE')} kr` : '–'}
                  </div>
                  <div>
                    <span className={`${styles.badge} ${STATUS_COLORS[b.status] ?? ''}`}>
                      {STATUS_LABELS[b.status] ?? b.status}
                    </span>
                  </div>
                  <div className={styles.actions}>
                    <select
                      className={styles.statusSelect}
                      value={b.status}
                      onChange={e => handleStatusChange(b.id, e.target.value)}
                    >
                      <option value="pending">Väntar</option>
                      <option value="confirmed">Bekräftad</option>
                      <option value="in_progress">Pågår</option>
                      <option value="completed">Genomförd</option>
                      <option value="cancelled">Avboka</option>
                    </select>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(b.id)}>
                      Radera
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* MODAL – NY BOKNING */}
      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Ny bokning</h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate} className={styles.form}>
              <div className={styles.formGrid}>

                <div className={styles.field}>
                  <label className={styles.label}>Namn *</label>
                  <input className={styles.input} value={form.client_name}
                    onChange={e => setForm({ ...form, client_name: e.target.value })} required />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>E-post</label>
                  <input className={styles.input} type="email" value={form.client_email}
                    onChange={e => setForm({ ...form, client_email: e.target.value })} />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Telefon</label>
                  <input className={styles.input} type="tel" value={form.client_phone}
                    onChange={e => setForm({ ...form, client_phone: e.target.value })} />
                </div>

                {/* TJÄNST-DROPDOWN – fyller i pris & tid automatiskt */}
                <div className={styles.field}>
                  <label className={styles.label}>Tjänst</label>
                  <select
                    className={styles.input}
                    value={form.service_id}
                    onChange={e => handleServiceChange(e.target.value)}
                  >
                    <option value="">– Välj tjänst –</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} · {s.price} kr · {s.duration_minutes} min
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Datum *</label>
                  <input className={styles.input} type="date" value={form.booking_date}
                    onChange={e => setForm({ ...form, booking_date: e.target.value })} required />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Tid *</label>
                  <input className={styles.input} type="time" value={form.booking_time}
                    onChange={e => setForm({ ...form, booking_time: e.target.value })} required />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Varaktighet (min)</label>
                  <input className={styles.input} type="number" value={form.duration_minutes}
                    onChange={e => setForm({ ...form, duration_minutes: e.target.value })} />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Pris (kr)</label>
                  <input className={styles.input} type="number" value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })} />
                </div>

                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label className={styles.label}>Notering</label>
                  <textarea className={styles.textarea} value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} />
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                  Avbryt
                </button>
                <button type="submit" className={styles.saveBtn} disabled={saving}>
                  {saving ? 'Sparar...' : 'Skapa bokning & skicka mail'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}