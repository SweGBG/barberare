import styles from './Galleri.module.css'

const bilder = [
  {
    id: 1,
    label: 'Balayage',
    span: 'wide',
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80'
  },
  {
    id: 2,
    label: 'Klippning',
    span: 'tall',
    img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80'
  },
  {
    id: 3,
    label: 'Slingor',
    span: '',
    img: 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=800&q=80'
  },
  {
    id: 4,
    label: 'Färgning',
    span: '',
    img: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80'
  },
  {
    id: 5,
    label: 'Brud & fest',
    span: 'wide',
    img: 'https://images.unsplash.com/photo-1519699696954-91a0e8bd2f56?w=800&q=80'
  },
]

export default function Galleri() {
  return (
    <section className={styles.section} id="galleri">
      <div className={styles.header}>
        <p className={styles.eyebrow}>Vårt arbete</p>
        <h2 className={styles.title}>
          Resultatet<br /><em>talar för sig.</em>
        </h2>
        <a href="#boka" className={styles.link}>Se mer på Instagram →</a>
      </div>

      <div className={styles.grid}>
        {bilder.map((b) => (
          <div
            key={b.id}
            className={`${styles.item} ${b.span === 'wide' ? styles.wide : ''} ${b.span === 'tall' ? styles.tall : ''}`}
            style={{
              backgroundImage: `url(${b.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className={styles.overlay}>
              <span className={styles.itemLabel}>{b.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}