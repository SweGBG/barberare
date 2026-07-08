'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './Footer.module.css'

const supabase = createClient()

interface OpeningHour {
  day_of_week: number
  open_time: string | null
  close_time: string | null
  is_closed: boolean
}

const dagNamn = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag']

const fallbackTider = [
  { dag: 'Mån–Fre', tid: '09–19' },
  { dag: 'Lördag', tid: '10–17' },
  { dag: 'Söndag', tid: 'Stängt' },
]

function fmt(t: string | null): string {
  if (!t) return ''
  return t.slice(0, 5)
}

export default function Footer() {
  const [tider, setTider] = useState<OpeningHour[] | null>(null)

  useEffect(() => {
    const hamta = async () => {
      const { data, error } = await supabase
        .from('opening_hours')
        .select('day_of_week, open_time, close_time, is_closed')
        .order('day_of_week')

      if (!error && data && data.length > 0) setTider(data as OpeningHour[])
    }
    hamta()
  }, [])

  return (
    <>
      {/* ── Boka-CTA ── */}
      <section className={styles.boka} id="boka">
        <div className={styles.bokaInner}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            Boka din tid
            <span className={styles.eyebrowLine} />
          </p>
          <h2 className={styles.bokaTitle}>
            Redo för ett <em>nytt kapitel?</em>
          </h2>
          <p className={styles.bokaSub}>
            Vi tar emot bokningar direkt här på sajten — snabbt, enkelt och
            alltid bekräftat via e-post. Välj tjänst, tid och fyll i dina
            uppgifter på under en minut.
          </p>
          <a href="/boka" className={styles.bokaBtn}>Boka tid nu</a>
          <p className={styles.bokaTel}>
            Eller ring oss: <a href="tel:031000000">031-00 00 00</a>
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <span className={styles.footerLogoMain}>Atilli Berg</span>
              <span className={styles.footerLogoSub}>Frisör &amp; Barberare</span>
            </div>
            <p className={styles.footerTagline}>
              Tradition möter passion.<br />
              Hantverksskicklighet sedan 2026.
            </p>
          </div>

          <div className={styles.footerCol}>
            <h5 className={styles.colHead}>Öppettider</h5>
            {tider
              ? tider.map((t) => (
                  <p key={t.day_of_week} className={styles.tidRad}>
                    <span>{dagNamn[t.day_of_week] ?? `Dag ${t.day_of_week}`}</span>
                    <span>
                      {t.is_closed ? 'Stängt' : `${fmt(t.open_time)}–${fmt(t.close_time)}`}
                    </span>
                  </p>
                ))
              : fallbackTider.map((t) => (
                  <p key={t.dag} className={styles.tidRad}>
                    <span>{t.dag}</span>
                    <span>{t.tid}</span>
                  </p>
                ))}
          </div>

          <div className={styles.footerCol}>
            <h5 className={styles.colHead}>Hitta oss</h5>
            <p>Din gata 1</p>
            <p>Göteborg</p>
            <a href="tel:031000000" style={{ marginTop: '12px' }}>031-00 00 00</a>
            <a href="mailto:info@atilliberg.se">info@atilliberg.se</a>
            <a href="#">Instagram @atilliberg</a>
          </div>

          <div className={styles.footerCol}>
            <h5 className={styles.colHead}>Navigera</h5>
            <a href="/#tjanster">Tjänster</a>
            <a href="/#galleri">Galleri</a>
            <a href="/#priser">Prislista</a>
            <a href="/#om">Om oss</a>
            <a href="/kontakt">Kontakt</a>
            <a href="/boka">Boka tid</a>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© 2026 Atilli Berg. Alla rättigheter förbehållna.</p>
          <p>Göteborg, Sverige</p>
        </div>
      </footer>
    </>
  )
}
