import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Tjanster from '@/components/Tjanster'
import Galleri from '@/components/Galleri'
import Om from '@/components/Om'
import Footer from '@/components/Footer'

const ticker = [
    'Atilli Berg', 'Est. 2026', 'Göteborg',
    'Premium Barbershop', 'Herrfrisör', 'Boka online',
]

export default function Home() {
    return (
        <main style={{ background: 'var(--cream, #F5F0E8)', overflowX: 'hidden' }}>
            <Navbar />

            {/* ── Ticker ── */}
            <div style={{
                borderTop: '0.5px solid rgba(184,149,106,0.25)',
                borderBottom: '0.5px solid rgba(184,149,106,0.25)',
                padding: '7px 0',
                overflow: 'hidden',
                background: 'var(--cream, #F5F0E8)',
                position: 'relative',
                zIndex: 10,
            }}>
                <div style={{
                    display: 'flex',
                    width: 'max-content',
                    animation: 'tickerSlide 28s linear infinite',
                    willChange: 'transform',
                }}>
                    {[...ticker, ...ticker, ...ticker, ...ticker].map((item, i) => (
                        <span key={i} style={{
                            fontSize: '9px',
                            letterSpacing: '0.28em',
                            textTransform: 'uppercase',
                            color: 'var(--muted, #8B7260)',
                            whiteSpace: 'nowrap',
                            padding: '0 20px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '20px',
                            fontWeight: 500,
                            fontFamily: 'Raleway, sans-serif',
                        }}>
                            {item}
                            <span style={{
                                width: '2px', height: '2px',
                                borderRadius: '50%',
                                background: 'var(--gold, #B8956A)',
                                display: 'inline-block',
                                flexShrink: 0,
                                opacity: 0.7,
                            }} />
                        </span>
                    ))}
                </div>
            </div>

            {/* ── Hero ── */}
            <section id="hem">
                <Hero />
            </section>

            <Divider variant="lines" />

            {/* ── Tjänster & Priser ── */}
            <section id="tjanster" style={{ scrollMarginTop: '80px' }}>
                <Tjanster />
            </section>

            <Divider variant="diamond" />

            {/* ── Galleri ── */}
            <section id="galleri" style={{ scrollMarginTop: '80px' }}>
                <Galleri />
            </section>

            <Divider variant="circle" />

            {/* ── Om oss ── */}
            <section id="om" style={{ scrollMarginTop: '80px' }}>
                <Om />
            </section>

            <CtaBanner />

            <Footer />
        </main>
    )
}

function Divider({ variant }: { variant: 'lines' | 'diamond' | 'circle' }) {
    if (variant === 'lines') return (
        <div style={{ padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <div style={{ height: '0.5px', width: 80, background: 'rgba(184,149,106,0.25)' }} />
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="7" y="0.5" width="9" height="9" transform="rotate(45 7 0.5)" stroke="#B8956A" strokeWidth="0.6" fill="none" opacity="0.5" />
            </svg>
            <div style={{ height: '0.5px', width: 200, background: 'rgba(184,149,106,0.2)' }} />
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                <circle cx="3" cy="3" r="2.5" stroke="#B8956A" strokeWidth="0.5" fill="none" opacity="0.4" />
            </svg>
            <div style={{ height: '0.5px', width: 200, background: 'rgba(184,149,106,0.2)' }} />
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="7" y="0.5" width="9" height="9" transform="rotate(45 7 0.5)" stroke="#B8956A" strokeWidth="0.6" fill="none" opacity="0.5" />
            </svg>
            <div style={{ height: '0.5px', width: 80, background: 'rgba(184,149,106,0.25)' }} />
        </div>
    )

    if (variant === 'diamond') return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
            <svg width="240" height="20" viewBox="0 0 240 20" fill="none">
                <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(184,149,106,0.2)" strokeWidth="0.5" />
                <rect x="112" y="3" width="14" height="14" transform="rotate(45 119 10)" stroke="#B8956A" strokeWidth="0.7" fill="none" opacity="0.6" />
                <line x1="140" y1="10" x2="240" y2="10" stroke="rgba(184,149,106,0.2)" strokeWidth="0.5" />
            </svg>
        </div>
    )

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
            <svg width="80" height="20" viewBox="0 0 80 20" fill="none">
                <circle cx="40" cy="10" r="8" stroke="#B8956A" strokeWidth="0.5" fill="none" opacity="0.4" />
                <circle cx="40" cy="10" r="4" stroke="#B8956A" strokeWidth="0.5" fill="none" opacity="0.3" />
                <circle cx="40" cy="10" r="1.5" fill="#B8956A" opacity="0.4" />
                <line x1="0" y1="10" x2="28" y2="10" stroke="rgba(184,149,106,0.2)" strokeWidth="0.5" />
                <line x1="52" y1="10" x2="80" y2="10" stroke="rgba(184,149,106,0.2)" strokeWidth="0.5" />
            </svg>
        </div>
    )
}

function CtaBanner() {
    return (
        <div style={{
            background: '#1C1A17',
            padding: '56px 24px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.06, pointerEvents: 'none' }} preserveAspectRatio="xMidYMid slice">
                <defs>
                    <pattern id="ctaGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#B8956A" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#ctaGrid)" />
            </svg>

            <svg style={{ position: 'absolute', right: -60, top: -60, opacity: 0.08, pointerEvents: 'none' }} width="300" height="300" viewBox="0 0 300 300">
                <circle cx="150" cy="150" r="140" stroke="#B8956A" strokeWidth="0.5" fill="none" />
                <circle cx="150" cy="150" r="100" stroke="#B8956A" strokeWidth="0.5" fill="none" />
                <circle cx="150" cy="150" r="60" stroke="#B8956A" strokeWidth="0.5" fill="none" />
            </svg>

            <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(184,149,106,0.6)', margin: '0 0 12px', position: 'relative' }}>
                Boka din tid
            </p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, color: '#fff', margin: '0 0 8px', letterSpacing: '0.05em', position: 'relative' }}>
                Välkommen till <em style={{ color: '#B8956A', fontStyle: 'italic' }}>Atilli Berg</em>
            </h2>
            <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.45)', margin: '0 0 32px', letterSpacing: '0.05em', position: 'relative' }}>
                Göteborg · Herrfrisör &amp; Barbershop · Est. 2026
            </p>
            <a href="/boka" style={{
                display: 'inline-block',
                fontFamily: 'Raleway, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#1C1A17',
                background: '#B8956A',
                padding: '14px 40px',
                borderRadius: '2px',
                textDecoration: 'none',
                fontWeight: 700,
                position: 'relative',
            }}>
                Boka tid nu →
            </a>
        </div>
    )
}