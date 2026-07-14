'use client'

import { useLang } from '@/lib/LangContext'
import { t } from '@/lib/translations'
import styles from './Galleri.module.css'

const bilder = [
  { id: 1, span: 'wide', img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1000&q=80' },
  { id: 2, span: 'tall', img: 'https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=800&q=80' },
  { id: 3, span: '', img: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80' },
  { id: 4, span: '', img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80' },
  { id: 5, span: 'wide', img: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1000&q=80' },
]

export default function Galleri() {
  const { lang } = useLang()
  const tr = t[lang].galleri

  return (
    <section className={styles.section} id="galleri">
      <div className={styles.header}>
        <h2 className={styles.title}>{tr.title}</h2>
        <p className={styles.sub}>{tr.sub}</p>
      </div>

      <div className={styles.grid}>
        {bilder.map((b, i) => (
          <div
            key={b.id}
            className={`${styles.item} ${b.span === 'wide' ? styles.wide : ''} ${b.span === 'tall' ? styles.tall : ''}`}
          >
            <img src={b.img} alt={tr.labels[i]} loading="lazy" />
            <div className={styles.overlay}>
              <span className={styles.label}>{tr.labels[i]}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
