import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'
import styles from './AdminLayout.module.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.root}>
      <AdminSidebar />
      <div className={styles.main}>
        <AdminTopbar />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  )
}