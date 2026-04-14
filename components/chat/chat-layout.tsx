'use client'

import { useState, useEffect } from 'react'
import { ChatSidebar } from './chat-sidebar'
import { ChatContainer } from './chat-container'
import { User } from '@supabase/supabase-js'
import { Menu } from 'lucide-react'

export default function ChatLayout({ user }: { user: User }) {
  const [activeSession, setActiveSession] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(false)

  // 🔥 PERUBAHAN 1: FIX MOBILE SAFETY STATE (opsional tapi aman)
  const [mobileFix] = useState(true)

  const handleNewChat = async () => {
    try {
      const res = await fetch('/api/chat-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Chat' }),
      })

      const data = await res.json()

      if (data?.id) {
        setActiveSession(data.id)
      }
    } catch (err) {
      console.error('new chat error:', err)
    }
  }

  const handleSelectSession = (id: string) => {
    setActiveSession(id)
  }

  useEffect(() => {
    const loadFirstSession = async () => {
      try {
        const res = await fetch('/api/chat-session', {
          cache: 'no-store', // 🔥 FIX IMPORTANT
        })
        const data = await res.json()

        if (Array.isArray(data) && data.length > 0 && !activeSession) {
          setActiveSession(data[0].id)
        }
      } catch (err) {
        console.error('load session error:', err)
      }
    }

    loadFirstSession()
  }, [])

  return (
    <div className="h-screen flex bg-black text-white overflow-hidden">

      {/* =========================
          SIDEBAR
      ========================= */}
      <div
        className={`border-r border-white/10 transition-all duration-300 flex-shrink-0 ${
          collapsed ? 'w-20' : 'w-72'
        }`}
      >
        <ChatSidebar
          collapsed={collapsed}
          activeId={activeSession}
          onSelect={handleSelectSession}
          onNewChat={handleNewChat}
        />
      </div>

      {/* =========================
          MAIN AREA
      ========================= */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* TOP BAR */}
        <div className="h-12 flex items-center px-3 border-b border-white/10">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-white/10 rounded"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* CHAT */}
        <div className="flex-1 overflow-hidden">
          <ChatContainer
            key={activeSession}
            user={user}
            sessionId={activeSession}
          />
        </div>

      </div>
    </div>
  )
}