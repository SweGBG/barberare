import AdminGuard from '@/components/AdminGuard'
import AdminLayout from '@/components/admin/AdminLayout'
import StatsGrid from '@/components/admin/StatsGrid'
import WeekChart from '@/components/admin/WeekChart'
import BookingsTable from '@/components/admin/BookingsTable'
import TodayTimeline from '@/components/admin/TodayTimeline'
import TrenderWidget from '@/components/admin/trender-widget'
import styles from './admin.module.css'

export const metadata = { title: 'Admin — Atilli Berg' }

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <StatsGrid />
        <WeekChart />
        <div className={styles.twoCol}>
          <BookingsTable />
          <TodayTimeline />
        </div>
        <div className={styles.trendsRow}>
          <TrenderWidget />
        </div>
      </AdminLayout>
    </AdminGuard>
  )
}