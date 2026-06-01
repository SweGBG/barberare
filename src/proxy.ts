import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*'] }