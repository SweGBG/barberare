import { createClient } from '@/lib/supabase/server'
import styles from './BookingsTable.module.css'

type Booking = {
  id: string
  booking_date: string
  status: string
  price: number
  profiles: { full_name: string; email: string } | null
  services: { name: string } | null
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
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

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      id,
      booking_date,
      status,
      price,
      profiles ( full_name, email ),
      services ( name )
    `)
    .gte('booking_date', today)
    .lt('booking_date', today + 'T23:59:59')
    .order('booking_date', { ascending: true })

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

      {list.map((b) => {
        const name = b.profiles?.full_name ?? 'Okänd'
        const time = new Date(b.booking_date).toLocaleTimeString('sv-SE', {
          hour: '2-digit', minute: '2-digit'
        })
        const st = statusLabel(b.status)

        return (
          <div key={b.id} className={`${styles.row} ${b.status === 'in_progress' ? styles.rowActive : ''}`}>
            <div className={styles.avatar}>{initials(name)}</div>
            <div>
              <p className={styles.clientName}>{name}</p>
              <p className={styles.clientService}>{b.services?.name ?? '–'}</p>
            </div>
            <span className={styles.timeCol}>{time}</span>
            <span className={`${styles.badge} ${st.cls}`}>{st.label}</span>
            <span className={styles.priceCol}>{b.price?.toLocaleString('sv-SE')} kr</span>
          </div>
        )
      })}
    </div>
  )
}