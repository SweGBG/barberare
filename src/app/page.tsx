import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Mellanrum from '@/components/Mellanrum'
import Tjanster from '@/components/Tjanster'
import Galleri from '@/components/Galleri'
import Om from '@/components/Om'
import Footer from '@/components/Footer'

const marqueeItems = [
    'Atilli Berg', 'Est. 2026', 'Göteborg', 'Premium Barbershop',
    'Atilli Berg', 'Est. 2026', 'Göteborg', 'Premium Barbershop',
    'Atilli Berg', 'Est. 2026', 'Göteborg', 'Premium Barbershop',
]

export default function Home() {
    return (
        <main>
            <Navbar />

            <div style={{
                borderTop: '0,25px solid var(--border)',
                borderBottom: '0.25px solid var(--border)',
                padding: '8px 0',
                overflow: 'hidden',
                background: 'var(--cream, #F5F0E8)',
                position: 'relative',
                zIndex: 50,
            }}>
                <div style={{
                    display: 'flex',
                    width: 'max-content',
                    animation: 'marquee 20s linear infinite',
                }}>
                    {[...marqueeItems, ...marqueeItems].map((item, i) => (
                        <span key={i} style={{
                            fontSize: '10px',
                            letterSpacing: '0.25em',
                            textTransform: 'uppercase',
                            color: 'var(--muted)',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '24px',
                            padding: '0 10px',
                            fontWeight: 500,
                        }}>
                            {item}
                            <span style={{
                                width: '3px', height: '3px',
                                borderRadius: '50%',
                                background: 'var(--gold)',
                                flexShrink: 0,
                                display: 'inline-block',
                            }} />
                        </span>
                    ))}
                </div>
            </div>

            <Hero />
            <Mellanrum />
            <Tjanster />
            <Galleri />
            <Om />
            <Footer />
        </main>
    )
}