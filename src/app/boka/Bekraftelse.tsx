'use client'

import { useLang } from '@/lib/LangContext'
import { t } from '@/lib/translations'
import type { Bokning } from './types'
import styles from './boka-components.module.css'

interface Props {
  bokning: Bokning
}

export default function Bekraftelse({ bokning }: Props) {
  const { lang } = useLang()
  const tr = t[lang].boka
  const manader = tr.manader
  const { tjanst, datum, tid, namn } = bokning

  return (
    <div className={styles.bekWrap}>

      <div className={styles.bekLeft}>
        <div className={styles.bekIconWrap}>
          <div className={styles.bekIconRing} />
          <div className={styles.bekIconRing2} />
          <span className={styles.bekIconCheck}>✓</span>
        </div>

        <p className={styles.bekEyebrow}>{tr.bekEyebrow}</p>
        <h2 className={styles.bekTitel}>
          {tr.bekTitel1}<br /><em>{namn}.</em>
        </h2>

        <p className={styles.bekIngress}>{tr.bekIngress}</p>

        <a href="/" className={styles.bekHem}>{tr.bekHem}</a>
      </div>

      <div className={styles.bekRight}>
        <div className={styles.kvitto}>
          <div className={styles.kvittoTop}>
            <p className={styles.kvittoLabel}>{tr.bekDetaljer}</p>
            <div className={styles.kvittoDivider} />
          </div>

          <div className={styles.kvittoRader}>
            <div className={styles.kvittoRad}>
              <span className={styles.kvittoNyckel}>{tr.tjanst}</span>
              <span className={styles.kvittoVarde}>{tjanst?.namn}</span>
            </div>
            <div className={styles.kvittoRad}>
              <span className={styles.kvittoNyckel}>{tr.datum}</span>
              <span className={styles.kvittoVarde}>
                {datum?.dag} {datum !== null ? manader[datum.manad] : ''} {datum?.ar}
              </span>
            </div>
            <div className={styles.kvittoRad}>
              <span className={styles.kvittoNyckel}>{tr.tid}</span>
              <span className={styles.kvittoVarde}>{tid}</span>
            </div>
            <div className={styles.kvittoRad}>
              <span className={styles.kvittoNyckel}>{tr.bekLangd}</span>
              <span className={styles.kvittoVarde}>{tjanst?.tid}</span>
            </div>
          </div>

          <div className={styles.kvittoFooter}>
            <span className={styles.kvittoTotaltLabel}>{tr.totalt}</span>
            <span className={styles.kvittoTotalt}>{tjanst?.pris}</span>
          </div>

          <div className={styles.kvittoStamp}>
            <div className={styles.stampRing}>
              <span>ATILLI</span>
              <span className={styles.stampSub}>BERG · GBG</span>
            </div>
          </div>
        </div>

        <p className={styles.bekObs}>{tr.bekObs}</p>
      </div>

    </div>
  )
}