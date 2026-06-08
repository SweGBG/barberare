'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './TodayTimeline.module.css'

type Service = {
  id: string
  name: string
  price: number
  duration_minutes: number
}

type TimelineBooking = {
  id: string
  booking_date: string
  status: string
  duration_minutes: number | null
  price: number | null
  client_name: string | null
  client_email: string | null
  client_phone: string | null
  notes: string | null
  services: { name: string } | null
}

const STATUS_LABELS: Record<string, string> = {
  confirmed: 'Bekräftad',
  pending: 'Väntar',
  in_progress: 'Pågår nu',
  completed: 'Klar',
  cancelled: 'Avbokad',
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: '#3d7a5f',
  pending: '#B8956A',
  in_progress: '#1C1A17',
  completed: '#4a7c59',
  cancelled: '#c0392b',
}

export default function TodayTimeline() {
  const [bookings, setBookings] = useState<TimelineBooking[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [editMode, setEditMode] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    booking_date: new Date().toISOString().slice(0, 10),
    booking_time: '',
    service_id: '',
    duration_minutes: '30',
    price: '',
    notes: '',
  })

  useEffect(() => {
    fetchToday()
    fetchServices()
  }, [])

  async function fetchServices() {
    const supabase = createClient()
    const { data } = await supabase
      .from('services')
      .select('id, name, price, duration_minutes')
      .order('price')
    if (data) setServices(data)
  }

  async function fetchToday() {
    const res = await fetch('/api/admin/booking')
    const json = await res.json()
    const today = new Date().toLocaleDateString('sv-SE', {
      year: 'numeric', month: '2-digit', day: '2-digit',
    })
    const filtered = (json.data ?? []).filter((b: TimelineBooking) => {
      const dStr = new Date(b.booking_date).toLocaleDateString('sv-SE', {
        year: 'numeric', month: '2-digit', day: '2-digit',
      })
      return dStr === today
    })
    // Sortera på tid
    filtered.sort((a: TimelineBooking, b: TimelineBooking) =>
      new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime()
    )
    setBookings(filtered)
  }

  function handleServiceChange(serviceId: string) {
    const svc = services.find(s => s.id === serviceId)
    setForm(prev => ({
      ...prev,
      service_id: serviceId,
      duration_minutes: svc ? String(svc.duration_minutes) : prev.duration_minutes,
      price: svc ? String(svc.price) : prev.price,
    }))
  }

  async function handleStatusChange(id: string, status: string) {
    await fetch('/api/admin/booking/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    fetchToday()
  }

  async function handleDelete(id: string) {
    if (!confirm('Radera denna bokning?')) return
    setDeletingId(id)
    await fetch(`/api/admin/booking?id=${id}`, { method: 'DELETE' })
    setDeletingId(null)
    fetchToday()
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
        service_id: form.service_id || null,
        duration_minutes: parseInt(form.duration_minutes),
        price: parseInt(form.price) || 0,
        notes: form.notes,
      }),
    })
    setSaving(false)
    setShowModal(false)
    setForm({
      client_name: '', client_email: '', client_phone: '',
      booking_date: new Date().toISOString().slice(0, 10),
      booking_time: '', service_id: '',
      duration_minutes: '30', price: '', notes: '',
    })
    fetchToday()
  }

  const getServiceName = (b: TimelineBooking) =>
    (b.services as any)?.[0]?.name ?? (b.services as any)?.name ?? '–'

  return (
    <>
      <div className={styles.panel}>
        <div className={styles.header}>
          <span className={styles.title}>Tidslinje · Idag</span>
          <button
            className={styles.action}
            onClick={() => setEditMode(!editMode)}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {editMode ? 'Stäng' : 'Redigera'}
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.timeline}>
            {bookings.length === 0 && (
              <p style={{ color: '#9A9088', fontSize: '13px', padding: '16px 0' }}>
                Inga bokningar idag
              </p>
            )}
            {bookings.map((b) => {
              const time = new Date(b.booking_date).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
              const isActive = b.status === 'in_progress'
              const isDone = b.status === 'completed'
              const isCancelled = b.status === 'cancelled'

              return (
                <div key={b.id} className={styles.slot} style={{ opacity: isCancelled ? 0.45 : 1 }}>
                  <span className={styles.time}>{time}</span>
                  <span className={`${styles.dot} ${isActive ? styles.dotActive : isDone ? styles.dotDone : ''}`} />
                  <div className={`${styles.card} ${isActive ? styles.cardActive : ''}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <p className={styles.clientName}>
                        {b.client_name ?? 'Okänd'}{isActive && ' — Pågår nu'}
                      </p>
                      {/* Status-badge */}
                      <span style={{
                        fontSize: 9,
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: STATUS_COLORS[b.status] ?? '#9A9088',
                        whiteSpace: 'nowrap',
                        paddingTop: 2,
                      }}>
                        {STATUS_LABELS[b.status] ?? b.status}
                      </span>
                    </div>
                    <p className={styles.service}>{getServiceName(b)}</p>
                    <span className={`${styles.duration} ${isActive ? styles.durationActive : ''}`}>
                      {b.duration_minutes ?? 30} min{isDone ? ' · Klar' : ''}
                    </span>

                    {/* Redigera-kontroller */}
                    {editMode && (
                      <div style={{
                        marginTop: 10,
                        paddingTop: 10,
                        borderTop: '0.5px solid var(--border)',
                        display: 'flex',
                        gap: 6,
                        flexWrap: 'wrap',
                        alignItems: 'center',
                      }}>
                        <select
                          value={b.status}
                          onChange={e => handleStatusChange(b.id, e.target.value)}
                          style={{
                            fontSize: 11,
                            padding: '4px 8px',
                            background: 'var(--cream)',
                            border: '0.5px solid var(--border)',
                            borderRadius: 6,
                            color: 'var(--dark)',
                            cursor: 'pointer',
                            fontFamily: 'Inter, sans-serif',
                          }}
                        >
                          <option value="pending">Väntar</option>
                          <option value="confirmed">Bekräftad</option>
                          <option value="in_progress">Pågår nu</option>
                          <option value="completed">Klar</option>
                          <option value="cancelled">Avboka</option>
                        </select>

                        {b.price && (
                          <span style={{ fontSize: 11, color: 'var(--gold)', fontStyle: 'italic' }}>
                            {b.price.toLocaleString('sv-SE')} kr
                          </span>
                        )}

                        <button
                          onClick={() => handleDelete(b.id)}
                          disabled={deletingId === b.id}
                          style={{
                            marginLeft: 'auto',
                            fontSize: 11,
                            padding: '4px 10px',
                            background: 'none',
                            border: '0.5px solid #c0392b',
                            borderRadius: 6,
                            color: '#c0392b',
                            cursor: 'pointer',
                          }}
                        >
                          {deletingId === b.id ? '...' : 'Radera'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className={styles.quickActions}>
          <button className={styles.qaBtn} onClick={() => { setShowModal(true); setEditMode(false) }}>
            Lägg klient
          </button>
          <button className={styles.qaBtn}>
            Skicka påm.
          </button>
          <button className={styles.newBooking} onClick={() => { setShowModal(true); setEditMode(false) }}>
            + Ny bokning
          </button>
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

                {/* TJÄNST – autofyll pris & tid */}
                <div className={styles.field}>
                  <label className={styles.label}>Tjänst</label>
                  <select className={styles.input} value={form.service_id}
                    onChange={e => handleServiceChange(e.target.value)}>
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
    </>
  )
}