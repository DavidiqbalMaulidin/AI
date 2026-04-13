'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      const supabase = createClient()

      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        router.push('/auth/error')
        return
      }

      // 🔥 CEK USER
      const { data: userData } = await supabase.auth.getUser()

      const isRecovery =
        userData?.user?.recovery_sent_at !== null

      if (isRecovery) {
        router.push('/reset-password')
        return
      }

      router.push('/chat')
    }

    run()
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="mt-4 text-zinc-400">
        Authenticating your account...
      </p>
    </div>
  )
}