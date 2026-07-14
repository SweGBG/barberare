'use client'

import { motion } from 'framer-motion'
import styles from './Hero.module.css'
import GoldDustField from './GoldDustField'
import { useLang } from '@/lib/LangContext'
import { t } from '@/lib/translations'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function Hero() {
  const { lang } = useLang()
  const tr = t[lang].hero
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
            alt={tr.logoAlt}
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
            {tr.eyebrow}
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
              {tr.subtitle}
            </span>
          </motion.h1>


          <motion.p
            className={styles.lead}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.6 }}
          >
            {tr.lead}
          </motion.p>


          <motion.div
            className={styles.btns}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.75 }}
          >
            <a href="/boka" className={styles.btnGold}>
              {tr.cta1}
            </a>

            <a href="/#tjanster" className={styles.btnGhost}>
              {tr.cta2}
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
          {tr.scroll}
        </span>
      </motion.div>

    </section>
  )
}