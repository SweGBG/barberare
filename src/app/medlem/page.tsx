'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Navbar from '@/components/Navbar';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/translations';
import styles from './medlem.module.css';

interface Booking {
  id: string; user_id: string | null; service_id: string | null;
  booking_date: string; status: string; duration_minutes: number | null;
  price: number | null; notes: string | null; created_at: string;
  client_name: string | null; client_email: string | null; client_phone: string | null;
  services?: { name: string } | null;
}

export default function MedlemPage() {
  const { lang } = useLang();
  const tr = t[lang].medlem;
  const STATUS_LABELS = tr.status;
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [cancelModal, setCancelModal] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({ client_name: '', client_phone: '', email: '' });

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => { checkUser(); }, []);

  const checkUser = async () => {
    try {
      // Steg 1: Försök med getSession (snabb, lokal)
      const { data: { session } } = await supabase.auth.getSession();

      // Steg 2: Om session finns, använd den
      if (session?.user) {
        setUser(session.user);
        await fetchBookings(session.user.email!, session.user.id);
        setLoading(false);
        return;
      }

      // Steg 3: Ingen session — försök refresha token (fixar Vercel-miljö)
      const { data: { user: refreshedUser }, error } = await supabase.auth.getUser();

      if (error || !refreshedUser) {
        router.push('/logga-in');
        return;
      }

      setUser(refreshedUser);
      await fetchBookings(refreshedUser.email!, refreshedUser.id);
      setLoading(false);

    } catch (err) {
      console.error('Auth error:', err);
      router.push('/logga-in');
    }
  };

  const fetchBookings = async (email: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, services(name)')
        .or(`client_email.eq.${email},user_id.eq.${userId}`)
        .order('booking_date', { ascending: false });

      if (error) { console.error('Bookings error:', error); setBookings([]); return; }

      if (data && data.length > 0) {
        setBookings(data);
        const first = data[0];
        setProfileData({ client_name: first.client_name ?? '', client_phone: first.client_phone ?? '', email });
      } else {
        setBookings([]);
        setProfileData(prev => ({ ...prev, email }));
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setBookings([]);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId);
    if (!error) { setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b)); setCancelModal(null); }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('bookings')
      .update({ client_name: profileData.client_name, client_phone: profileData.client_phone })
      .eq('client_email', user.email);
    if (!error) { setShowProfile(false); await fetchBookings(user.email!, user.id); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const formatDate = (d: string) => {
    const dt = new Date(d);
    return `${dt.getDate()} ${tr.manader[dt.getMonth()]} ${dt.getFullYear()}`;
  };
  const formatTime = (d: string) => new Date(d).toLocaleTimeString(lang === 'sv' ? 'sv-SE' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
  const getStatusClass = (s: string) => ({ confirmed: styles.statusConfirmed, cancelled: styles.statusCancelled, completed: styles.statusCompleted, pending: styles.statusPending, in_progress: styles.statusInProgress }[s] ?? '');
  const getServiceName = (b: Booking) => (b.services as any)?.[0]?.name ?? (b.services as any)?.name ?? '–';

  const calcStats = () => {
    const done = bookings.filter(b => b.status === 'completed');
    const next = bookings.find(b => new Date(b.booking_date) >= new Date() && (b.status === 'confirmed' || b.status === 'pending'));
    return {
      totalVisits: done.length,
      totalSpent: done.reduce((s, b) => s + (b.price ?? 0), 0),
      memberSince: bookings.length > 0 ? new Date(bookings[bookings.length - 1].created_at) : new Date(),
      nextBooking: next,
    };
  };

  if (loading) return (
    <><Navbar />
    <div className={styles.loadingContainer}>
      <div className={styles.loader} />
      <p>{tr.laddarProfil}</p>
    </div></>
  );

  const kommande = bookings.filter(b => new Date(b.booking_date) >= new Date() && b.status !== 'cancelled');
  const tidigare = bookings.filter(b => new Date(b.booking_date) < new Date() || b.status === 'cancelled');
  const s = calcStats();

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div>
              <p className={styles.eyebrow}>{tr.valkommen}</p>
              <h1 className={styles.title}>{profileData.client_name || user?.email?.split('@')[0]}</h1>
            </div>
            <div className={styles.headerActions}>
              <button onClick={() => setShowProfile(true)} className={styles.profileBtn}>{tr.redigeraProfil}</button>
              <button onClick={handleLogout} className={styles.logoutBtn}>{tr.loggaUt}</button>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}><p className={styles.statLabel}>{tr.totaltBesok}</p><p className={styles.statValue}>{s.totalVisits}</p></div>
            <div className={styles.statCard}><p className={styles.statLabel}>{tr.totaltSpenderat}</p><p className={styles.statValue}>{s.totalSpent.toLocaleString('sv-SE')} kr</p></div>
            <div className={styles.statCard}><p className={styles.statLabel}>{tr.medlemSedan}</p><p className={styles.statValue}>{s.memberSince.toLocaleDateString(lang === 'sv' ? 'sv-SE' : 'en-GB', { month: 'short', year: 'numeric' })}</p></div>
            <div className={styles.statCard}><p className={styles.statLabel}>{tr.nastaBesok}</p><p className={styles.statValue}>{s.nextBooking ? `${new Date(s.nextBooking.booking_date).getDate()}/${new Date(s.nextBooking.booking_date).getMonth() + 1}` : tr.ingenBokning}</p></div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{tr.kommande}</h2>
              <a href="/boka" className={styles.bookBtn}>{tr.bokaNy}</a>
            </div>
            {kommande.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyIcon}>📅</p>
                <p className={styles.emptyTitle}>{tr.ingaKommande}</p>
                <p className={styles.emptyText}>{tr.ingaKommandeText}</p>
                <a href="/boka" className={styles.emptyBtn}>{tr.bokaTid}</a>
              </div>
            ) : (
              <div className={styles.bookingGrid}>
                {kommande.map(b => (
                  <div key={b.id} className={styles.bookingCard}>
                    <div className={styles.bookingHeader}>
                      <h3 className={styles.bookingService}>{getServiceName(b)}</h3>
                      <span className={`${styles.status} ${getStatusClass(b.status)}`}>{STATUS_LABELS[b.status] ?? b.status}</span>
                    </div>
                    <div className={styles.bookingDetails}>
                      <div className={styles.detail}><span className={styles.detailLabel}>{tr.datum}</span><span className={styles.detailValue}>{formatDate(b.booking_date)}</span></div>
                      <div className={styles.detail}><span className={styles.detailLabel}>{tr.tidLabel}</span><span className={styles.detailValue}>{formatTime(b.booking_date)}</span></div>
                      {b.duration_minutes && <div className={styles.detail}><span className={styles.detailLabel}>{tr.varaktighet}</span><span className={styles.detailValue}>{b.duration_minutes} min</span></div>}
                      <div className={styles.detail}><span className={styles.detailLabel}>{tr.pris}</span><span className={styles.detailPrice}>{b.price ? `${b.price.toLocaleString('sv-SE')} kr` : '–'}</span></div>
                    </div>
                    {b.status !== 'cancelled' && <button onClick={() => setCancelModal(b.id)} className={styles.cancelBtn}>{tr.avboka}</button>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {tidigare.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>{tr.tidigare}</h2>
              <div className={styles.historyList}>
                {tidigare.map(b => (
                  <div key={b.id} className={styles.historyItem}>
                    <div className={styles.historyLeft}><p className={styles.historyService}>{getServiceName(b)}</p><p className={styles.historyDate}>{formatDate(b.booking_date)} {tr.kl} {formatTime(b.booking_date)}</p></div>
                    <div className={styles.historyRight}><span className={styles.historyPrice}>{b.price ? `${b.price.toLocaleString('sv-SE')} kr` : '–'}</span><span className={`${styles.status} ${getStatusClass(b.status)}`}>{STATUS_LABELS[b.status] ?? b.status}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{tr.snabblankar}</h2>
            <div className={styles.quickLinks}>
              <a href="/boka" className={styles.quickLink}><span className={styles.quickIcon}>📅</span><span className={styles.quickText}>{tr.qlBoka}</span></a>
              <a href="/priser" className={styles.quickLink}><span className={styles.quickIcon}>💰</span><span className={styles.quickText}>{tr.qlPriser}</span></a>
              <a href="/kontakt" className={styles.quickLink}><span className={styles.quickIcon}>📞</span><span className={styles.quickText}>{tr.qlKontakt}</span></a>
            </div>
          </div>
        </div>

        {showProfile && (
          <div className={styles.modalOverlay} onClick={() => setShowProfile(false)}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}><h2 className={styles.modalTitle}>{tr.modalTitle}</h2><button onClick={() => setShowProfile(false)} className={styles.modalClose}>✕</button></div>
              <form onSubmit={handleUpdateProfile} className={styles.modalForm}>
                <div className={styles.formField}><label className={styles.formLabel}>{tr.namn}</label><input type="text" value={profileData.client_name} onChange={e => setProfileData({ ...profileData, client_name: e.target.value })} className={styles.formInput} required /></div>
                <div className={styles.formField}><label className={styles.formLabel}>{tr.telefon}</label><input type="tel" value={profileData.client_phone} onChange={e => setProfileData({ ...profileData, client_phone: e.target.value })} className={styles.formInput} /></div>
                <div className={styles.formField}><label className={styles.formLabel}>{tr.epost}</label><input type="email" value={profileData.email} className={styles.formInput} disabled /></div>
                <div className={styles.modalActions}><button type="button" onClick={() => setShowProfile(false)} className={styles.cancelModalBtn}>{tr.avbryt}</button><button type="submit" className={styles.saveBtn}>{tr.spara}</button></div>
              </form>
            </div>
          </div>
        )}

        {cancelModal && (
          <div className={styles.modalOverlay} onClick={() => setCancelModal(null)}>
            <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
              <h3 className={styles.confirmTitle}>{tr.avbokaTitle}</h3>
              <p className={styles.confirmText}>{tr.avbokaText}</p>
              <div className={styles.confirmActions}><button onClick={() => setCancelModal(null)} className={styles.cancelModalBtn}>{tr.nejBehall}</button><button onClick={() => handleCancelBooking(cancelModal)} className={styles.confirmBtn}>{tr.jaAvboka}</button></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
