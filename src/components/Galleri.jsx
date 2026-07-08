import styles from './Galleri.module.css'

const bilder = [
  {
    id: 1,
    label: 'Klippning',
    span: 'wide',
    img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1000&q=80'
  },
  {
    id: 2,
    label: 'Rakning',
    span: 'tall',
    img: 'https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=800&q=80'
  },
  {
    id: 3,
    label: 'Skäggtrim',
    span: '',
    img: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80'
  },
  {
    id: 4,
    label: 'Styling',
    span: '',
    img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80'
  },
  {
    id: 5,
    label: 'Salongen',
    span: 'wide',
    img: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1000&q=80'
  },
]

export default function Galleri() {
  return (
    <section className={styles.section} id="galleri">
      <div className={styles.header}>
        <h2 className={styles.title}>Vårt arbete</h2>
        <p className={styles.sub}>Resultatet talar för sig självt.</p>
      </div>

      <div className={styles.grid}>
        {bilder.map((b) => (
          <div
            key={b.id}
            className={`${styles.item} ${b.span === 'wide' ? styles.wide : ''} ${b.span === 'tall' ? styles.tall : ''}`}
          >
            <img src={b.img} alt={b.label} loading="lazy" />
            <div className={styles.overlay}>
              <span className={styles.label}>{b.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
