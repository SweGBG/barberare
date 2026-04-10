'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TjanstVal from './TjanstVal'
import KalenderVal from './KalenderVal'
import KontaktForm from './KontaktForm'
import Bekraftelse from './Bekraftelse'
import type { Bokning } from './types'
import styles from './boka.module.css'

const tomBokning: Bokning = {
  tjanst: null,
  datum: null,
  tid: null,
  namn: '',
  efternamn: '',
  email: '',
  telefon: '',
  meddelande: '',
}

const stegLabels = ['Tjänst', 'Datum & Tid', 'Dina uppgifter', 'Bekräftelse']

export default function BokaPage() {
  const [steg, setSteg] = useState<number>(1)
  const [bokning, setBokning] = useState<Bokning>(tomBokning)

  const uppdatera = <K extends keyof Bokning>(nyckel: K, varde: Bokning[K]) =>
    setBokning((prev) => ({ ...prev, [nyckel]: varde }))

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.hero}>
          <p className={styles.eyebrow}>Exklusiv salong · Est. 2022</p>
          <h1 className={styles.title}>
            Boka din <em>tid</em>
          </h1>
          <div className={styles.divider} />
          <p className={styles.sub}>Välj tjänst, datum och tid — enkelt och smidigt.</p>
        </div>

        <div className={styles.stegBar}>
          {stegLabels.map((label, i) => (
            <div
              key={i}
              className={`${styles.steg} ${steg === i + 1 ? styles.aktiv : steg > i + 1 ? styles.klar : ''
                }`}
            >
              {i + 1} · {label}
            </div>
          ))}
        </div>

        <div className={styles.innehall}>
          {steg === 1 && (
            <TjanstVal
              vald={bokning.tjanst}
              onValj={(t) => uppdatera('tjanst', t)}
              onNasta={() => setSteg(2)}
            />
          )}
          {steg === 2 && (
            <KalenderVal
              datum={bokning.datum}
              tid={bokning.tid}
              onDatum={(d) => uppdatera('datum', d)}
              onTid={(t) => uppdatera('tid', t)}
              onNasta={() => setSteg(3)}
              onTillbaka={() => setSteg(1)}
            />
          )}
          {steg === 3 && (
            <KontaktForm
              bokning={bokning}
              onChange={uppdatera}
              onNasta={() => setSteg(4)}
              onTillbaka={() => setSteg(2)}
            />
          )}
          {steg === 4 && <Bekraftelse bokning={bokning} />}
        </div>
      </main>
      <Footer />
    </>
  )
}