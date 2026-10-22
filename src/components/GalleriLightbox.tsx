'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import type { Lang } from '@/lib/translations'
import styles from './GalleriLightbox.module.css'

export type Bild = { src: string; ar: string }

type Cta = { label: string; href: string; top?: boolean }
type Story = { tag: string; title: string; line: string; body: string; meta: string[]; cta: Cta; cta2: Cta }

/* Berättelse + vart varje bild leder. Ordningen följer bilderna i Galleri.tsx.
   top: true = "spola tillbaka" till heron (filmen) i stället för att navigera. */
const STORIES: Record<Lang, Story[]> = {
  sv: [
    {
      tag: 'Salongen', title: 'Där allt börjar', line: 'Tegel, läder och varmt ljus.',
      body: 'Fyra stolar, en espresso som alltid står på och en salong byggd för att du ska landa. Här tar vi oss tid — konsultation först, sax sen.',
      meta: ['Göteborg', 'Est. 2026'],
      cta: { label: 'Boka din tid', href: '/boka' }, cta2: { label: 'Om oss', href: '/#om' },
    },
    {
      tag: 'Klippning', title: 'Formen som håller', line: 'Klassisk herrklippning, anpassad efter dig.',
      body: 'Vi läser hårets växt, ansiktets linjer och hur du faktiskt lever med frisyren. Resultatet ska se lika bra ut om tre veckor som när du går härifrån.',
      meta: ['Konsultation ingår', 'Tvätt & styling'],
      cta: { label: 'Boka klippning', href: '/boka' }, cta2: { label: 'Se alla tjänster', href: '/#tjanster' },
    },
    {
      tag: 'Ritualen', title: 'Borsten lyfter', line: 'Varm handduk, lödder, stål.',
      body: 'Den klassiska rakningen är en ritual i flera steg — och precis det vår film på startsidan visar. Vill du se den igen?',
      meta: ['Varm handduk', 'Rakkniv i stål'],
      cta: { label: 'Se filmen igen', href: '/#hem', top: true }, cta2: { label: 'Boka rakning', href: '/boka' },
    },
    {
      tag: 'Sax & kam', title: 'Precision i varje klipp', line: 'Handverktyg, inga genvägar.',
      body: 'Saxklippning ger textur och rörelse som maskinen aldrig kan. Vi jobbar sektion för sektion tills linjerna sitter.',
      meta: ['Saxklippning', 'Textur & rörelse'],
      cta: { label: 'Boka tid', href: '/boka' }, cta2: { label: 'Våra tjänster', href: '/#tjanster' },
    },
    {
      tag: 'Maskinklipp', title: 'Fade utan trappsteg', line: 'Från noll till full längd — mjukt.',
      body: 'En ren fade kräver tålamod och flera guards. Vi blandar övergången tills den inte syns, och avslutar med skarpa konturer.',
      meta: ['Skin fade', 'Konturer'],
      cta: { label: 'Boka fade', href: '/boka' }, cta2: { label: 'Prislista', href: '/#priser' },
    },
    {
      tag: 'Stolen', title: 'Stol 01 väntar', line: 'Krom, läder och femtio år av historia.',
      body: 'Våra stolar är restaurerade klassiker. Luta dig bakåt, ta en varm handduk — resten sköter vi.',
      meta: ['Stol 01', 'Göteborg'],
      cta: { label: 'Boka din stol', href: '/boka' }, cta2: { label: 'Se ritualen', href: '/#hem', top: true },
    },
    {
      tag: 'Korridoren', title: 'Välkommen in', line: 'Lamporna är tända.',
      body: 'Gå in genom porten, följ ljuset längs tegelväggen — vi hälsar dig välkommen redan i dörren. Drop-in när stolarna är lediga.',
      meta: ['Drop-in', 'Hitta hit'],
      cta: { label: 'Kontakt & hitta hit', href: '/kontakt' }, cta2: { label: 'Boka tid', href: '/boka' },
    },
    {
      tag: 'Hantverket', title: 'Verktygen vaknar', line: 'Ögonblicket filmen fångar.',
      body: 'Varje verktyg har en uppgift. Borsten, kniven, kammen — tillsammans blir de hantverket. Scrolla igenom det från början.',
      meta: ['Hantverk', 'Est. 2026'],
      cta: { label: 'Se hela filmen', href: '/#hem', top: true }, cta2: { label: 'Våra tjänster', href: '/#tjanster' },
    },
  ],
  en: [
    {
      tag: 'The salon', title: 'Where it all begins', line: 'Brick, leather and warm light.',
      body: 'Four chairs, an espresso always on and a salon built for you to unwind. We take our time — consultation first, scissors second.',
      meta: ['Gothenburg', 'Est. 2026'],
      cta: { label: 'Book your appointment', href: '/boka' }, cta2: { label: 'About us', href: '/#om' },
    },
    {
      tag: 'Haircut', title: 'A shape that lasts', line: 'Classic men’s cut, tailored to you.',
      body: 'We read how your hair grows, the lines of your face and how you actually live with the style. It should look as good in three weeks as the day you leave.',
      meta: ['Consultation included', 'Wash & styling'],
      cta: { label: 'Book a haircut', href: '/boka' }, cta2: { label: 'All services', href: '/#tjanster' },
    },
    {
      tag: 'The ritual', title: 'The brush rises', line: 'Hot towel, lather, steel.',
      body: 'The classic shave is a ritual in several steps — exactly what the film on our front page shows. Want to see it again?',
      meta: ['Hot towel', 'Steel razor'],
      cta: { label: 'Watch the film again', href: '/#hem', top: true }, cta2: { label: 'Book a shave', href: '/boka' },
    },
    {
      tag: 'Scissors & comb', title: 'Precision in every cut', line: 'Hand tools, no shortcuts.',
      body: 'Scissor cutting gives texture and movement a clipper never can. We work section by section until the lines sit right.',
      meta: ['Scissor cut', 'Texture & movement'],
      cta: { label: 'Book now', href: '/boka' }, cta2: { label: 'Our services', href: '/#tjanster' },
    },
    {
      tag: 'Clipper work', title: 'A fade without steps', line: 'From zero to full length — smoothly.',
      body: 'A clean fade takes patience and several guards. We blend the transition until it disappears, then finish with sharp outlines.',
      meta: ['Skin fade', 'Outlines'],
      cta: { label: 'Book a fade', href: '/boka' }, cta2: { label: 'Price list', href: '/#priser' },
    },
    {
      tag: 'The chair', title: 'Chair 01 awaits', line: 'Chrome, leather and fifty years of history.',
      body: 'Our chairs are restored classics. Lean back, take a hot towel — we handle the rest.',
      meta: ['Chair 01', 'Gothenburg'],
      cta: { label: 'Book your chair', href: '/boka' }, cta2: { label: 'See the ritual', href: '/#hem', top: true },
    },
    {
      tag: 'The corridor', title: 'Come on in', line: 'The lights are on.',
      body: 'Walk through the gate and follow the light along the brick wall — we’ll greet you at the door. Drop-ins welcome when chairs are free.',
      meta: ['Drop-in', 'Find us'],
      cta: { label: 'Contact & directions', href: '/kontakt' }, cta2: { label: 'Book now', href: '/boka' },
    },
    {
      tag: 'The craft', title: 'The tools awaken', line: 'The moment the film captures.',
      body: 'Every tool has a purpose. The brush, the blade, the comb — together they become the craft. Scroll through it from the start.',
      meta: ['Craft', 'Est. 2026'],
      cta: { label: 'Watch the full film', href: '/#hem', top: true }, cta2: { label: 'Our services', href: '/#tjanster' },
    },
  ],
}

