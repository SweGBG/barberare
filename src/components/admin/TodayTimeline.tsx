'use client'

import { useEffect, useState } from 'react'
import styles from './TodayTimeline.module.css'

type TimelineBooking = {
  id: string
  booking_date: string
  status: string
  duration_minutes: number | null
  client_name: string | null
  services: { name: string } | null
}

export default function TodayTimeline() {
  const [bookings, setBookings] = useState<TimelineBooking[]>([])
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    booking_date: '',
    booking_time: '',
    duration_minutes: '30',
    price: '',
    notes: '',
  })

  useEffect(() => {
    fetchToday()
  }, [])

  async function fetchToday() {
    const res = await fetch('/api/admin/booking')
    const json = await res.json()
    const today = new Date().toLocaleDateString('sv-SE', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    })
    const filtered = (json.data ?? []).filter((b: TimelineBooking) => {
      const dStr = new Date(b.booking_date).toLocaleDateString('sv-SE', {
        year: 'numeric', month: '2-digit', day: '2-digit'
      })
      return dStr === today
    })
    setBookings(filtered)
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
        duration_minutes: parseInt(form.duration_minutes),
        price: parseInt(form.price) || 0,
        notes: form.notes,
      }),
    })
    setSaving(false)
    setShowModal(false)
    setForm({
      client_name: '', client_email: '', client_phone: '',
      booking_date: '', booking_time: '', duration_minutes: '30',
      price: '', notes: '',
    })
    fetchToday()
  }

  return (
    <>
      <div className={styles.panel}>
        <div className={styles.header}>
          <span className={styles.title}>Tidslinje · Idag</span>
          <span className={styles.action}>Redigera</span>
        </div>

        <div className={styles.body}>
          <div className={styles.timeline}>
            {bookings.length === 0 && (
              <p style={{ color: '#9A9088', fontSize: '13px', padding: '16px 0' }}>
                Inga bokningar idag
              </p>
            )}
            {bookings.map((b) => {
              const time = new Date(b.booking_date).toLocaleTimeString('sv-SE', {
                hour: '2-digit', minute: '2-digit'
              })
              const isActive = b.status === 'in_progress'
              const isDone = b.status === 'completed'
              return (
                <div key={b.id} className={styles.slot}>
                  <span className={styles.time}>{time}</span>
                  <span className={`${styles.dot} ${isActive ? styles.dotActive : isDone ? styles.dotDone : ''}`} />
                  <div className={`${styles.card} ${isActive ? styles.cardActive : ''}`}>
                    <p className={styles.clientName}>
                      {b.client_name ?? 'Okänd'}{isActive && ' — Pågår nu'}
                    </p>
                    <p className={styles.service}>
                      {(b.services as any)?.[0]?.name ?? (b.services as any)?.name ?? '–'}
                    </p>
                    <span className={`${styles.duration} ${isActive ? styles.durationActive : ''}`}>
                      {b.duration_minutes ?? 30} min{isDone ? ' · Klar' : ''}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className={styles.quickActions}>
          <button className={styles.qaBtn} onClick={() => setShowModal(true)}>
            Lägg klient
          </button>
          <button className={styles.qaBtn}>
            Skicka påm.
          </button>
          <button className={styles.newBooking} onClick={() => setShowModal(true)}>
            + Ny bokning
          </button>
        </div>
      </div>

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