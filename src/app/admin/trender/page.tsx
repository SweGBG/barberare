import AdminGuard from '@/components/AdminGuard'
import AdminLayout from '@/components/admin/AdminLayout'
import TrenderWidget from '@/components/admin/trender-widget'
import styles from './trender.module.css'

export const metadata = { title: 'Trender — Atilli Berg' }

export default function TrenderPage() {
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
          {/* Huvud-widget */}
          <div className={styles.mainCol}>
            <TrenderWidget expanded />
          </div>

          {/* Sidopanel */}
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
              <div className={styles.chipList}>
                {[
                  'fade haircut 2026',
                  'barber business tips',
                  'men grooming trends',
                  'beard styles',
                  'barbershop marketing',
                  'hair color trends',
                ].map(tip => (
                  <span key={tip} className={styles.chip}>{tip}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </AdminLayout>
    </AdminGuard>
  )
}