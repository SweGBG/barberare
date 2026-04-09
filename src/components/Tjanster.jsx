import styles from './Tjanster.module.css'

const tjanster = [
  {
    nr: '01',
    namn: 'Klippning',
    desc: 'Precision och personlighet i varje klipp. Vi lyssnar på dig — och på håret. Alltid konsultation innan saxen sätts igång.',
    pris: 'från 650 kr',
    tid: '45–75 min',
  },
  {
    nr: '02',
    namn: 'Färgning',
    desc: 'Balayage, slingor, heltäckande färg eller toning. Vi väljer teknik efter ditt hår, ditt liv och din stil.',
    pris: 'från 1 200 kr',
    tid: '90–180 min',
  },
  {
    nr: '03',
    namn: 'Behandling',
    desc: 'Keratin, djupvård och återfuktning. Hår som mår bra syns — och känns. Vi använder enbart premiumserier.',
    pris: 'från 450 kr',
    tid: '30–60 min',
  },
  {
    nr: '04',
    namn: 'Brud & fest',
    desc: 'Uppsättning, lockar och finish för din stora dag. Provfrisyr ingår alltid — inga överraskningar på dagen.',
    pris: 'från 900 kr',
    tid: '60–120 min',
  },
]

export default function Tjanster() {
  return (
    <section className={styles.section} id="tjanster">
      <div className={styles.header}>
        <p className={styles.eyebrow}>Vad vi gör</p>
        <h2 className={styles.title}>
          Hantverk du<br /><em>känner på dig.</em>
        </h2>
      </div>

      <div className={styles.grid}>
        {tjanster.map((t) => (
          <div key={t.nr} className={styles.card}>
            <div className={styles.cardTop}>
              <span className={styles.nr}>{t.nr}</span>
              <div className={styles.cardMeta}>
                <span className={styles.tid}>{t.tid}</span>
              </div>
            </div>
            <h3 className={styles.namn}>{t.namn}</h3>
            <p className={styles.desc}>{t.desc}</p>
            <div className={styles.cardFooter}>
              <span className={styles.pris}>{t.pris}</span>
              <a href="#boka" className={styles.bokabtn}>Boka →</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
