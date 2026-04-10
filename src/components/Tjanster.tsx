import styles from './Tjanster.module.css'

const tjanster = [
  {
    nr: '01',
    namn: 'Klippning',
    tag: 'The Classic',
    desc: 'Precision och personlighet i varje klipp. Vi lyssnar på dig — och på håret. Alltid konsultation innan saxen sätts igång.',
    pris: 'från 650 kr',
    tid: '45–75 min',
  },
  {
    nr: '02',
    namn: 'Färgning',
    tag: 'The Craft',
    desc: 'Balayage, slingor, heltäckande färg eller toning. Vi väljer teknik efter ditt hår, ditt liv och din stil.',
    pris: 'från 1 200 kr',
    tid: '90–180 min',
  },
  {
    nr: '03',
    namn: 'Behandling',
    tag: 'The Cure',
    desc: 'Keratin, djupvård och återfuktning. Hår som mår bra syns — och känns. Vi använder enbart premiumserier.',
    pris: 'från 450 kr',
    tid: '30–60 min',
  },
  {
    nr: '04',
    namn: 'Brud & fest',
    tag: 'The Moment',
    desc: 'Uppsättning, lockar och finish för din stora dag. Provfrisyr ingår alltid — inga överraskningar på dagen.',
    pris: 'från 900 kr',
    tid: '60–120 min',
  },
]

export default function Tjanster() {
  return (
    <section className={styles.section} id="tjanster">

      <div className={styles.headerWrap}>
        <div className={styles.headerLeft}>
          <p className={styles.eyebrow}>— Vad vi gör</p>
          <h2 className={styles.title}>
            Hantverk du<br /><em>känner på dig.</em>
          </h2>
        </div>
        <div className={styles.headerRight}>
          <p className={styles.manifesto}>
            Vi är inte billigast.<br />
            Vi är bäst — och det märks.
          </p>
          <a href="/boka" className={styles.headerCta}>Boka din tid →</a>
        </div>
      </div>

      <div className={styles.grid}>
        {tjanster.map((t, i) => (
          <a href="/boka" key={t.nr} className={styles.card}>
            <div className={styles.cardInner}>
              <div className={styles.cardTop}>
                <span className={styles.nr}>{t.nr}</span>
                <span className={styles.tag}>{t.tag}</span>
              </div>

              <div className={styles.cardMid}>
                <h3 className={styles.namn}>{t.namn}</h3>
                <p className={styles.desc}>{t.desc}</p>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.meta}>
                  <span className={styles.pris}>{t.pris}</span>
                  <span className={styles.tid}>{t.tid}</span>
                </div>
                <div className={styles.arrow}>→</div>
              </div>
            </div>

            <div className={styles.cardOverlay} />
          </a>
        ))}
      </div>

      <div className={styles.stripe}>
        {Array(6).fill('ATILLI BERG · GÖTEBORG · SEDAN 2022 · ').map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>

    </section>
  )
}
