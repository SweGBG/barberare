'use client'

import { useRef } from 'react'
import AdminGuard from '@/components/AdminGuard'
import AdminLayout from '@/components/admin/AdminLayout'
import TrenderWidget, { TrenderWidgetHandle } from '@/components/admin/trender-widget'
import FirecrawlWidget, { FirecrawlWidgetHandle } from '@/components/admin/firecrawl-widget'
import styles from './trender.module.css'

const NEWS_TIPS = [
  'fade haircut 2026',
  'barber business tips',
  'men grooming trends',
  'beard styles',
  'barbershop marketing',
  'hair color trends',
]

export default function TrenderPage() {
  const newsRef = useRef<TrenderWidgetHandle>(null)
  const firecrawlRef = useRef<FirecrawlWidgetHandle>(null)

  return (
    <AdminGuard>
      <AdminLayout>

        {/* ── Page header ── */}
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
              <p className={styles.pageSubtitle}>Nyheter &amp; intelligence från webben</p>
            </div>
          </div>
          <div className={styles.headerBadges}>
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              NewsAPI
            </div>
            <div className={`${styles.badge} ${styles.badgeFirecrawl}`}>
              <span className={`${styles.badgeDot} ${styles.badgeDotOrange}`} />
              Firecrawl
            </div>
          </div>
        </div>

        {/* ── Sektion 1: Firecrawl ── */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionLine} />
          <span className={styles.sectionLabel}>KÄLLSCRAPING</span>
          <div className={styles.sectionLine} />
        </div>

        <div className={styles.layout}>
          <div className={styles.mainCol}>
            <FirecrawlWidget ref={firecrawlRef} />
          </div>
          <aside className={styles.sideCol}>
            <div className={styles.infoCard}>
              <p className={styles.infoLabel}>OM FIRECRAWL</p>
              <p className={styles.infoText}>
                Scrapar direkt från specifika webbsidor — produktsidor, bloggar, konkurrenters priser. Mer träffsäkert än nyhetsflöden.
              </p>
            </div>
            <div className={styles.infoCard}>
              <p className={styles.infoLabel}>BRA KÄLLOR</p>
              <div className={styles.chipList}>
                {[
                  'americancrew.com/blogs/news',
                  'schwarzkopf.com/en/professionals',
                  'menshairstyletrends.com',
                  'gq.com/grooming/hair',
                  'barbermag.com',
                ].map(tip => (
                  <button
                    key={tip}
                    className={styles.chip}
                    onClick={() => firecrawlRef.current?.openEditor()}
                    title={`https://${tip}`}
                  >
                    + {tip}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* ── Sektion 2: NewsAPI ── */}
        <div className={styles.sectionHeader} style={{ marginTop: 32 }}>
          <div className={styles.sectionLine} />
          <span className={styles.sectionLabel}>NYHETSFLÖDE</span>
          <div className={styles.sectionLine} />
        </div>

        <div className={styles.layout}>
          <div className={styles.mainCol}>
            <TrenderWidget ref={newsRef} />
          </div>
          <aside className={styles.sideCol}>
            <div className={styles.infoCard}>
              <p className={styles.infoLabel}>OM NEWSAPI</p>
              <p className={styles.infoText}>
                Söker nyhetsartiklar baserat på sökord. Använd <strong>AND</strong>, <strong>OR</strong> och <strong>"citattecken"</strong> för bättre träffar.
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
                {NEWS_TIPS.map(tip => (
                  <button
                    key={tip}
                    className={styles.chip}
                    onClick={() => newsRef.current?.addQuery(tip)}
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
