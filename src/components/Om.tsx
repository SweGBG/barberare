'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useLang } from '@/lib/LangContext'
import { t } from '@/lib/translations'
import styles from './Om.module.css'

/** Räknar upp när siffran syns. Hanterar "10+", "4", "4.9". */
function Count({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const m = value.match(/^([\d.]+)(.*)$/)
  const to = m ? parseFloat(m[1]) : 0
  const dec = m && m[1].includes('.') ? m[1].split('.')[1].length : 0
  const suffix = m ? m[2] : ''
  const [v, setV] = useState(value)
  useEffect(() => {
    const el = ref.current
    if (!el || !m) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / 1600)
        setV((to * (1 - Math.pow(1 - k, 3))).toFixed(dec) + suffix)
        if (k < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    })
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return <span ref={ref} className={styles.statNum}>{v}</span>
}

export default function Om() {
  const { lang } = useLang()
  const tr = t[lang].om
  const stats = [
    { n: '10+', l: tr.stat1Label },
    { n: '4', l: tr.stat2Label },
    { n: '4.9', l: tr.stat3Label },
  ]

  return (
    <>
      {/* ── Om Atilli Berg ── */}
      <section className={styles.om} id="om" data-progress>
        <div className={styles.layers} data-reveal>
          <div className={`${styles.photo} ${styles.back}`}>
            <img src="/img/gal-salong.webp" alt="" aria-hidden loading="lazy" />
          </div>
          <div className={`${styles.photo} ${styles.front}`}>
            <img src="/img/gal-stol.webp" alt={tr.imgAlt} loading="lazy" />
            <span className={styles.frame} aria-hidden />
          </div>
          <div className={styles.seal} aria-hidden>
            <span className={styles.sealRing} />
            <span className={styles.sealText}>Est.<br />2026</span>
          </div>
        </div>

        <div className={styles.text} data-reveal>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            {lang === 'sv' ? 'Salongen' : 'The salon'}
          </p>
          <h2 className={styles.title}>{tr.title}</h2>
          <p className={styles.lead}>
            <strong>{tr.leadStrong}</strong>{tr.lead}
          </p>
          <p className={styles.body}>{tr.body}</p>

          <div className={styles.stats}>
            {stats.map((s) => (
              <div key={s.l} className={styles.stat}>
                <Count value={s.n} />
                <span className={styles.statLabel}>{s.l}</span>
              </div>
            ))}
          </div>

          <a href="/kontakt" className={styles.btn}>{tr.btn}</a>
        </div>
      </section>

      {/* ── Prislista ── */}
      <section className={styles.priser} id="priser">
        <div className={styles.menu} data-reveal>
          <span className={styles.menuCorners} aria-hidden />
          <header className={styles.menuHead}>
            <h2 className={styles.menuTitle}>{tr.priserTitle}</h2>
            <p className={styles.menuSub}>{tr.priserSub}</p>
          </header>

          <div className={styles.menuGrid}>
            {tr.priser.map((kat, ki) => (
              <div key={kat.kategori} className={styles.kat} style={{ '--k': ki } as CSSProperties}>
                <h3 className={styles.katNamn}>{kat.kategori}</h3>
                {kat.rader.map((rad, ri) => (
                  <div key={rad.namn} className={styles.rad} style={{ '--r': ri } as CSSProperties}>
                    <span className={styles.radNamn}>{rad.namn}</span>
                    <span className={styles.dots} aria-hidden />
                    <span className={styles.radPris}>{rad.pris}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <p className={styles.note}>{tr.priserNote}</p>
          <a href="/boka" className={styles.menuBtn}>{t[lang].hero.cta1}</a>
        </div>
      </section>
    </>
  )
}
