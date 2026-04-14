'use client'

import { Sparkles, BookOpen, Calculator, FlaskConical, Globe, Code, PenTool } from 'lucide-react'

interface WelcomeScreenProps {
  userName: string
  onQuickAction: (prompt: string) => void
}

const quickActions = [
  {
    icon: Calculator,
    label: 'Matematika',
    prompt: 'Jelaskan turunan dasar dan berikan contoh soal beserta langkah penyelesaiannya',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Code,
    label: 'Pemrograman',
    prompt: 'Jelaskan konsep dasar pemrograman (variabel, loop, function) dengan contoh di JavaScript',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: BookOpen,
    label: 'Algoritma',
    prompt: 'Jelaskan apa itu algoritma dan berikan contoh pseudocode sederhana untuk mencari nilai terbesar dalam array',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    icon: Globe,
    label: 'Bahasa Inggris',
    prompt: 'Jelaskan perbedaan Simple Past dan Present Perfect serta contoh kalimatnya',
    color: 'from-orange-500 to-amber-500',
  },

  // =========================
  // 🔥 TAMBAHAN 2 MATAKULIAH
  // =========================
  {
    icon: FlaskConical,
    label: 'Fisika',
    prompt: 'Jelaskan hukum Newton 1, 2, dan 3 beserta contoh penerapannya dalam kehidupan sehari-hari',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: PenTool,
    label: 'Sejarah',
    prompt: 'Jelaskan sejarah singkat kemerdekaan Indonesia dan tokoh-tokoh penting di dalamnya',
    color: 'from-red-500 to-orange-500',
  },
]

export function WelcomeScreen({ userName, onQuickAction }: WelcomeScreenProps) {
  return (
    <div className="h-full overflow-y-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Welcome Message */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-accent animate-float">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Hai, {userName}!
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Aku IqDav, asisten AI kamu. Mau tanya apa hari ini? Aku siap bantu belajar!
          </p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Atau pilih topik di bawah untuk mulai:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => onQuickAction(action.prompt)}
                className="group p-4 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 text-left"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-medium text-foreground text-sm">{action.label}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {action.prompt.slice(0, 40)}...
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
          <p className="text-sm text-foreground font-medium mb-2">Tips:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Tanya dengan bahasa yang jelas dan spesifik</li>
            <li>Bisa minta contoh soal atau penjelasan step-by-step</li>
            <li>Kalau belum paham, tanya lagi aja!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}