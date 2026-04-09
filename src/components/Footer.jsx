import styles from './Footer.module.css'

const marqueeItems = [
  'Boka tid online', 'Premium salong', 'Est. 2012', 'Mån–Fre 09–19',
  'Lördag 10–17', 'Söndagar stängt', 'Boka tid online', 'Premium salong',
  'Est. 2012', 'Mån–Fre 09–19', 'Lördag 10–17', 'Söndagar stängt',
]

export default function FooterSection() {
  return (
    <>
      {/* MARQUEE */}
      <div className={styles.marqueeWrap}>
        <div className={styles.marqueeTrack}>
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className={styles.marqueeItem}>
              {item}
              <span className={styles.marqueeDot} />
            </span>
          ))}
        </div>
      </div>

      {/* BOKA */}
      <section className={styles.boka} id="boka">
        <div className={styles.bokaInner}>
          <p className={styles.eyebrow}>Boka din tid</p>
          <h2 className={styles.bokaTitle}>
            Redo för ett<br /><em>nytt kapitel?</em>
          </h2>
          <p className={styles.bokaSub}>
            Vi bokar via Bokadirekt — snabbt, enkelt och alltid bekräftat direkt.
            Välj din frisör, tid och tjänst på under en minut.
          </p>
          <a href="https://bokadirekt.se" target="_blank" rel="noopener noreferrer" className={styles.bokaBtn}>
            Öppna Bokadirekt
          </a>
          <p className={styles.bokaTel}>Eller ring oss: <a href="tel:031000000">031-00 00 00</a></p>
        </div>
        <div className={styles.bokaDecoWrap}>
          <div className={styles.bokaDeco}>
            <div className={styles.decoRing} />
            <div className={styles.decoRing2} />
            <div className={styles.decoCenter} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer} id="kontakt">
        <div className={styles.footerTop}>

          {/* LOGO */}
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <span className={styles.footerLogoMain}>Atilli</span>
              <span className={styles.footerLogoSub}>Berg</span>
            </div>
            <p className={styles.footerTagline}>
              Din salong. Din stad.<br />
              Hantverksskicklighet sedan år ett.
            </p>
          </div>

          {/* BESÖK */}
          <div className={styles.footerCol}>
            <h5 className={styles.colHead}>Hitta oss</h5>
            <p>Din gata 1</p>
            <p>Din stad</p>
            <p style={{ marginTop: '12px' }}>Mån–Fre: 09–19</p>
            <p>Lördag: 10–17</p>
            <p>Söndag: Stängt</p>
          </div>

          {/* KONTAKT */}
          <div className={styles.footerCol}>
            <h5 className={styles.colHead}>Kontakt</h5>
            <a href="tel:">Ditt telefonnummer</a>
            <a href="mailto:">Din e-post</a>
            <a href="#">Instagram @dinsalong</a>
          </div>

          {/* SNABBLÄNKAR */}
          <div className={styles.footerCol}>
            <h5 className={styles.colHead}>Navigera</h5>
            <a href="#tjanster">Tjänster</a>
            <a href="#galleri">Galleri</a>
            <a href="#priser">Prislista</a>
            <a href="#om">Om oss</a>
            <a href="#boka">Boka tid</a>
          </div>

        </div>

        <div className={styles.footerBottom}>
          <p>© 2026 Atilli Berg. Alla rättigheter förbehållna.</p>
          <p>Din stad, Sverige</p>
        </div>
      </footer>
    </>
  )
}