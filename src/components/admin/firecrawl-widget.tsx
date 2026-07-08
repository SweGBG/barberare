'use client'

import { useState, forwardRef, useImperativeHandle } from 'react'
import styles from './firecrawl-widget.module.css'

interface Product { name: string; price: string; currency?: string }
interface ScrapeResult {
  action: 'scrape' | 'search'
  url?: string
  query?: string
  summary?: string
  products?: Product[]
  trends?: string[]
  keyFacts?: string[]
  title?: string
  description?: string
  h1s?: string[]
  results?: SearchResult[]
  scrapedAt?: string
  searchedAt?: string
  resultCount?: number
}
interface SearchResult {
  title: string; url: string; description: string
  summary?: string; products?: Product[]; trends?: string[]; keyFacts?: string[]
}
export interface FirecrawlWidgetHandle { openEditor: () => void }

const MODES = [
  { id: 'general', label: 'Allmänt', icon: 'ti-search' },
  { id: 'priser', label: 'Priser', icon: 'ti-currency-dollar' },
  { id: 'trender', label: 'Trender', icon: 'ti-trending-up' },
  { id: 'seo', label: 'SEO', icon: 'ti-chart-bar' },
]
const ACTIONS = [
  { id: 'scrape', label: 'Scrapa URL', icon: 'ti-flame' },
  { id: 'search', label: 'Sök webben', icon: 'ti-world' },
]
const QUICK_SEARCHES = [
  { label: 'Hårvax priser', query: 'hårvax barberare pris Sverige 2026', mode: 'priser' },
  { label: 'Fade trender 2026', query: 'fade haircut trends 2026', mode: 'trender' },
  { label: 'Skäggvård produkter', query: 'beard grooming products barbershop', mode: 'priser' },
  { label: 'Men grooming trends', query: '"men grooming" trends 2026 barbershop', mode: 'trender' },
  { label: 'Barbershop marketing', query: 'barbershop marketing tips 2026', mode: 'general' },
]
const QUICK_URLS = [
  { label: 'American Crew', url: 'https://www.americancrew.com/blogs/news' },
  { label: 'GQ Grooming', url: 'https://www.gq.com/grooming/hair' },
  { label: 'Men\'s Hair Trends', url: 'https://www.menshairstyletrends.com' },
]

