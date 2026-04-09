import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>

      <div className={styles.dekoLeft}>
        <svg width="120" height="300" viewBox="0 0 120 300">
          <line x1="60" y1="0" x2="60" y2="300" stroke="#C4A99A" strokeWidth="0.5" />
          <line x1="20" y1="60" x2="100" y2="60" stroke="#C4A99A" strokeWidth="0.5" />
          <line x1="20" y1="240" x2="100" y2="240" stroke="#C4A99A" strokeWidth="0.5" />
          <circle cx="60" cy="60" r="20" fill="none" stroke="#B8956A" strokeWidth="0.5" />
          <circle cx="60" cy="150" r="35" fill="none" stroke="#C4A99A" strokeWidth="0.5" strokeDasharray="3 5" />
          <circle cx="60" cy="240" r="20" fill="none" stroke="#B8956A" strokeWidth="0.5" />
          <circle cx="60" cy="150" r="4" fill="#B8956A" opacity="0.4" />
        </svg>
      </div>

      <div className={styles.dekoRight}>
        <svg width="120" height="300" viewBox="0 0 120 300">
          <line x1="60" y1="0" x2="60" y2="300" stroke="#C4A99A" strokeWidth="0.5" />
          <line x1="20" y1="60" x2="100" y2="60" stroke="#C4A99A" strokeWidth="0.5" />
          <line x1="20" y1="240" x2="100" y2="240" stroke="#C4A99A" strokeWidth="0.5" />
          <circle cx="60" cy="60" r="20" fill="none" stroke="#B8956A" strokeWidth="0.5" />
          <circle cx="60" cy="150" r="35" fill="none" stroke="#C4A99A" strokeWidth="0.5" strokeDasharray="3 5" />
          <circle cx="60" cy="240" r="20" fill="none" stroke="#B8956A" strokeWidth="0.5" />
          <circle cx="60" cy="150" r="4" fill="#B8956A" opacity="0.4" />
        </svg>
      </div>

      {/* MAIN CONTENT */}
      ...




      {/* MAIN CONTENT */}
      <div className={styles.content}>
        <p className={`${styles.eyebrow} anim-1`}>Exklusiv salong · Est. 2022</p>

        <h1 className={`${styles.title} anim-2`}>
          Håret är<br />
          ditt <em>första</em><br />
          intryck.
        </h1>

        <div className={`${styles.dividerWrap} anim-3`}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerDot} />
          <span className={styles.dividerLine} />
        </div>

        <p className={`${styles.sub} anim-3`}>
          Vi klipper, färgar och formar med precision och känsla.
          Varje besök är en upplevelse — varje resultat, ett hantverk.
        </p>

        <div className={`${styles.btns} anim-4`}>
          <a href="#boka" className={styles.btnPrimary}>Boka din tid</a>
          <a href="#tjanster" className={styles.btnGhost}>Se tjänster</a>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div className={`${styles.scroll} anim-5`}>
        <span className={styles.scrollLine} />
        <span className={styles.scrollText}>Scrolla</span>
      </div>
    </section>
  )
}
