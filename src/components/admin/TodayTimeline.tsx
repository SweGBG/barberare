import { createClient } from '@/lib/supabase/server'
import styles from './TodayTimeline.module.css'

export default async function TodayTimeline() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      id, booking_date, status, duration_minutes,
      profiles ( full_name ),
      services ( name )
    `)
    .gte('booking_date', today)
    .lt('booking_date', today + 'T23:59:59')
    .order('booking_date', { ascending: true })

  const list = bookings ?? []

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>Tidslinje · Idag</span>
        <span className={styles.action}>Redigera</span>
      </div>

      <div className={styles.body}>
        <div className={styles.timeline}>
          {list.map((b) => {
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
                    {b.profiles?.full_name ?? 'Okänd'}
                    {isActive && ' — Pågår nu'}
                  </p>
                  <p className={styles.service}>{b.services?.name ?? '–'}</p>
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
        <button className={styles.qaBtn}>
          <i className="ti ti-user-plus" aria-hidden="true" /> Lägg klient
        </button>
        <button className={styles.qaBtn}>
          <i className="ti ti-send" aria-hidden="true" /> Skicka påm.
        </button>
        <button className={styles.newBooking}>
          <i className="ti ti-plus" aria-hidden="true" /> Ny bokning
        </button>
      </div>
    </div>
  )
}