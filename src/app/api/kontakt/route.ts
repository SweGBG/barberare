import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: Request) {
  const { name, email, phone, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Fält saknas' }, { status: 400 })
  }

  const { error } = await supabase.from('messages').insert({ name, email, phone, message })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await resend.emails.send({
    from: 'Atilli Berg <no-reply@atilliberg.se>',
    to: 'atilli@atilliberg.se',
    subject: `Nytt meddelande från ${name}`,
    html: `
      <h2>Nytt kontaktmeddelande</h2>
      <p><strong>Namn:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefon:</strong> ${phone || '–'}</p>
      <p><strong>Meddelande:</strong><br/>${message}</p>
    `
  })

  return NextResponse.json({ ok: true })
}