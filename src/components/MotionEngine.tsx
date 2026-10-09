'use client'

import { useEffect } from 'react'

/**
 * En liten motor för hela startsidan:
 *  - [data-reveal]    → får data-in="1" när elementet syns (en gång)
 *  - [data-progress]  → får --p (0..1) från att sektionen kommer in nedtill tills den lämnar upptill
 */
export default function MotionEngine() {
  useEffect(() => {
    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            ;(e.target as HTMLElement).dataset.in = '1'
            reveal.unobserve(e.target)
          }
        }),
      { threshold: 0.16, rootMargin: '0px 0px -6% 0px' }
    )
    document.querySelectorAll('[data-reveal]').forEach((el) => reveal.observe(el))

    const progressEls = Array.from(document.querySelectorAll<HTMLElement>('[data-progress]'))
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const vh = window.innerHeight
        for (const el of progressEls) {
          const r = el.getBoundingClientRect()
          if (r.bottom < -200 || r.top > vh + 200) continue
          const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)))
          el.style.setProperty('--p', p.toFixed(3))
        }
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      reveal.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return null
}
