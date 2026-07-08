import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function PATCH(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { id, status } = await req.json()

  const { data: booking, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (status === 'cancelled' && booking.client_email) {
    const datum = new Date(booking.booking_date).toLocaleDateString('sv-SE', {
      weekday: 'long', day: 'numeric', month: 'long'
    })
    const tid = new Date(booking.booking_date).toLocaleTimeString('sv-SE', {
      hour: '2-digit', minute: '2-digit'
    })

    await resend.emails.send({
      from: 'Atilli Berg <onboarding@resend.dev>',
      to: booking.client_email,
      subject: 'Din bokning har avbokats — Atilli Berg',
      html: `
        <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; color: #1A1008;">
          <h1 style="font-size: 22px; letter-spacing: 0.1em; text-transform: uppercase;">ATILLI BERG</h1>
          <h2 style="font-size: 20px; font-weight: normal;">Din bokning är avbokad</h2>
          <p style="color: #6B4C3B;">Hej ${booking.client_name}, din tid ${datum} kl ${tid} har avbokats.</p>
          <p style="font-size: 13px; color: #9B7560;">Välkommen att boka en ny tid när det passar dig.</p>
        </div>
      `,
    })
  }

  return NextResponse.json({ data: booking })
}