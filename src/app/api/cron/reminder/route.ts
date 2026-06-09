import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY!)

export async function GET(req: Request) {
  // Skydda routen — Vercel skickar med CRON_SECRET
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Kolla om 24h-påminnelse är aktiverad i inställningar
  const { data: notifSetting } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'notifications')
    .single()

  const notifs = notifSetting?.value as { reminder_24h: boolean } | null
  if (notifs?.reminder_24h === false) {
    return NextResponse.json({ ok: true, skipped: 'reminder_24h disabled' })
  }

  // Hitta bokningar imorgon
  const imorgon = new Date()
  imorgon.setDate(imorgon.getDate() + 1)
  const fran = imorgon.toISOString().split('T')[0] + 'T00:00:00'
  const till = imorgon.toISOString().split('T')[0] + 'T23:59:59'

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('id, booking_date, client_name, client_email, price, service_id')
    .gte('booking_date', fran)
    .lte('booking_date', till)
    .in('status', ['confirmed', 'pending'])
    .not('client_email', 'is', null)

  if (error) {
    console.error('Cron error:', error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  // Hämta tjänstnamn
  const { data: services } = await supabase
    .from('services')
    .select('id, name')

  const serviceMap = Object.fromEntries(
    (services ?? []).map((s: { id: string; name: string }) => [s.id, s.name])
  )

  let skickade = 0

  for (const b of bookings ?? []) {
    if (!b.client_email) continue

    const datum = new Date(b.booking_date).toLocaleDateString('sv-SE', {
      weekday: 'long', day: 'numeric', month: 'long',
    })
    const tid = new Date(b.booking_date).toLocaleTimeString('sv-SE', {
      hour: '2-digit', minute: '2-digit',
    })
    const tjanst = b.service_id ? (serviceMap[b.service_id] ?? '') : ''

    const html = `
      <!DOCTYPE html>
      <html lang="sv">
      <head><meta charset="UTF-8" /></head>
      <body style="margin:0;padding:0;background:#F5F0E8;font-family:'Georgia',serif;">
        <div style="max-width:560px;margin:40px auto;background:#fff;">
          <div style="background:#2f210c;padding:40px;text-align:center;">
            <p style="color:rgba(184,149,106,0.7);font-size:10px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 8px;">Påminnelse</p>
            <h1 style="color:#fff;font-size:28px;font-weight:400;margin:0;letter-spacing:0.15em;text-transform:uppercase;">Atilli Berg</h1>
            <p style="color:rgba(255,255,255,0.3);font-size:9px;letter-spacing:0.4em;text-transform:uppercase;margin:6px 0 0;">Göteborg · Est. 2022</p>
          </div>
          <div style="padding:40px;">
            <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8B6F5E;margin:0 0 16px;">— Påminnelse inför imorgon</p>
            <h2 style="font-size:24px;font-weight:400;color:#2f210c;margin:0 0 8px;">Vi ses imorgon, ${b.client_name}!</h2>
            <p style="font-size:14px;color:#8B6F5E;line-height:1.7;margin:0 0 32px;">Det här är en vänlig påminnelse om din bokning hos Atilli Berg imorgon.</p>
            <div style="background:#F7F3EC;padding:24px;margin-bottom:32px;">
              <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#B8956A;margin:0 0 16px;">Din bokning</p>
              <table style="width:100%;border-collapse:collapse;">
                ${tjanst ? `
                <tr style="border-bottom:1px solid rgba(139,111,94,0.1);">
                  <td style="padding:10px 0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#9A9088;">Tjänst</td>
                  <td style="padding:10px 0;font-size:15px;color:#2f210c;text-align:right;">${tjanst}</td>
                </tr>` : ''}
                <tr style="border-bottom:1px solid rgba(139,111,94,0.1);">
                  <td style="padding:10px 0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#9A9088;">Datum</td>
                  <td style="padding:10px 0;font-size:15px;color:#2f210c;text-align:right;">${datum}</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(139,111,94,0.1);">
                  <td style="padding:10px 0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#9A9088;">Tid</td>
                  <td style="padding:10px 0;font-size:15px;color:#2f210c;text-align:right;">${tid}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#B8956A;">Pris</td>
                  <td style="padding:10px 0;font-size:18px;color:#B8956A;text-align:right;font-style:italic;">${b.price?.toLocaleString('sv-SE')} kr</td>
                </tr>
              </table>
            </div>
            <p style="font-size:12px;color:#9A9088;line-height:1.7;border-top:1px solid rgba(139,111,94,0.15);padding-top:24px;">
              Behöver du avboka eller ändra din tid? Hör av dig senast idag.
            </p>
          </div>
          <div style="background:#2f210c;padding:24px;text-align:center;">
            <p style="color:rgba(255,255,255,0.3);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;margin:0;">Atilli Berg · Göteborg · atilliberg.se</p>
          </div>
        </div>
      </body>
      </html>
    `

    await resend.emails.send({
      from: 'Atilli Berg <onboarding@resend.dev>',
      to: b.client_email,
      subject: `Påminnelse — din bokning imorgon kl ${tid}`,
      html,
    })

    skickade++
  }

  return NextResponse.json({ ok: true, skickade })
}