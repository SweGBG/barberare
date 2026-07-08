'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './AdminSidebar.module.css'

type NavLink = {
  href: string
  label: string
  icon: string
  exact?: boolean
  badge?: string
}

const nav: { group: string; links: NavLink[] }[] = [
  {
    group: 'ÖVERSIKT',
    links: [
      { href: '/admin', label: 'Dashboard', exact: true, icon: 'ti-layout-dashboard' },
      { href: '/admin/bokningar', label: 'Bokningar', icon: 'ti-calendar-event' },
      { href: '/admin/schema', label: 'Schema', icon: 'ti-clock' },
    ],
  },
  {
    group: 'KUNDER',
    links: [
      { href: '/admin/klienter', label: 'Klientregister', icon: 'ti-users' },
      { href: '/admin/meddelanden', label: 'Meddelanden', icon: 'ti-message' },
    ],
  },
  {
    group: 'VERKSAMHET',
    links: [
      { href: '/admin/tjanster', label: 'Tjänster & Priser', icon: 'ti-scissors' },
      { href: '/admin/trender', label: 'Trender', icon: 'ti-trending-up', badge: 'NY' },
      { href: '/admin/rapporter', label: 'Rapporter', icon: 'ti-chart-bar' },
      { href: '/admin/installningar', label: 'Inställningar', icon: 'ti-settings' },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.wordmark}>Atilli Berg</span>
        <span className={styles.sub}>Admin Panel</span>
      </div>

      <Link href="/" className={styles.homeLink}>
        <i className="ti ti-home" />
        Hemsidan
      </Link>

      <nav className={styles.nav}>
        {nav.map(section => (
          <div key={section.group}>
            <p className={styles.sectionLabel}>{section.group}</p>
            {section.links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navItem} ${isActive(link.href, link.exact) ? styles.active : ''}`}
              >
                <i className={`ti ${link.icon}`} />
                {link.label}
                {link.badge && (
                  <span className={styles.newBadge}>{link.badge}</span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className={styles.footer}>
        Atilli Berg © {new Date().getFullYear()}
      </div>
    </aside>
  )
}