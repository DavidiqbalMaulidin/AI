'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Send, Paperclip, Image as ImageIcon, X } from 'lucide-react'
import Tesseract from 'tesseract.js'

interface ChatInputProps {
  onSendMessage: (message: string, fileText?: string) => void
  isLoading: boolean
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [fileText, setFileText] = useState('')
  const [fileName, setFileName] = useState('')

  const [imagePreview, setImagePreview] = useState('')
  const [imageText, setImageText] = useState('')
  const [imageName, setImageName] = useState('')

  const [isDragging, setIsDragging] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLInputElement>(null)

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 180) + 'px'
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [message])

  const handleFileChange = async (file: File) => {
    if (!file.name.endsWith('.txt')) return alert('Hanya file .txt')

    const text = await file.text()
    setFileText(text)
    setFileName(file.name)
  }

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return alert('Hanya gambar')

    setImageName(file.name)
    setImagePreview(URL.createObjectURL(file))

    const result = await Tesseract.recognize(file, 'eng+ind')
    setImageText(result.data.text)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() && !fileText && !imageText) return

    const finalMessage =
      message +
      (fileText ? `\n\n[FILE TXT]: ${fileText}` : '') +
      (imageText ? `\n\n[TEXT GAMBAR]: ${imageText}` : '')

    onSendMessage(finalMessage, fileText)

    setMessage('')
    setFileText('')
    setFileName('')
    setImagePreview('')
    setImageText('')
    setImageName('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    // 🔥 FIX 1: STICKY + SAFE AREA + Z-INDEX
    <div className="sticky bottom-0 z-50 border-t p-3 sm:p-4 bg-background/90 backdrop-blur-md border-border pb-[env(safe-area-inset-bottom)]">

      {/* hidden inputs */}
      <input
        ref={fileRef}
        type="file"
        accept=".txt"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileChange(file)
        }}
      />

      <input
        ref={imageRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleImageFile(file)
        }}
      />

      <form
        className="max-w-3xl mx-auto"
        onSubmit={handleSubmit}
      >

        {/* INPUT BOX */}
        <div className="flex items-end gap-2 p-3 rounded-2xl bg-secondary border border-border relative z-10">

          {/* FILE */}
          <button type="button" onClick={() => fileRef.current?.click()} className="p-2">
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* IMAGE */}
          <button type="button" onClick={() => imageRef.current?.click()} className="p-2">
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* TEXTAREA */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isDragging ? 'Drop file...' : 'Tanya apa saja...'}
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-transparent outline-none resize-none px-2 py-1 max-h-40 overflow-y-auto"
          />

          {/* SEND */}
          <Button
            type="submit"
            size="icon"
            disabled={isLoading}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-accent"
          >
            <Send />
          </Button>

        </div>

        {/* PREVIEW (FIX: NO LAYOUT JUMP) */}
        {(fileName || imagePreview) && (
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">

            {fileName && (
              <div className="px-3 py-1 bg-zinc-800 text-green-400 rounded-full text-xs flex items-center gap-2 whitespace-nowrap">
                📄 {fileName}
                <X size={14} onClick={() => setFileName('')} />
              </div>
            )}

            {imagePreview && (
              <div className="relative shrink-0">
                <img
                  src={imagePreview}
                  className="w-12 h-12 rounded object-cover"
                />
                <X
                  size={14}
                  className="absolute -top-1 -right-1 bg-black rounded-full"
                  onClick={() => setImagePreview('')}
                />
              </div>
            )}

          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-2">
          Drop file / image langsung ke sini 🔥
        </p>

      </form>
    </div>
  )
}