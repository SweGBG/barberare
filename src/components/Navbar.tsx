'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-dropdown]')) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setDropdownOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>

      <ul className={styles.left}>
        <li><a href="#tjanster">Tjänster</a></li>
        <li><a href="#om">Om oss</a></li>
        <li><a href="#priser">Priser</a></li>
      </ul>

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

      <ul className={styles.right}>
        <li><a href="#galleri">Galleri</a></li>
        <li><a href="#kontakt">Kontakt</a></li>
        <li><a href="/boka" className={styles.bokaCta}>Boka tid</a></li>

        <li data-dropdown style={{ position: 'relative' }}>
          <button
            className={styles.kontoKnapp}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="Konto"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            <span className={`${styles.kontoRing} ${user ? styles.kontoRingActive : ''}`} />
          </button>

          {dropdownOpen && (
            <div className={styles.dropdown}>
              <svg className={styles.dropdownGeo} viewBox="0 0 180 220" xmlns="http://www.w3.org/2000/svg">
                <circle cx="160" cy="30" r="80" fill="none" stroke="rgba(184,149,106,0.07)" strokeWidth="0.5" />
                <circle cx="160" cy="30" r="50" fill="none" stroke="rgba(184,149,106,0.05)" strokeWidth="0.5" />
                <line x1="0" y1="80" x2="180" y2="80" stroke="rgba(184,149,106,0.04)" strokeWidth="0.5" />
                <line x1="0" y1="150" x2="180" y2="150" stroke="rgba(184,149,106,0.04)" strokeWidth="0.5" />
              </svg>

              {user ? (
                <>
                  <div className={styles.dropdownHeader}>
                    <p className={styles.dropdownEmail}>{user.email}</p>
                  </div>
                  <a href="/konto" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    <span>Mina bokningar</span>
                    <span className={styles.dropdownArrow}>›</span>
                  </a>
                  <a href="/konto/profil" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    <span>Min profil</span>
                    <span className={styles.dropdownArrow}>›</span>
                  </a>
                  <button className={styles.dropdownLogout} onClick={handleLogout}>
                    Logga ut
                  </button>
                </>
              ) : (
                <>
                  <div className={styles.dropdownHeader}>
                    <p className={styles.dropdownTagline}>Exklusiv access</p>
                  </div>
                  <a href="/logga-in" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    <span>Logga in</span>
                    <span className={styles.dropdownArrow}>›</span>
                  </a>
                  <a href="/skapa-konto" className={styles.dropdownItemGold} onClick={() => setDropdownOpen(false)}>
                    <span>Skapa konto</span>
                    <span className={styles.dropdownArrow}>›</span>
                  </a>
                </>
              )}
            </div>
          )}
        </li>
      </ul>
    </nav>
  )
}
