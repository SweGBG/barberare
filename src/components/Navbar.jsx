'use client'
import { useEffect, useState } from 'react'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>

      {/* LEFT LINKS */}
      <ul className={styles.left}>
        <li><a href="#tjanster">Tjänster</a></li>
        <li><a href="#om">Om oss</a></li>
        <li><a href="#priser">Priser</a></li>
      </ul>

      {/* CENTER LOGO */}
      <div className={styles.logoWrap}>
        <div className={styles.logoRing}>
          <svg className={styles.logoRingSvg} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#B8956A" strokeWidth="1" strokeDasharray="3 4" />
          </svg>
        </div>
        <div className={styles.logoRing2}>
          <svg className={styles.logoRingSvg2} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#1C1A17" strokeWidth="0.5" strokeDasharray="1 6" />
          </svg>
        </div>
        <a href="/" className={styles.logo}>
          <span className={styles.logoMain}>Atilli</span>
          <span className={styles.logoSub}>Berg</span>
        </a>
      </div>

      {/* RIGHT LINKS */}
      <ul className={styles.right}>
        <li><a href="#galleri">Galleri</a></li>
        <li><a href="#kontakt">Kontakt</a></li>
        <li><a href="#boka" className={styles.bokaCta}>Boka tid</a></li>
      </ul>

    </nav>
  )
}