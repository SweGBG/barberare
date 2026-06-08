'use client'

import { useEffect, useState } from 'react'
import styles from './trender-widget.module.css'

interface Article {
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  source: { name: string }
}

interface TrenderResponse {
  articles: Article[]
  cachedAt: string
  fromCache: boolean
  queries: string[]
  error?: string
}

function formatAge(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  if (h > 23) return `${Math.floor(h / 24)}d sedan`
  if (h > 0) return `${h}h sedan`
  return `${m}m sedan`
}

interface Props {
  expanded?: boolean
}

export default function TrenderWidget({ expanded }: Props) {
  const [data, setData] = useState<TrenderResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Editor-state
  const [editing, setEditing] = useState(false)
  const [draftQueries, setDraftQueries] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)

  async function load(bust = false) {
    setLoading(true)
    setError(null)
    try {
      const url = bust ? '/api/admin/trender?bust=1' : '/api/admin/trender'
      const res = await fetch(url)
      const json: TrenderResponse = await res.json()
      if (json.error) throw new Error(json.error)
      setData(json)
      setDraftQueries(json.queries ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Kunde inte hämta nyheter')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openEditor() {
    setDraftQueries(data?.queries ?? [])
    setSaveMsg(null)
    setEditing(true)
  }

  function updateQuery(i: number, val: string) {
    setDraftQueries(prev => prev.map((q, idx) => idx === i ? val : q))
  }

  function addQuery() {
    if (draftQueries.length < 5) setDraftQueries(prev => [...prev, ''])
  }

  function removeQuery(i: number) {
    setDraftQueries(prev => prev.filter((_, idx) => idx !== i))
  }

  async function saveQueries() {
    setSaving(true)
    setSaveMsg(null)
    try {
      const res = await fetch('/api/admin/trender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queries: draftQueries.filter(q => q.trim()) }),
      })
      const json = await res.json()
      if (!json.ok) throw new Error(json.error ?? 'Fel vid sparning')
      setSaveMsg('✓ Sparat — hämtar nya nyheter...')
      setEditing(false)
      setTimeout(() => load(true), 600)
    } catch (e) {
      setSaveMsg(e instanceof Error ? e.message : 'Fel vid sparning')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.widget}>
      {/* Masthead */}
      <div className={styles.masthead}>
        <div className={styles.mastheadLeft}>
          <span className={styles.edition}>BARBERSHOP DISPATCH</span>
          <span className={styles.divider}>—</span>
          <span className={styles.tagline}>Trender &amp; Inspiration</span>
        </div>
        <div className={styles.mastheadActions}>
          <button
            className={styles.iconBtn}
            onClick={openEditor}
            title="Redigera sökord"
          >
            ✎
          </button>
          <button
            className={styles.iconBtn}
            onClick={() => load(true)}
            disabled={loading}
            title="Uppdatera"
          >
            {loading ? '◌' : '↻'}
          </button>
        </div>
      </div>

      <div className={styles.rule} />

      {/* Sökords-editor */}
      {editing && (
        <div className={styles.editor}>
          <p className={styles.editorLabel}>SÖKORD — max 5 st</p>
          {draftQueries.map((q, i) => (
            <div key={i} className={styles.queryRow}>
              <input
                className={styles.queryInput}
                value={q}
                onChange={e => updateQuery(i, e.target.value)}
                placeholder="t.ex. barbershop trends"
                maxLength={60}
              />
              <button
                className={styles.removeBtn}
                onClick={() => removeQuery(i)}
                disabled={draftQueries.length <= 1}
                title="Ta bort"
              >
                ×
              </button>
            </div>
          ))}
          {draftQueries.length < 5 && (
            <button className={styles.addBtn} onClick={addQuery}>
              + Lägg till sökord
            </button>
          )}
          <div className={styles.editorFooter}>
            {saveMsg && <span className={styles.saveMsg}>{saveMsg}</span>}
            <div className={styles.editorBtns}>
              <button
                className={styles.cancelBtn}
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                Avbryt
              </button>
              <button
                className={styles.saveBtn}
                onClick={saveQueries}
                disabled={saving || draftQueries.filter(q => q.trim()).length === 0}
              >
                {saving ? 'Sparar...' : 'Spara & hämta'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Aktiva sökord — pills */}
      {!editing && data?.queries && (
        <div className={styles.queryPills}>
          {data.queries.map(q => (
            <span key={q} className={styles.pill}>{q}</span>
          ))}
          <span className={styles.cacheNote}>
            {data.fromCache ? '⊙' : '⊛'}{' '}
            {new Date(data.cachedAt).toLocaleTimeString('sv-SE', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      )}

      {/* Felmeddelande */}
      {error && (
        <div className={styles.errorBox}>
          <span>⚠ {error}</span>
          <button className={styles.retryBtn} onClick={() => load()}>
            Försök igen
          </button>
        </div>
      )}

      {/* Skeleton */}
      {loading && !error && (
        <div className={styles.skeletonList}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.skeletonItem}>
              <div className={styles.skeletonImg} />
              <div className={styles.skeletonText}>
                <div className={styles.skeletonLine} style={{ width: '80%' }} />
                <div className={styles.skeletonLine} style={{ width: '55%' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Artikellista */}
      {!loading && data && (
        <ol className={styles.articleList}>
          {data.articles.map((a, i) => (
            <li key={a.url} className={styles.articleItem}>
              <div className={styles.articleNum}>{String(i + 1).padStart(2, '0')}</div>
              <div className={styles.articleBody}>
                <div className={styles.articleMeta}>
                  <span className={styles.source}>{a.source.name}</span>
                  <span className={styles.age}>{formatAge(a.publishedAt)}</span>
                </div>
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.articleTitle}
                >
                  {a.title}
                </a>
                {a.description && (
                  <p className={styles.articleDesc}>
                    {a.description.length > 120
                      ? a.description.slice(0, 120) + '…'
                      : a.description}
                  </p>
                )}
              </div>
              {a.urlToImage && (
                <img
                  src={a.urlToImage}
                  alt=""
                  className={styles.articleThumb}
                  loading="lazy"
                  onError={e => ((e.target as HTMLImageElement).style.display = 'none')}
                />
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}