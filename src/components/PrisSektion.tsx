'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function PrisSektion() {
    const [tjanster, setTjanster] = useState<{ id: string; name: string; price: number; duration_minutes: number }[]>([])

    useEffect(() => {
        const supabase = createClient()
        supabase.from('services').select('id, name, price, duration_minutes').order('price').then(({ data }) => {
            if (data) setTjanster(data)
        })
    }, [])

    return (
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 56px' }}>
            <p style={{ fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#B8956A', textAlign: 'center', margin: '0 0 10px', fontFamily: 'Raleway, sans-serif' }}>
                — Prislista
            </p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 400, color: '#2f210c', textAlign: 'center', margin: '0 0 40px', letterSpacing: '0.04em' }}>
                Tjänster &amp; Priser
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {tjanster.map((t, i) => (
                    <div key={t.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 0',
                        borderBottom: i < tjanster.length - 1 ? '0.5px solid rgba(184,149,106,0.18)' : 'none',
                        gap: 16,
                    }}>
                        <div>
                            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: '#2f210c', margin: 0 }}>{t.name}</p>
                            <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '11px', color: '#8B7260', margin: '3px 0 0', letterSpacing: '0.06em' }}>{t.duration_minutes} min</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                            <div style={{ height: '0.5px', width: 60, background: 'rgba(184,149,106,0.2)' }} />
                            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#B8956A', whiteSpace: 'nowrap', fontStyle: 'italic' }}>
                                {t.price.toLocaleString('sv-SE')} kr
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 36 }}>
                <a href="/boka" style={{
                    display: 'inline-block',
                    fontFamily: 'Raleway, sans-serif',
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#fff',
                    background: '#B8956A',
                    padding: '13px 32px',
                    borderRadius: '2px',
                    textDecoration: 'none',
                    fontWeight: 600,
                }}>
                    Boka tid →
                </a>
            </div>
        </div>
    )
}