const FirecrawlWidget = forwardRef<FirecrawlWidgetHandle, { expanded?: boolean }>(function FirecrawlWidget(_, ref) {
  const [action, setAction] = useState<'scrape' | 'search'>('search')
  const [mode, setMode] = useState('trender')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScrapeResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  const [showRaw, setShowRaw] = useState(false)

  useImperativeHandle(ref, () => ({ openEditor() {} }))

  async function run() {
    if (!input.trim()) return
    setLoading(true); setError(null); setResult(null); setExpandedIdx(null)
    try {
      const res = await fetch('/api/admin/firecrawl-trender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(action === 'search' ? { query: input.trim() } : { url: input.trim() }),
          mode, action,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
    } catch (e) { setError(e instanceof Error ? e.message : 'Något gick fel') }
    setLoading(false)
  }

  return (
    <div className={styles.panel}>
      <div className={styles.masthead}>
        <div className={styles.mastheadLeft}>
          <div className={styles.mastheadIcon}><i className="ti ti-world-search" /></div>
          <div>
            <span className={styles.edition}>FIRECRAWL INTEL</span>
            <span className={styles.divider}>—</span>
            <span className={styles.tagline}>Web intelligence</span>
          </div>
        </div>
        {result && <button className={styles.clearBtn} onClick={() => { setResult(null); setError(null) }}><i className="ti ti-x" /> Rensa</button>}
      </div>

      <div className={styles.rule} />

      <div className={styles.actionTabs}>
        {ACTIONS.map(a => (
          <button key={a.id} className={`${styles.actionTab} ${action === a.id ? styles.actionTabActive : ''}`}
            onClick={() => { setAction(a.id as 'scrape' | 'search'); setResult(null); setError(null); setInput('') }}>
            <i className={`ti ${a.icon}`} /> {a.label}
          </button>
        ))}
      </div>

      <div className={styles.inputRow}>
        <input className={styles.input} value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && run()}
          placeholder={action === 'search' ? 'Sök t.ex. "hårvax priser barbershop"' : 'https://americancrew.com/blogs/news'} />
        <button className={styles.runBtn} onClick={run} disabled={loading || !input.trim()}>
          <i className={`ti ${loading ? 'ti-loader' : action === 'search' ? 'ti-search' : 'ti-flame'}`} />
          {loading ? 'Hämtar...' : action === 'search' ? 'Sök' : 'Scrapa'}
        </button>
      </div>

      <div className={styles.modeTabs}>
        {MODES.map(m => (
          <button key={m.id} className={`${styles.modeTab} ${mode === m.id ? styles.modeTabActive : ''}`} onClick={() => setMode(m.id)}>
            <i className={`ti ${m.icon}`} /> {m.label}
          </button>
        ))}
      </div>

      {!result && !loading && (
        <div className={styles.quickSection}>
          <p className={styles.quickLabel}>SNABBSÖK</p>
          <div className={styles.quickList}>
            {QUICK_SEARCHES.map(q => (
              <button key={q.label} className={styles.quickChip}
                onClick={() => { setAction('search'); setMode(q.mode); setInput(q.query); setResult(null); setError(null) }}>
                <i className="ti ti-search" /> {q.label}
              </button>
            ))}
          </div>
          <p className={styles.quickLabel} style={{ marginTop: 12 }}>SNABBSCRAPA</p>
          <div className={styles.quickList}>
            {QUICK_URLS.map(u => (
              <button key={u.label} className={`${styles.quickChip} ${styles.quickChipUrl}`}
                onClick={() => { setAction('scrape'); setMode('trender'); setInput(u.url); setResult(null); setError(null) }}>
                <i className="ti ti-flame" /> {u.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <div className={styles.errorBox}><i className="ti ti-alert-triangle" /> {error}</div>}

      {loading && (
        <div className={styles.skeletonWrap}>
          <div className={styles.skeletonMsg}><i className={`ti ${action === 'search' ? 'ti-world' : 'ti-flame'}`} /> {action === 'search' ? `Söker: "${input}"` : `Scrapar ${input}`}...</div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonLine} style={{ width: '50%' }} />
              <div className={styles.skeletonLine} style={{ width: '80%' }} />
              <div className={styles.skeletonLine} style={{ width: '65%' }} />
            </div>
          ))}
        </div>
      )}

      {result && result.action === 'scrape' && !loading && (
        <div className={styles.resultWrap}>
          <div className={styles.resultMeta}>
            <i className="ti ti-check" />
            <a href={result.url} target="_blank" rel="noopener noreferrer" className={styles.resultUrl}>{result.url}</a>
            <span className={styles.resultTime}>{result.scrapedAt ? new Date(result.scrapedAt).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
          </div>
          {result.trends && result.trends.length > 0 && (
            <div className={styles.trendsWrap}>
              <p className={styles.sectionLabel}>TRENDER</p>
              <div className={styles.trendChips}>{result.trends.map(t => <span key={t} className={styles.trendChip}>{t}</span>)}</div>
            </div>
          )}
          {result.summary && (
            <div className={styles.summaryBox}>
              <p className={styles.sectionLabel}>SAMMANFATTNING</p>
              <p className={styles.summaryText}>{result.summary}</p>
            </div>
          )}
          {result.products && result.products.length > 0 && (
            <div className={styles.pricesWrap}>
              <p className={styles.sectionLabel}>PRODUKTER & PRISER</p>
              <div className={styles.priceList}>
                {result.products.map((p, i) => (
                  <div key={i} className={styles.priceRow}>
                    <span className={styles.priceName}>{p.name}</span>
                    <span className={styles.priceVal}>{p.price} {p.currency || ''}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {result.title && (
            <div className={styles.seoWrap}>
              <p className={styles.sectionLabel}>SEO</p>
              <div className={styles.seoItem}><span className={styles.seoKey}>TITLE</span><span className={styles.seoVal}>{result.title}</span></div>
              {result.description && <div className={styles.seoItem}><span className={styles.seoKey}>DESC</span><span className={styles.seoVal}>{result.description}</span></div>}
              {result.h1s?.map((h, i) => <div key={i} className={styles.seoItem}><span className={styles.seoKey}>H1</span><span className={styles.seoVal}>{h}</span></div>)}
            </div>
          )}
          {result.keyFacts && result.keyFacts.length > 0 && (
            <div className={styles.factsWrap}>
              <p className={styles.sectionLabel}>NYCKELINFO</p>
              {result.keyFacts.map((f, i) => <div key={i} className={styles.factRow}><i className="ti ti-point-filled" />{f}</div>)}
            </div>
          )}
          <button className={styles.rawToggle} onClick={() => setShowRaw(!showRaw)}>
            <i className={`ti ${showRaw ? 'ti-eye-off' : 'ti-eye'}`} /> {showRaw ? 'Dölj rå-data' : 'Visa rå-data'}
          </button>
          {showRaw && <pre className={styles.rawBox}>{JSON.stringify(result, null, 2)}</pre>}
        </div>
      )}

      {result && result.action === 'search' && !loading && (
        <div className={styles.resultWrap}>
          <div className={styles.resultMeta}>
            <i className="ti ti-world" />
            <span>{result.resultCount} resultat för &quot;{result.query}&quot;</span>
            <span className={styles.resultTime}>{result.searchedAt ? new Date(result.searchedAt).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
          </div>
          {result.results?.length === 0 && <p className={styles.emptyMsg}>Inga resultat — försök med annat sökord</p>}
          {result.results?.map((r, i) => (
            <div key={i} className={`${styles.searchCard} ${expandedIdx === i ? styles.searchCardOpen : ''}`}>
              <div className={styles.searchCardHead} onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}>
                <div className={styles.searchCardMeta}>
                  <p className={styles.searchTitle}>{r.title}</p>
                  <p className={styles.searchUrlText}>{r.url}</p>
                  {r.description && <p className={styles.searchDesc}>{r.description.slice(0, 110)}{r.description.length > 110 ? '…' : ''}</p>}
                </div>
                <i className={`ti ${expandedIdx === i ? 'ti-chevron-up' : 'ti-chevron-down'} ${styles.chevron}`} />
              </div>
              {expandedIdx === i && (
                <div className={styles.searchCardBody}>
                  {r.trends && r.trends.length > 0 && <div className={styles.trendChips} style={{ marginBottom: 10 }}>{r.trends.map(t => <span key={t} className={styles.trendChip}>{t}</span>)}</div>}
                  {r.summary && <p className={styles.summaryText}>{r.summary}</p>}
                  {r.products && r.products.length > 0 && (
                    <div className={styles.priceList}>
                      {r.products.map((p, j) => <div key={j} className={styles.priceRow}><span className={styles.priceName}>{p.name}</span><span className={styles.priceVal}>{p.price}</span></div>)}
                    </div>
                  )}
                  {r.keyFacts?.map((f, j) => <div key={j} className={styles.factRow}><i className="ti ti-point-filled" />{f}</div>)}
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}><i className="ti ti-external-link" /> Öppna sida</a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
})

export default FirecrawlWidget
