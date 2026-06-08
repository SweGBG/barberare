'use client'

import { useRef } from 'react'
import AdminGuard from '@/components/AdminGuard'
import AdminLayout from '@/components/admin/AdminLayout'
import TrenderWidget, { TrenderWidgetHandle } from '@/components/admin/trender-widget'
import styles from './trender.module.css'

const TIPS = [
  'fade haircut 2026',
  'barber business tips',
  'men grooming trends',
  'beard styles',
  'barbershop marketing',
  'hair color trends',
]

export default function TrenderPage() {
  const widgetRef = useRef<TrenderWidgetHandle>(null)

  function handleChipClick(tip: string) {
    widgetRef.current?.addQuery(tip)
  }

  return (
    <AdminGuard>
      <AdminLayout>
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.iconWrap}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <div>
              <h1 className={styles.pageTitle}>Trender</h1>
              <p className={styles.pageSubtitle}>Aktuella nyheter inom barbershop &amp; hårstyling</p>
            </div>
          </div>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Live via NewsAPI
          </div>
        </div>

        <div className={styles.layout}>
          <div className={styles.mainCol}>
            <TrenderWidget ref={widgetRef} />
          </div>

          <aside className={styles.sideCol}>
            <div className={styles.infoCard}>
              <p className={styles.infoLabel}>OM TRENDER</p>
              <p className={styles.infoText}>
                Widgeten hämtar artiklar automatiskt baserat på dina sökord. Nyheter cachas i <strong>1 timme</strong> för att spara API-anrop.
              </p>
            </div>
            <div className={styles.infoCard}>
              <p className={styles.infoLabel}>API-GRÄNS</p>
              <div className={styles.limitBar}>
                <div className={styles.limitFill} style={{ width: '12%' }} />
              </div>
              <p className={styles.infoSmall}>~12 / 100 anrop idag (gratis tier)</p>
            </div>
            <div className={styles.infoCard}>
              <p className={styles.infoLabel}>TIPS PÅ SÖKORD</p>
              <p className={styles.infoHint}>Klicka för att lägga till</p>
              <div className={styles.chipList}>
                {TIPS.map(tip => (
                  <button
                    key={tip}
                    className={styles.chip}
                    onClick={() => handleChipClick(tip)}
                  >
                    + {tip}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </AdminLayout>
    </AdminGuard>
  )
}