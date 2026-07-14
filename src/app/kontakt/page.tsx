'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { useLang } from '@/lib/LangContext'
import { t } from '@/lib/translations'
import styles from './kontakt.module.css'

export default function KontaktPage() {
  const { lang } = useLang()
  const tr = t[lang].kontakt
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
          <p className={styles.eyebrow}>{tr.eyebrow}</p>
          <h1 className={styles.title}>{tr.title1}<br /><em>{tr.title2}</em></h1>
          <p className={styles.sub}>{tr.sub}</p>
        </div>

        <div className={styles.grid}>

          {/* FORMULÄR */}
          <div className={styles.formCard}>
            {status === 'sent' ? (
              <div className={styles.success}>
                <div className={styles.successIcon}>✓</div>
                <h3>{tr.skickat}</h3>
                <p>{tr.skickatSub}</p>
              </div>
            ) : (
              <>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>{tr.namn}</label>
                    <input
                      type="text"
                      placeholder={tr.namnPlaceholder}
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>{tr.email}</label>
                    <input
                      type="email"
                      placeholder="din@email.se"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>{tr.telefon}</label>
                  <input
                    type="tel"
                    placeholder="070-000 00 00"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className={styles.field}>
                  <label>{tr.meddelande}</label>
                  <textarea
                    placeholder={tr.meddelandePlaceholder}
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                  />
                </div>
                {status === 'error' && (
                  <p className={styles.errorMsg}>{tr.fel}</p>
                )}
                <button
                  className={styles.submitBtn}
                  onClick={handleSubmit}
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? tr.skickar : tr.skicka}
                </button>
              </>
            )}
          </div>

          {/* INFO */}
          <div className={styles.infoCard}>
            <div className={styles.infoBlock}>
              <h4>{tr.oppettider}</h4>
              <p>{tr.manFre} <span>09:00 – 19:00</span></p>
              <p>{tr.lordag} <span>10:00 – 17:00</span></p>
              <p>{tr.sondag} <span>{tr.stangt}</span></p>
            </div>
            <div className={styles.infoBlock}>
              <h4>{tr.hittaOss}</h4>
              <p>Din gata 1</p>
              <p>Din stad</p>
            </div>
            <div className={styles.infoBlock}>
              <h4>{tr.direktKontakt}</h4>
              <a href="tel:031000000">031-00 00 00</a>
              <a href="mailto:info@atilliberg.se">info@atilliberg.se</a>
            </div>
            <a href="/boka" className={styles.bokaBtn}>
              {tr.bokaBtn}
            </a>
          </div>

        </div>
      </main>
    </>
  )
}