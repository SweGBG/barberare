import { createClient } from '@/lib/supabase/server'
import styles from './Tjanster.module.css'


interface Service {
  id: string
  name: string
  price: number
  duration_minutes: number
}

/* Fallback om databasen inte kan nås — samma tjänster som i Supabase */
const fallback: Service[] = [
  { id: 'f1', name: 'Klippning', price: 350, duration_minutes: 45 },
  { id: 'f2', name: 'Skäggtrim', price: 250, duration_minutes: 30 },
  { id: 'f3', name: 'Rakning', price: 400, duration_minutes: 45 },
  { id: 'f4', name: 'Styling', price: 200, duration_minutes: 20 },
]

const beskrivningar: Record<string, string> = {
  klipp: 'Klassisk herrklippning anpassad efter din stil och önskemål.',
  skägg: 'Skäggtrimning och formning för en perfekt look.',
  rak: 'Klassisk rakning med kniv och varma handdukar.',
  styl: 'Tvätt, styling och rådgivning för rätt produkter.',
  färg: 'Färg och toning utförd med precision och känsla.',
  barn: 'Klippning för de yngsta — med tålamod och omtanke.',
}

const bilder: Record<string, string> = {
  klipp: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
  skägg: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80',
  rak: 'https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=800&q=80',
  styl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80',
}

function matcha<T>(namn: string, karta: Record<string, T>): T | undefined {
  const n = namn.toLowerCase()
  const nyckel = Object.keys(karta).find((k) => n.includes(k))
  return nyckel ? karta[nyckel] : undefined
}

async function hamtaTjanster(): Promise<Service[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('services')
      .select('id, name, price, duration_minutes')
      .order('price', { ascending: false })

    if (error || !data || data.length === 0) return fallback
    return data
  } catch {
    return fallback
  }
}

export default async function Tjanster() {
  const tjanster = await hamtaTjanster()

  return (
    <section className={styles.section} id="tjanster">

      <div className={styles.header}>
        <h2 className={styles.title}>Våra tjänster</h2>
        <Flourish />
      </div>

      <div className={styles.grid}>
        {tjanster.slice(0, 4).map((t) => {
          const bild = matcha(t.name, bilder) ?? bilder.klipp
          const desc =
            matcha(t.name, beskrivningar) ??
            'Utförd med precision, omsorg och premiumprodukter.'

          return (
            <article key={t.id} className={styles.card}>
              <div className={styles.imgWrap}>
                <img src={bild} alt={t.name} loading="lazy" />
                <div className={styles.imgTint} />
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.cardName}>{t.name}</h3>
                <p className={styles.cardDesc}>{desc}</p>
                <p className={styles.cardPris}>
                  fr. {t.price} kr
                  <span className={styles.cardTid}> · {t.duration_minutes} min</span>
                </p>
                <a href="/boka" className={styles.cardBtn}>Boka tid</a>
              </div>
            </article>
          )
        })}
      </div>

      <div className={styles.more}>
        <a href="/boka" className={styles.moreBtn}>Se alla tjänster</a>
      </div>
    </section>
  )
}

function Flourish() {
  return (
    <svg className={styles.flourish} width="220" height="26" viewBox="0 0 220 26" fill="none" aria-hidden="true">
      <line x1="0" y1="13" x2="86" y2="13" stroke="rgba(201,162,75,0.5)" strokeWidth="0.7" />
      <line x1="134" y1="13" x2="220" y2="13" stroke="rgba(201,162,75,0.5)" strokeWidth="0.7" />
      <path d="M96 13c4-6 10-6 14 0-4 6-10 6-14 0Z" stroke="#C9A24B" strokeWidth="0.8" fill="none" />
      <circle cx="103" cy="13" r="1.6" fill="#C9A24B" />
      <path d="M86 13c3 0 5-3 5-3M86 13c3 0 5 3 5 3M134 13c-3 0-5-3-5-3M134 13c-3 0-5 3-5 3"
        stroke="rgba(201,162,75,0.7)" strokeWidth="0.7" />
    </svg>
  )
}
