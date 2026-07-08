'use client'

import { useEffect, useState } from 'react'
import styles from './rapporter.module.css'

interface MaanadsData {
  manad: string
  intakter: number
  bokningar: number
}

interface TjanstData {
  namn: string
  intakter: number
  antal: number
}

interface StatusData {
  confirmed: number
  pending: number
  cancelled: number
  completed: number
}

interface RapportData {
  totalt: {
    intakter: number
    bokningar: number
    snittPris: number
    dennaManad: number
    manadForandring: number
  }
  manadsgraf: MaanadsData[]
  tjanster: TjanstData[]
  status: StatusData
}

function formatSEK(n: number) {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0,
  }).format(n)
}

function Linjegraf({ data }: { data: MaanadsData[] }) {
  const W = 600
  const H = 200
  const padL = 48
  const padR = 16
  const padT = 16
  const padB = 32

  const max = Math.max(...data.map((d) => d.intakter), 1)
  const xStep = (W - padL - padR) / Math.max(data.length - 1, 1)

  const points = data.map((d, i) => ({
    x: padL + i * xStep,
    y: padT + (1 - d.intakter / max) * (H - padT - padB),
    ...d,
  }))

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ')

  const areaD =
    pathD +
    ` L${points[points.length - 1].x.toFixed(1)},${(H - padB).toFixed(1)}` +
    ` L${points[0].x.toFixed(1)},${(H - padB).toFixed(1)} Z`

  const yTicks = [0, 0.25, 0.5, 0.75, 1]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} aria-label="Intäkter per månad">
      {yTicks.map((t) => {
        const y = padT + (1 - t) * (H - padT - padB)
        return (
          <g key={t}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} className={styles.gridLine} />
            <text x={padL - 6} y={y + 4} className={styles.axisLabel} textAnchor="end">
              {t === 0 ? '0' : `${Math.round((max * t) / 1000)}k`}
            </text>
          </g>
        )
      })}
      <path d={areaD} className={styles.areaFill} />
      <path d={pathD} className={styles.linePath} />
      {points.map((p) => (
        <g key={p.manad}>
          <circle cx={p.x} cy={p.y} r={5} className={styles.dot} />
          <title>{p.manad}: {formatSEK(p.intakter)} ({p.bokningar} bkn)</title>
        </g>
      ))}
      {points.map((p) => (
        <text key={p.manad} x={p.x} y={H - padB + 18} className={styles.axisLabel} textAnchor="middle">
          {p.manad}
        </text>
      ))}
    </svg>
  )
}

function Stapelgraf({ data }: { data: TjanstData[] }) {
  const max = Math.max(...data.map((d) => d.intakter), 1)
  return (
    <div className={styles.stapelWrap}>
      {data.slice(0, 6).map((t, i) => (
        <div key={`${t.namn}-${i}`} className={styles.stapelRow}>
          <span className={styles.stapelNamn}>{t.namn}</span>
          <div className={styles.stapelBarWrap}>
            <div
              className={styles.stapelBar}
              style={{ width: `${(t.intakter / max) * 100}%` }}
            />
          </div>
          <span className={styles.stapelVarde}>{formatSEK(t.intakter)}</span>
        </div>
      ))}
    </div>
  )
}

function StatusPills({ status }: { status: StatusData }) {
  const total = Object.values(status).reduce((a, b) => a + b, 0) || 1
  const items = [
    { label: 'Bekräftade', value: status.confirmed, color: '#4caf50' },
    { label: 'Avklarade', value: status.completed, color: '#B8956A' },
    { label: 'Väntande', value: status.pending, color: '#f59e0b' },
    { label: 'Avbokade', value: status.cancelled, color: '#ef4444' },
  ]
  return (
    <div className={styles.statusGrid}>
      {items.map((item) => (
        <div key={item.label} className={styles.statusPill}>
          <div className={styles.statusDot} style={{ background: item.color }} />
          <div>
            <p className={styles.statusLabel}>{item.label}</p>
            <p className={styles.statusVarde}>{item.value}</p>
          </div>
          <span className={styles.statusProcent}>
            {Math.round((item.value / total) * 100)}%
          </span>
        </div>
      ))}
    </div>
  )
}

function Skeleton({ h = 24, w = '100%' }: { h?: number; w?: string }) {
  return <div className={styles.skeleton} style={{ height: h, width: w }} />
}

export default function RapporterPage() {
  const [data, setData] = useState<RapportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/rapporter')
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setData(json.data)
        else setError(json.error || 'Okänt fel')
      })
      .catch(() => setError('Kunde inte ansluta till servern'))
      .finally(() => setLoading(false))
  }, [])

  const forändring = data?.totalt.manadForandring ?? 0

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Rapporter</h1>
          <p className={styles.sub}>Intäkter &amp; statistik</p>
        </div>
      </div>

      {error && <div className={styles.errorBox}>{error}</div>}

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Denna månad</span>
          {loading ? (
            <Skeleton h={36} />
          ) : (
            <>
              <span className={styles.kpiVarde}>{formatSEK(data?.totalt.dennaManad ?? 0)}</span>
              <span
                className={styles.kpiTrend}
                style={{ color: forändring >= 0 ? '#4caf50' : '#ef4444' }}
              >
                <i className={`ti ${forändring >= 0 ? 'ti-trending-up' : 'ti-trending-down'}`} />
                {forändring >= 0 ? '+' : ''}{forändring}% vs förra månaden
              </span>
            </>
          )}
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Totalt (12 mån)</span>
          {loading ? (
            <Skeleton h={36} />
          ) : (
            <span className={styles.kpiVarde}>{formatSEK(data?.totalt.intakter ?? 0)}</span>
          )}
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Snitt per bokning</span>
          {loading ? (
            <Skeleton h={36} />
          ) : (
            <span className={styles.kpiVarde}>{formatSEK(data?.totalt.snittPris ?? 0)}</span>
          )}
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Bokningar (12 mån)</span>
          {loading ? (
            <Skeleton h={36} />
          ) : (
            <span className={styles.kpiVarde}>{data?.totalt.bokningar ?? 0}</span>
          )}
        </div>
      </div>

      <div className={styles.sektion}>
        <h2 className={styles.sektionTitel}>
          <i className="ti ti-chart-line" />
          Intäkter — senaste 6 månader
        </h2>
        {loading ? (
          <Skeleton h={200} />
        ) : data?.manadsgraf ? (
          <Linjegraf data={data.manadsgraf} />
        ) : null}
      </div>

      <div className={styles.bottenGrid}>
        <div className={styles.sektion}>
          <h2 className={styles.sektionTitel}>
            <i className="ti ti-scissors" />
            Intäkter per tjänst
          </h2>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1, 2, 3].map((i) => <Skeleton key={i} h={28} />)}
            </div>
          ) : data?.tjanster.length ? (
            <Stapelgraf data={data.tjanster} />
          ) : (
            <p className={styles.tomText}>Ingen tjänstedata ännu.</p>
          )}
        </div>

        <div className={styles.sektion}>
          <h2 className={styles.sektionTitel}>
            <i className="ti ti-chart-donut" />
            Bokningsstatus
          </h2>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} h={52} />)}
            </div>
          ) : data?.status ? (
            <StatusPills status={data.status} />
          ) : null}
        </div>
      </div>
    </div>
  )
}