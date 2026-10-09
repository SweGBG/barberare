'use client'

import type { CSSProperties } from 'react'
import { useLang } from '@/lib/LangContext'
import { t } from '@/lib/translations'
import type { Service } from './Tjanster'
import styles from './Tjanster.module.css'

/* Egna, färgsatta bilder (Unsplash, graderade till svart & guld) */
const bilder: Record<string, string> = {
  fade: '/img/gal-maskin.webp',
  klipp: '/img/svc-klipp.webp',
  skägg: '/img/svc-skagg.webp',
  rak: '/img/svc-rak.webp',
  styl: '/img/svc-styl.webp',
}
const ROMAN = ['I', 'II', 'III', 'IV']
/* reserver när en tjänst inte matchar något eget ord */
const RESERV = ['/img/svc-rak.webp', '/img/svc-styl.webp', '/img/gal-sax.webp', '/img/svc-skagg.webp', '/img/svc-klipp.webp']

/** Ger varje tjänst en egen bild: unika träffar först, sedan kombinationer, sist reserver. */
function bildFor(namn: string[]): string[] {
  const traff = namn.map((n) => Object.keys(bilder).filter((k) => n.toLowerCase().includes(k)))
  const ut: string[] = new Array(namn.length).fill('')
  const tagna = new Set<string>()
  const ordning = namn.map((_, i) => i).sort((a, b) => (traff[a].length || 99) - (traff[b].length || 99))
  for (const i of ordning) {
    const fri = traff[i].map((k) => bilder[k]).find((b) => !tagna.has(b))
      ?? RESERV.find((b) => !tagna.has(b))
      ?? RESERV[i % RESERV.length]
    ut[i] = fri
    tagna.add(fri)
  }
  return ut
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
    <section className={styles.section} id="tjanster" data-progress>
      <header className={styles.header} data-reveal>
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          {lang === 'sv' ? 'Menyn' : 'The menu'}
          <span className={styles.eyebrowLine} />
        </p>
        <h2 className={styles.title}>{tr.title}</h2>
        <Flourish />
      </header>

      <div className={styles.grid}>
        {tjanster.slice(0, 4).map((tj, i, lista) => {
          const bild = bildFor(lista.map((x) => x.name))[i]
          const desc = matcha(tj.name, tr.beskrivningar) ?? tr.fallbackDesc
          return (
            <article key={tj.id} className={styles.card} data-reveal style={{ '--k': i } as CSSProperties}>
              <div className={styles.media}>
                <img src={bild} alt={tj.name} loading="lazy" className={styles.img} />
                <span className={styles.sheen} aria-hidden />
                <span className={styles.frame} aria-hidden />
                <span className={styles.roman} aria-hidden>{ROMAN[i]}</span>
              </div>
              <div className={styles.body}>
                <h3 className={styles.name}>{tj.name}</h3>
                <p className={styles.desc}>{desc}</p>
                <div className={styles.meta}>
                  <span className={styles.price}>{tr.fr} {tj.price} {tr.kr}</span>
                  <span className={styles.time}>{tj.duration_minutes} {tr.min}</span>
                </div>
                <a href="/boka" className={styles.cta}>
                  {tr.boka}
                  <svg viewBox="0 0 24 24" aria-hidden><path d="M4 12h15M13 6l6 6-6 6" /></svg>
                </a>
              </div>
            </article>
          )
        })}
      </div>

      <div className={styles.more} data-reveal>
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
