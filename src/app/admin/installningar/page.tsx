'use client'

import { useEffect, useState, useCallback } from 'react'
import styles from './installningar.module.css'

type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

interface DayHours {
  open: boolean
  from: string
  to: string
}

type OpeningHours = Record<DayKey, DayHours>

interface SalonInfo {
  namn: string
  adress: string
  telefon: string
  email: string
  instagram: string
}

interface Notifications {
  booking_email: boolean
  reminder_24h: boolean
  reminder_sms: boolean
}

const DAY_LABELS: Record<DayKey, string> = {
  monday: 'Måndag',
  tuesday: 'Tisdag',
  wednesday: 'Onsdag',
  thursday: 'Torsdag',
  friday: 'Fredag',
  saturday: 'Lördag',
  sunday: 'Söndag',
}

const DAY_ORDER: DayKey[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const DEFAULT_HOURS: OpeningHours = {
  monday: { open: true, from: '09:00', to: '18:00' },
  tuesday: { open: true, from: '09:00', to: '18:00' },
  wednesday: { open: true, from: '09:00', to: '18:00' },
  thursday: { open: true, from: '09:00', to: '18:00' },
  friday: { open: true, from: '09:00', to: '17:00' },
  saturday: { open: true, from: '10:00', to: '15:00' },
  sunday: { open: false, from: '10:00', to: '15:00' },
}

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className={`${styles.toast} ${ok ? styles.toastOk : styles.toastErr}`}>
      <i className={`ti ${ok ? 'ti-check' : 'ti-x'}`} />
      {msg}
    </div>
  )
}

