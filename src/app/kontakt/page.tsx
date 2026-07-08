'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import styles from './kontakt.module.css'

export default function KontaktPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return
    setStatus('loading')
    const res = await fetch('/api/kontakt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setStatus(res.ok ? 'sent' : 'error')
  }

  return (
    <>
      <Navbar />
      <main className={styles.page}>

        <div className={styles.header}>
          <p className={styles.eyebrow}>Kontakta oss</p>
          <h1 className={styles.title}>Vi svarar<br /><em>inom 24h</em></h1>
          <p className={styles.sub}>
            Har du frågor om tjänster, priser eller vill boka via telefon?
            Fyll i formuläret så hör vi av oss.
          </p>
        </div>

        <div className={styles.grid}>

          {/* FORMULÄR */}
          <div className={styles.formCard}>
            {status === 'sent' ? (
              <div className={styles.success}>
                <div className={styles.successIcon}>✓</div>
                <h3>Meddelande skickat!</h3>
                <p>Vi återkommer inom 24 timmar.</p>
              </div>
            ) : (
              <>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Namn *</label>
                    <input
                      type="text"
                      placeholder="Ditt namn"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Email *</label>
                    <input
                      type="email"
                      placeholder="din@email.se"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Telefon</label>
                  <input
                    type="tel"
                    placeholder="070-000 00 00"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className={styles.field}>
                  <label>Meddelande *</label>
                  <textarea
                    placeholder="Skriv ditt meddelande här..."
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                  />
                </div>
                {status === 'error' && (
                  <p className={styles.errorMsg}>Något gick fel. Försök igen.</p>
                )}
                <button
                  className={styles.submitBtn}
                  onClick={handleSubmit}
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Skickar...' : 'Skicka meddelande'}
                </button>
              </>
            )}
          </div>

          {/* INFO */}
          <div className={styles.infoCard}>
            <div className={styles.infoBlock}>
              <h4>Öppettider</h4>
              <p>Måndag – Fredag <span>09:00 – 19:00</span></p>
              <p>Lördag <span>10:00 – 17:00</span></p>
              <p>Söndag <span>Stängt</span></p>
            </div>
            <div className={styles.infoBlock}>
              <h4>Hitta oss</h4>
              <p>Din gata 1</p>
              <p>Din stad</p>
            </div>
            <div className={styles.infoBlock}>
              <h4>Direkt kontakt</h4>
              <a href="tel:031000000">031-00 00 00</a>
              <a href="mailto:info@atilliberg.se">info@atilliberg.se</a>
            </div>
            <a href="/boka" className={styles.bokaBtn}>
              Boka tid direkt →
            </a>
          </div>

        </div>
      </main>
    </>
  )
}