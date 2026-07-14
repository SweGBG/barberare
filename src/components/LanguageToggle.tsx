'use client'

import { useLang } from '@/lib/LangContext'
import styles from './LanguageToggle.module.css'

/** SE/EN-växlare med SVG-flaggor — Atilli guld-tema. */
export default function LanguageToggle() {
  const { lang, setLang } = useLang()

  return (
    <div className={styles.toggle} role="group" aria-label="Språk / Language">
      <button
        className={`${styles.flagBtn} ${lang === 'sv' ? styles.active : ''}`}
        onClick={() => setLang('sv')}
        aria-label="Svenska"
        aria-pressed={lang === 'sv'}
      >
        <svg viewBox="0 0 16 10" className={styles.flag}>
          <rect width="16" height="10" fill="#006AA7" />
          <rect x="5" width="2" height="10" fill="#FECC00" />
          <rect y="4" width="16" height="2" fill="#FECC00" />
        </svg>
      </button>
      <span className={styles.sep} aria-hidden="true" />
      <button
        className={`${styles.flagBtn} ${lang === 'en' ? styles.active : ''}`}
        onClick={() => setLang('en')}
        aria-label="English"
        aria-pressed={lang === 'en'}
      >
        <svg viewBox="0 0 16 10" className={styles.flag}>
          <rect width="16" height="10" fill="#012169" />
          <path d="M0,0 L16,10 M16,0 L0,10" stroke="#fff" strokeWidth="2" />
          <path d="M0,0 L16,10 M16,0 L0,10" stroke="#C8102E" strokeWidth="0.9" />
          <rect x="6.6" width="2.8" height="10" fill="#fff" />
          <rect y="3.6" width="16" height="2.8" fill="#fff" />
          <rect x="7.2" width="1.6" height="10" fill="#C8102E" />
          <rect y="4.2" width="16" height="1.6" fill="#C8102E" />
        </svg>
      </button>
    </div>
  )
}
