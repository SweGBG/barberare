'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import styles from './AdminTopbar.module.css'

export default function AdminTopbar() {
  const [email, setEmail] = useState('')
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? '')
    })
  }, [])

  const today = new Date().toLocaleDateString('sv-SE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  const initials = email.slice(0, 2).toUpperCase()

  return (
    <div className={styles.topbar}>
      <span className={styles.title}>God morgon, Atilli</span>
      <div className={styles.right}>
        <span className={styles.dateBadge}>{today}</span>
        <div className={styles.avatar} title={email}>{initials}</div>
      </div>
    </div>
  )
}