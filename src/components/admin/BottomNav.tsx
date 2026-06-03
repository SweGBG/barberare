'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './BottomNav.module.css'

const nav = [
  { label: 'Dashboard', href: '/admin', icon: 'ti-layout-dashboard' },
  { label: 'Bokningar', href: '/admin/bokningar', icon: 'ti-calendar' },
  { label: 'Schema', href: '/admin/schema', icon: 'ti-clock' },
  { label: 'Klienter', href: '/admin/klienter', icon: 'ti-users' },
  { label: 'Inställn.', href: '/admin/installningar', icon: 'ti-settings' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className={styles.nav}>
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`${styles.item} ${pathname === item.href ? styles.active : ''}`}
        >
          <i className={`ti ${item.icon}`} aria-hidden="true" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}