import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(req: NextRequest) {
  const res = NextResponse.next()

  // Supabase kräver att cookies refreshas på varje request på Vercel
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value)
            res.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refreshar sessionen — kritiskt för Vercel
  await supabase.auth.getSession()

  // Skydda /admin-routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      const loginUrl = new URL('/logga-in', req.url)
      loginUrl.searchParams.set('redirect', req.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return res
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/medlem',
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}
