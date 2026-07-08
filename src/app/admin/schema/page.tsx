'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import styles from './schema.module.css'

const DAYS = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag']
const DAYS_SHORT = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör']

type Booking = {
  id: string
  client_name: string | null
  client_phone: string | null
  booking_date: string
  duration_minutes: number | null
  status: string
  price: number | null
}

type OpeningHour = {
  id: string
  day_of_week: number
  is_open: boolean
  open_time: string
  close_time: string
}

export default function SchemaPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [openingHours, setOpeningHours] = useState<OpeningHour[]>([])
  const [weekOffset, setWeekOffset] = useState(0)
  const [loading, setLoading] = useState(true)
  const [savingHours, setSavingHours] = useState(false)
  const [activeTab, setActiveTab] = useState<'kalender' | 'oppettider'>('kalender')
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set())
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [weekOffset])

  async function fetchData() {
    setLoading(true)
    const monday = getMonday(weekOffset)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    sunday.setHours(23, 59, 59)

    const [{ data: bData }, { data: ohData }] = await Promise.all([
      supabase
        .from('bookings')
        .select('id, client_name, client_phone, booking_date, duration_minutes, status, price')
        .gte('booking_date', monday.toISOString())
        .lte('booking_date', sunday.toISOString())
        .neq('status', 'cancelled')
        .order('booking_date', { ascending: true }),
      supabase
        .from('opening_hours')
        .select('*')
        .order('day_of_week', { ascending: true })
    ])

    setBookings(bData ?? [])
    setOpeningHours(ohData ?? [])
    setLoading(false)
  }

  function toggleExpand(i: number) {
    setExpandedDays(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  function getMonday(offset: number) {
    const now = new Date()
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(now.setDate(diff + offset * 7))
    monday.setHours(0, 0, 0, 0)
    return monday
  }

  function getWeekDays() {
    const monday = getMonday(weekOffset)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      return d
    })
  }

  function getBookingsForDay(date: Date) {
    const dateStr = date.toISOString().split('T')[0]
    return bookings.filter(b => b.booking_date.startsWith(dateStr))
  }

  function getOpeningHourForDay(date: Date) {
    const dow = date.getDay()
    return openingHours.find(oh => oh.day_of_week === dow)
  }

  function getAvailableSlots(date: Date, oh: OpeningHour | undefined) {
    if (!oh || !oh.is_open) return []
    const dayBookings = getBookingsForDay(date)
    const slots: string[] = []
    const [openH, openM] = oh.open_time.split(':').map(Number)
    const [closeH, closeM] = oh.close_time.split(':').map(Number)
    let current = openH * 60 + openM
    const close = closeH * 60 + closeM

    while (current + 30 <= close) {
      const h = Math.floor(current / 60).toString().padStart(2, '0')
      const m = (current % 60).toString().padStart(2, '0')
      const slotTime = `${h}:${m}`
      const slotDate = new Date(date)
      slotDate.setHours(parseInt(h), parseInt(m), 0, 0)

      const isBooked = dayBookings.some(b => {
        const bStart = new Date(b.booking_date)
        const bEnd = new Date(bStart.getTime() + (b.duration_minutes ?? 30) * 60000)
        return slotDate >= bStart && slotDate < bEnd
      })

      if (!isBooked) slots.push(slotTime)
      current += 30
    }
    return slots
  }

  async function saveOpeningHours() {
    setSavingHours(true)
    for (const oh of openingHours) {
      await supabase
        .from('opening_hours')
        .update({
          is_open: oh.is_open,
          open_time: oh.open_time,
          close_time: oh.close_time,
        })
        .eq('id', oh.id)
    }
    setSavingHours(false)
  }

  function updateHour(id: string, field: keyof OpeningHour, value: any) {
    setOpeningHours(prev => prev.map(oh => oh.id === id ? { ...oh, [field]: value } : oh))
  }

  const weekDays = getWeekDays()
  const monday = getMonday(weekOffset)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const weekLabel = `${monday.getDate()} ${monday.toLocaleDateString('sv-SE', { month: 'short' })} — ${sunday.getDate()} ${sunday.toLocaleDateString('sv-SE', { month: 'short', year: 'numeric' })}`

  return (
    <AdminLayout>
      <div className={styles.page}>

        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Schema</h1>
            <p className={styles.sub}>{weekLabel}</p>
          </div>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'kalender' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('kalender')}
            >
              Kalender
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'oppettider' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('oppettider')}
            >
              Öppettider
            </button>
          </div>
        </div>

        {activeTab === 'kalender' && (
          <>
            <div className={styles.weekNav}>
              <button className={styles.navBtn} onClick={() => setWeekOffset(w => w - 1)}>← Förra</button>
              <button className={styles.todayBtn} onClick={() => setWeekOffset(0)}>Idag</button>
              <button className={styles.navBtn} onClick={() => setWeekOffset(w => w + 1)}>Nästa →</button>
            </div>

            <div className={styles.calendar}>
              {weekDays.map((day, i) => {
                const dayBookings = getBookingsForDay(day)
                const oh = getOpeningHourForDay(day)
                const isToday = day.toDateString() === new Date().toDateString()
                const isClosed = !oh?.is_open
                const availableSlots = getAvailableSlots(day, oh)
                const isExpanded = expandedDays.has(i)

                return (
                  <div key={i} className={`${styles.dayCol} ${isToday ? styles.today : ''} ${isClosed ? styles.closed : ''}`}>
                    <div className={styles.dayHeader}>
                      <span className={styles.dayName}>{DAYS_SHORT[(i + 1) % 7]}</span>
                      <span className={`${styles.dayNum} ${isToday ? styles.todayNum : ''}`}>{day.getDate()}</span>
                      {isClosed && <span className={styles.closedBadge}>Stängt</span>}
                    </div>

                    {!isClosed && (
                      <div className={styles.dayContent}>
                        {oh && (
                          <p className={styles.openHours}>{oh.open_time}–{oh.close_time}</p>
                        )}

                        {dayBookings.length === 0 && (
                          <p className={styles.noBookings}>Inga bokningar</p>
                        )}

                        {dayBookings.map(b => {
                          const time = new Date(b.booking_date).toLocaleTimeString('sv-SE', {
                            hour: '2-digit', minute: '2-digit'
                          })
                          return (
                            <div key={b.id} className={`${styles.bookingChip} ${styles[b.status] ?? ''}`}>
                              <span className={styles.chipTime}>{time}</span>
                              <span className={styles.chipName}>{b.client_name ?? 'Okänd'}</span>
                              <span className={styles.chipDur}>{b.duration_minutes ?? 30} min</span>
                            </div>
                          )
                        })}

                        {availableSlots.length > 0 && (
                          <div className={styles.slotsWrap}>
                            <p className={styles.slotsLabel}>{availableSlots.length} lediga</p>
                            <div className={styles.slots}>
                              {(isExpanded ? availableSlots : availableSlots.slice(0, 4)).map(slot => (
                                <span key={slot} className={styles.slot}>{slot}</span>
                              ))}
                              {availableSlots.length > 4 && (
                                <button
                                  className={styles.slotMore}
                                  onClick={() => toggleExpand(i)}
                                >
                                  {isExpanded ? 'Visa färre ↑' : `+${availableSlots.length - 4} visa alla`}
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}

        {activeTab === 'oppettider' && (
          <div className={styles.hoursPanel}>
            <div className={styles.hoursGrid}>
              {openingHours.map(oh => (
                <div key={oh.id} className={`${styles.hourRow} ${!oh.is_open ? styles.hourClosed : ''}`}>
                  <div className={styles.hourDay}>
                    <span className={styles.hourDayName}>{DAYS[oh.day_of_week]}</span>
                    <label className={styles.toggle}>
                      <input
                        type="checkbox"
                        checked={oh.is_open}
                        onChange={e => updateHour(oh.id, 'is_open', e.target.checked)}
                      />
                      <span className={styles.toggleSlider} />
                    </label>
                  </div>
                  {oh.is_open ? (
                    <div className={styles.hourTimes}>
                      <input
                        type="time"
                        value={oh.open_time}
                        onChange={e => updateHour(oh.id, 'open_time', e.target.value)}
                        className={styles.timeInput}
                      />
                      <span className={styles.timeSep}>–</span>
                      <input
                        type="time"
                        value={oh.close_time}
                        onChange={e => updateHour(oh.id, 'close_time', e.target.value)}
                        className={styles.timeInput}
                      />
                    </div>
                  ) : (
                    <span className={styles.closedText}>Stängt</span>
                  )}
                </div>
              ))}
            </div>

            <button
              className={styles.saveBtn}
              onClick={saveOpeningHours}
              disabled={savingHours}
            >
              {savingHours ? 'Sparar...' : 'Spara öppettider'}
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}