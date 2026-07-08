'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import styles from './Navbar.module.css'

const supabase = createClient()

const links = [
  { href: '/#hem', label: 'Hem' },
  { href: '/#tjanster', label: 'Tjänster' },
  { href: '/boka', label: 'Boka tid' },
  { href: '/#priser', label: 'Priser' },
  { href: '/#om', label: 'Om oss' },
  { href: '/kontakt', label: 'Kontakt' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) await fetchRole(user.id)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) await fetchRole(session.user.id)
      else setIsAdmin(false)
    })

    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const fetchRole = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()
    setIsAdmin(data?.role === 'admin')
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-dropdown]')) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Lås scroll när mobilmenyn är öppen
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
    setDropdownOpen(false)
    setMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  const close = () => setMenuOpen(false)

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>

        {/* ── Logotyp ── */}
        <a href="/" className={styles.brand} onClick={close}>
          <span className={styles.brandMain}>Atilli Berg</span>
          <span className={styles.brandSub}>Frisör &amp; Barberare</span>
        </a>

        {/* ── Länkar (desktop) ── */}
        <ul className={styles.links}>
          {links.map((l, i) => (
            <li key={l.label} className={styles.linkItem}>
              <a href={l.href}>{l.label}</a>
              {i < links.length - 1 && (
                <svg className={styles.sep} width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
                  <rect x="4" y="0.6" width="4.8" height="4.8" transform="rotate(45 4 0.6)"
                    fill="none" stroke="currentColor" strokeWidth="0.7" />
                </svg>
              )}
            </li>
          ))}
        </ul>

        {/* ── Höger: auth ── */}
        <div className={styles.actions}>
          {user ? (
            <div data-dropdown className={styles.kontoWrap}>
              <button
                className={styles.kontoBtn}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="Konto"
                aria-expanded={dropdownOpen}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
                <span className={styles.kontoLabel}>Mitt konto</span>
              </button>

              {dropdownOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <p className={styles.dropdownEmail}>{user.email}</p>
                  </div>
                  {isAdmin && (
                    <a href="/admin" className={styles.dropdownItemGold} onClick={() => setDropdownOpen(false)}>
                      <span>Admin</span><span className={styles.dropdownArrow}>›</span>
                    </a>
                  )}
                  <a href="/medlem" className={styles.dropdownItemGold} onClick={() => setDropdownOpen(false)}>
                    <span>Mina sidor</span><span className={styles.dropdownArrow}>›</span>
                  </a>
                  <a href="/boka" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    <span>Boka ny tid</span><span className={styles.dropdownArrow}>›</span>
                  </a>
                  <button className={styles.dropdownLogout} onClick={handleLogout}>
                    Logga ut
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <a href="/logga-in" className={styles.btnOutline}>Logga in</a>
              <a href="/skapa-konto" className={styles.btnGold}>Skapa konto</a>
            </>
          )}

          {/* Hamburgare (mobil) */}
          <button
            className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Stäng meny' : 'Öppna meny'}
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* ── Mobilmeny: slide-down ── */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        <ul className={styles.mobileLinks}>
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} onClick={close}>{l.label}</a>
            </li>
          ))}
        </ul>

        <div className={styles.mobileAuth}>
          {user ? (
            <>
              <p className={styles.mobileEmail}>{user.email}</p>
              {isAdmin && <a href="/admin" className={styles.btnOutline} onClick={close}>Admin</a>}
              <a href="/medlem" className={styles.btnOutline} onClick={close}>Mina sidor</a>
              <a href="/boka" className={styles.btnGold} onClick={close}>Boka tid</a>
              <button className={styles.mobileLogout} onClick={handleLogout}>Logga ut</button>
            </>
          ) : (
            <>
              <a href="/logga-in" className={styles.btnOutline} onClick={close}>Logga in</a>
              <a href="/skapa-konto" className={styles.btnGold} onClick={close}>Skapa konto</a>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
