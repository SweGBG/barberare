'use client'

import { useLang } from '@/lib/LangContext'
import { t } from '@/lib/translations'
import type { Service } from './Tjanster'
import styles from './Tjanster.module.css'

const bilder: Record<string, string> = {
  klipp: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
  skägg: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80',
  rak: 'https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=800&q=80',
  styl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80',
}

function matcha<T>(namn: string, karta: Record<string, T>): T | undefined {
  const n = namn.toLowerCase()
  const nyckel = Object.keys(karta).find((k) => n.includes(k))
  return nyckel ? karta[nyckel] : undefined
}

export default function TjansterClient({ tjanster }: { tjanster: Service[] }) {
  const { lang } = useLang()
  const tr = t[lang].tjanster

  return (
    <section className={styles.section} id="tjanster">
      <div className={styles.header}>
        <h2 className={styles.title}>{tr.title}</h2>
        <Flourish />
      </div>

      <div className={styles.grid}>
        {tjanster.slice(0, 4).map((tj) => {
          const bild = matcha(tj.name, bilder) ?? bilder.klipp
          const desc = matcha(tj.name, tr.beskrivningar) ?? tr.fallbackDesc

          return (
            <article key={tj.id} className={styles.card}>
              <div className={styles.imgWrap}>
                <img src={bild} alt={tj.name} loading="lazy" />
                <div className={styles.imgTint} />
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.cardName}>{tj.name}</h3>
                <p className={styles.cardDesc}>{desc}</p>
                <p className={styles.cardPris}>
                  {tr.fr} {tj.price} {tr.kr}
                  <span className={styles.cardTid}> · {tj.duration_minutes} {tr.min}</span>
                </p>
                <a href="/boka" className={styles.cardBtn}>{tr.boka}</a>
              </div>
            </article>
          )
        })}
      </div>

      <div className={styles.more}>
        <a href="/boka" className={styles.moreBtn}>{tr.seAlla}</a>
      </div>
    </section>
  )
}

function Flourish() {
  return (
    <svg className={styles.flourish} width="220" height="26" viewBox="0 0 220 26" fill="none" aria-hidden="true">
      <line x1="0" y1="13" x2="86" y2="13" stroke="rgba(201,162,75,0.5)" strokeWidth="0.7" />
      <line x1="134" y1="13" x2="220" y2="13" stroke="rgba(201,162,75,0.5)" strokeWidth="0.7" />
      <path d="M96 13c4-6 10-6 14 0-4 6-10 6-14 0Z" stroke="#C9A24B" strokeWidth="0.8" fill="none" />
      <circle cx="103" cy="13" r="1.6" fill="#C9A24B" />
      <path d="M86 13c3 0 5-3 5-3M86 13c3 0 5 3 5 3M134 13c-3 0-5-3-5-3M134 13c-3 0-5 3-5 3"
        stroke="rgba(201,162,75,0.7)" strokeWidth="0.7" />
    </svg>
  )
}
