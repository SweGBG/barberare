'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const ADMIN_EMAILS = [
    'lenn.soder@protonmail.com',
    'atilli@example.com', // byt till Atillis riktiga email
  ]

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user && ADMIN_EMAILS.includes(data.user.email ?? '')) {
        setOk(true)
      } else {
        router.replace('/')
      }
    })
  }, [])

  if (!ok) return null
  return <>{children}</>
}