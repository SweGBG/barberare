'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Navbar from '@/components/Navbar';
import styles from './medlem.module.css';

interface Bokning {
  id: string;
  tjanst: string;
  pris: string;
  datum: string;
  tid: string;
  status: string;
  skapad: string;
  namn: string;
  efternamn: string;
  telefon: string;
}

export default function MedlemPage() {
  const [user, setUser] = useState<any>(null);
  const [bokningar, setBokningar] = useState<Bokning[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [cancelModal, setCancelModal] = useState<string | null>(null);
  const supabase = createClient();

  const [profileData, setProfileData] = useState({
    namn: '',
    efternamn: '',
    telefon: '',
    email: '',
  });

  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/logga-in');
      return;
    }

    setUser(user);
    await fetchBokningar(user.email!);
    setLoading(false);
  };

  const fetchBokningar = async (email: string) => {
    const { data, error } = await supabase
      .from('bokningar')
      .select('*')
      .eq('email', email)
      .order('datum', { ascending: false });

    if (!error && data && data.length > 0) {
      setBokningar(data);

      const firstBokning = data[0];
      setProfileData({
        namn: firstBokning.namn || '',
        efternamn: firstBokning.efternamn || '',
        telefon: firstBokning.telefon || '',
        email: email,
      });
    }
  };

  const handleCancelBooking = async (bokningId: string) => {
    const { error } = await supabase
      .from('bokningar')
      .update({ status: 'avbokad' })
      .eq('id', bokningId);

    if (!error) {
      setBokningar(bokningar.map(b =>
        b.id === bokningId ? { ...b, status: 'avbokad' } : b
      ));
      setCancelModal(null);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from('bokningar')
      .update({
        namn: profileData.namn,
        efternamn: profileData.efternamn,
        telefon: profileData.telefon,
      })
      .eq('email', user.email);

    if (!error) {
      setShowProfile(false);
      await fetchBokningar(user.email!);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const manader = [
      'januari', 'februari', 'mars', 'april', 'maj', 'juni',
      'juli', 'augusti', 'september', 'oktober', 'november', 'december'
    ];
    return `${date.getDate()} ${manader[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'bekraftad': return styles.statusConfirmed;
      case 'avbokad': return styles.statusCancelled;
      case 'genomford': return styles.statusCompleted;
      default: return '';
    }
  };

  const calculateStats = () => {
    const genomforda = bokningar.filter(b => b.status === 'genomford');
    const totalVisits = genomforda.length;

    const totalSpent = genomforda.reduce((sum, b) => {
      const pris = parseInt(b.pris.replace(/[^0-9]/g, '')) || 0;
      return sum + pris;
    }, 0);

    const memberSince = bokningar.length > 0
      ? new Date(bokningar[bokningar.length - 1].skapad)
      : new Date();

    const nextBooking = bokningar.find(b => {
      const bokningDatum = new Date(b.datum);
      return bokningDatum >= new Date() && b.status === 'bekraftad';
    });

    return { totalVisits, totalSpent, memberSince, nextBooking };
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>Laddar din profil...</p>
        </div>
      </>
    );
  }

  const kommandeBokningar = bokningar.filter(b => {
    const bokningDatum = new Date(b.datum);
    return bokningDatum >= new Date() && b.status === 'bekraftad';
  });

  const tidigareBokningar = bokningar.filter(b => {
    const bokningDatum = new Date(b.datum);
    return bokningDatum < new Date() || b.status !== 'bekraftad';
  });

  const stats = calculateStats();

  return (
    <>
      <Navbar />

      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div>
              <p className={styles.eyebrow}>Välkommen tillbaka</p>
              <h1 className={styles.title}>
                {profileData.namn || user?.email?.split('@')[0]}
              </h1>
            </div>
            <div className={styles.headerActions}>
              <button onClick={() => setShowProfile(true)} className={styles.profileBtn}>
                Redigera profil
              </button>
            </div>
          </div>
        </div>

        <div className={styles.content}>
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
                  ? `${new Date(stats.nextBooking.datum).getDate()}/${new Date(stats.nextBooking.datum).getMonth() + 1}`
                  : 'Ingen bokning'
                }
              </p>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Kommande bokningar</h2>
              <a href="/boka" className={styles.bookBtn}>Boka ny tid</a>
            </div>

            {kommandeBokningar.length === 0 ? (
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
                {kommandeBokningar.map((bokning) => (
                  <div key={bokning.id} className={styles.bookingCard}>
                    <div className={styles.bookingHeader}>
                      <h3 className={styles.bookingService}>{bokning.tjanst}</h3>
                      <span className={`${styles.status} ${getStatusColor(bokning.status)}`}>
                        {bokning.status}
                      </span>
                    </div>
                    <div className={styles.bookingDetails}>
                      <div className={styles.detail}>
                        <span className={styles.detailLabel}>Datum</span>
                        <span className={styles.detailValue}>{formatDate(bokning.datum)}</span>
                      </div>
                      <div className={styles.detail}>
                        <span className={styles.detailLabel}>Tid</span>
                        <span className={styles.detailValue}>{bokning.tid}</span>
                      </div>
                      <div className={styles.detail}>
                        <span className={styles.detailLabel}>Pris</span>
                        <span className={styles.detailPrice}>{bokning.pris}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setCancelModal(bokning.id)}
                      className={styles.cancelBtn}
                    >
                      Avboka
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {tidigareBokningar.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Tidigare bokningar</h2>
              <div className={styles.historyList}>
                {tidigareBokningar.map((bokning) => (
                  <div key={bokning.id} className={styles.historyItem}>
                    <div className={styles.historyLeft}>
                      <p className={styles.historyService}>{bokning.tjanst}</p>
                      <p className={styles.historyDate}>
                        {formatDate(bokning.datum)} kl {bokning.tid}
                      </p>
                    </div>
                    <div className={styles.historyRight}>
                      <span className={styles.historyPrice}>{bokning.pris}</span>
                      <span className={`${styles.status} ${getStatusColor(bokning.status)}`}>
                        {bokning.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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

        {showProfile && (
          <div className={styles.modalOverlay} onClick={() => setShowProfile(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Redigera profil</h2>
                <button onClick={() => setShowProfile(false)} className={styles.modalClose}>✕</button>
              </div>
              <form onSubmit={handleUpdateProfile} className={styles.modalForm}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Förnamn</label>
                  <input
                    type="text"
                    value={profileData.namn}
                    onChange={(e) => setProfileData({ ...profileData, namn: e.target.value })}
                    className={styles.formInput}
                    required
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Efternamn</label>
                  <input
                    type="text"
                    value={profileData.efternamn}
                    onChange={(e) => setProfileData({ ...profileData, efternamn: e.target.value })}
                    className={styles.formInput}
                    required
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Telefon</label>
                  <input
                    type="tel"
                    value={profileData.telefon}
                    onChange={(e) => setProfileData({ ...profileData, telefon: e.target.value })}
                    className={styles.formInput}
                    required
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

        {cancelModal && (
          <div className={styles.modalOverlay} onClick={() => setCancelModal(null)}>
            <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
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