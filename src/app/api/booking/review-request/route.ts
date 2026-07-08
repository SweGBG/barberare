/**
 * ReviewRequest – skickar ett mejl till kunden via Resend
 * efter avslutad bokning, med en länk till Google-recensioner.
 *
 * Placeras i /api/booking/review-request/route.ts
 * Kallas från admin-panelen eller automatiskt X timmar efter bokning.
 */

import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

// Byt ut mot din riktiga Google Maps Places-recensionslänk
// Hitta den: Google Business Profile → Hämta recension-länk
const GOOGLE_REVIEW_URL =
  "https://g.page/r/XXXXXXXXXXXXXXXX/review"; // ← fyll i

interface ReviewRequestBody {
  customerName: string;
  customerEmail: string;
  serviceName: string;   // t.ex. "Herrklippning"
}

export async function POST(request: Request) {
  try {
    const body: ReviewRequestBody = await request.json();
    const { customerName, customerEmail, serviceName } = body;

    if (!customerEmail || !customerName) {
      return NextResponse.json(
        { error: "customerEmail och customerName krävs" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Atilli Berg <noreply@atilliberg.se>",
      to: customerEmail,
      subject: `Tack för ditt besök, ${customerName}! ✂️`,
      html: buildReviewEmail({ customerName, serviceName }),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "E-post kunde inte skickas" }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("review-request error:", err);
    return NextResponse.json({ error: "Serverfel" }, { status: 500 });
  }
}

// ─── E-postmall ───────────────────────────────────────────────────────────────
function buildReviewEmail({
  customerName,
  serviceName,
}: Pick<ReviewRequestBody, "customerName" | "serviceName">): string {
  return `
<!DOCTYPE html>
<html lang="sv">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:#3B2F2F;padding:32px;text-align:center;">
              <h1 style="color:#B8956A;font-family:Georgia,serif;font-size:28px;margin:0;letter-spacing:2px;">
                ATILLI BERG
              </h1>
              <p style="color:#F5F0E8;font-size:13px;margin:6px 0 0;letter-spacing:1px;">BARBERARE · GÖTEBORG</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="font-size:18px;color:#3B2F2F;margin:0 0 16px;">
                Tack, ${customerName}! ✂️
              </p>
              <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 24px;">
                Det var ett nöje att ta hand om dig idag. Vi hoppas att du är nöjd med din <strong>${serviceName || "klippning"}</strong>.
              </p>
              <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 32px;">
                Om du har en minut över skulle vi uppskatta om du lämnar ett omdöme på Google – det hjälper oss att nå fler kunder och fortsätta växa.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#B8956A;border-radius:8px;">
                    <a href="${GOOGLE_REVIEW_URL}"
                       style="display:inline-block;padding:14px 32px;color:#fff;font-family:Georgia,serif;font-size:15px;text-decoration:none;letter-spacing:0.5px;">
                      ⭐ Lämna ett omdöme
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color:#888;font-size:13px;margin:24px 0 0;line-height:1.6;">
                Det tar bara 30 sekunder och betyder mycket för oss. Tack på förhand!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F5F0E8;padding:20px 40px;border-top:1px solid #E8E0D4;">
              <p style="color:#888;font-size:12px;margin:0;text-align:center;">
                Atilli Berg Barberare · Göteborg<br>
                <a href="https://barberare.vercel.app/boka" style="color:#B8956A;">Boka nästa besök</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
