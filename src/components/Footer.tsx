'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/lib/LangContext'
import { t } from '@/lib/translations'
import styles from './Footer.module.css'

const supabase = createClient()

interface OpeningHour {
  day_of_week: number
  open_time: string | null
  close_time: string | null
  is_closed: boolean
}

function fmt(t: string | null): string {
  if (!t) return ''
  return t.slice(0, 5)
}

export default function Footer() {
  const { lang } = useLang()
  const tr = t[lang].footer
  const dagNamn = tr.dagNamn
  const fallbackTider = tr.fallbackTider
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
            {tr.bokaEyebrow}
            <span className={styles.eyebrowLine} />
          </p>
          <h2 className={styles.bokaTitle}>
            {tr.bokaTitle1}<em>{tr.bokaTitle2}</em>
          </h2>
          <p className={styles.bokaSub}>{tr.bokaSub}</p>
          <a href="/boka" className={styles.bokaBtn}>{tr.bokaBtn}</a>
          <p className={styles.bokaTel}>
            {tr.ellerRing} <a href="tel:031000000">031-00 00 00</a>
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <span className={styles.footerLogoMain}>Atilli Berg</span>
              <span className={styles.footerLogoSub}>{t[lang].nav.brandSub}</span>
            </div>
            <p className={styles.footerTagline}>
              {tr.tagline1}<br />
              {tr.tagline2}
            </p>
          </div>

          <div className={styles.footerCol}>
            <h5 className={styles.colHead}>{tr.colHours}</h5>
            {tider
              ? tider.map((rad) => (
                  <p key={rad.day_of_week} className={styles.tidRad}>
                    <span>{dagNamn[rad.day_of_week] ?? `Dag ${rad.day_of_week}`}</span>
                    <span>
                      {rad.is_closed ? tr.stangt : `${fmt(rad.open_time)}–${fmt(rad.close_time)}`}
                    </span>
                  </p>
                ))
              : fallbackTider.map((ft) => (
                  <p key={ft.dag} className={styles.tidRad}>
                    <span>{ft.dag}</span>
                    <span>{ft.tid}</span>
                  </p>
                ))}
          </div>

          <div className={styles.footerCol}>
            <h5 className={styles.colHead}>{tr.colFind}</h5>
            <p>Din gata 1</p>
            <p>Göteborg</p>
            <a href="tel:031000000" style={{ marginTop: '12px' }}>031-00 00 00</a>
            <a href="mailto:info@atilliberg.se">info@atilliberg.se</a>
            <a href="#">Instagram @atilliberg</a>
          </div>

          <div className={styles.footerCol}>
            <h5 className={styles.colHead}>{tr.colNav}</h5>
            {tr.navLinks.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© 2026 Atilli Berg. {tr.rights}</p>
          <p>{tr.city}</p>
        </div>
      </footer>
    </>
  )
}
