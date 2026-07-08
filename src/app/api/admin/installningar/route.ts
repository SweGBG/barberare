import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('settings')
    .select('key, value')

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

  const settings: Record<string, unknown> = {}
  data?.forEach((row) => { settings[row.key] = row.value })

  return NextResponse.json({ ok: true, data: settings })
}

export async function PUT(req: NextRequest) {
  const supabase = getSupabase()
  const body = await req.json()
  const { key, value } = body

  if (!key || value === undefined) {
    return NextResponse.json({ ok: false, error: 'key och value krävs' }, { status: 400 })
  }

  const { error } = await supabase
    .from('settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}