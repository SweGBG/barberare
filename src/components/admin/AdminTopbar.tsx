'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './AdminTopbar.module.css'

export default function AdminTopbar() {
  const [email, setEmail] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? '')
    })
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const today = new Date().toLocaleDateString('sv-SE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  const initials = email.slice(0, 2).toUpperCase()

  return (
    <div className={styles.topbar}>

      {/* Vänster */}
      <span className={styles.title}>God morgon, Atilli</span>

      {/* Mitten – mini-logga */}
      {/* Mitten – logga */}
      <a href="/" className={styles.logoWrap}>
        <span className={styles.logoMain}>Atilli</span>
        <span className={styles.logoSub}>Berg</span>
      </a>

      {/* Höger */}
      <div className={styles.right}>
        <span className={styles.dateBadge}>{today}</span>
        <div className={styles.avatarWrap} ref={dropdownRef}>
          <button
            className={styles.avatar}
            title={email}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {initials}
          </button>

          {dropdownOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <p className={styles.dropdownEmail}>{email}</p>
              </div>
              <Link href="/" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                <i className="ti ti-home" />
                <span>Hemsidan</span>
              </Link>
              <Link href="/admin" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                <i className="ti ti-layout-dashboard" />
                <span>Dashboard</span>
              </Link>
              <button className={styles.dropdownLogout} onClick={handleLogout}>
                <i className="ti ti-logout" />
                <span>Logga ut</span>
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}