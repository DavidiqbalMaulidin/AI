'use client'

import { useEffect, useState } from 'react'
import { MessageSquare } from 'lucide-react'

interface Session {
  id: string
  title: string
}

interface Props {
  activeId: string | null
  onSelect: (id: string) => void
  collapsed: boolean
  onNewChat: () => void
}

export function ChatSidebar({
  activeId,
  onSelect,
  collapsed,
  onNewChat,
}: Props) {
  const [sessions, setSessions] = useState<Session[]>([])

  // =========================
  // LOAD SESSIONS
  // =========================
  const loadSessions = async () => {
    try {
      const res = await fetch('/api/chat-session', {
        cache: 'no-store',
      })
      const data = await res.json()
      setSessions(Array.isArray(data) ? data : [])
    } catch (err) {
      console.log('Failed to load sessions')
    }
  }

  useEffect(() => {
    loadSessions()
  }, [])

  // ❌ PERUBAHAN PENTING: HAPUS auto reload dari activeId
  // useEffect(() => {
  //   loadSessions()
  // }, [activeId])

  // =========================
  // HANDLE NEW CHAT
  // =========================
  const handleNewChat = async () => {
    await onNewChat()
    loadSessions()
  }

  return (
    <div className="h-full p-3 flex flex-col">

      {/* LOGO */}
      <div className="mb-6 text-center">
        {!collapsed ? (
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-pink-500 text-transparent bg-clip-text">
            IQDAV AI
          </h1>
        ) : (
          <MessageSquare className="mx-auto text-blue-400" />
        )}
      </div>

      {/* NEW CHAT */}
      <button
        onClick={handleNewChat}
        className="mb-4 w-full p-2 rounded-xl bg-gradient-to-r from-blue-500 to-pink-500 text-white text-sm"
      >
        {!collapsed ? '+ New Chat' : '+'}
      </button>

      {/* SESSION LIST */}
      <div className="space-y-2 overflow-y-auto flex-1">

        {sessions.length === 0 && (
          <p className="text-xs text-gray-400 text-center">
            Belum ada chat
          </p>
        )}

        {sessions.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between gap-2 bg-white/5 hover:bg-white/10 rounded-xl p-3"
          >
            {/* CLICK CHAT */}
            <div
              onClick={() => onSelect(s.id)}
              className="flex-1 cursor-pointer"
            >
              {collapsed ? '💬' : `📘 ${s.title}`}
            </div>

            {/* ACTIONS */}
            {!collapsed && (
              <div className="flex gap-2 text-xs">

                {/* EDIT */}
                <button
                  onClick={async () => {
                    const newTitle = prompt('Edit judul:', s.title)
                    if (!newTitle) return

                    await fetch('/api/chat-session/update', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        sessionId: s.id,
                        title: newTitle,
                      }),
                    })

                    loadSessions()
                  }}
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  ✏️
                </button>

                {/* DELETE */}
                <button
                  onClick={async () => {
                    if (!confirm('Hapus chat ini?')) return

                    await fetch('/api/chat-session/delete', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        sessionId: s.id,
                      }),
                    })

                    setSessions(prev =>
                      prev.filter(item => item.id !== s.id)
                    )
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  🗑
                </button>

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}