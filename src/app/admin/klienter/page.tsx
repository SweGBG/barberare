'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import styles from './klienter.module.css'

type Client = {
  client_email: string
  client_name: string | null
  client_phone: string | null
  total_bookings: number
  completed_bookings: number
  total_spent: number
  last_booking: string | null
  first_booking: string | null
}

type Booking = {
  id: string
  booking_date: string
  status: string
  price: number | null
  duration_minutes: number | null
  notes: string | null
}

const STATUS_LABELS: Record<string, string> = {
  confirmed: 'Bekräftad',
  pending: 'Väntar',
  in_progress: 'Pågår',
  completed: 'Genomförd',
  cancelled: 'Avbokad',
}

export default function KlienterPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [filtered, setFiltered] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Client | null>(null)
  const [clientBookings, setClientBookings] = useState<Booking[]>([])
  const [loadingBookings, setLoadingBookings] = useState(false)

  useEffect(() => {
    fetchClients()
  }, [])

  useEffect(() => {
    if (!search) {
      setFiltered(clients)
      return
    }
    const q = search.toLowerCase()
    setFiltered(clients.filter(c =>
      c.client_name?.toLowerCase().includes(q) ||
      c.client_email.toLowerCase().includes(q) ||
      c.client_phone?.includes(q)
    ))
  }, [search, clients])

  async function fetchClients() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/clients')
      const json = await res.json()
      setClients(json.data ?? [])
      setFiltered(json.data ?? [])
    } catch (err) {
      console.error('fetchClients error:', err)
    }
    setLoading(false)
  }

  async function selectClient(client: Client) {
    setSelected(client)
    setLoadingBookings(true)
    try {
      const res = await fetch(`/api/admin/clients/bookings?email=${encodeURIComponent(client.client_email)}`)
      const json = await res.json()
      setClientBookings(json.data ?? [])
    } catch (err) {
      console.error('selectClient error:', err)
    }
    setLoadingBookings(false)
  }

  function initials(name: string | null) {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  }

  return (
    <AdminLayout>
      <div className={styles.page}>

        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Klientregister</h1>
            <p className={styles.sub}>{clients.length} klienter totalt</p>
          </div>
        </div>

        <div className={styles.searchWrap}>
          <i className="ti ti-search" aria-hidden="true" />
          <input
            className={styles.search}
            placeholder="Sök på namn, email eller telefon..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.layout}>

          <div className={styles.list}>
            {loading ? (
              <div className={styles.empty}>Laddar...</div>
            ) : filtered.length === 0 ? (
              <div className={styles.empty}>Inga klienter hittades</div>
            ) : (
              filtered.map(client => (
                <div
                  key={`${client.client_email}-${client.first_booking}`}
                  className={`${styles.clientRow} ${selected?.client_email === client.client_email ? styles.clientRowActive : ''}`}
                  onClick={() => selectClient(client)}
                >
                  <div className={styles.avatar}>
                    {initials(client.client_name)}
                  </div>
                  <div className={styles.clientInfo}>
                    <p className={styles.clientName}>{client.client_name ?? 'Okänt namn'}</p>
                    <p className={styles.clientEmail}>{client.client_email}</p>
                    {client.client_phone && (
                      <p className={styles.clientPhone}>{client.client_phone}</p>
                    )}
                  </div>
                  <div className={styles.clientStats}>
                    <p className={styles.statNum}>{client.total_bookings}</p>
                    <p className={styles.statLabel}>bokningar</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={styles.detail}>
            {!selected ? (
              <div className={styles.detailEmpty}>
                <p>Välj en klient för att se detaljer</p>
              </div>
            ) : (
              <>
                <div className={styles.detailHeader}>
                  <div className={styles.detailAvatar}>
                    {initials(selected.client_name)}
                  </div>
                  <div>
                    <h2 className={styles.detailName}>{selected.client_name ?? 'Okänt namn'}</h2>
                    <p className={styles.detailEmail}>{selected.client_email}</p>
                    {selected.client_phone && (
                      <p className={styles.detailPhone}>{selected.client_phone}</p>
                    )}
                  </div>
                </div>

                <div className={styles.detailStats}>
                  <div className={styles.detailStat}>
                    <p className={styles.detailStatNum}>{selected.total_bookings}</p>
                    <p className={styles.detailStatLabel}>Totalt bokningar</p>
                  </div>
                  <div className={styles.detailStat}>
                    <p className={styles.detailStatNum}>{selected.completed_bookings}</p>
                    <p className={styles.detailStatLabel}>Genomförda</p>
                  </div>
                  <div className={styles.detailStat}>
                    <p className={styles.detailStatNum}>{selected.total_spent?.toLocaleString('sv-SE')} kr</p>
                    <p className={styles.detailStatLabel}>Totalt spenderat</p>
                  </div>
                  <div className={styles.detailStat}>
                    <p className={styles.detailStatNum}>
                      {selected.first_booking
                        ? new Date(selected.first_booking).toLocaleDateString('sv-SE', { month: 'short', year: 'numeric' })
                        : '–'}
                    </p>
                    <p className={styles.detailStatLabel}>Kund sedan</p>
                  </div>
                </div>

                <div className={styles.bookingHistory}>
                  <h3 className={styles.historyTitle}>Bokningshistorik</h3>
                  {loadingBookings ? (
                    <p className={styles.empty}>Laddar...</p>
                  ) : clientBookings.length === 0 ? (
                    <p className={styles.empty}>Inga bokningar</p>
                  ) : (
                    clientBookings.map(b => {
                      const date = new Date(b.booking_date)
                      const datum = date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' })
                      const tid = date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
                      return (
                        <div key={b.id} className={styles.historyRow}>
                          <div>
                            <p className={styles.historyDate}>{datum} kl {tid}</p>
                            {b.notes && <p className={styles.historyNote}>{b.notes}</p>}
                          </div>
                          <div className={styles.historyRight}>
                            {b.price && <p className={styles.historyPrice}>{b.price.toLocaleString('sv-SE')} kr</p>}
                            <span className={`${styles.badge} ${styles[b.status] ?? ''}`}>
                              {STATUS_LABELS[b.status] ?? b.status}
                            </span>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}