import { createClient } from '@/lib/supabase/server'
import TjansterClient from './TjansterClient'

export interface Service {
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

/* Server-komponent: hämtar data. Klient-barnet sköter språket. */
export default async function Tjanster() {
  const tjanster = await hamtaTjanster()
  return <TjansterClient tjanster={tjanster} />
}
