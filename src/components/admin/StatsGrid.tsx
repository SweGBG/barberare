import { createClient } from '@/lib/supabase/server'
import styles from './StatsGrid.module.css'

async function getStats() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: todaysBookings } = await supabase
    .from('bookings')
    .select('id, price, status')
    .gte('booking_date', today)
    .lt('booking_date', today + 'T23:59:59')

  const confirmed = todaysBookings?.filter(b =>
    ['confirmed', 'completed'].includes(b.status)
  ) ?? []

  const revenue = confirmed.reduce((sum, b) => sum + (b.price ?? 0), 0)

  const firstOfMonth = new Date()
  firstOfMonth.setDate(1)

  const { count: newClients } = await supabase
    .from('bookings')
    .select('user_id', { count: 'exact', head: true })
    .gte('created_at', firstOfMonth.toISOString())

  return {
    bookingsToday: todaysBookings?.length ?? 0,
    revenueToday: revenue,
    newClients: newClients ?? 0,
    avgRating: 4.9, // koppla till reviews-tabell när den finns
  }
}

export default async function StatsGrid() {
  const stats = await getStats()

  const cards = [
    { label: 'Bokningar idag', value: stats.bookingsToday, delta: '+2 vs igår', up: true, icon: 'ti-calendar-check' },
    { label: 'Intäkt idag', value: `${stats.revenueToday.toLocaleString('sv-SE')} kr`, delta: '+12%', up: true, icon: 'ti-coin' },
    { label: 'Nya kunder (mån)', value: stats.newClients, delta: '+5 vs förra mån', up: true, icon: 'ti-users' },
    { label: 'Omdömen (snitt)', value: stats.avgRating, delta: 'Baserat på 38 reviews', up: null, icon: 'ti-star' },
  ]

  return (
    <div className={styles.grid}>
      {cards.map((card) => (
        <div key={card.label} className={styles.card}>
          <div className={styles.icon}>
            <i className={`ti ${card.icon}`} aria-hidden="true" />
          </div>
          <p className={styles.label}>{card.label}</p>
          <p className={styles.value}>{card.value}</p>
          <p className={`${styles.delta} ${card.up === true ? styles.up : card.up === false ? styles.down : styles.neutral}`}>
            {card.up === true && <i className="ti ti-trending-up" aria-hidden="true" />}
            {card.up === false && <i className="ti ti-trending-down" aria-hidden="true" />}
            {card.delta}
          </p>
        </div>
      ))}
    </div>
  )
}