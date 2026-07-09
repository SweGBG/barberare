'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './AdminSidebar.module.css'

type NavItem = {
  href: string
  label: string
  icon: string
  badge?: string
}

type NavSection = {
  title: string
  items: NavItem[]
}

const SECTIONS: NavSection[] = [
  {
    title: 'Översikt',
    items: [
      { href: '/admin', label: 'Dashboard', icon: 'ti-layout-dashboard' },
      { href: '/admin/bokningar', label: 'Bokningar', icon: 'ti-calendar-check' },
      { href: '/admin/schema', label: 'Schema', icon: 'ti-clock-hour-4' },
    ],
  },
  {
    title: 'Kunder',
    items: [
      { href: '/admin/klienter', label: 'Klientregister', icon: 'ti-users' },
      { href: '/admin/meddelanden', label: 'Meddelanden', icon: 'ti-mail' },
    ],
  },
  {
    title: 'Verksamhet',
    items: [
      { href: '/admin/tjanster', label: 'Tjänster & Priser', icon: 'ti-scissors' },
      { href: '/admin/trender', label: 'Trender', icon: 'ti-trending-up', badge: 'NY' },
      { href: '/admin/rapporter', label: 'Rapporter', icon: 'ti-chart-bar' },
      { href: '/admin/installningar', label: 'Inställningar', icon: 'ti-settings' },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <aside className={styles.sidebar}>
      {/* Guldskimmer i toppen */}
      <div className={styles.glow} aria-hidden="true" />

      {/* Logotyp */}
      <div className={styles.brand}>
        <span className={styles.brandName}>Atilli Berg</span>
        <span className={styles.brandRule} aria-hidden="true" />
        <span className={styles.brandSub}>Admin Panel</span>
      </div>

      {/* Tillbaka till hemsidan */}
      <Link href="/" className={styles.homeLink}>
        <i className="ti ti-arrow-narrow-left" aria-hidden="true" />
        Hemsidan
      </Link>

      {/* Navigation */}
      <nav className={styles.nav}>
        {SECTIONS.map((section) => (
          <div key={section.title} className={styles.section}>
            <span className={styles.sectionTitle}>{section.title}</span>

            {section.items.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.link} ${active ? styles.linkActive : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className={styles.linkBar} aria-hidden="true" />
                  <i className={`ti ${item.icon} ${styles.linkIcon}`} aria-hidden="true" />
                  <span className={styles.linkLabel}>{item.label}</span>
                  {item.badge && <span className={styles.badge}>{item.badge}</span>}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={styles.footer}>
        <span className={styles.footerMonogram} aria-hidden="true">AB</span>
        <span className={styles.footerText}>Atilli Berg © {new Date().getFullYear()}</span>
      </div>
    </aside>
  )
}
