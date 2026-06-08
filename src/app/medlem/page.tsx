'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Navbar from '@/components/Navbar';
import styles from './medlem.module.css';

// Matchar bookings-tabellens faktiska kolumner
interface Booking {
  id: string;
  user_id: string | null;
  service_id: string | null;
  booking_date: string;
  status: string;
  duration_minutes: number | null;
  price: number | null;
  notes: string | null;
  created_at: string;
  client_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  services?: { name: string } | null; // join med services-tabellen
}

const STATUS_LABELS: Record<string, string> = {
  confirmed: 'Bekräftad',
  pending: 'Väntar',
  in_progress: 'Pågår',
  completed: 'Genomförd',
  cancelled: 'Avbokad',
};

export default function MedlemPage() {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [cancelModal, setCancelModal] = useState<string | null>(null);

  const [profileData, setProfileData] = useState({
    client_name: '',
    client_phone: '',
    email: '',
  });

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => { checkUser(); }, []);

  /* ── AUTH ── */
  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) { router.push('/logga-in'); return; }
      setUser(user);
      await fetchBookings(user.email!, user.id);
    } catch (err) {
      console.error('Auth error:', err);
      router.push('/logga-in');
    } finally {
      setLoading(false);
    }
  };

  /* ── HÄMTA BOKNINGAR ──
     Söker på client_email ELLER user_id så det funkar oavsett hur bokningen skapades */
  const fetchBookings = async (email: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, services(name)')
        .or(`client_email.eq.${email},user_id.eq.${userId}`)
        .order('booking_date', { ascending: false });

      if (error) { console.error('Bookings fetch error:', error); return; }

      if (data && data.length > 0) {
        setBookings(data);
        const first = data[0];
        setProfileData({
          client_name: first.client_name ?? '',
          client_phone: first.client_phone ?? '',
          email,
        });
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  /* ── AVBOKA ── */
  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (!error) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
        setCancelModal(null);
      } else {
        console.error('Cancel error:', error);
      }
    } catch (err) {
      console.error('Cancel error:', err);
    }
  };

  /* ── UPPDATERA PROFIL ── */
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          client_name: profileData.client_name,
          client_phone: profileData.client_phone,
        })
        .eq('client_email', user.email);

      if (!error) {
        setShowProfile(false);
        await fetchBookings(user.email!, user.id);
      } else {
        console.error('Update profile error:', error);
      }
    } catch (err) {
      console.error('Profile update error:', err);
    }
  };

  /* ── LOGOUT ── */
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  /* ── HJÄLPFUNKTIONER ── */
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const manader = ['januari', 'februari', 'mars', 'april', 'maj', 'juni',
      'juli', 'augusti', 'september', 'oktober', 'november', 'december'];
    return `${date.getDate()} ${manader[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'confirmed': return styles.statusConfirmed;
      case 'cancelled': return styles.statusCancelled;
      case 'completed': return styles.statusCompleted;
      case 'pending': return styles.statusPending;
      case 'in_progress': return styles.statusInProgress;
      default: return '';
    }
  };

  const getServiceName = (b: Booking) =>
    (b.services as any)?.[0]?.name ?? (b.services as any)?.name ?? '–';

  /* ── STATISTIK ── */
  const calculateStats = () => {
    const completed = bookings.filter(b => b.status === 'completed');
    const totalVisits = completed.length;
    const totalSpent = completed.reduce((sum, b) => sum + (b.price ?? 0), 0);

    const memberSince = bookings.length > 0
      ? new Date(bookings[bookings.length - 1].created_at)
      : new Date();

    const nextBooking = bookings.find(b => {
      return new Date(b.booking_date) >= new Date() &&
        (b.status === 'confirmed' || b.status === 'pending');
    });

    return { totalVisits, totalSpent, memberSince, nextBooking };
  };

  /* ── LOADING ── */
  if (loading) {
    return (
      <>
        <Navbar />
        <div className={styles.loadingContainer}>
          <div className={styles.loader} />
          <p>Laddar din profil...</p>
        </div>
      </>
    );
  }

  /* ── FILTRERA ── */
  const kommande = bookings.filter(b => {
    return new Date(b.booking_date) >= new Date() &&
      b.status !== 'cancelled';
  });

  const tidigare = bookings.filter(b => {
    return new Date(b.booking_date) < new Date() ||
      b.status === 'cancelled';
  });

  const stats = calculateStats();

  /* ── RENDER ── */
  return (
    <>
      <Navbar />

      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div>
              <p className={styles.eyebrow}>Välkommen tillbaka</p>
              <h1 className={styles.title}>
                {profileData.client_name || user?.email?.split('@')[0]}
              </h1>
            </div>
            <div className={styles.headerActions}>
              <button onClick={() => setShowProfile(true)} className={styles.profileBtn}>
                Redigera profil
              </button>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logga ut
              </button>
            </div>
          </div>
        </div>

        <div className={styles.content}>

          {/* STATS */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Totalt besök</p>
              <p className={styles.statValue}>{stats.totalVisits}</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Totalt spenderat</p>
              <p className={styles.statValue}>{stats.totalSpent.toLocaleString('sv-SE')} kr</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Medlem sedan</p>
              <p className={styles.statValue}>
                {stats.memberSince.toLocaleDateString('sv-SE', { month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Nästa besök</p>
              <p className={styles.statValue}>
                {stats.nextBooking
                  ? `${new Date(stats.nextBooking.booking_date).getDate()}/${new Date(stats.nextBooking.booking_date).getMonth() + 1}`
                  : 'Ingen bokning'}
              </p>
            </div>
          </div>

          {/* KOMMANDE BOKNINGAR */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Kommande bokningar</h2>
              <a href="/boka" className={styles.bookBtn}>Boka ny tid</a>
            </div>

            {kommande.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyIcon}>📅</p>
                <p className={styles.emptyTitle}>Inga kommande bokningar</p>
                <p className={styles.emptyText}>
                  Du har inga bokade tider just nu. Boka en tid för att komma igång!
                </p>
                <a href="/boka" className={styles.emptyBtn}>Boka tid</a>
              </div>
            ) : (
              <div className={styles.bookingGrid}>
                {kommande.map(b => (
                  <div key={b.id} className={styles.bookingCard}>
                    <div className={styles.bookingHeader}>
                      <h3 className={styles.bookingService}>{getServiceName(b)}</h3>
                      <span className={`${styles.status} ${getStatusClass(b.status)}`}>
                        {STATUS_LABELS[b.status] ?? b.status}
                      </span>
                    </div>
                    <div className={styles.bookingDetails}>
                      <div className={styles.detail}>
                        <span className={styles.detailLabel}>Datum</span>
                        <span className={styles.detailValue}>{formatDate(b.booking_date)}</span>
                      </div>
                      <div className={styles.detail}>
                        <span className={styles.detailLabel}>Tid</span>
                        <span className={styles.detailValue}>{formatTime(b.booking_date)}</span>
                      </div>
                      {b.duration_minutes && (
                        <div className={styles.detail}>
                          <span className={styles.detailLabel}>Varaktighet</span>
                          <span className={styles.detailValue}>{b.duration_minutes} min</span>
                        </div>
                      )}
                      <div className={styles.detail}>
                        <span className={styles.detailLabel}>Pris</span>
                        <span className={styles.detailPrice}>
                          {b.price ? `${b.price.toLocaleString('sv-SE')} kr` : '–'}
                        </span>
                      </div>
                    </div>
                    {b.status !== 'cancelled' && (
                      <button onClick={() => setCancelModal(b.id)} className={styles.cancelBtn}>
                        Avboka
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TIDIGARE BOKNINGAR */}
          {tidigare.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Tidigare bokningar</h2>
              <div className={styles.historyList}>
                {tidigare.map(b => (
                  <div key={b.id} className={styles.historyItem}>
                    <div className={styles.historyLeft}>
                      <p className={styles.historyService}>{getServiceName(b)}</p>
                      <p className={styles.historyDate}>
                        {formatDate(b.booking_date)} kl {formatTime(b.booking_date)}
                      </p>
                    </div>
                    <div className={styles.historyRight}>
                      <span className={styles.historyPrice}>
                        {b.price ? `${b.price.toLocaleString('sv-SE')} kr` : '–'}
                      </span>
                      <span className={`${styles.status} ${getStatusClass(b.status)}`}>
                        {STATUS_LABELS[b.status] ?? b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SNABBLÄNKAR */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Snabblänkar</h2>
            <div className={styles.quickLinks}>
              <a href="/boka" className={styles.quickLink}>
                <span className={styles.quickIcon}>📅</span>
                <span className={styles.quickText}>Boka ny tid</span>
              </a>
              <a href="/priser" className={styles.quickLink}>
                <span className={styles.quickIcon}>💰</span>
                <span className={styles.quickText}>Se prislista</span>
              </a>
              <a href="/kontakt" className={styles.quickLink}>
                <span className={styles.quickIcon}>📞</span>
                <span className={styles.quickText}>Kontakta oss</span>
              </a>
            </div>
          </div>
        </div>

        {/* MODAL – REDIGERA PROFIL */}
        {showProfile && (
          <div className={styles.modalOverlay} onClick={() => setShowProfile(false)}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Redigera profil</h2>
                <button onClick={() => setShowProfile(false)} className={styles.modalClose}>✕</button>
              </div>
              <form onSubmit={handleUpdateProfile} className={styles.modalForm}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Namn</label>
                  <input
                    type="text"
                    value={profileData.client_name}
                    onChange={e => setProfileData({ ...profileData, client_name: e.target.value })}
                    className={styles.formInput}
                    required
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Telefon</label>
                  <input
                    type="tel"
                    value={profileData.client_phone}
                    onChange={e => setProfileData({ ...profileData, client_phone: e.target.value })}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>E-post</label>
                  <input
                    type="email"
                    value={profileData.email}
                    className={styles.formInput}
                    disabled
                  />
                </div>
                <div className={styles.modalActions}>
                  <button type="button" onClick={() => setShowProfile(false)} className={styles.cancelModalBtn}>
                    Avbryt
                  </button>
                  <button type="submit" className={styles.saveBtn}>
                    Spara ändringar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL – AVBOKA BEKRÄFTELSE */}
        {cancelModal && (
          <div className={styles.modalOverlay} onClick={() => setCancelModal(null)}>
            <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
              <h3 className={styles.confirmTitle}>Avboka bokning?</h3>
              <p className={styles.confirmText}>
                Är du säker på att du vill avboka denna tid? Detta kan inte ångras.
              </p>
              <div className={styles.confirmActions}>
                <button onClick={() => setCancelModal(null)} className={styles.cancelModalBtn}>
                  Nej, behåll
                </button>
                <button onClick={() => handleCancelBooking(cancelModal)} className={styles.confirmBtn}>
                  Ja, avboka
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}