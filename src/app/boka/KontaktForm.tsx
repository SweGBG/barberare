'use client'

import { useState } from 'react'
import type { Bokning } from './types'
import styles from './boka-components.module.css'

const manader = [
  'Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
  'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December',
]

interface Props {
  bokning: Bokning
  onChange: <K extends keyof Bokning>(nyckel: K, varde: Bokning[K]) => void
  onNasta: () => void
  onTillbaka: () => void
}

export default function KontaktForm({ bokning, onChange, onNasta, onTillbaka }: Props) {
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
        setFel(data.error || 'Något gick fel, försök igen.')
        return
      }

      onNasta()
    } catch {
      setFel('Kunde inte nå servern, kontrollera din uppkoppling.')
    } finally {
      setLaddar(false)
    }
  }

  return (
    <div>
      <p className={styles.sektionsTitel}>Dina uppgifter</p>

      <div className={styles.sammanfattning}>
        <div className={styles.sammRad}>
          <span className={styles.sammLabel}>Tjänst</span>
          <span>{tjanst?.namn}</span>
        </div>
        <div className={styles.sammRad}>
          <span className={styles.sammLabel}>Datum</span>
          <span>{datum?.dag} {datum !== null ? manader[datum.manad] : ''} {datum?.ar}</span>
        </div>
        <div className={styles.sammRad}>
          <span className={styles.sammLabel}>Tid</span>
          <span>{tid}</span>
        </div>
        <div className={`${styles.sammRad} ${styles.sammTotalt}`}>
          <span className={styles.sammLabel}>Totalt</span>
          <span>{tjanst?.pris}</span>
        </div>
      </div>

      <div className={styles.formGrid}>
        <div>
          <label className={styles.formLabel}>Förnamn</label>
          <input
            className={styles.formInput}
            value={bokning.namn}
            onChange={(e) => onChange('namn', e.target.value)}
            placeholder="Anna"
          />
        </div>
        <div>
          <label className={styles.formLabel}>Efternamn</label>
          <input
            className={styles.formInput}
            value={bokning.efternamn}
            onChange={(e) => onChange('efternamn', e.target.value)}
            placeholder="Lindqvist"
          />
        </div>
        <div>
          <label className={styles.formLabel}>E-post</label>
          <input
            className={styles.formInput}
            type="email"
            value={bokning.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="anna@exempel.se"
          />
        </div>
        <div>
          <label className={styles.formLabel}>Telefon</label>
          <input
            className={styles.formInput}
            type="tel"
            value={bokning.telefon}
            onChange={(e) => onChange('telefon', e.target.value)}
            placeholder="070-000 00 00"
          />
        </div>
        <div className={styles.formFull}>
          <label className={styles.formLabel}>Meddelande (valfritt)</label>
          <textarea
            className={`${styles.formInput} ${styles.formTextarea}`}
            value={bokning.meddelande}
            onChange={(e) => onChange('meddelande', e.target.value)}
            placeholder="Önskemål, allergier eller annat vi bör veta..."
          />
        </div>
      </div>

      {fel && (
        <p className={styles.felmeddelande}>{fel}</p>
      )}

      <div className={styles.knappar}>
        <button className={styles.knappSekundar} onClick={onTillbaka} disabled={laddar}>
          ← Tillbaka
        </button>
        <button
          className={styles.knappPrimar}
          onClick={skickaBokning}
          disabled={!kanGaVidere || laddar}
        >
          {laddar ? 'Skickar...' : 'Bekräfta bokning →'}
        </button>
      </div>
    </div>
  )
}