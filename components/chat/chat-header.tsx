'use client'

import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  LogOut,
  User as UserIcon,
  Settings,
  Menu,
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ChatHeaderProps {
  user: User

  // 🔥 TAMBAHAN OPTIONAL (buat integrasi layout)
  onToggleSidebar?: () => void
}

export function ChatHeader({ user, onToggleSidebar }: ChatHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const userName =
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    'User'

  const initials = userName.slice(0, 2).toUpperCase()

  return (
    <header className="h-14 sm:h-16 border-b border-border bg-card/80 backdrop-blur-sm px-3 sm:px-4 flex items-center justify-between shrink-0">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-3 select-none">

        {/* 🔥 MOBILE MENU BUTTON (OPSIONAL) */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded hover:bg-muted"
          >
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>
        )}

        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>

        <div className="hidden sm:block">
          <h1 className="font-bold text-foreground text-sm sm:text-base">
            IqDav Assistant
          </h1>
          <p className="text-xs text-muted-foreground">
            Made by @Daveeed_Iqbaaal
          </p>
        </div>

      </div>

      {/* USER MENU */}
      <DropdownMenu>

        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-2 focus:outline-none">

            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
              {initials}
            </div>

            <span className="hidden sm:block text-foreground font-medium">
              {userName}
            </span>

            <Menu className="w-4 h-4 text-muted-foreground sm:hidden" />

          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">

          <div className="px-2 py-1.5">
            <p className="text-sm font-medium text-foreground">
              {userName}
            </p>
            <p className="text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => router.push('/profile')}>
            <UserIcon className="w-4 h-4 mr-2" />
            Profil
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push('/settings')}>
            <Settings className="w-4 h-4 mr-2" />
            Pengaturan
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="text-red-500 focus:text-red-500"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>

    </header>
  )
}