import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('id, booking_date, price, status, service_id, duration_minutes')
      .gte('booking_date', twelveMonthsAgo.toISOString())
      .order('booking_date', { ascending: true })

    if (error) throw error

    const { data: services } = await supabase
      .from('tjanster')
      .select('id, namn, pris')

    const serviceMap: Record<string, string> = {}
    services?.forEach((s) => { serviceMap[s.id] = s.namn })

    // Bygger månadsdata (senaste 6 månader)
    const monthlyMap: Record<string, { manad: string; intakter: number; bokningar: number }> = {}
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const label = d.toLocaleDateString('sv-SE', { month: 'short', year: '2-digit' })
      monthlyMap[key] = { manad: label, intakter: 0, bokningar: 0 }
    }

    const serviceStats: Record<string, { namn: string; intakter: number; antal: number }> = {}
    const statusCount = { confirmed: 0, pending: 0, cancelled: 0, completed: 0 }
    let totalIntakter = 0
    let konfirmeradeBokningar = 0

    bookings?.forEach((b) => {
      const dateKey = b.booking_date?.substring(0, 7)
      const pris = Number(b.price) || 0

      if ((b.status === 'confirmed' || b.status === 'completed') && dateKey && monthlyMap[dateKey]) {
        monthlyMap[dateKey].intakter += pris
        monthlyMap[dateKey].bokningar += 1
      }

      if (b.status === 'confirmed') statusCount.confirmed++
      else if (b.status === 'pending') statusCount.pending++
      else if (b.status === 'cancelled') statusCount.cancelled++
      else if (b.status === 'completed') statusCount.completed++

      if (b.service_id && (b.status === 'confirmed' || b.status === 'completed')) {
        const sNamn = serviceMap[b.service_id] || 'Okänd tjänst'
        if (!serviceStats[b.service_id]) serviceStats[b.service_id] = { namn: sNamn, intakter: 0, antal: 0 }
        serviceStats[b.service_id].intakter += pris
        serviceStats[b.service_id].antal += 1
        totalIntakter += pris
        konfirmeradeBokningar++
      }
    })

    const manadslista = Object.values(monthlyMap)
    const dennaManadKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const forraManad = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const forraManadKey = `${forraManad.getFullYear()}-${String(forraManad.getMonth() + 1).padStart(2, '0')}`
    const dennaManadIntakter = monthlyMap[dennaManadKey]?.intakter || 0
    const forraManadIntakter = monthlyMap[forraManadKey]?.intakter || 0
    const forändring = forraManadIntakter > 0
      ? Math.round(((dennaManadIntakter - forraManadIntakter) / forraManadIntakter) * 100)
      : 0

    return NextResponse.json({
      ok: true,
      data: {
        totalt: {
          intakter: totalIntakter,
          bokningar: konfirmeradeBokningar,
          snittPris: konfirmeradeBokningar > 0 ? Math.round(totalIntakter / konfirmeradeBokningar) : 0,
          dennaManad: dennaManadIntakter,
          manadForandring: forändring,
        },
        manadsgraf: manadslista,
        tjanster: Object.values(serviceStats).sort((a, b) => b.intakter - a.intakter),
        status: statusCount,
      },
    })
  } catch (err) {
    console.error('Rapporter error:', err)
    return NextResponse.json({ ok: false, error: 'Kunde inte hämta rapportdata' }, { status: 500 })
  }
}