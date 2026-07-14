'use client'

import { useState } from 'react'
import type { Bokning } from './types'
import { useLang } from '@/lib/LangContext'
import { t } from '@/lib/translations'
import styles from './boka-components.module.css'

interface Props {
  bokning: Bokning
  onChange: <K extends keyof Bokning>(nyckel: K, varde: Bokning[K]) => void
  onNasta: () => void
  onTillbaka: () => void
}

export default function KontaktForm({ bokning, onChange, onNasta, onTillbaka }: Props) {
  const { lang } = useLang()
  const tr = t[lang].boka
  const manader = tr.manader
  const { tjanst, datum, tid } = bokning
  const [laddar, setLaddar] = useState(false)
  const [fel, setFel] = useState<string | null>(null)
  const kanGaVidere = !!bokning.namn && !!bokning.email && !!bokning.telefon

  const skickaBokning = async () => {
    setLaddar(true)
    setFel(null)

    try {
      const res = await fetch('/api/boka', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bokning),
      })

      const data = await res.json()

      if (!res.ok) {
        setFel(data.error || tr.felGenerisk)
        return
      }

      onNasta()
    } catch {
      setFel(tr.felServer)
    } finally {
      setLaddar(false)
    }
  }

  return (
    <div>
      <p className={styles.sektionsTitel}>{tr.dinaUppgifter}</p>

      <div className={styles.sammanfattning}>
        <div className={styles.sammRad}>
          <span className={styles.sammLabel}>{tr.tjanst}</span>
          <span>{tjanst?.namn}</span>
        </div>
        <div className={styles.sammRad}>
          <span className={styles.sammLabel}>{tr.datum}</span>
          <span>{datum?.dag} {datum !== null ? manader[datum.manad] : ''} {datum?.ar}</span>
        </div>
        <div className={styles.sammRad}>
          <span className={styles.sammLabel}>{tr.tid}</span>
          <span>{tid}</span>
        </div>
        <div className={`${styles.sammRad} ${styles.sammTotalt}`}>
          <span className={styles.sammLabel}>{tr.totalt}</span>
          <span>{tjanst?.pris}</span>
        </div>
      </div>

      <div className={styles.formGrid}>
        <div>
          <label className={styles.formLabel}>{tr.fornamn}</label>
          <input
            className={styles.formInput}
            value={bokning.namn}
            onChange={(e) => onChange('namn', e.target.value)}
            placeholder="Anna"
          />
        </div>
        <div>
          <label className={styles.formLabel}>{tr.efternamn}</label>
          <input
            className={styles.formInput}
            value={bokning.efternamn}
            onChange={(e) => onChange('efternamn', e.target.value)}
            placeholder="Lindqvist"
          />
        </div>
        <div>
          <label className={styles.formLabel}>{tr.epost}</label>
          <input
            className={styles.formInput}
            type="email"
            value={bokning.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="anna@exempel.se"
          />
        </div>
        <div>
          <label className={styles.formLabel}>{tr.telefon}</label>
          <input
            className={styles.formInput}
            type="tel"
            value={bokning.telefon}
            onChange={(e) => onChange('telefon', e.target.value)}
            placeholder="070-000 00 00"
          />
        </div>
        <div className={styles.formFull}>
          <label className={styles.formLabel}>{tr.meddelande}</label>
          <textarea
            className={`${styles.formInput} ${styles.formTextarea}`}
            value={bokning.meddelande}
            onChange={(e) => onChange('meddelande', e.target.value)}
            placeholder={tr.meddelandePlaceholder}
          />
        </div>
      </div>

      {fel && (
        <p className={styles.felmeddelande}>{fel}</p>
      )}

      <div className={styles.knappar}>
        <button className={styles.knappSekundar} onClick={onTillbaka} disabled={laddar}>
          {tr.tillbaka}
        </button>
        <button
          className={styles.knappPrimar}
          onClick={skickaBokning}
          disabled={!kanGaVidere || laddar}
        >
          {laddar ? tr.skickar : tr.bekrafta}
        </button>
      </div>
    </div>
  )
}