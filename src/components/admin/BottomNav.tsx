'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './BottomNav.module.css'

type NavItem = {
  href: string
  label: string
  icon: string
  badge?: string
}

const PRIMARY: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: 'ti-layout-dashboard' },
  { href: '/admin/bokningar', label: 'Bokningar', icon: 'ti-calendar-check' },
  { href: '/admin/schema', label: 'Schema', icon: 'ti-clock-hour-4' },
  { href: '/admin/klienter', label: 'Klienter', icon: 'ti-users' },
]

const MORE: NavItem[] = [
  { href: '/admin/meddelanden', label: 'Meddelanden', icon: 'ti-mail' },
  { href: '/admin/tjanster', label: 'Tjänster & Priser', icon: 'ti-scissors' },
  { href: '/admin/trender', label: 'Trender', icon: 'ti-trending-up', badge: 'NY' },
  { href: '/admin/rapporter', label: 'Rapporter', icon: 'ti-chart-bar' },
  { href: '/admin/installningar', label: 'Inställningar', icon: 'ti-settings' },
  { href: '/', label: 'Till hemsidan', icon: 'ti-arrow-narrow-left' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  // "Mer" markeras aktiv om nuvarande sida ligger i MORE-listan
  const moreActive = MORE.some(item => item.href !== '/' && isActive(item.href))

  return (
    <>
      {/* Sheet för "Mer" */}
      {moreOpen && (
        <div className={styles.sheetOverlay} onClick={() => setMoreOpen(false)}>
          <div className={styles.sheet} onClick={e => e.stopPropagation()}>
            <div className={styles.sheetHandle} aria-hidden="true" />
            <span className={styles.sheetTitle}>Mer</span>

            {MORE.map(item => {
              const active = item.href !== '/' && isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.sheetLink} ${active ? styles.sheetLinkActive : ''}`}
                  onClick={() => setMoreOpen(false)}
                >
                  <i className={`ti ${item.icon}`} aria-hidden="true" />
                  <span className={styles.sheetLabel}>{item.label}</span>
                  {item.badge && <span className={styles.badge}>{item.badge}</span>}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Bottenmeny */}
      <nav className={styles.nav} aria-label="Adminnavigation">
        {PRIMARY.map(item => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.item} ${active ? styles.itemActive : ''}`}
              aria-current={active ? 'page' : undefined}
              onClick={() => setMoreOpen(false)}
            >
              <span className={styles.itemDot} aria-hidden="true" />
              <i className={`ti ${item.icon} ${styles.itemIcon}`} aria-hidden="true" />
              <span className={styles.itemLabel}>{item.label}</span>
            </Link>
          )
        })}

        <button
          type="button"
          className={`${styles.item} ${moreActive || moreOpen ? styles.itemActive : ''}`}
          onClick={() => setMoreOpen(open => !open)}
          aria-expanded={moreOpen}
        >
          <span className={styles.itemDot} aria-hidden="true" />
          <i className={`ti ti-dots ${styles.itemIcon}`} aria-hidden="true" />
          <span className={styles.itemLabel}>Mer</span>
        </button>
      </nav>
    </>
  )
}
