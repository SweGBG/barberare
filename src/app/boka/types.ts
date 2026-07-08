export interface Tjanst {
  id: string           // service_id för bookings-tabellen
  namn: string
  tid: string          // t.ex. "45 min"
  pris: string         // t.ex. "550 kr"
  duration_minutes: number
  price: number
}

export interface Datum {
  dag: number
  manad: number
  ar: number
}

export interface Bokning {
  tjanst: Tjanst | null
  datum: Datum | null
  tid: string | null
  namn: string
  efternamn: string
  email: string
  telefon: string
  meddelande: string
}