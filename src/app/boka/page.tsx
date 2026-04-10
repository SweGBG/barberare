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

          <div className={styles.geoLeft}>
            <svg width="80" height="200" viewBox="0 0 80 200" fill="none">
              <line x1="40" y1="0" x2="40" y2="200" stroke="#B8956A" strokeWidth="0.5" />
              <line x1="10" y1="40" x2="70" y2="40" stroke="#B8956A" strokeWidth="0.5" />
              <line x1="10" y1="160" x2="70" y2="160" stroke="#B8956A" strokeWidth="0.5" />
              <circle cx="40" cy="40" r="14" stroke="#B8956A" strokeWidth="0.5" fill="none" />
              <circle cx="40" cy="100" r="24" stroke="#B8956A" strokeWidth="0.5" strokeDasharray="3 5" fill="none" />
              <circle cx="40" cy="160" r="14" stroke="#B8956A" strokeWidth="0.5" fill="none" />
              <circle cx="40" cy="100" r="3" fill="#B8956A" opacity="0.5" />
            </svg>
          </div>

          <div className={styles.geoRight}>
            <svg width="80" height="200" viewBox="0 0 80 200" fill="none">
              <line x1="40" y1="0" x2="40" y2="200" stroke="#B8956A" strokeWidth="0.5" />
              <line x1="10" y1="40" x2="70" y2="40" stroke="#B8956A" strokeWidth="0.5" />
              <line x1="10" y1="160" x2="70" y2="160" stroke="#B8956A" strokeWidth="0.5" />
              <circle cx="40" cy="40" r="14" stroke="#B8956A" strokeWidth="0.5" fill="none" />
              <circle cx="40" cy="100" r="24" stroke="#B8956A" strokeWidth="0.5" strokeDasharray="3 5" fill="none" />
              <circle cx="40" cy="160" r="14" stroke="#B8956A" strokeWidth="0.5" fill="none" />
              <circle cx="40" cy="100" r="3" fill="#B8956A" opacity="0.5" />
            </svg>
          </div>

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
              className={`${styles.steg} ${
                steg === i + 1 ? styles.aktiv : steg > i + 1 ? styles.klar : ''
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