const UI = {
  sv: { close: 'Stäng', prev: 'Föregående bild', next: 'Nästa bild', dialog: 'Bild ur galleriet' },
  en: { close: 'Close', prev: 'Previous image', next: 'Next image', dialog: 'Gallery image' },
}

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

type Props = {
  bilder: Bild[]
  index: number | null
  origin: HTMLElement | null
  lang: Lang
  onIndex: (i: number) => void
  onClose: () => void
}

export default function GalleriLightbox({ bilder, index, origin, lang, onIndex, onClose }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const shown = index
  const [dir, setDir] = useState(0)
  const [closing, setClosing] = useState(false)
  const open = index !== null
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // FLIP: bilden växer ut ur rutan man klickade på
  const flip = (from: HTMLElement | null, el: HTMLElement | null, reverse = false) => {
    if (!from || !el || reduced) return null
    const a = from.getBoundingClientRect()
    const b = el.getBoundingClientRect()
    if (!a.width || !b.width || a.bottom < 0 || a.top > window.innerHeight) return null
    const t = `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})`
    const frames = [{ transform: t, borderRadius: '0px' }, { transform: 'none' }]
    return el.animate(reverse ? frames.reverse() : frames, {
      duration: reverse ? 520 : 760,
      easing: EASE,
      fill: 'both',
    })
  }

  useLayoutEffect(() => {
    if (!open) return
    setClosing(false)
    flip(origin, mediaRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const close = useCallback(() => {
    if (closing) return
    setClosing(true)
    const tile = shown !== null ? (document.querySelector(`[data-gal="${shown}"]`) as HTMLElement | null) : null
    const anim = flip(tile, mediaRef.current, true)
    const done = () => {
      setClosing(false)
      onClose()
    }
    if (anim) anim.finished.then(done, done)
    else setTimeout(done, reduced ? 0 : 380)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closing, shown, onClose])

  const go = useCallback(
    (d: number) => {
      if (index === null) return
      setDir(d)
      onIndex((index + d + bilder.length) % bilder.length)
    },
    [index, bilder.length, onIndex]
  )

  // tangentbord, scroll-lås och fokus
  useEffect(() => {
    if (!open) return
    const prevFocus = document.activeElement as HTMLElement | null
    const html = document.documentElement
    const sbw = window.innerWidth - html.clientWidth
    html.style.overflow = 'hidden'
    html.style.paddingRight = sbw ? `${sbw}px` : ''
    closeRef.current?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'Tab' && rootRef.current) {
        const f = rootRef.current.querySelectorAll<HTMLElement>('a, button')
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      html.style.overflow = ''
      html.style.paddingRight = ''
      prevFocus?.focus?.({ preventScroll: true })
    }
  }, [open, close, go])

  // svep på mobil
  const touch = useRef<{ x: number; y: number } | null>(null)
  const onTouchStart = (e: React.TouchEvent) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return
    const dx = e.changedTouches[0].clientX - touch.current.x
    const dy = e.changedTouches[0].clientY - touch.current.y
    touch.current = null
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? 1 : -1)
    else if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.4) close()
  }

  const follow = (c: Cta) => (e: React.MouseEvent) => {
    if (c.top) {
      // tillbaka till filmen: stäng och glid upp till heron
      e.preventDefault()
      onClose()
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }))
    } else if (c.href.startsWith('/#')) {
      onClose()
    }
  }

  if (!open || shown === null) return null
  const s = STORIES[lang][shown]
  const ui = UI[lang]
  const nr = (n: number) => String(n + 1).padStart(2, '0')

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${closing ? styles.closing : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${ui.dialog}: ${s.tag}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className={styles.backdrop} onClick={close} aria-hidden />

      <div className={styles.stage}>
        {/* ── Bilden i dubbel guldram ── */}
        <div
          ref={mediaRef}
          className={styles.media}
          style={{ '--ar': bilder[shown].ar } as CSSProperties}
        >
          <img
            key={shown}
            src={bilder[shown].src}
            alt={s.tag}
            className={styles.img}
            style={{ '--dir': dir } as CSSProperties}
            draggable={false}
          />
          <span className={styles.frame} aria-hidden />
          <span className={styles.sheen} aria-hidden />
          <span className={styles.roman} aria-hidden>{nr(shown)}</span>
        </div>

        {/* ── Berättelsen ── */}
        <div className={styles.panel} key={`p${shown}`}>
          <p className={styles.count}>
            <span>{nr(shown)}</span>
            <i aria-hidden />
            {nr(bilder.length - 1)}
          </p>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            {s.tag}
          </p>
          <h3 className={styles.title}>{s.title}</h3>
          <p className={styles.line}>{s.line}</p>
          <span className={styles.rule} aria-hidden><b /></span>
          <p className={styles.body}>{s.body}</p>
          <ul className={styles.meta}>
            {s.meta.map((m) => <li key={m}>{m}</li>)}
          </ul>
          <div className={styles.btns}>
            <a href={s.cta.href} className={styles.btnGold} onClick={follow(s.cta)}>
              <span>{s.cta.label}</span>
              <svg viewBox="0 0 24 24" aria-hidden><path d="M4 12h15M13 6l6 6-6 6" /></svg>
            </a>
            <a href={s.cta2.href} className={styles.btnGhost} onClick={follow(s.cta2)}>{s.cta2.label}</a>
          </div>
        </div>
      </div>

      {/* ── Miniatyrer ── */}
      <div className={styles.thumbs}>
        {bilder.map((b, i) => (
          <button
            key={b.src}
            className={`${styles.thumb} ${i === shown ? styles.active : ''}`}
            onClick={() => { setDir(i > shown ? 1 : -1); onIndex(i) }}
            aria-label={STORIES[lang][i].tag}
            aria-current={i === shown}
          >
            <img src={b.src} alt="" loading="lazy" />
          </button>
        ))}
      </div>

      <button ref={closeRef} className={styles.close} onClick={close} aria-label={ui.close}>
        <svg viewBox="0 0 24 24" aria-hidden><path d="M6 6l12 12M18 6 6 18" /></svg>
      </button>
      <button className={`${styles.nav} ${styles.prev}`} onClick={() => go(-1)} aria-label={ui.prev}>
        <svg viewBox="0 0 24 24" aria-hidden><path d="M15 5l-7 7 7 7" /></svg>
      </button>
      <button className={`${styles.nav} ${styles.next}`} onClick={() => go(1)} aria-label={ui.next}>
        <svg viewBox="0 0 24 24" aria-hidden><path d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  )
}
