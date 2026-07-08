import type { Bokning } from './types'
import styles from './boka-components.module.css'

const manader = [
  'Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
  'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December',
]

interface Props {
  bokning: Bokning
}

export default function Bekraftelse({ bokning }: Props) {
  const { tjanst, datum, tid, namn } = bokning

  return (
    <div className={styles.bekWrap}>

      <div className={styles.bekLeft}>
        <div className={styles.bekIconWrap}>
          <div className={styles.bekIconRing} />
          <div className={styles.bekIconRing2} />
          <span className={styles.bekIconCheck}>✓</span>
        </div>

        <p className={styles.bekEyebrow}>— Bekräftat</p>
        <h2 className={styles.bekTitel}>
          Vi ses,<br /><em>{namn}.</em>
        </h2>

        <p className={styles.bekIngress}>
          Din bokning är registrerad. En bekräftelse
          landar i din inbox inom några minuter.
        </p>

        <a href="/" className={styles.bekHem}>← Tillbaka till startsidan</a>
      </div>

      <div className={styles.bekRight}>
        <div className={styles.kvitto}>
          <div className={styles.kvittoTop}>
            <p className={styles.kvittoLabel}>Bokningsdetaljer</p>
            <div className={styles.kvittoDivider} />
          </div>

          <div className={styles.kvittoRader}>
            <div className={styles.kvittoRad}>
              <span className={styles.kvittoNyckel}>Tjänst</span>
              <span className={styles.kvittoVarde}>{tjanst?.namn}</span>
            </div>
            <div className={styles.kvittoRad}>
              <span className={styles.kvittoNyckel}>Datum</span>
              <span className={styles.kvittoVarde}>
                {datum?.dag} {datum !== null ? manader[datum.manad] : ''} {datum?.ar}
              </span>
            </div>
            <div className={styles.kvittoRad}>
              <span className={styles.kvittoNyckel}>Tid</span>
              <span className={styles.kvittoVarde}>{tid}</span>
            </div>
            <div className={styles.kvittoRad}>
              <span className={styles.kvittoNyckel}>Längd</span>
              <span className={styles.kvittoVarde}>{tjanst?.tid}</span>
            </div>
          </div>

          <div className={styles.kvittoFooter}>
            <span className={styles.kvittoTotaltLabel}>Totalt</span>
            <span className={styles.kvittoTotalt}>{tjanst?.pris}</span>
          </div>

          <div className={styles.kvittoStamp}>
            <div className={styles.stampRing}>
              <span>ATILLI</span>
              <span className={styles.stampSub}>BERG · GBG</span>
            </div>
          </div>
        </div>

        <p className={styles.bekObs}>
          Inga förskottsbetalningar. Betala i salongen efter besöket.
        </p>
      </div>

    </div>
  )
}