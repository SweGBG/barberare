import { createClient } from '@/lib/supabase/server'
import styles from './BookingsTable.module.css'

type Booking = {
  id: string
  booking_date: string
  status: string
  price: number
  service_id: string | null
  client_name: string | null
  client_phone: string | null
}

type Service = {
  id: string
  name: string
}

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function statusLabel(s: string) {
  const map: Record<string, { label: string; cls: string }> = {
    confirmed: { label: 'Bekräftad', cls: styles.confirmed },
    pending: { label: 'Väntar', cls: styles.pending },
    completed: { label: 'Klar', cls: styles.done },
    in_progress: { label: 'Pågår', cls: styles.inProgress },
  }
  return map[s] ?? { label: s, cls: '' }
}

export default async function BookingsTable() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const [{ data: bookings }, { data: services }] = await Promise.all([
    supabase
      .from('bookings')
      .select('id, booking_date, status, price, service_id, client_name, client_phone')
      .gte('booking_date', today)
      .lt('booking_date', today + 'T23:59:59')
      .order('booking_date', { ascending: true }),
    supabase
      .from('services')
      .select('id, name'),
  ])

  const serviceMap = Object.fromEntries(
    (services ?? []).map((s: Service) => [s.id, s.name])
  )

  const list = (bookings ?? []) as Booking[]

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>Dagens bokningar</span>
        <span className={styles.action}>Alla →</span>
      </div>

      <div className={styles.tableHead}>
        <span></span>
        <span>Klient</span>
        <span>Tid</span>
        <span>Status</span>
        <span className={styles.priceCol}>Pris</span>
      </div>

      {list.length === 0 && (
        <p className={styles.empty}>Inga bokningar idag.</p>
      )}

      {list.map((b) => {
        const name = b.client_name ?? 'Okänd'
        const tjanstNamn = b.service_id ? (serviceMap[b.service_id] ?? '–') : '–'
        const time = new Date(b.booking_date).toLocaleTimeString('sv-SE', {
          hour: '2-digit',
          minute: '2-digit',
        })
        const st = statusLabel(b.status)

        return (
          <div
            key={b.id}
            className={`${styles.row} ${b.status === 'in_progress' ? styles.rowActive : ''}`}
          >
            <div className={styles.avatar}>{initials(name)}</div>
            <div>
              <p className={styles.clientName}>{name}</p>
              <p className={styles.clientService}>{tjanstNamn}</p>
            </div>
            <span className={styles.timeCol}>{time}</span>
            <span className={`${styles.badge} ${st.cls}`}>{st.label}</span>
            <span className={styles.priceCol}>
              {b.price?.toLocaleString('sv-SE')} kr
            </span>
          </div>
        )
      })}
    </div>
  )
}