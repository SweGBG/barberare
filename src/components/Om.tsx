'use client'

import { useLang } from '@/lib/LangContext'
import { t } from '@/lib/translations'
import styles from './Om.module.css'

export default function Om() {
  const { lang } = useLang()
  const tr = t[lang].om

  return (
    <>
      {/* ── Om Atilli Berg ── */}
      <section className={styles.om} id="om">
        <div className={styles.omImageWrap}>
          <div className={styles.omFrame} aria-hidden="true" />
          <img
            src="/hero-bg2.jpg"
            alt={tr.imgAlt}
            className={styles.omImage}
            loading="lazy"
          />
        </div>

        <div className={styles.omText}>
          <h2 className={styles.omTitle}>{tr.title}</h2>

          <p className={styles.omLead}>
            <strong>{tr.leadStrong}</strong>{tr.lead}
          </p>
          <p className={styles.omBody}>{tr.body}</p>

          <div className={styles.omStats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>10+</span>
              <span className={styles.statLabel}>{tr.stat1Label}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>4</span>
              <span className={styles.statLabel}>{tr.stat2Label}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>4.9</span>
              <span className={styles.statLabel}>{tr.stat3Label}</span>
            </div>
          </div>

          <a href="/kontakt" className={styles.omBtn}>{tr.btn}</a>
        </div>
      </section>

      {/* ── Prislista ── */}
      <section className={styles.priser} id="priser">
        <div className={styles.priserHeader}>
          <h2 className={styles.priserTitle}>{tr.priserTitle}</h2>
          <p className={styles.priserSub}>{tr.priserSub}</p>
        </div>

        <div className={styles.priserGrid}>
          {tr.priser.map((kat) => (
            <div key={kat.kategori} className={styles.priserKat}>
              <h3 className={styles.katNamn}>{kat.kategori}</h3>
              {kat.rader.map((rad) => (
                <div key={rad.namn} className={styles.prisRad}>
                  <span className={styles.prisNamn}>{rad.namn}</span>
                  <span className={styles.prisDots} aria-hidden="true" />
                  <span className={styles.prisPris}>{rad.pris}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <p className={styles.prisNote}>{tr.priserNote}</p>
      </section>
    </>
  )
}
