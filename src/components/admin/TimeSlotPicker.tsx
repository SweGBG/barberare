'use client'

import styles from './TimeSlotPicker.module.css'

type Props = {
  /** Valt klockslag, t.ex. "14:30" (tom sträng = inget valt) */
  value: string
  /** Anropas med nytt klockslag när en slot klickas */
  onChange: (time: string) => void
  /** Öppningstid, t.ex. "09:00" */
  open?: string
  /** Stängningstid, t.ex. "18:00" */
  close?: string
  /** Intervall i minuter mellan slots */
  stepMin?: number
  /** Redan bokade klockslag som ska gråas ut, t.ex. ["10:00", "14:30"] */
  bookedTimes?: string[]
}

export default function TimeSlotPicker({
  value,
  onChange,
  open = '09:00',
  close = '18:00',
  stepMin = 15,
  bookedTimes = [],
}: Props) {
  // Generera slots från öppning till stängning
  const slots: string[] = []
  const [oh, om] = open.split(':').map(Number)
  const [ch, cm] = close.split(':').map(Number)

  for (let t = oh * 60 + om; t < ch * 60 + cm; t += stepMin) {
    const h = String(Math.floor(t / 60)).padStart(2, '0')
    const m = String(t % 60).padStart(2, '0')
    slots.push(`${h}:${m}`)
  }

  if (slots.length === 0) {
    return <p className={styles.empty}>Inga tillgängliga tider.</p>
  }

  return (
    <div className={styles.grid} role="listbox" aria-label="Välj tid">
      {slots.map(slot => {
        const booked = bookedTimes.includes(slot)
        const active = value === slot
        return (
          <button
            key={slot}
            type="button"
            role="option"
            aria-selected={active}
            disabled={booked}
            title={booked ? 'Upptagen' : undefined}
            className={`${styles.slot} ${active ? styles.slotActive : ''}`}
            onClick={() => onChange(slot)}
          >
            {slot}
          </button>
        )
      })}
    </div>
  )
}
