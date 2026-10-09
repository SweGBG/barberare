'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useLang } from '@/lib/LangContext'
import { t } from '@/lib/translations'
import { createClient } from '@/lib/supabase/client'
import styles from './HeroFilm.module.css'

/**
 * HERO — scroll-scrubbed film (MiniMax H3, rendered locally), Apple-style.
 * Frames live in /public/film/{d|m}/0001.webp … and are drawn on a sticky canvas
 * that follows scroll progress. The intro (logo, lead, CTAs, opening status) sits on
 * the still barber station; as you scroll it dissolves and the tools float apart.
 */
export const FILM_FRAMES = 120
const pad = (n: number) => String(n).padStart(4, '0')

type Hour = { day_of_week: number; open_time: string | null; close_time: string | null; is_closed: boolean }
/* Fallback = samma tider som i footern (translations.fallbackTider). 0 = söndag. */
const FALLBACK: Hour[] = [
  { day_of_week: 0, open_time: null, close_time: null, is_closed: true },
  ...[1, 2, 3, 4, 5].map((d) => ({ day_of_week: d, open_time: '09:00', close_time: '19:00', is_closed: false })),
  { day_of_week: 6, open_time: '10:00', close_time: '17:00', is_closed: false },
]

function OpenStatus() {
  const { lang } = useLang()
  const tr = t[lang].film
  const dagNamn = t[lang].footer.dagNamn
  const [hours, setHours] = useState<Hour[]>(FALLBACK)
  const [msg, setMsg] = useState<{ open: boolean; text: string } | null>(null)

  useEffect(() => {
    try {
      const supabase = createClient()
      supabase
        .from('opening_hours')
        .select('day_of_week, open_time, close_time, is_closed')
        .order('day_of_week')
        .then(({ data, error }) => {
          if (!error && data && data.length) setHours(data as Hour[])
        })
    } catch {
      /* ingen Supabase-konfig (t.ex. lokal preview) — reservtiderna gäller */
    }
  }, [])

  useEffect(() => {
    const tick = () => {
      // tid i Göteborg, oavsett var besökaren befinner sig
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Stockholm', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      }).formatToParts(new Date())
      const get = (k: string) => parts.find((p) => p.type === k)?.value ?? ''
      const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
      const now = Number(get('hour')) * 60 + Number(get('minute'))
      const mins = (s: string | null) => (s ? Number(s.slice(0, 2)) * 60 + Number(s.slice(3, 5)) : 0)
      const byDay = (d: number) => hours.find((x) => x.day_of_week === d)
      const today = byDay(wd)
      if (today && !today.is_closed && now >= mins(today.open_time) && now < mins(today.close_time)) {
        setMsg({ open: true, text: tr.open(today.close_time!.slice(0, 5)) })
        return
      }
      for (let i = 0; i < 7; i++) {
        const d = (wd + i) % 7
        const x = byDay(d)
        if (!x || x.is_closed) continue
        if (i === 0 && now >= mins(x.open_time)) continue
        const when = i === 0 ? tr.today : i === 1 ? tr.tomorrow : dagNamn[d].toLowerCase()
        setMsg({ open: false, text: tr.closed(when, x.open_time!.slice(0, 5)) })
        return
      }
      setMsg(null)
    }
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [hours, tr, dagNamn])

  return (
    <p className={`${styles.status} ${msg?.open ? styles.live : ''}`} aria-live="polite">
      <span className={styles.dot} />
      {msg ? msg.text : ' '}
    </p>
  )
}

export default function HeroFilm() {
  const { lang } = useLang()
  const tr = t[lang]
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loaded, setLoaded] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const set = window.matchMedia('(max-width: 760px)').matches ? 'm' : 'd'
    const frames: (HTMLImageElement | null)[] = new Array(FILM_FRAMES).fill(null)
    let count = 0
    let alive = true

    const load = (i: number) =>
      new Promise<void>((res) => {
        if (frames[i]) return res()
        const img = new Image()
        img.decoding = 'async'
        img.src = `/film/${set}/${pad(i + 1)}.webp`
        img.onload = () => {
          frames[i] = img
          count++
          if (alive && (count % 4 === 0 || count === FILM_FRAMES)) setLoaded(count)
          res()
        }
        img.onerror = () => res()
      })

    let w = 0, h = 0, lastDrawn = -1, target = 0, current = 0, raf = 0

    const nearestLoaded = (i: number) => {
      for (let d = 0; d < FILM_FRAMES; d++) {
        if (frames[i - d]) return i - d
        if (frames[i + d]) return i + d
      }
      return -1
    }
    const draw = (i: number, force = false) => {
      const k = nearestLoaded(i)
      if (k < 0 || (!force && k === lastDrawn)) return
      const img = frames[k]!
      ctx.fillStyle = '#0A0908'
      ctx.fillRect(0, 0, w, h)
      let s: number, dy: number
      if (set === 'm') {
        // telefon: verktygen i övre bandet, intro/rubriker får eget mörkt fält under
        s = Math.max(w / img.naturalWidth, (h * 0.64) / img.naturalHeight)
        dy = h * 0.07
      } else {
        // desktop: luft upptill för navigationen, förankrad i nederkant
        s = Math.max(w / img.naturalWidth, (h * 0.92) / img.naturalHeight)
        dy = h - img.naturalHeight * s
      }
      const dw = img.naturalWidth * s
      ctx.drawImage(img, (w - dw) / 2, dy, dw, img.naturalHeight * s)
      lastDrawn = k
    }
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = canvas.getBoundingClientRect()
      w = Math.max(1, Math.round(r.width * dpr))
      h = Math.max(1, Math.round(r.height * dpr))
      canvas.width = w
      canvas.height = h
      draw(Math.round(current), true)
    }
    const tick = () => {
      // mjuk inbromsning mot rätt bildruta — känns som film, inte bläddrat block
      current += (target - current) * 0.16
      if (Math.abs(target - current) < 0.04) current = target
      draw(Math.round(current))
      raf = current !== target ? requestAnimationFrame(tick) : 0
    }
    const onScroll = () => {
      const r = section.getBoundingClientRect()
      const total = r.height - window.innerHeight
      const p = reduced ? 0 : Math.min(1, Math.max(0, total > 0 ? -r.top / total : 0))
      section.style.setProperty('--bp', p.toFixed(3))
      section.dataset.step = p < 0.14 ? 'intro' : String(Math.min(2, Math.floor(((p - 0.14) / 0.86) * 3.15)))
      target = p * (FILM_FRAMES - 1)
      if (!raf) raf = requestAnimationFrame(tick)
    }

    ;(async () => {
      await load(0)
      resize()
      setReady(true)
      if (reduced) return
      const order: number[] = []
      const seen = new Set<number>()
      for (const step of [12, 6, 3, 1])
        for (let i = 0; i < FILM_FRAMES; i += step)
          if (!seen.has(i)) { seen.add(i); order.push(i) }
      if (!seen.has(FILM_FRAMES - 1)) order.splice(1, 0, FILM_FRAMES - 1)
      for (let k = 0; k < order.length && alive; k += 6) {
        await Promise.all(order.slice(k, k + 6).map(load))
        draw(Math.round(current), true)
      }
    })()

    onScroll()
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const pct = Math.round((loaded / FILM_FRAMES) * 100)

  return (
    <section className={styles.film} ref={sectionRef} id="hem" data-step="intro" aria-label={tr.film.aria}>
      <div className={styles.stage}>
        <picture>
          <source media="(max-width: 760px)" srcSet={`/film/m/${pad(1)}.webp`} />
          <img className={styles.poster} src={`/film/d/${pad(1)}.webp`} alt="" aria-hidden fetchPriority="high" />
        </picture>
        <canvas ref={canvasRef} className={`${styles.canvas} ${ready ? styles.ready : ''}`} aria-hidden />
        <span className={styles.vignette} aria-hidden />

        <p className={styles.tag}>
          <span className={styles.rec} />
          {tr.film.tag}
        </p>
        <div className={`${styles.loader} ${pct >= 100 ? styles.done : ''}`} aria-hidden style={{ '--lp': pct / 100 } as CSSProperties}>
          <svg viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" />
            <circle cx="18" cy="18" r="16" className={styles.lp} />
          </svg>
        </div>

        {/* ── Intro på den orörda stationen ── */}
        <div className={styles.intro}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            {tr.hero.eyebrow}
          </p>
          <h1 className={styles.h1}>
            <img src="/img/atilli-logo.webp" alt={tr.hero.logoAlt} className={styles.logo} draggable={false} />
            <span className={styles.srOnly}>Atilli Berg — {tr.hero.subtitle}</span>
          </h1>
          <p className={styles.lead}>{tr.hero.lead}</p>
          <div className={styles.btns}>
            <a href="/boka" className={styles.btnGold}>
              <span>{tr.hero.cta1}</span>
              <svg viewBox="0 0 24 24" aria-hidden><path d="M4 12h15M13 6l6 6-6 6" /></svg>
            </a>
            <a href="/#tjanster" className={styles.btnGhost}>{tr.hero.cta2}</a>
          </div>
          <OpenStatus />
        </div>

        {/* ── Rubriker under filmen ── */}
        <div className={styles.copy} aria-hidden>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            {tr.film.eyebrow}
          </p>
          <div className={styles.lines}>
            {tr.film.lines.map((l, i) => (
              <p key={l} className={`${styles.line} ${styles['l' + i]}`}>{l}</p>
            ))}
          </div>
        </div>
        <ol className={styles.steps} aria-hidden>
          {tr.film.steps.map((s, i) => (
            <li key={s}><span>0{i + 1}</span>{s}</li>
          ))}
        </ol>
        <p className={styles.hint} aria-hidden>{tr.film.hint}</p>
        <div className={styles.bar} aria-hidden><i /></div>
      </div>
    </section>
  )
}
