'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useLang } from '@/lib/LangContext'
import { t } from '@/lib/translations'
import styles from './skapa-konto.module.css'

export default function SkapaKontoPage() {
    const router = useRouter()
    const supabase = createClient()
    const { lang } = useLang()
    const tr = t[lang].skapaKonto
    const fileRef = useRef<HTMLInputElement>(null)

    const [form, setForm] = useState({
        fornamn: '',
        efternamn: '',
        email: '',
        telefon: '',
        lösenord: '',
        bekrafta: '',
    })
    const [avatar, setAvatar] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setAvatar(file)
        setPreview(URL.createObjectURL(file))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')

        if (form.lösenord !== form.bekrafta) {
            setError(tr.felMatchar)
            return
        }
        if (form.lösenord.length < 6) {
            setError(tr.felLangd)
            return
        }

        setLoading(true)

        try {
            // 1. Skapa auth-användare
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: form.email,
                password: form.lösenord,
                options: {
                    data: {
                        full_name: `${form.fornamn} ${form.efternamn}`.trim(),
                        phone: form.telefon,
                    },
                },
            })

            if (authError) throw authError

            const userId = authData.user?.id
            if (!userId) throw new Error('Kunde inte hämta användar-ID')

            // 2. Ladda upp profilbild om vald
            let avatarUrl: string | null = null
            if (avatar) {
                const ext = avatar.name.split('.').pop()
                const filePath = `avatars/${userId}.${ext}`
                const { error: uploadError } = await supabase.storage
                    .from('profiles')
                    .upload(filePath, avatar, { upsert: true })

                if (!uploadError) {
                    const { data: urlData } = supabase.storage
                        .from('profiles')
                        .getPublicUrl(filePath)
                    avatarUrl = urlData.publicUrl
                }
            }

            // 3. Spara profil i profiles-tabellen
            await supabase.from('profiles').upsert({
                id: userId,
                full_name: `${form.fornamn} ${form.efternamn}`.trim(),
                email: form.email,
                phone: form.telefon,
                avatar_url: avatarUrl,
                updated_at: new Date().toISOString(),
            })

            router.push('/skapa-konto/bekraftelse')

        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : tr.felGenerisk
            if (msg.includes('already registered')) {
                setError(tr.felRegistrerad)
            } else {
                setError(msg)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.hero}>
                    <p className={styles.eyebrow}>{tr.eyebrow}</p>
                    <h1 className={styles.title}>{tr.title1}<em>{tr.title2}</em></h1>
                    <div className={styles.divider} />
                    <p className={styles.sub}>{tr.sub}</p>
                </div>

                <div className={styles.kortWrap}>
                    <div className={styles.kort}>

                        {/* Avatar */}
                        <div className={styles.avatarSektion}>
                            <button
                                type="button"
                                className={styles.avatarBtn}
                                onClick={() => fileRef.current?.click()}
                            >
                                {preview ? (
                                    <img src={preview} alt="Profilbild" className={styles.avatarImg} />
                                ) : (
                                    <div className={styles.avatarPlaceholder}>
                                        <i className="ti ti-user" />
                                        <span>{tr.valjBild}</span>
                                    </div>
                                )}
                            </button>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleFile}
                            />
                            <p className={styles.avatarHint}>{tr.profilbild}</p>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.rad}>
                                <div className={styles.falt}>
                                    <label className={styles.label}>{tr.fornamn}</label>
                                    <input
                                        className={styles.input}
                                        type="text"
                                        placeholder="Atilli"
                                        value={form.fornamn}
                                        onChange={e => setForm({ ...form, fornamn: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.falt}>
                                    <label className={styles.label}>{tr.efternamn}</label>
                                    <input
                                        className={styles.input}
                                        type="text"
                                        placeholder="Berg"
                                        value={form.efternamn}
                                        onChange={e => setForm({ ...form, efternamn: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.falt}>
                                <label className={styles.label}>{tr.epost}</label>
                                <input
                                    className={styles.input}
                                    type="email"
                                    placeholder="din@email.se"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className={styles.falt}>
                                <label className={styles.label}>{tr.telefon}</label>
                                <input
                                    className={styles.input}
                                    type="tel"
                                    placeholder="070-xxx xx xx"
                                    value={form.telefon}
                                    onChange={e => setForm({ ...form, telefon: e.target.value })}
                                />
                            </div>

                            <div className={styles.rad}>
                                <div className={styles.falt}>
                                    <label className={styles.label}>{tr.losenord}</label>
                                    <input
                                        className={styles.input}
                                        type="password"
                                        placeholder={tr.losenordPlaceholder}
                                        value={form.lösenord}
                                        onChange={e => setForm({ ...form, lösenord: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.falt}>
                                    <label className={styles.label}>{tr.bekrafta}</label>
                                    <input
                                        className={styles.input}
                                        type="password"
                                        placeholder={tr.bekraftaPlaceholder}
                                        value={form.bekrafta}
                                        onChange={e => setForm({ ...form, bekrafta: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {error && <p className={styles.error}>{error}</p>}

                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={loading}
                            >
                                {loading ? tr.skaparKonto : tr.skapaKonto}
                            </button>

                            <p className={styles.loginLink}>
                                {tr.redanKonto}{' '}
                                <a href="/logga-in" className={styles.link}>{tr.loggaInHar}</a>
                            </p>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}