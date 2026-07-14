'use client'

import { useLang } from '@/lib/LangContext'
import { t } from '@/lib/translations'
import styles from './Features.module.css'

const icons = [
  <svg key="i0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
    <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
    <path d="M8.5 8.5 20 20M8.5 15.5 20 4" />
  </svg>,
  <svg key="i1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
    <rect x="5" y="8" width="14" height="12" rx="1" />
    <path d="M5 12h14M9 8V5a3 3 0 0 1 6 0v3" />
  </svg>,
  <svg key="i2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2.5" />
  </svg>,
  <svg key="i3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
    <circle cx="9" cy="8" r="3" /><circle cx="16.5" cy="9.5" r="2.5" />
    <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5M14.5 14.6c2.6.3 4.5 2 4.5 4.4" />
  </svg>,
]

export default function Features() {
  const { lang } = useLang()
  const tr = t[lang].features

  return (
    <section className={styles.strip} aria-label={tr.ariaLabel}>
      <div className={styles.inner}>
        {tr.items.map((f, i) => (
          <div key={f.title} className={styles.item}>
            <div className={styles.icon}>{icons[i]}</div>
            <div>
              <h3 className={styles.title}>{f.title}</h3>
              <p className={styles.desc}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
