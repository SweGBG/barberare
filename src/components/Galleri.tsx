'use client'

import { useState, type CSSProperties } from 'react'
import { useLang } from '@/lib/LangContext'
import { t } from '@/lib/translations'
import styles from './Galleri.module.css'
import GalleriLightbox from './GalleriLightbox'

/* Ordningen följer t[lang].galleri.labels */
const bilder = [
  { src: '/img/gal-salong.webp', ar: '4 / 3' },
  { src: '/img/gal-klipp.webp', ar: '4 / 5' },
  { src: '/img/gal-film-a.webp', ar: '4 / 5' },
  { src: '/img/gal-sax.webp', ar: '4 / 5' },
  { src: '/img/gal-maskin.webp', ar: '3 / 2' },
  { src: '/img/gal-stol.webp', ar: '4 / 5' },
  { src: '/img/gal-korridor.webp', ar: '3 / 4' },
  { src: '/img/gal-film-b.webp', ar: '4 / 5' },
]
/* tre kolumner på olika djup — glider i olika takt */
const KOLUMNER = [
  { speed: 70, items: [0, 3, 6] },
  { speed: -50, items: [1, 4, 7] },
  { speed: 110, items: [2, 5] },
]

export default function Galleri() {
  const { lang } = useLang()
  const tr = t[lang].galleri
  const [open, setOpen] = useState<number | null>(null)
  const [origin, setOrigin] = useState<HTMLElement | null>(null)

  return (
    <section className={styles.section} id="galleri" data-progress>
      <header className={styles.header} data-reveal>
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          {lang === 'sv' ? 'Galleri' : 'Gallery'}
        </p>
        <h2 className={styles.title}>{tr.title}</h2>
        <p className={styles.sub}>{tr.sub}</p>
      </header>

      <div className={styles.cols}>
        {KOLUMNER.map((col, c) => (
          <div key={c} className={styles.col} style={{ '--speed': col.speed } as CSSProperties}>
            {col.items.map((i) => (
              <figure key={i} className={styles.item} data-reveal data-gal={i} style={{ '--ar': bilder[i].ar, '--k': c } as CSSProperties}>
                <img src={bilder[i].src} alt={tr.labels[i]} loading="lazy" />
                <button
                  type="button"
                  className={styles.hit}
                  aria-label={`${tr.labels[i]} — ${lang === 'sv' ? 'öppna' : 'open'}`}
                  onClick={(e) => {
                    setOrigin(e.currentTarget.parentElement)
                    setOpen(i)
                  }}
                />
                <span className={styles.corners} aria-hidden />
                <figcaption className={styles.label}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {tr.labels[i]}
                </figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>

      <GalleriLightbox
        bilder={bilder}
        index={open}
        origin={origin}
        lang={lang}
        onIndex={setOpen}
        onClose={() => setOpen(null)}
      />
    </section>
  )
}
