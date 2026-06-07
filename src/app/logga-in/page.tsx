'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './login.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/medlem')
    } catch (error: any) {
      setError(error.message || 'Något gick fel vid inloggning')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.page}>

      {/* Guldgradient bakgrund */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: `
          radial-gradient(ellipse at 50% 50%, rgba(184,149,106,0.18) 0%, transparent 65%),
          radial-gradient(ellipse at 80% 20%, rgba(184,149,106,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 20% 80%, rgba(184,149,106,0.06) 0%, transparent 50%)
        `,
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      {/* SVG ringar */}
      <svg style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none',
      }} xmlns="http://www.w3.org/2000/svg">
        <circle cx="50%" cy="50%" r="200" fill="none" stroke="rgba(184,149,106,0.1)" strokeWidth="0.5" />
        <circle cx="50%" cy="50%" r="350" fill="none" stroke="rgba(184,149,106,0.08)" strokeWidth="0.5" />
        <circle cx="50%" cy="50%" r="500" fill="none" stroke="rgba(184,149,106,0.06)" strokeWidth="0.5" />
        <circle cx="50%" cy="50%" r="680" fill="none" stroke="rgba(184,149,106,0.04)" strokeWidth="0.5" />
      </svg>

      {/* Mini-header */}
      <div className={styles.miniHeader} style={{ position: 'relative', zIndex: 2 }}>
        <a href="/" className={styles.miniLogo}>
          <span className={styles.miniLogoMain}>Atilli</span>
          <span className={styles.miniLogoSub}>Berg</span>
        </a>
      </div>

      {/* Formulär */}
      <div className={styles.container}>
        <div className={styles.formWrap}>
          <div className={styles.header}>
            <p className={styles.eyebrow}>Välkommen tillbaka</p>
            <h1 className={styles.title}>
              Logga in på <em>ditt konto</em>
            </h1>
            <p className={styles.subtitle}>
              Hantera dina bokningar och se din profil
            </p>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>E-post</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className={styles.input}
                placeholder="din@email.se"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>Lösenord</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className={styles.input}
                placeholder="••••••••"
              />
            </div>
            <div className={styles.remember}>
              <label className={styles.checkbox}>
                <input type="checkbox" />
                <span>Kom ihåg mig</span>
              </label>
              <a href="/glomt-losenord" className={styles.forgot}>
                Glömt lösenord?
              </a>
            </div>
            <button type="submit" disabled={isLoading} className={styles.submitBtn}>
              {isLoading ? 'Loggar in...' : 'Logga in'}
            </button>
          </form>

          <div className={styles.divider}>
            <span>eller</span>
          </div>

          <div className={styles.register}>
            <p>Har du inget konto än?</p>
            <a href="/skapa-konto" className={styles.registerBtn}>
              Skapa konto
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}