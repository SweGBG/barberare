'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import styles from './BottomNav.module.css'

const mainNav = [
  { label: 'Dashboard', href: '/admin', icon: 'ti-layout-dashboard' },
  { label: 'Bokningar', href: '/admin/bokningar', icon: 'ti-calendar' },
  { label: 'Schema', href: '/admin/schema', icon: 'ti-clock' },
  { label: 'Klienter', href: '/admin/klienter', icon: 'ti-users' },
]

const moreNav = [
  { label: 'Meddelanden', href: '/admin/meddelanden', icon: 'ti-message' },
  { label: 'Tjänster & Priser', href: '/admin/tjanster', icon: 'ti-scissors' },
  { label: 'Rapporter', href: '/admin/rapporter', icon: 'ti-chart-bar' },
  { label: 'Inställningar', href: '/admin/installningar', icon: 'ti-settings' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  const isMoreActive = moreNav.some(item => pathname === item.href)

  return (
    <>
      {moreOpen && (
        <div className={styles.moreOverlay} onClick={() => setMoreOpen(false)}>
          <div className={styles.morePanel} onClick={e => e.stopPropagation()}>
            <p className={styles.morePanelLabel}>Mer</p>
            {moreNav.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.morePanelItem} ${pathname === item.href ? styles.morePanelActive : ''}`}
                onClick={() => setMoreOpen(false)}
              >
                <i className={`ti ${item.icon}`} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <nav className={styles.nav}>
        {mainNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.item} ${pathname === item.href ? styles.active : ''}`}
          >
            <i className={`ti ${item.icon}`} aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        ))}

        <button
          className={`${styles.item} ${styles.moreBtn} ${isMoreActive ? styles.active : ''}`}
          onClick={() => setMoreOpen(!moreOpen)}
        >
          <i className="ti ti-dots" aria-hidden="true" />
          <span>Mer</span>
        </button>
      </nav>
    </>
  )
}