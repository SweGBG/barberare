'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import TimeSlotPicker from '@/components/admin/TimeSlotPicker'
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

const EMPTY_FORM = {
  client_name: '',
  client_email: '',
  client_phone: '',
  booking_date: '',
  booking_time: '',
  service_id: '',
  duration_minutes: '30',
  price: '',
  notes: '',
}

export default function BokningarPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'alla' | 'idag' | 'kommande' | 'historik'>('idag')
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [bookedTimes, setBookedTimes] = useState<string[]>([])

  const supabase = createClient()

  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    fetchBookings()
    fetchServices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Hämta upptagna tider när datum väljs i modalen — gråas ut i TimeSlotPicker
  useEffect(() => {
    if (!form.booking_date) {
      setBookedTimes([])
      return
    }

    supabase
      .from('bookings')
      .select('booking_date')
      .gte('booking_date', `${form.booking_date}T00:00:00`)
      .lte('booking_date', `${form.booking_date}T23:59:59`)
      .in('status', ['confirmed', 'pending', 'in_progress'])
      .then(({ data, error }) => {
        if (error) {
          console.error('Kunde inte hämta upptagna tider:', error.message)
          return
        }
        setBookedTimes(
          (data ?? []).map(b =>
            new Date(b.booking_date).toLocaleTimeString('sv-SE', {
              hour: '2-digit',
              minute: '2-digit',
            })
          )
        )
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.booking_date])

  async function fetchServices() {
    const { data, error } = await supabase
      .from('services')
      .select('id, name, price, duration_minutes')
      .order('name')

    if (error) console.error('Kunde inte hämta tjänster:', error.message)
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

  // När tjänst väljs — fyll i pris och varaktighet automatiskt
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
    try {
      const res = await fetch('/api/admin/booking/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => null)
        alert(`Kunde inte ändra status: ${json?.error ?? res.statusText}`)
      }
    } catch (err) {
      console.error('handleStatusChange error:', err)
      alert('Kunde inte ändra status — kontrollera anslutningen.')
    }
    fetchBookings()
  }

  async function handleDelete(id: string) {
    if (!confirm('Är du säker på att du vill radera denna bokning?')) return

    try {
      const res = await fetch(`/api/admin/booking?id=${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const json = await res.json().catch(() => null)
        alert(`Kunde inte radera: ${json?.error ?? res.statusText}`)
      }
    } catch (err) {
      console.error('handleDelete error:', err)
      alert('Kunde inte radera — kontrollera anslutningen.')
    }
    fetchBookings()
  }

  function openModal() {
    setForm(EMPTY_FORM)
    setFormError(null)
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setFormError(null)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    // Validera — konvertera strängar till number här, inte i onChange
    const duration = Number(form.duration_minutes)
    const price = form.price === '' ? 0 : Number(form.price)

    if (!form.client_name.trim()) {
      setFormError('Ange klientens namn.')
      return
    }
    if (!form.booking_date) {
      setFormError('Välj ett datum.')
      return
    }
    if (!form.booking_time) {
      setFormError('Välj en tid.')
      return
    }
    if (Number.isNaN(duration) || duration < 5) {
      setFormError('Ange en giltig varaktighet (minst 5 min).')
      return
    }
    if (Number.isNaN(price) || price < 0) {
      setFormError('Ange ett giltigt pris.')
      return
    }

    setSaving(true)
    const booking_date = `${form.booking_date}T${form.booking_time}:00`

    try {
      const res = await fetch('/api/admin/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: form.client_name.trim(),
          client_email: form.client_email.trim() || null,
          client_phone: form.client_phone.trim() || null,
          booking_date,
          service_id: form.service_id || null,
          duration_minutes: duration,
          price,
          notes: form.notes.trim() || null,
        }),
      })

      setSaving(false)

      if (!res.ok) {
        const json = await res.json().catch(() => null)
        setFormError(`Kunde inte spara: ${json?.error ?? res.statusText}`)
        return
      }
    } catch (err) {
      console.error('handleCreate error:', err)
      setSaving(false)
      setFormError('Kunde inte spara — kontrollera anslutningen.')
      return
    }

    setShowModal(false)
    setForm(EMPTY_FORM)
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
          <button className={styles.newBtn} onClick={openModal}>
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

      {/* MODAL — NY BOKNING */}
      {showModal && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Ny bokning</h2>
              <button className={styles.closeBtn} onClick={closeModal} aria-label="Stäng">✕</button>
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

                {/* Tjänst-dropdown — fyller i pris & varaktighet automatiskt */}
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
                    onChange={e => setForm({ ...form, booking_date: e.target.value, booking_time: '' })}
                    required />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Varaktighet (min)</label>
                  <input className={styles.input} type="number" min="5" step="1"
                    value={form.duration_minutes}
                    onChange={e => setForm({ ...form, duration_minutes: e.target.value })} />
                </div>

                {/* Tid — slot-grid istället för native time-input */}
                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label className={styles.label}>Tid *</label>
                  <TimeSlotPicker
                    value={form.booking_time}
                    onChange={time => setForm({ ...form, booking_time: time })}
                    open="09:00"
                    close="18:00"
                    stepMin={15}
                    bookedTimes={bookedTimes}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Pris (kr)</label>
                  <input className={styles.input} type="number" min="0" step="1"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })} />
                </div>

                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label className={styles.label}>Notering</label>
                  <textarea className={styles.textarea} value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} />
                </div>
              </div>

              {formError && (
                <p className={styles.formError} role="alert">{formError}</p>
              )}

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={closeModal}>
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