'use client'

import { useState } from 'react'
import type { Datum } from './types'
import styles from './boka-components.module.css'

const manader = [
  'Januari','Februari','Mars','April','Maj','Juni',
  'Juli','Augusti','September','Oktober','November','December',
]
const dagLabels = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön']
const tider = [
  '09:00','09:45','10:30','11:15',
  '13:00','13:45','14:30','15:15',
  '16:00','16:45','17:30','18:15',
]
const ointligaTider = [2, 7]

interface Props {
  datum: Datum | null
  tid: string | null
  onDatum: (d: Datum) => void
  onTid: (t: string) => void
  onNasta: () => void
  onTillbaka: () => void
}

export default function KalenderVal({ datum, tid, onDatum, onTid, onNasta, onTillbaka }: Props) {
  const idag = new Date()
  const [manad, setManad] = useState<number>(idag.getMonth())
  const [ar, setAr] = useState<number>(idag.getFullYear())

  const bytManad = (rikt: number) => {
    let m = manad + rikt
    let a = ar
    if (m > 11) { m = 0; a++ }
    if (m < 0) { m = 11; a-- }
    setManad(m)
    setAr(a)
  }

  const forstaDag = new Date(ar, manad, 1)
  let startDag = forstaDag.getDay() - 1
  if (startDag < 0) startDag = 6
  const antalDagar = new Date(ar, manad + 1, 0).getDate()

  const arVald = (d: number) =>
    datum?.dag === d && datum?.manad === manad && datum?.ar === ar

  const arForbi = (d: number) =>
    new Date(ar, manad, d) < new Date(idag.getFullYear(), idag.getMonth(), idag.getDate())

  return (
    <div>
      <div className={styles.kalHuvud}>
        <button className={styles.kalKnapp} onClick={() => bytManad(-1)}>←</button>
        <p className={styles.sektionsTitel} style={{ margin: 0 }}>
          {manader[manad]} {ar}
        </p>
        <button className={styles.kalKnapp} onClick={() => bytManad(1)}>→</button>
      </div>

      <div className={styles.kalGrid}>
        {dagLabels.map((d) => (
          <div key={d} className={styles.kalDagLabel}>{d}</div>
        ))}
        {Array(startDag).fill(null).map((_, i) => <div key={'tom-' + i} />)}
        {Array.from({ length: antalDagar }, (_, i) => i + 1).map((dag) => {
          const forbi = arForbi(dag)
          const vald = arVald(dag)
          return (
            <div
              key={dag}
              className={`${styles.kalCell} ${forbi ? styles.forbi : ''} ${vald ? styles.valdDag : ''}`}
              onClick={() => !forbi && onDatum({ dag, manad, ar })}
            >
              {dag}
            </div>
          )
        })}
      </div>

      <div className={styles.ornament}>Välj tid</div>

      <div className={styles.tidGrid}>
        {tider.map((t, i) => {
          const otill = ointligaTider.includes(i)
          return (
            <div
              key={t}
              className={`${styles.tidCell} ${otill ? styles.otillganglig : ''} ${tid === t && !otill ? styles.valdTid : ''}`}
              onClick={() => !otill && onTid(t)}
            >
              {t}
            </div>
          )
        })}
      </div>

      <div className={styles.knappar}>
        <button className={styles.knappSekundar} onClick={onTillbaka}>← Tillbaka</button>
        <button
          className={styles.knappPrimar}
          onClick={onNasta}
          disabled={!datum || !tid}
        >
          Mina uppgifter →
        </button>
      </div>
    </div>
  )
}
