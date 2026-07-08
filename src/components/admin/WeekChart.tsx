import { createClient } from '@/lib/supabase/server'
import styles from './WeekChart.module.css'

const DAYS = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön']
const TODAY_IDX = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

export default async function WeekChart() {
  const supabase = await createClient()

  const monday = new Date()
  monday.setDate(monday.getDate() - TODAY_IDX)
  monday.setHours(0, 0, 0, 0)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

  const { data } = await supabase
    .from('bookings')
    .select('booking_date, price, status')
    .gte('booking_date', monday.toISOString())
    .lte('booking_date', sunday.toISOString())
    .in('status', ['confirmed', 'completed', 'in_progress'])

  const dailyRevenue = Array(7).fill(0)
  for (const b of data ?? []) {
    const d = new Date(b.booking_date)
    const idx = d.getDay() === 0 ? 6 : d.getDay() - 1
    dailyRevenue[idx] += b.price ?? 0
  }

  const max = Math.max(...dailyRevenue, 1)

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>Veckans intäkter</span>
        <span className={styles.action}>Visa rapport</span>
      </div>
      <div className={styles.bars}>
        {DAYS.map((day, i) => (
          <div key={day} className={styles.barWrap}>
            <span className={styles.amount}>
              {dailyRevenue[i] > 0 ? `${(dailyRevenue[i] / 1000).toFixed(1)}k` : ''}
            </span>
            <div
              className={`${styles.bar} ${i === TODAY_IDX ? styles.barToday : ''}`}
              style={{ height: `${Math.round((dailyRevenue[i] / max) * 56) + 4}px` }}
            />
            <span className={`${styles.label} ${i === TODAY_IDX ? styles.labelToday : ''}`}>
              {day}{i === TODAY_IDX ? ' ●' : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}