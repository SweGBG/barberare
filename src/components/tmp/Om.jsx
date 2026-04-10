import styles from './Om.module.css'

const priser = [
  {
    kategori: 'Klippning', rader: [
      { namn: 'Herrklippning', pris: '650 kr' },
      { namn: 'Damklippning', pris: '750 kr' },
      { namn: 'Barnklippning (under 12)', pris: '450 kr' },
      { namn: 'Konsultation', pris: 'Kostnadsfri' },
    ]
  },
  {
    kategori: 'Färg & teknik', rader: [
      { namn: 'Heltäckande färg', pris: 'från 1 200 kr' },
      { namn: 'Balayage / slingor', pris: 'från 1 600 kr' },
      { namn: 'Toning', pris: 'från 650 kr' },
      { namn: 'Färg + klippning', pris: 'från 1 800 kr' },
    ]
  },
  {
    kategori: 'Behandlingar', rader: [
      { namn: 'Keratin', pris: 'från 1 400 kr' },
      { namn: 'Djupvård', pris: 'från 450 kr' },
      { namn: 'Brud & fest', pris: 'från 900 kr' },
      { namn: 'Provfrisyr', pris: 'från 600 kr' },
    ]
  },
]

export default function Om() {
  return (
    <>
      {/* OM OSS */}
      <section className={styles.om} id="om">
        <div className={styles.omLeft}>
          <p className={styles.eyebrow}>Om oss</p>
          <h2 className={styles.omTitle}>
            Salongen som<br />
            alltid<br />
            <em>bryr sig.</em>
          </h2>
        </div>
        <div className={styles.omRight}>
          <p className={styles.omLead}>
            Vi öppnade med en enkel övertygelse — att en bra frisör
            förändrar hur du mår om dig själv.
          </p>
          <p className={styles.omBody}>
            Vi är inte en kedja. Vi är frisörer som valt att satsa på
            hantverket, inte volymen. Vi tar oss tid för varje gäst,
            konsulterar innan vi klipper, och ser till att du lämnar
            salongen med ett resultat — inte bara en frisyr.
          </p>
          <div className={styles.omStats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>10+</span>
              <span className={styles.statLabel}>År i branschen</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>4</span>
              <span className={styles.statLabel}>Erfarna frisörer</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>4.9</span>
              <span className={styles.statLabel}>Snittbetyg på Google</span>
            </div>
          </div>
        </div>
      </section>

      {/* PRISER */}
      <section className={styles.priser} id="priser">
        <div className={styles.priserHeader}>
          <p className={styles.eyebrow}>Prislista</p>
          <h2 className={styles.priserTitle}>
            Transparent.<br /><em>Inga dolda avgifter.</em>
          </h2>
        </div>
        <div className={styles.priserGrid}>
          {priser.map((kat) => (
            <div key={kat.kategori} className={styles.priserKat}>
              <h3 className={styles.katNamn}>{kat.kategori}</h3>
              {kat.rader.map((rad) => (
                <div key={rad.namn} className={styles.prisRad}>
                  <span className={styles.prisNamn}>{rad.namn}</span>
                  <span className={styles.prisPris}>{rad.pris}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className={styles.prisNote}>
          * Exakta priser sätts alltid vid konsultation — vi tar aldrig betalt för mer än vi levererar.
        </p>
      </section>
    </>
  )
}