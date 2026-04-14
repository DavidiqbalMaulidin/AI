'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [resetting, setResetting] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()

      setUser(data.user)
      setLoading(false)
    }

    getUser()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        No user found
      </div>
    )
  }

  // 🔥 RESET PASSWORD LANGSUNG DI SINI
  const handleResetPassword = async () => {
    setResetting(true)

    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    })

    setResetting(false)

    if (error) {
      alert(error.message)
      return
    }

    alert('Cek email kamu untuk reset password')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white p-10">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-blue-400">
            Settings ⚙️
          </h1>

          <p className="text-zinc-400 mt-1">
            Atur akun dan preferensi aplikasi kamu
          </p>
        </div>

        <button
          onClick={() => router.push('/chat')}
          className="px-4 py-2 rounded-lg border border-zinc-700 hover:border-blue-500 hover:text-blue-400 transition"
        >
          Back to Chat
        </button>

      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

        {/* ACCOUNT */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">

          <h2 className="text-lg font-semibold text-pink-400">
            Account Info
          </h2>

          <div className="space-y-1 text-sm text-zinc-300">
            <p>
              <span className="text-blue-400">Email:</span> {user.email}
            </p>

            <p>
              <span className="text-pink-400">User ID:</span> {user.id}
            </p>
          </div>

          <button
            onClick={() => router.push('/profile')}
            className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded transition"
          >
            Edit Profile
          </button>

        </div>

        {/* APPEARANCE */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">

          <h2 className="text-lg font-semibold text-blue-400">
            Appearance
          </h2>

          <div className="text-sm text-zinc-300 space-y-1">
            <p>🎨 Theme: Black / Blue / Pink</p>
            <p>💻 UI Mode: SaaS Modern</p>
            <p>🤖 AI Style: Friendly Assistant</p>
          </div>

          <button className="w-full border border-blue-500 text-blue-400 p-2 rounded hover:bg-blue-500/10 transition">
            Change Theme (Coming Soon)
          </button>

        </div>

        {/* SECURITY */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">

          <h2 className="text-lg font-semibold text-pink-400">
            Security
          </h2>

          {/* 🔥 RESET PASSWORD FIX */}
          <button
            onClick={handleResetPassword}
            disabled={resetting}
            className="w-full bg-pink-600 hover:bg-pink-500 p-2 rounded transition"
          >
            {resetting ? 'Mengirim email...' : 'Reset Password'}
          </button>

          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/')
            }}
            className="w-full border border-zinc-700 hover:border-pink-500 p-2 rounded transition"
          >
            Logout
          </button>

        </div>

        {/* SYSTEM */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">

          <h2 className="text-lg font-semibold text-blue-300">
            System
          </h2>

          <div className="text-sm text-zinc-400 space-y-1">
            <p>🚀 Version: IqDav AI v1.0</p>
            <p>🟢 Status: Online</p>
            <p>⚡ Mode: Production</p>
          </div>

          <button className="w-full border border-zinc-700 p-2 rounded text-zinc-300">
            Diagnostics (Soon)
          </button>

        </div>

      </div>
    </div>
  )
}