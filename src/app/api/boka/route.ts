import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

const manader = [
  'Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
  'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December',
]

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tjanst, datum, tid, namn, efternamn, email, telefon, meddelande } = body

    if (!tjanst || !datum || !tid || !namn || !email || !telefon) {
      return NextResponse.json(
        { error: 'Obligatoriska fält saknas' },
        { status: 400 }
      )
    }

    const datumStr = `${datum.ar}-${String(datum.manad + 1).padStart(2, '0')}-${String(datum.dag).padStart(2, '0')}`

    const { error: dbError } = await supabase
      .from('bokningar')
      .insert([{
        tjanst: tjanst.namn,
        pris: tjanst.pris,
        datum: datumStr,
        tid,
        namn,
        efternamn,
        email,
        telefon,
        meddelande: meddelande || '',
        status: 'bekraftad',
        skapad: new Date().toISOString(),
      }])

    if (dbError) {
      console.error('Supabase error:', dbError)
      return NextResponse.json({ error: 'Kunde inte spara bokning' }, { status: 500 })
    }

    const datumFormaterat = `${datum.dag} ${manader[datum.manad]} ${datum.ar}`

    await resend.emails.send({
      from: 'Atilli Berg <onboarding@resend.dev>',
      to: "lenn.soder@protonmail.com",

      subject: `Bokningsbekräftelse — ${tjanst.namn} ${datumFormaterat}`,
      html: `
        <!DOCTYPE html>
        <html lang="sv">
        <head><meta charset="UTF-8" /></head>
        <body style="margin:0;padding:0;background:#F5F0E8;font-family:'Georgia',serif;">
          <div style="max-width:560px;margin:40px auto;background:#fff;">

            <div style="background:#2f210c;padding:40px;text-align:center;">
              <p style="color:rgba(184,149,106,0.7);font-size:10px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 8px;">Exklusiv Salong</p>
              <h1 style="color:#fff;font-size:28px;font-weight:400;margin:0;letter-spacing:0.15em;text-transform:uppercase;">Atilli Berg</h1>
              <p style="color:rgba(255,255,255,0.3);font-size:9px;letter-spacing:0.4em;text-transform:uppercase;margin:6px 0 0;">Göteborg · Est. 2022</p>
            </div>

            <div style="padding:40px;">
              <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8B6F5E;margin:0 0 16px;">— Bokningsbekräftelse</p>
              <h2 style="font-size:28px;font-weight:400;color:#2f210c;margin:0 0 8px;">Vi ses, ${namn}.</h2>
              <p style="font-size:14px;color:#8B6F5E;line-height:1.7;margin:0 0 32px;">
                Din bokning är bekräftad. Vi ser fram emot att välkomna dig till Atilli Berg.
              </p>

              <div style="background:#F7F3EC;padding:24px;margin-bottom:32px;">
                <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#B8956A;margin:0 0 16px;">Dina detaljer</p>
                <table style="width:100%;border-collapse:collapse;">
                  <tr style="border-bottom:1px solid rgba(139,111,94,0.1);">
                    <td style="padding:10px 0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#9A9088;">Tjänst</td>
                    <td style="padding:10px 0;font-size:15px;color:#2f210c;text-align:right;">${tjanst.namn}</td>
                  </tr>
                  <tr style="border-bottom:1px solid rgba(139,111,94,0.1);">
                    <td style="padding:10px 0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#9A9088;">Datum</td>
                    <td style="padding:10px 0;font-size:15px;color:#2f210c;text-align:right;">${datumFormaterat}</td>
                  </tr>
                  <tr style="border-bottom:1px solid rgba(139,111,94,0.1);">
                    <td style="padding:10px 0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#9A9088;">Tid</td>
                    <td style="padding:10px 0;font-size:15px;color:#2f210c;text-align:right;">${tid}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#B8956A;">Totalt</td>
                    <td style="padding:10px 0;font-size:18px;color:#B8956A;text-align:right;font-style:italic;">${tjanst.pris}</td>
                  </tr>
                </table>
              </div>

              <p style="font-size:12px;color:#9A9088;line-height:1.7;border-top:1px solid rgba(139,111,94,0.15);padding-top:24px;">
                Betalning sker i salongen efter besöket. Behöver du avboka eller ändra din tid? 
                Hör av dig senast 24 timmar innan.
              </p>
            </div>

            <div style="background:#2f210c;padding:24px;text-align:center;">
              <p style="color:rgba(255,255,255,0.3);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;margin:0;">
                Atilli Berg · Göteborg · atilliberg.se
              </p>
            </div>

          </div>
        </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('Route error:', err)
    return NextResponse.json({ error: 'Något gick fel' }, { status: 500 })
  }
}
