'use client'

import { Message } from './chat-container'
import { Sparkles, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {

  // 🔥 TAMBAHAN: AUTO SCROLL
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    // 🔥 FIX: HEIGHT FULL + FLEX STABLE
    <div className="h-full overflow-y-auto px-4 py-6 scroll-smooth">

      <div className="max-w-3xl mx-auto space-y-6 pb-6">

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-4',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >

            {/* ASSISTANT ICON */}
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
            )}

            {/* MESSAGE BOX */}
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-4 py-3 break-words whitespace-pre-wrap',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-sm'
                  : 'bg-card border border-border rounded-tl-sm'
              )}
            >

              {message.content ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">

                  {message.content.split('\n').map((line, i) => (
                    <p
                      key={i}
                      className={cn(
                        'mb-2 last:mb-0',
                        message.role === 'user'
                          ? 'text-primary-foreground'
                          : 'text-foreground'
                      )}
                    >
                      {line || '\u00A0'}
                    </p>
                  ))}

                </div>
              ) : (
                // 🔥 TYPING ANIMATION
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:150ms]" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              )}

            </div>

            {/* USER ICON */}
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-secondary-foreground" />
              </div>
            )}

          </div>
        ))}

        {/* 🔥 FIX AUTO SCROLL TARGET */}
        <div ref={endRef} />

      </div>
    </div>
  )
}