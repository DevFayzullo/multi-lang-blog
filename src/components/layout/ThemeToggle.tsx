'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const effective = theme === 'system' ? systemTheme : theme
  const next = effective === 'dark' ? 'light' : 'dark'

  return (
    <button
      onClick={() => setTheme(next as any)}
      className="rounded-xl border border-neutral-200/60 dark:border-neutral-700/60 px-3 py-1.5 text-sm backdrop-blur hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 transition"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {effective === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}
