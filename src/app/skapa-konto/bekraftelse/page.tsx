import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import styles from '../skapa-konto.module.css'

export default function BekraftelsePage() {
    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.hero}>
                    <p className={styles.eyebrow}>Välkommen</p>
                    <h1 className={styles.title}>Konto <em>skapat</em></h1>
                    <div className={styles.divider} />
                </div>
                <div className={styles.kortWrap}>
                    <div className={`${styles.kort} ${styles.kortCenter}`}>
                        <div className={styles.bekrIcon}>
                            <i className="ti ti-mail-check" />
                        </div>
                        <h2 className={styles.bekrTitel}>Kontrollera din e-post</h2>
                        <p className={styles.bekrText}>
                            Vi har skickat en bekräftelselänk till din e-postadress.
                            Klicka på länken för att aktivera ditt konto och börja boka.
                        </p>
                        <a href="/boka" className={styles.submitBtn} style={{ textDecoration: 'none', textAlign: 'center' }}>
                            Gå till bokning →
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}