import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// 🔥 PERUBAHAN 1: WAJIB TAMBAH INI (disable cache Next.js)
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title } = await req.json()

  const { data } = await supabase
    .from('chat_sessions')
    .insert({
      user_id: user.id,
      title: title || 'New Chat',
    })
    .select()
    .single()

  return NextResponse.json(data)
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json([])
  }

  const { data } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // 🔥 PERUBAHAN 2: TAMBAH HEADER NO-STORE
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}