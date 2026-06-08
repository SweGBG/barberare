'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Tjanst } from './types'
import styles from './boka-components.module.css'

interface Props {
  vald: Tjanst | null
  onValj: (t: Tjanst) => void
  onNasta: () => void
}

export default function TjanstVal({ vald, onValj, onNasta }: Props) {
  const [tjanster, setTjanster] = useState<Tjanst[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTjanster = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('services')
        .select('id, name, price, duration_minutes')
        .order('price', { ascending: true })

      if (!error && data) {
        const mapped: Tjanst[] = data.map(s => ({
          id: s.id,
          namn: s.name,
          tid: `${s.duration_minutes} min`,
          pris: `${s.price.toLocaleString('sv-SE')} kr`,
          duration_minutes: s.duration_minutes,
          price: s.price,
        }))
        setTjanster(mapped)
      }
      setLoading(false)
    }

    fetchTjanster()
  }, [])

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Laddar tjänster...</p>
      </div>
    )
  }

  return (
    <div>
      <p className={styles.sektionsTitel}>Välj tjänst</p>
      <div className={styles.tjanstGrid}>
        {tjanster.map((t) => (
          <div
            key={t.id}
            className={`${styles.tjanstKort} ${vald?.id === t.id ? styles.vald : ''}`}
            onClick={() => onValj(t)}
          >
            <div>
              <p className={styles.tjanstNamn}>{t.namn}</p>
              <p className={styles.tjanstTid}>{t.tid}</p>
            </div>
            <p className={styles.tjanstPris}>{t.pris}</p>
          </div>
        ))}
      </div>
      <div className={styles.knappar}>
        <span />
        <button className={styles.knappPrimar} onClick={onNasta} disabled={!vald}>
          Välj datum →
        </button>
      </div>
    </div>
  )
}