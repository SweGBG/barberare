'use client'

import { motion } from 'framer-motion'
import styles from './Hero.module.css'
import GoldDustField from './GoldDustField'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function Hero() {
  return (
    <section className={styles.hero} id="hem">

      {/* Bakgrund */}
      <div className={styles.bgWrap}>
        <div className={styles.bg} />
        <div className={styles.bgVignette} />

        {/* Guldstoft-effekt */}
        <GoldDustField />
      </div>

      <div className={styles.inner}>

        {/* ── Vänster: ornamentlogotypen ── */}
        <motion.div
          className={styles.logoSide}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease, delay: 0.1 }}
        >
          <img
            src="/atilli-logo.png"
            alt="Atilli Berg — Frisör & Barberare, Est. 2026"
            className={styles.logoImg}
            draggable={false}
          />

          <div className={styles.logoGlow} aria-hidden="true" />
        </motion.div>


        {/* ── Höger: text ── */}
        <div className={styles.textSide}>

          <motion.p
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.25 }}
          >
            <span className={styles.eyebrowLine} />
            Välkommen till
            <span className={styles.eyebrowLine} />
          </motion.p>


          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.4 }}
          >
            Atilli Berg
            <span className={styles.subtitle}>
              Frisör &amp; Barberare
            </span>
          </motion.h1>


          <motion.p
            className={styles.lead}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.6 }}
          >
            På Atilli Berg kombinerar vi traditionellt hantverk med
            moderna tekniker för att ge dig en stil som passar dig.
            Vår passion är ditt hår — din stil är vår stolthet.
          </motion.p>


          <motion.div
            className={styles.btns}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.75 }}
          >
            <a href="/boka" className={styles.btnGold}>
              Boka din tid
            </a>

            <a href="/#tjanster" className={styles.btnGhost}>
              Våra tjänster
            </a>
          </motion.div>

        </div>

      </div>


      {/* Scroll-indikator */}
      <motion.div
        className={styles.scroll}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        aria-hidden="true"
      >
        <span className={styles.scrollLine} />
        <span className={styles.scrollText}>
          Scrolla
        </span>
      </motion.div>

    </section>
  )
}