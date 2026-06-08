'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import styles from './Hero.module.css'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

const marqueeItems = [
  'Atilli Berg', 'Est. 2026', 'Göteborg', 'Premium Barbershop',
  'Atilli Berg', 'Est. 2026', 'Göteborg', 'Premium Barbershop',
  'Atilli Berg', 'Est. 2026', 'Göteborg', 'Premium Barbershop',
]

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (bgRef.current) bgRef.current.style.transform = `translateY(${y * 0.35}px)`
      if (overlayRef.current) overlayRef.current.style.opacity = String(Math.min(y / 300, 0.7))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <section className={styles.hero}>

        {/* Bakgrundsbild */}
        <div className={styles.bgWrap}>
          <div ref={bgRef} className={styles.bg} />
          <div className={styles.bgTint} />
          <div ref={overlayRef} className={styles.overlay} />
        </div>

        {/* Dekorativa SVG:er */}
        <div className={styles.dekoLeft}>
          <svg width="90" height="240" viewBox="0 0 120 300">
            <line x1="60" y1="0" x2="60" y2="300" stroke="#C4A99A" strokeWidth="0.5" />
            <line x1="20" y1="60" x2="100" y2="60" stroke="#C4A99A" strokeWidth="0.5" />
            <line x1="20" y1="240" x2="100" y2="240" stroke="#C4A99A" strokeWidth="0.5" />
            <circle cx="60" cy="60" r="20" fill="none" stroke="#B8956A" strokeWidth="0.5" />
            <circle cx="60" cy="150" r="35" fill="none" stroke="#C4A99A" strokeWidth="0.5" strokeDasharray="3 5" />
            <circle cx="60" cy="240" r="20" fill="none" stroke="#B8956A" strokeWidth="0.5" />
            <circle cx="60" cy="150" r="4" fill="#B8956A" opacity="0.5" />
          </svg>
        </div>

        <div className={styles.dekoRight}>
          <svg width="90" height="240" viewBox="0 0 120 300">
            <line x1="60" y1="0" x2="60" y2="300" stroke="#C4A99A" strokeWidth="0.5" />
            <line x1="20" y1="60" x2="100" y2="60" stroke="#C4A99A" strokeWidth="0.5" />
            <line x1="20" y1="240" x2="100" y2="240" stroke="#C4A99A" strokeWidth="0.5" />
            <circle cx="60" cy="60" r="20" fill="none" stroke="#B8956A" strokeWidth="0.5" />
            <circle cx="60" cy="150" r="35" fill="none" stroke="#C4A99A" strokeWidth="0.5" strokeDasharray="3 5" />
            <circle cx="60" cy="240" r="20" fill="none" stroke="#B8956A" strokeWidth="0.5" />
            <circle cx="60" cy="150" r="4" fill="#B8956A" opacity="0.5" />
          </svg>
        </div>

        {/* Innehåll */}
        <div className={styles.content}>
          <motion.p
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
          >
            Exklusiv Salong · Est. 2026
          </motion.p>

          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.25 }}
          >
            Håret är<br />
            ditt <em>första</em><br />
            intryck.
          </motion.h1>

          <motion.div
            className={styles.dividerWrap}
            initial={{ opacity: 0, scaleX: 0.4 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, ease, delay: 0.45 }}
          >
            <span className={styles.dividerLine} />
            <span className={styles.dividerDot} />
            <span className={styles.dividerLine} />
          </motion.div>

          <motion.p
            className={styles.sub}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.55 }}
          >
            Vi klipper, färgar och formar med precision och känsla.<br />
            Varje besök är en upplevelse — varje resultat, ett hantverk.
          </motion.p>

          <motion.div
            className={styles.btns}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.7 }}
          >
            <a href="/boka" className={styles.btnPrimary}>Boka din tid</a>
            <a href="#tjanster" className={styles.btnGhost}>Se tjänster</a>
          </motion.div>
        </div>

        {/* Scroll-indikator */}
        <motion.div
          className={styles.scroll}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <span className={styles.scrollLine} />
          <span className={styles.scrollText}>Scrolla</span>
        </motion.div>

      </section>

      {/* Marquee-band */}
      <div className={styles.marqueeWrap}>
        <div className={styles.marqueeTrack}>
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className={styles.marqueeItem}>
              {item}
              <span className={styles.marqueeDot} />
            </span>
          ))}
        </div>
      </div>
    </>
  )
}