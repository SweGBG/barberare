import styles from './Mellanrum.module.css'

export default function Mellanrum() {
  return (
    <section className={styles.wrap}>
      <div className={styles.bg} />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <span className={styles.line} />
        <p className={styles.citat}>
          Varje klipp är ett <em>löfte</em>.
        </p>
        <span className={styles.line} />
      </div>
    </section>
  )
}
