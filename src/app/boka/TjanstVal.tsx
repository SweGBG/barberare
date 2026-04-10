import type { Tjanst } from './types'
import styles from './boka-components.module.css'

const tjanster: Tjanst[] = [
  { namn: 'Herrklippning', tid: '45 min', pris: '550 kr' },
  { namn: 'Damklippning', tid: '60 min', pris: '750 kr' },
  { namn: 'Färgning', tid: '90 min', pris: '1 200 kr' },
  { namn: 'Balayage / Slingor', tid: '120 min', pris: '1 800 kr' },
  { namn: 'Skäggvård', tid: '30 min', pris: '350 kr' },
  { namn: 'Brudfrisyr', tid: '90 min', pris: '1 500 kr' },
]

interface Props {
  vald: Tjanst | null
  onValj: (t: Tjanst) => void
  onNasta: () => void
}

export default function TjanstVal({ vald, onValj, onNasta }: Props) {
  return (
    <div>
      <p className={styles.sektionsTitel}>Välj tjänst</p>
      <div className={styles.tjanstGrid}>
        {tjanster.map((t) => (
          <div
            key={t.namn}
            className={`${styles.tjanstKort} ${vald?.namn === t.namn ? styles.vald : ''}`}
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
