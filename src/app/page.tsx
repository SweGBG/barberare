import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Tjanster from '@/components/Tjanster'
import Galleri from '@/components/Galleri'
import Om from '@/components/Om'
import Footer from '@/components/Footer'

// Tjänster & priser hämtas från Supabase — uppdatera var 5:e minut
export const revalidate = 300

export default function Home() {
  return (
    <main style={{ background: 'var(--bg)', overflowX: 'hidden' }}>
      <Navbar />

      {/* ── Hero ── */}
      <Hero />

      {/* ── Varför Atilli Berg ── */}
      <Features />

      {/* ── Tjänster (från Supabase) ── */}
      <Tjanster />

      <Ornament />

      {/* ── Galleri ── */}
      <Galleri />

      <Ornament />

      {/* ── Om oss + Prislista ── */}
      <Om />

      {/* ── Boka-CTA + Footer ── */}
      <Footer />
    </main>
  )
}

function Ornament() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }} aria-hidden="true">
      <svg width="280" height="24" viewBox="0 0 280 24" fill="none">
        <line x1="0" y1="12" x2="112" y2="12" stroke="rgba(201,162,75,0.3)" strokeWidth="0.6" />
        <line x1="168" y1="12" x2="280" y2="12" stroke="rgba(201,162,75,0.3)" strokeWidth="0.6" />
        <path d="M126 12c4-6 10-6 14 0-4 6-10 6-14 0Z" stroke="#C9A24B" strokeWidth="0.8" fill="none" opacity="0.8" />
        <circle cx="133" cy="12" r="1.5" fill="#C9A24B" opacity="0.8" />
        <path d="M112 12c4 0 7-4 7-4M112 12c4 0 7 4 7 4M168 12c-4 0-7-4-7-4M168 12c-4 0-7 4-7 4"
          stroke="rgba(201,162,75,0.55)" strokeWidth="0.6" />
      </svg>
    </div>
  )
}
