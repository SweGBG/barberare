'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import styles from './tjanster.module.css'

type Service = {
  id: string
  name: string
  duration_minutes: number
  price: number
  created_at: string
}

const emptyForm = { name: '', duration_minutes: 30, price: 0 }

export default function TjansterPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchServices()
  }, [])

  async function fetchServices() {
    setLoading(true)
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('price', { ascending: true })
    setServices(data ?? [])
    setLoading(false)
  }

  function openNew() {
    setEditing(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(service: Service) {
    setEditing(service)
    setForm({
      name: service.name,
      duration_minutes: service.duration_minutes,
      price: service.price,
    })
    setShowModal(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    if (editing) {
      await supabase
        .from('services')
        .update(form)
        .eq('id', editing.id)
    } else {
      await supabase
        .from('services')
        .insert(form)
    }

    setSaving(false)
    setShowModal(false)
    fetchServices()
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    await supabase.from('services').delete().eq('id', id)
    setDeleting(null)
    fetchServices()
  }

  const totalRevenuePotential = services.reduce((sum, s) => sum + s.price, 0)

  return (
    <AdminLayout>
      <div className={styles.page}>

        {/* HEADER */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Tjänster & Priser</h1>
            <p className={styles.sub}>{services.length} tjänster</p>
          </div>
          <button className={styles.newBtn} onClick={openNew}>
            + Ny tjänst
          </button>
        </div>

        {/* STATS */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Antal tjänster</p>
            <p className={styles.statValue}>{services.length}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Lägsta pris</p>
            <p className={styles.statValue}>
              {services.length > 0 ? `${Math.min(...services.map(s => s.price))} kr` : '–'}
            </p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Högsta pris</p>
            <p className={styles.statValue}>
              {services.length > 0 ? `${Math.max(...services.map(s => s.price))} kr` : '–'}
            </p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Snitt pris</p>
            <p className={styles.statValue}>
              {services.length > 0
                ? `${Math.round(services.reduce((s, v) => s + v.price, 0) / services.length)} kr`
                : '–'}
            </p>
          </div>
        </div>

        {/* TJÄNSTER GRID */}
        {loading ? (
          <div className={styles.empty}>Laddar...</div>
        ) : services.length === 0 ? (
          <div className={styles.empty}>Inga tjänster än — lägg till din första!</div>
        ) : (
          <div className={styles.grid}>
            {services.map(service => (
              <div key={service.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.cardIcon}>
                    <i className="ti ti-scissors" aria-hidden="true" />
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => openEdit(service)}
                    >
                      <i className="ti ti-edit" aria-hidden="true" />
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(service.id)}
                      disabled={deleting === service.id}
                    >
                      <i className="ti ti-trash" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <h3 className={styles.cardName}>{service.name}</h3>

                <div className={styles.cardMeta}>
                  <span className={styles.duration}>
                    <i className="ti ti-clock" aria-hidden="true" />
                    {service.duration_minutes} min
                  </span>
                </div>

                <div className={styles.cardPrice}>
                  {service.price.toLocaleString('sv-SE')} kr
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PRISLISTA PREVIEW */}
        {services.length > 0 && (
          <div className={styles.priceList}>
            <div className={styles.priceListHeader}>
              <span className={styles.panelTitle}>Prislista — förhandsvisning</span>
              <span className={styles.previewNote}>Så här ser kunderna det</span>
            </div>
            {services.map(service => (
              <div key={service.id} className={styles.priceRow}>
                <div>
                  <span className={styles.priceName}>{service.name}</span>
                  <span className={styles.priceDur}>{service.duration_minutes} min</span>
                </div>
                <span className={styles.priceAmount}>{service.price.toLocaleString('sv-SE')} kr</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editing ? 'Redigera tjänst' : 'Ny tjänst'}
              </h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSave} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Tjänstnamn *</label>
                <input
                  className={styles.input}
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="t.ex. Klippning + Skägg"
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Varaktighet (min) *</label>
                  <input
                    className={styles.input}
                    type="number"
                    min="5"
                    step="5"
                    value={form.duration_minutes}
                    onChange={e => setForm({ ...form, duration_minutes: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Pris (kr) *</label>
                  <input
                    className={styles.input}
                    type="number"
                    min="0"
                    step="50"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowModal(false)}
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={saving}
                >
                  {saving ? 'Sparar...' : editing ? 'Spara ändringar' : 'Skapa tjänst'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}