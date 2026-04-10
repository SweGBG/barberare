export interface Tjanst {
  namn: string
  tid: string
  pris: string
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
