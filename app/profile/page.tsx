'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Menu, X } from 'lucide-react'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState('')
  const [originalName, setOriginalName] = useState('')
  const [isChanged, setIsChanged] = useState(false)

  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // 🔥 NEW: MOBILE SIDEBAR STATE
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  // GET USER
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()

      const fullName = data.user?.user_metadata?.full_name || ''

      setUser(data.user)
      setName(fullName)
      setOriginalName(fullName)
      setLoading(false)
    }

    getUser()
  }, [])

  // DETECT CHANGE
  useEffect(() => {
    setIsChanged(name !== originalName)
  }, [name, originalName])

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

  const updateName = async () => {
    if (!isChanged) return

    setSaving(true)

    const { error } = await supabase.auth.updateUser({
      data: { full_name: name },
    })

    setSaving(false)

    if (error) {
      alert(error.message)
      return
    }

    setOriginalName(name)
    setIsChanged(false)

    alert('Nama berhasil diupdate')
  }

  const resetPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    })

    if (error) return alert(error.message)

    alert('Cek email untuk reset password')
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black text-white">

      {/* 🔥 MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800">
        <h1 className="font-bold text-blue-400">IqDav AI</h1>

        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* SIDEBAR */}
      <div
        className={`
          bg-zinc-950 border-r border-zinc-800 p-4 space-y-4
          w-64 md:block
          ${sidebarOpen ? 'block' : 'hidden md:block'}
        `}
      >
        <h1 className="text-xl font-bold text-blue-400 hidden md:block">
          IqDav AI
        </h1>

        <button
          onClick={() => setActiveTab('profile')}
          className={`w-full text-left p-2 rounded ${
            activeTab === 'profile'
              ? 'bg-blue-600'
              : 'hover:bg-zinc-800'
          }`}
        >
          Profile
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`w-full text-left p-2 rounded ${
            activeTab === 'security'
              ? 'bg-pink-600'
              : 'hover:bg-zinc-800'
          }`}
        >
          Security
        </button>

        <button
          onClick={() => router.push('/chat')}
          className="w-full mt-10 border border-zinc-700 hover:border-blue-500 p-2 rounded"
        >
          Back to Chat
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-4 md:p-10 bg-gradient-to-br from-black via-zinc-950 to-black overflow-y-auto">

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-6">

            <h2 className="text-2xl font-bold text-blue-400">
              Profile
            </h2>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">

              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center font-bold text-lg">
                {user.email?.charAt(0).toUpperCase()}
              </div>

              <div className="text-sm space-y-1">
                <p><span className="text-blue-400">Email:</span> {user.email}</p>
                <p><span className="text-pink-400">User ID:</span> {user.id}</p>
              </div>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama kamu"
                className="w-full p-2 rounded bg-black border border-zinc-700 focus:border-blue-500 outline-none"
              />

              <button
                onClick={updateName}
                disabled={!isChanged || saving}
                className={`w-full p-2 rounded transition ${
                  isChanged
                    ? 'bg-blue-600 hover:bg-blue-500'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                {saving ? 'Menyimpan...' : 'Update Name'}
              </button>

            </div>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === 'security' && (
          <div className="space-y-6">

            <h2 className="text-2xl font-bold text-pink-400">
              Security
            </h2>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">

              <button
                onClick={resetPassword}
                className="w-full bg-pink-600 hover:bg-pink-500 p-2 rounded"
              >
                Reset Password
              </button>

              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  router.push('/')
                }}
                className="w-full border border-zinc-700 hover:border-pink-500 p-2 rounded"
              >
                Logout
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}