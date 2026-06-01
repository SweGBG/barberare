'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './AdminSidebar.module.css'

const nav = [
  {
    section: 'Översikt', items: [
      { label: 'Dashboard', href: '/admin', icon: 'ti-layout-dashboard' },
      { label: 'Bokningar', href: '/admin/bokningar', icon: 'ti-calendar' },
      { label: 'Schema', href: '/admin/schema', icon: 'ti-clock' },
    ]
  },
  {
    section: 'Kunder', items: [
      { label: 'Klientregister', href: '/admin/klienter', icon: 'ti-users' },
      { label: 'Meddelanden', href: '/admin/meddelanden', icon: 'ti-message' },
    ]
  },
  {
    section: 'Verksamhet', items: [
      { label: 'Tjänster & Priser', href: '/admin/tjanster', icon: 'ti-scissors' },
      { label: 'Rapporter', href: '/admin/rapporter', icon: 'ti-chart-bar' },
      { label: 'Inställningar', href: '/admin/installningar', icon: 'ti-settings' },
    ]
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.wordmark}>Atilli Berg</span>
        <span className={styles.sub}>Admin Panel</span>
      </div>

      <nav className={styles.nav}>
        {nav.map((group) => (
          <div key={group.section}>
            <p className={styles.sectionLabel}>{group.section}</p>
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
              >
                <i className={`ti ${item.icon}`} aria-hidden="true" />
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className={styles.footer}>v1.0 · Atilli Admin</div>
    </aside>
  )
}