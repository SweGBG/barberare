import styles from './Om.module.css'

interface PrisRad {
  namn: string
  pris: string
}

interface PrisKategori {
  kategori: string
  rader: PrisRad[]
}

const priser: PrisKategori[] = [
  {
    kategori: 'Klippning',
    rader: [
      { namn: 'Herrklippning', pris: 'fr. 350 kr' },
      { namn: 'Klippning + skäggtrim', pris: 'fr. 550 kr' },
      { namn: 'Barnklippning (under 12)', pris: 'fr. 250 kr' },
      { namn: 'Konsultation', pris: 'Kostnadsfri' },
    ],
  },
  {
    kategori: 'Skägg & rakning',
    rader: [
      { namn: 'Skäggtrim', pris: 'fr. 250 kr' },
      { namn: 'Klassisk rakning med kniv', pris: 'fr. 400 kr' },
      { namn: 'Skäggformning & vård', pris: 'fr. 300 kr' },
      { namn: 'Varma handdukar', pris: 'Ingår alltid' },
    ],
  },
  {
    kategori: 'Styling & vård',
    rader: [
      { namn: 'Tvätt & styling', pris: 'fr. 200 kr' },
      { namn: 'Produktrådgivning', pris: 'Kostnadsfri' },
      { namn: 'Hårvårdsbehandling', pris: 'fr. 300 kr' },
      { namn: 'Brud & fest', pris: 'fr. 600 kr' },
    ],
  },
]

export default function Om() {
  return (
    <>
      {/* ── Om Atilli Berg ── */}
      <section className={styles.om} id="om">
        <div className={styles.omImageWrap}>
          <div className={styles.omFrame} aria-hidden="true" />
          <img
            src="/hero-bg2.jpg"
            alt="Barberarens verktyg hos Atilli Berg"
            className={styles.omImage}
            loading="lazy"
          />
        </div>

        <div className={styles.omText}>
          <h2 className={styles.omTitle}>Om Atilli Berg</h2>

          <p className={styles.omLead}>
            <strong>Atilli Berg</strong> är mer än bara en frisörsalong — det är
            en plats där tradition möter passion. Vi grundades med målet att
            erbjuda kvalitativ hårvård och en upplevelse utöver det vanliga.
          </p>
          <p className={styles.omBody}>
            Hos oss står kunden i fokus och vi strävar alltid efter att leverera
            resultat som överträffar dina förväntningar. Vi tar oss tid för
            varje gäst, konsulterar innan vi klipper, och ser till att du lämnar
            salongen med ett resultat — inte bara en frisyr.
          </p>

          <div className={styles.omStats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>10+</span>
              <span className={styles.statLabel}>År i branschen</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>4</span>
              <span className={styles.statLabel}>Erfarna barberare</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>4.9</span>
              <span className={styles.statLabel}>Snittbetyg på Google</span>
            </div>
          </div>

          <a href="/kontakt" className={styles.omBtn}>Läs mer om oss</a>
        </div>
      </section>

      {/* ── Prislista ── */}
      <section className={styles.priser} id="priser">
        <div className={styles.priserHeader}>
          <h2 className={styles.priserTitle}>Prislista</h2>
          <p className={styles.priserSub}>Transparent — inga dolda avgifter.</p>
        </div>

        <div className={styles.priserGrid}>
          {priser.map((kat) => (
            <div key={kat.kategori} className={styles.priserKat}>
              <h3 className={styles.katNamn}>{kat.kategori}</h3>
              {kat.rader.map((rad) => (
                <div key={rad.namn} className={styles.prisRad}>
                  <span className={styles.prisNamn}>{rad.namn}</span>
                  <span className={styles.prisDots} aria-hidden="true" />
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
