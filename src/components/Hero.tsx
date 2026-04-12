'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import styles from './Hero.module.css'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

const PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  left: `${5 + i * 10}%`,
  bottom: `${10 + (i % 3) * 20}%`,
  size: i % 3 === 0 ? '2px' : '1.5px',
  color: i % 2 === 0 ? 'rgba(184,149,106,0.4)' : 'rgba(196,169,154,0.25)',
  duration: 5 + (i % 4),
  delay: i * 0.7,
}))

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (bgRef.current) bgRef.current.style.transform = `translateY(${y * 0.4}px)`
      if (overlayRef.current) overlayRef.current.style.opacity = String(Math.min(y / 400, 0.85))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className={styles.hero}>

      <div className={styles.bgWrap}>
        <div ref={bgRef} className={styles.bg} />
        <div ref={overlayRef} className={styles.overlay} />
      </div>

      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse at 20% 30%, rgba(184,149,106,0.06) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 70%, rgba(196,169,154,0.04) 0%, transparent 50%)
        `,
      }} />

      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hgrid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <line x1="0" y1="80" x2="80" y2="0" stroke="rgba(184,149,106,0.04)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hgrid)" />
      </svg>

      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -60, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          style={{
            position: 'absolute', left: p.left, bottom: p.bottom,
            width: p.size, height: p.size,
            borderRadius: '50%', background: p.color,
            pointerEvents: 'none', zIndex: 1,
          }}
        />
      ))}

      <motion.div
        className={styles.dekoLeft}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 0.6, x: 0 }}
        transition={{ duration: 1.2, delay: 0.8, ease }}
      >
        <motion.svg
          width="120" height="300" viewBox="0 0 120 300"
          animate={{ opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <line x1="60" y1="0" x2="60" y2="300" stroke="#C4A99A" strokeWidth="0.5" />
          <line x1="20" y1="60" x2="100" y2="60" stroke="#C4A99A" strokeWidth="0.5" />
          <line x1="20" y1="240" x2="100" y2="240" stroke="#C4A99A" strokeWidth="0.5" />
          <circle cx="60" cy="60" r="20" fill="none" stroke="#B8956A" strokeWidth="0.5" />
          <circle cx="60" cy="150" r="35" fill="none" stroke="#C4A99A" strokeWidth="0.5" strokeDasharray="3 5" />
          <circle cx="60" cy="240" r="20" fill="none" stroke="#B8956A" strokeWidth="0.5" />
          <circle cx="60" cy="150" r="4" fill="#B8956A" opacity="0.4" />
        </motion.svg>
      </motion.div>

      <motion.div
        className={styles.dekoRight}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 0.6, x: 0 }}
        transition={{ duration: 1.2, delay: 0.8, ease }}
      >
        <motion.svg
          width="120" height="300" viewBox="0 0 120 300"
          animate={{ opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <line x1="60" y1="0" x2="60" y2="300" stroke="#C4A99A" strokeWidth="0.5" />
          <line x1="20" y1="60" x2="100" y2="60" stroke="#C4A99A" strokeWidth="0.5" />
          <line x1="20" y1="240" x2="100" y2="240" stroke="#C4A99A" strokeWidth="0.5" />
          <circle cx="60" cy="60" r="20" fill="none" stroke="#B8956A" strokeWidth="0.5" />
          <circle cx="60" cy="150" r="35" fill="none" stroke="#C4A99A" strokeWidth="0.5" strokeDasharray="3 5" />
          <circle cx="60" cy="240" r="20" fill="none" stroke="#B8956A" strokeWidth="0.5" />
          <circle cx="60" cy="150" r="4" fill="#B8956A" opacity="0.4" />
        </motion.svg>
      </motion.div>

      <div className={styles.content}>

        <motion.div
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            width: '5px', height: '5px', borderRadius: '50%',
            background: 'var(--gold)', marginBottom: '18px',
          }}
        />

        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          Exklusiv salong · Est. 2022
        </motion.p>

        <motion.h1 className={styles.title}>
          {['Håret är', 'ditt ', 'intryck.'].map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35 + i * 0.18, ease }}
              style={{ display: i === 1 ? 'inline' : 'block' }}
            >
              {i === 1 ? (<>ditt <em>första</em><br /></>) : word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.div
          className={styles.dividerWrap}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <motion.span
            className={styles.dividerLine}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.0, ease }}
            style={{ transformOrigin: 'right' }}
          />
          <motion.span
            className={styles.dividerDot}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.2 }}
          />
          <motion.span
            className={styles.dividerLine}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.0, ease }}
            style={{ transformOrigin: 'left' }}
          />
        </motion.div>

        <motion.p
          className={styles.sub}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1, ease }}
        >
          Vi klipper, färgar och formar med precision och känsla.
          Varje besök är en upplevelse — varje resultat, ett hantverk.
        </motion.p>

        <motion.div
          className={styles.btns}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3, ease }}
        >
          <motion.a
            href="/boka"
            className={styles.btnPrimary}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            Boka din tid
          </motion.a>
          <motion.a
            href="#tjanster"
            className={styles.btnGhost}
            whileHover={{ x: 4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            Se tjänster
          </motion.a>
        </motion.div>
      </div>

      <motion.div
        className={styles.scroll}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <span className={styles.scrollLine} />
        <span className={styles.scrollText}>Scrolla</span>
      </motion.div>

    </section>
  )
}