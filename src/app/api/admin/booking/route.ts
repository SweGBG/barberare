import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('bookings')
    .select('*, services(name)')
    .order('booking_date', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id saknas' }, { status: 400 })
  const supabase = getSupabase()
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase()
    const resend = new Resend(process.env.RESEND_API_KEY!)
    const body = await req.json()
    const { client_name, client_email, client_phone, booking_date, service_id, duration_minutes, price, notes } = body

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        client_name,
        client_email,
        client_phone,
        booking_date,
        service_id: service_id || null,   // ← detta saknades
        duration_minutes: duration_minutes || 30,
        price: price || 0,
        notes: notes || null,
        status: 'confirmed',
      })
      .select()
      .single()
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (client_email) {
      const datum = new Date(booking_date).toLocaleDateString('sv-SE', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
      const tid = new Date(booking_date).toLocaleTimeString('sv-SE', {
        hour: '2-digit', minute: '2-digit'
      })

      const kundHtml = `<!DOCTYPE html><html lang="sv"><head><meta charset="UTF-8" /></head><body style="margin:0;padding:0;background:#F5F0E8;font-family:'Georgia',serif;"><div style="max-width:560px;margin:40px auto;background:#fff;"><div style="background:#2f210c;padding:40px;text-align:center;"><p style="color:rgba(184,149,106,0.7);font-size:10px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 8px;">Exklusiv Salong</p><h1 style="color:#fff;font-size:28px;font-weight:400;margin:0;letter-spacing:0.15em;text-transform:uppercase;">Atilli Berg</h1><p style="color:rgba(255,255,255,0.3);font-size:9px;letter-spacing:0.4em;text-transform:uppercase;margin:6px 0 0;">Göteborg · Est. 2022</p></div><div style="padding:40px;"><p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8B6F5E;margin:0 0 16px;">— Bokningsbekräftelse</p><h2 style="font-size:28px;font-weight:400;color:#2f210c;margin:0 0 8px;">Vi ses, ${client_name}.</h2><p style="font-size:14px;color:#8B6F5E;line-height:1.7;margin:0 0 32px;">Din bokning är bekräftad. Vi ser fram emot att välkomna dig till Atilli Berg.</p><div style="background:#F7F3EC;padding:24px;margin-bottom:32px;"><p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#B8956A;margin:0 0 16px;">Dina detaljer</p><table style="width:100%;border-collapse:collapse;"><tr style="border-bottom:1px solid rgba(139,111,94,0.1);"><td style="padding:10px 0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#9A9088;">Datum</td><td style="padding:10px 0;font-size:15px;color:#2f210c;text-align:right;">${datum}</td></tr><tr style="border-bottom:1px solid rgba(139,111,94,0.1);"><td style="padding:10px 0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#9A9088;">Tid</td><td style="padding:10px 0;font-size:15px;color:#2f210c;text-align:right;">${tid}</td></tr><tr style="border-bottom:1px solid rgba(139,111,94,0.1);"><td style="padding:10px 0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#9A9088;">Varaktighet</td><td style="padding:10px 0;font-size:15px;color:#2f210c;text-align:right;">${duration_minutes} min</td></tr><tr><td style="padding:10px 0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#B8956A;">Totalt</td><td style="padding:10px 0;font-size:18px;color:#B8956A;text-align:right;font-style:italic;">${price} kr</td></tr></table></div><p style="font-size:12px;color:#9A9088;line-height:1.7;border-top:1px solid rgba(139,111,94,0.15);padding-top:24px;">Betalning sker i salongen efter besöket. Behöver du avboka eller ändra din tid? Hör av dig senast 24 timmar innan.</p></div><div style="background:#2f210c;padding:24px;text-align:center;"><p style="color:rgba(255,255,255,0.3);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;margin:0;">Atilli Berg · Göteborg · barberare.vercel.app</p></div></div></body></html>`

      const agarHtml = `<!DOCTYPE html><html lang="sv"><head><meta charset="UTF-8" /></head><body style="margin:0;padding:0;background:#F5F0E8;font-family:'Georgia',serif;"><div style="max-width:560px;margin:40px auto;background:#fff;"><div style="background:#2f210c;padding:40px;text-align:center;"><h1 style="color:#fff;font-size:24px;font-weight:400;margin:0;letter-spacing:0.15em;text-transform:uppercase;">Ny bokning via admin!</h1></div><div style="padding:40px;"><table style="width:100%;border-collapse:collapse;"><tr style="border-bottom:1px solid rgba(139,111,94,0.1);"><td style="padding:10px 0;color:#8B6F5E;font-size:13px;">Kund</td><td style="padding:10px 0;font-size:13px;color:#2f210c;text-align:right;">${client_name}</td></tr><tr style="border-bottom:1px solid rgba(139,111,94,0.1);"><td style="padding:10px 0;color:#8B6F5E;font-size:13px;">Email</td><td style="padding:10px 0;font-size:13px;color:#2f210c;text-align:right;">${client_email}</td></tr><tr style="border-bottom:1px solid rgba(139,111,94,0.1);"><td style="padding:10px 0;color:#8B6F5E;font-size:13px;">Telefon</td><td style="padding:10px 0;font-size:13px;color:#2f210c;text-align:right;">${client_phone ?? '–'}</td></tr><tr style="border-bottom:1px solid rgba(139,111,94,0.1);"><td style="padding:10px 0;color:#8B6F5E;font-size:13px;">Datum</td><td style="padding:10px 0;font-size:13px;color:#2f210c;text-align:right;">${datum}</td></tr><tr style="border-bottom:1px solid rgba(139,111,94,0.1);"><td style="padding:10px 0;color:#8B6F5E;font-size:13px;">Tid</td><td style="padding:10px 0;font-size:13px;color:#2f210c;text-align:right;">${tid}</td></tr><tr><td style="padding:10px 0;color:#B8956A;font-size:13px;">Pris</td><td style="padding:10px 0;font-size:16px;color:#B8956A;text-align:right;">${price} kr</td></tr></table>${notes ? `<p style="margin-top:24px;padding:16px;background:#F7F3EC;font-size:13px;color:#8B6F5E;"><strong>Notering:</strong> ${notes}</p>` : ''}</div></div></body></html>`

      await resend.emails.send({
        from: 'Atilli Berg <onboarding@resend.dev>',
        to: client_email,
        subject: `Bokningsbekräftelse — ${datum} kl ${tid}`,
        html: kundHtml,
      })

      await resend.emails.send({
        from: 'Atilli Berg <onboarding@resend.dev>',
        to: 'lenn.soder@protonmail.com',
        subject: `Ny bokning via admin — ${client_name} · ${datum}`,
        html: agarHtml,
      })
    }

    return NextResponse.json({ data })

  } catch (err) {
    console.error('Route error:', err)
    return NextResponse.json({ error: 'Något gick fel' }, { status: 500 })
  }
}