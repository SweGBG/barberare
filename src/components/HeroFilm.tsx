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

/* Mobil: filmen spelas upp av sig själv (ms) när besökaren börjat scrolla — kort scroll.
   Dator: filmen följer scrollen bildruta för bildruta — lång scroll. */
const MOBILE_PLAY_MS = 4200
/* Dator: andel av scrollen — ren film i början, filmen klar vid FILM_END, varumärket poppar vid REVEAL_AT */
const START_END = 0.05
const FILM_END = 0.78
const REVEAL_AT = 0.76
const HOLD_AT = 0.8 // här står sidan still medan loggan sätter sig
const HOLD_MS = 2600
const MOBILE_START = 0.05 // scrollandel som startar uppspelningen
const MOBILE_RESET = 0.02 // tillbaka hit = spola tillbaka till början

/* Seedad slump så att guldstoftet blir identiskt på server och klient (som Proviant) */
function rng(seed: number) {
  return () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296)
}
const r = rng(7)
const DUST = Array.from({ length: 30 }, () => {
  const a = r() * Math.PI * 2
  const dist = 24 + r() * 22 // vmin, där kornet startar
  return {
    x: `${(Math.cos(a) * dist).toFixed(1)}vmin`,
    y: `${(Math.sin(a) * dist * 0.6).toFixed(1)}vmin`,
    d: `${(0.1 + r() * 1.3).toFixed(2)}s`,
    s: `${(2 + r() * 3).toFixed(1)}px`,
  }
})
const SPARKS = Array.from({ length: 12 }, () => ({
  left: `${(14 + r() * 68).toFixed(1)}%`,
  top: `${(12 + r() * 76).toFixed(1)}%`,
  d: `${(2.6 + r() * 4).toFixed(1)}s`,
  t: `${(3 + r() * 4).toFixed(1)}s`,
}))

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
    const mobile = window.matchMedia('(max-width: 760px)').matches
    const set = mobile ? 'm' : 'd'
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
    const LAST = FILM_FRAMES - 1
    const scrollProgress = () => {
      const r = section.getBoundingClientRect()
      const total = r.height - window.innerHeight
      return reduced ? 0 : Math.min(1, Math.max(0, total > 0 ? -r.top / total : 0))
    }

    /* ── Brand reveal: filmen först, sedan poppar emblem + text fram över sista bilden ──
       data-brand = syns nu · data-played = animationerna har startat (en gång) */
    /* Paus: första gången loggan avslöjas stannar sidan en stund så att man ser den "sätta sig".
       Hjul, touch, tangenter och scrollbar spärras — och scrollen hålls kvar på samma ställe. */
    let holdY = -1
    let holdTimer = 0
    const stopEvent = (e: Event) => e.preventDefault()
    const stopKeys = (e: KeyboardEvent) => {
      if ([' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'End', 'Home'].includes(e.key)) e.preventDefault()
    }
    const pinScroll = () => {
      if (holdY >= 0 && Math.abs(window.scrollY - holdY) > 2) window.scrollTo({ top: holdY, behavior: 'instant' })
    }
    const release = () => {
      holdY = -1
      clearTimeout(holdTimer)
      window.removeEventListener('wheel', stopEvent)
      window.removeEventListener('touchmove', stopEvent)
      window.removeEventListener('keydown', stopKeys)
      window.removeEventListener('scroll', pinScroll)
      delete section.dataset.holding
    }
    const hold = (y: number) => {
      holdY = Math.round(y)
      window.scrollTo({ top: holdY, behavior: 'instant' })
      section.dataset.holding = '1'
      window.addEventListener('wheel', stopEvent, { passive: false })
      window.addEventListener('touchmove', stopEvent, { passive: false })
      window.addEventListener('keydown', stopKeys)
      window.addEventListener('scroll', pinScroll)
      holdTimer = window.setTimeout(release, HOLD_MS)
    }

    const setBrand = (on: boolean) => {
      if (on) {
        if (section.dataset.brand) return
        section.dataset.brand = '1'
        // pausa bara om man faktiskt är kvar i heron — inte vid hopp via menyn (#tjanster m.fl.)
        if (!section.dataset.played && !reduced && scrollProgress() < 0.95) {
          // första gången: lås fast vid filmens slut medan loggan landar
          const top = window.scrollY + section.getBoundingClientRect().top
          const total = section.offsetHeight - window.innerHeight
          hold(mobile ? window.scrollY : top + total * HOLD_AT)
        }
        section.dataset.played = '1'
      } else if (section.dataset.brand) {
        delete section.dataset.brand
      }
    }
    if (reduced) setBrand(true)

    /* ── System 1 · DATOR: scroll-scrub över lång sektion ── */
    const desktopScroll = () => {
      const p = scrollProgress()
      const fp = Math.min(1, p / FILM_END) // filmen är klar vid FILM_END, sedan står sista bilden kvar
      section.style.setProperty('--bp', fp.toFixed(3))
      section.dataset.step =
        p < START_END ? 'start' : String(Math.min(2, Math.floor(((p - START_END) / (FILM_END - START_END)) * 3)))
      if (!reduced) setBrand(p >= REVEAL_AT)
      target = fp * LAST
      if (!raf) raf = requestAnimationFrame(tick)
    }

    /* ── System 2 · MOBIL: kort scroll startar en självgående uppspelning ── */
    let playing = false
    let playStart = 0
    let playFrom = 0
    const mobileStep = () => {
      const fp = current / LAST
      section.style.setProperty('--bp', fp.toFixed(3))
      section.dataset.step = !playing && fp < 0.03 ? 'start' : String(Math.min(2, Math.floor(fp * 3)))
      if (!reduced) setBrand(fp >= 0.97)
    }
    const mobileScroll = () => {
      const p = scrollProgress()
      if (!playing && p > MOBILE_START && current < LAST) {
        playing = true
        playStart = performance.now()
        playFrom = current
      } else if (p < MOBILE_RESET) {
        playing = false // spola tillbaka till början
        target = 0
      }
      if (playing) target = Math.max(target, p * LAST) // scrollar man fort hänger filmen med
      mobileStep()
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const tick = (now: number) => {
      if (mobile && playing) {
        const auto = playFrom + ((now - playStart) / MOBILE_PLAY_MS) * LAST
        target = Math.min(LAST, Math.max(target, auto))
        if (target >= LAST) playing = false
      }
      // mjuk inbromsning mot rätt bildruta — känns som film, inte bläddrat block
      current += (target - current) * (mobile ? 0.22 : 0.16)
      if (Math.abs(target - current) < 0.04) current = target
      draw(Math.round(current))
      if (mobile) mobileStep()
      raf = current !== target || (mobile && playing) ? requestAnimationFrame(tick) : 0
    }
    const onScroll = mobile ? mobileScroll : desktopScroll

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

    /* ── Interaktivt: emblemet lutar mot muspekaren, ljuset följer ── */
    let mx = 0, my = 0, tx = 0, ty = 0, praf = 0
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const ptick = () => {
      mx += (tx - mx) * 0.08
      my += (ty - my) * 0.08
      section.style.setProperty('--mx', mx.toFixed(4))
      section.style.setProperty('--my', my.toFixed(4))
      praf = Math.abs(tx - mx) + Math.abs(ty - my) > 0.001 ? requestAnimationFrame(ptick) : 0
    }
    const onPointer = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1
      ty = (e.clientY / window.innerHeight) * 2 - 1
      if (!praf) praf = requestAnimationFrame(ptick)
    }
    const onLeave = () => {
      tx = 0
      ty = 0
      if (!praf) praf = requestAnimationFrame(ptick)
    }
    if (fine && !reduced) {
      section.addEventListener('pointermove', onPointer)
      section.addEventListener('pointerleave', onLeave)
    }

    onScroll()
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      cancelAnimationFrame(praf)
      release()
      section.removeEventListener('pointermove', onPointer)
      section.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const pct = Math.round((loaded / FILM_FRAMES) * 100)

  return (
    <section className={styles.film} ref={sectionRef} id="hem" data-step="start" aria-label={tr.film.aria}>
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

        {/* ── Intro: emblem vänster, text höger (som konceptbilden) — filmen ligger bakom ── */}
        <span className={styles.introShade} aria-hidden />
        <div className={styles.intro}>
          <div className={styles.emblem}>
            <div className={styles.emblemTilt}>
              {/* guldstoft som samlas i loggan (som Proviant) */}
              <span className={styles.dust} aria-hidden>
                {DUST.map((g, i) => (
                  <i key={i} style={{ '--x': g.x, '--y': g.y, '--d': g.d, '--s': g.s } as CSSProperties} />
                ))}
              </span>
              <img src="/img/atilli-logo.webp" alt={tr.hero.logoAlt} className={styles.logo} draggable={false} />
              <span className={styles.gloss} aria-hidden />
              <span className={styles.spot} aria-hidden />
              <span className={styles.sparks} aria-hidden>
                {SPARKS.map((s, i) => (
                  <i key={i} style={{ left: s.left, top: s.top, '--d': s.d, '--t': s.t } as CSSProperties} />
                ))}
              </span>
            </div>
          </div>

          <div className={styles.text}>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowLine} />
              {tr.hero.eyebrow}
              <span className={`${styles.eyebrowLine} ${styles.flip}`} />
            </p>
            <h1 className={styles.h1}>
              <span className={styles.name}>Atilli Berg</span>
              <span className={styles.sub}>{tr.hero.subtitle}</span>
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
