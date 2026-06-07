import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'
import BottomNav from '@/components/admin/BottomNav'
import styles from '@/components/admin/AdminLayout.module.css'

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/logga-in')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  return (
    <div className={styles.root}>
      <AdminSidebar />
      <div className={styles.main}>
        <AdminTopbar />
        <div className={styles.content}>
          {children}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}