export default function InstallningarPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const [hours, setHours] = useState<OpeningHours>(DEFAULT_HOURS)
  const [salon, setSalon] = useState<SalonInfo>({ namn: '', adress: '', telefon: '', email: '', instagram: '' })
  const [notifs, setNotifs] = useState<Notifications>({ booking_email: true, reminder_24h: true, reminder_sms: false })
  const [closedDates, setClosedDates] = useState<string[]>([])
  const [newDate, setNewDate] = useState('')

  useEffect(() => {
    fetch('/api/admin/installningar')
      .then(r => r.json())
      .then(json => {
        if (json.ok && json.data) {
          if (json.data.opening_hours) setHours(json.data.opening_hours as OpeningHours)
          if (json.data.salon_info) setSalon(json.data.salon_info as SalonInfo)
          if (json.data.notifications) setNotifs(json.data.notifications as Notifications)
          if (json.data.closed_dates) setClosedDates(json.data.closed_dates as string[])
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const showToast = useCallback((msg: string, ok: boolean) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }, [])

  async function save(key: string, value: unknown) {
    setSaving(key)
    const res = await fetch('/api/admin/installningar', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    })
    const json = await res.json()
    setSaving(null)
    showToast(json.ok ? 'Sparat!' : 'Fel — försök igen', json.ok)
  }

  function updateDay(day: DayKey, field: keyof DayHours, val: string | boolean) {
    setHours(prev => ({ ...prev, [day]: { ...prev[day], [field]: val } }))
  }

  function addClosedDate() {
    if (!newDate || closedDates.includes(newDate)) return
    const updated = [...closedDates, newDate].sort()
    setClosedDates(updated)
    setNewDate('')
    save('closed_dates', updated)
  }

  function removeClosedDate(date: string) {
    const updated = closedDates.filter(d => d !== date)
    setClosedDates(updated)
    save('closed_dates', updated)
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Inställningar</h1>
        </div>
        <div className={styles.skeletonGrid}>
          {[1, 2, 3].map(i => <div key={i} className={styles.skeleton} style={{ height: 200 }} />)}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Inställningar</h1>
          <p className={styles.sub}>Salong, öppettider &amp; notiser</p>
        </div>
      </div>

      {/* ── Salongsinformation ── */}
      <div className={styles.sektion}>
        <div className={styles.sektionTop}>
          <h2 className={styles.sektionTitel}>
            <i className="ti ti-building-store" />
            Salongsinformation
          </h2>
        </div>

        <div className={styles.formGrid}>
          {([
            { key: 'namn', label: 'Salong', type: 'text', placeholder: 'Atilli Berg' },
            { key: 'adress', label: 'Adress', type: 'text', placeholder: 'Göteborg' },
            { key: 'telefon', label: 'Telefon', type: 'tel', placeholder: '031-xxx xx xx' },
            { key: 'email', label: 'E-post', type: 'email', placeholder: 'info@atilliberg.se' },
            { key: 'instagram', label: 'Instagram', type: 'text', placeholder: '@atilliberg' },
          ] as { key: keyof SalonInfo; label: string; type: string; placeholder: string }[]).map(f => (
            <div key={f.key} className={styles.field}>
              <label className={styles.label}>{f.label}</label>
              <input
                className={styles.input}
                type={f.type}
                placeholder={f.placeholder}
                value={salon[f.key]}
                onChange={e => setSalon(prev => ({ ...prev, [f.key]: e.target.value }))}
              />
            </div>
          ))}
        </div>

        <div className={styles.sektionFot}>
          <button
            className={styles.sparaBtn}
            onClick={() => save('salon_info', salon)}
            disabled={saving === 'salon_info'}
          >
            {saving === 'salon_info' ? 'Sparar...' : 'Spara information'}
          </button>
        </div>
      </div>

      {/* ── Öppettider ── */}
      <div className={styles.sektion}>
        <div className={styles.sektionTop}>
          <h2 className={styles.sektionTitel}>
            <i className="ti ti-clock" />
            Öppettider
          </h2>
        </div>

        <div className={styles.daysGrid}>
          {DAY_ORDER.map(day => (
            <div key={day} className={`${styles.dayRow} ${!hours[day]?.open ? styles.dayStangd : ''}`}>
              <div className={styles.dayLeft}>
                <label className={styles.toggleWrap}>
                  <input
                    type="checkbox"
                    className={styles.toggleInput}
                    checked={hours[day]?.open ?? false}
                    onChange={e => updateDay(day, 'open', e.target.checked)}
                  />
                  <span className={styles.toggle} />
                </label>
                <span className={styles.dayNamn}>{DAY_LABELS[day]}</span>
              </div>

              {hours[day]?.open ? (
                <div className={styles.dayTider}>
                  <input
                    type="time"
                    className={styles.timeInput}
                    value={hours[day]?.from}
                    onChange={e => updateDay(day, 'from', e.target.value)}
                  />
                  <span className={styles.tidDash}>–</span>
                  <input
                    type="time"
                    className={styles.timeInput}
                    value={hours[day]?.to}
                    onChange={e => updateDay(day, 'to', e.target.value)}
                  />
                </div>
              ) : (
                <span className={styles.stangdText}>Stängt</span>
              )}
            </div>
          ))}
        </div>

        <div className={styles.sektionFot}>
          <button
            className={styles.sparaBtn}
            onClick={() => save('opening_hours', hours)}
            disabled={saving === 'opening_hours'}
          >
            {saving === 'opening_hours' ? 'Sparar...' : 'Spara öppettider'}
          </button>
        </div>
      </div>

      {/* ── Stängda dagar ── */}
      <div className={styles.sektion}>
        <div className={styles.sektionTop}>
          <h2 className={styles.sektionTitel}>
            <i className="ti ti-calendar-off" />
            Stängda dagar &amp; semester
          </h2>
        </div>

        <div className={styles.closedWrap}>
          <div className={styles.addDateRow}>
            <input
              type="date"
              className={styles.input}
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              style={{ maxWidth: 200 }}
            />
            <button className={styles.sparaBtn} onClick={addClosedDate} disabled={!newDate}>
              + Lägg till
            </button>
          </div>

          {closedDates.length === 0 ? (
            <p className={styles.tomText}>Inga stängda dagar inlagda.</p>
          ) : (
            <div className={styles.dateList}>
              {closedDates.map(d => {
                const formatted = new Date(d).toLocaleDateString('sv-SE', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                })
                return (
                  <div key={d} className={styles.dateChip}>
                    <i className="ti ti-calendar-event" />
                    <span>{formatted}</span>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeClosedDate(d)}
                      aria-label="Ta bort"
                    >
                      <i className="ti ti-x" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div style={{ height: 20 }} />
      </div>

      {/* ── Notiser ── */}
      <div className={styles.sektion}>
        <div className={styles.sektionTop}>
          <h2 className={styles.sektionTitel}>
            <i className="ti ti-bell" />
            Notiser
          </h2>
        </div>

        <div className={styles.notisGrid}>
          {([
            { key: 'booking_email', label: 'Bekräftelsemejl vid ny bokning', sub: 'Skickas till kund och ägare automatiskt' },
            { key: 'reminder_24h', label: 'Påminnelse 24h innan', sub: 'Mejl till kunden dagen före' },
            { key: 'reminder_sms', label: 'SMS-påminnelse (kommer snart)', sub: 'Kräver Twilio-integration', disabled: true },
          ] as { key: keyof Notifications; label: string; sub: string; disabled?: boolean }[]).map(n => (
            <div key={n.key} className={`${styles.notisRow} ${n.disabled ? styles.notisDisabled : ''}`}>
              <div>
                <p className={styles.notisLabel}>{n.label}</p>
                <p className={styles.notisSub}>{n.sub}</p>
              </div>
              <label className={styles.toggleWrap}>
                <input
                  type="checkbox"
                  className={styles.toggleInput}
                  checked={notifs[n.key]}
                  disabled={n.disabled}
                  onChange={e => setNotifs(prev => ({ ...prev, [n.key]: e.target.checked }))}
                />
                <span className={styles.toggle} />
              </label>
            </div>
          ))}
        </div>

        <div className={styles.sektionFot}>
          <button
            className={styles.sparaBtn}
            onClick={() => save('notifications', notifs)}
            disabled={saving === 'notifications'}
          >
            {saving === 'notifications' ? 'Sparar...' : 'Spara notiser'}
          </button>
        </div>
      </div>
    </div>
  )
}