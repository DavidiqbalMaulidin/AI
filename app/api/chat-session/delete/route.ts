import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId } = await req.json()

    console.log('SESSION ID:', sessionId)
    console.log('USER ID:', user.id)

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId required' },
        { status: 400 }
      )
    }

    // 🔥 TEST TANPA user_id dulu
    const { data, error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId)
      .select()

    if (error) {
      console.log('SUPABASE DELETE ERROR:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    console.log('DELETED DATA:', data)

    return NextResponse.json({
      success: true,
      deleted: data,
    })

  } catch (err: any) {
    console.log('SERVER ERROR:', err)
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}