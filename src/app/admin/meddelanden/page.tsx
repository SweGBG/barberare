import AdminLayout from '@/components/admin/AdminLayout'
import MessagesInbox from '@/components/admin/MessagesInbox'

export const metadata = { title: 'Meddelanden — Atilli Berg' }

export default function MeddelandenPage() {
    return (
        <AdminLayout>
            <MessagesInbox />
        </AdminLayout>
    )
}