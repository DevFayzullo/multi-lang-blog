'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import LocaleSwitcher from './LocaleSwitcher'
import { motion } from 'framer-motion'

export default function Header() {
  const pathname = usePathname()
  const parts = pathname.split('/').filter(Boolean)
  const locale = ['ko','en','uz'].includes(parts[0]) ? parts[0] : 'ko'

  return (
    <div className="sticky top-0 z-50">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="border-b border-neutral-200/50 dark:border-neutral-800/50 bg-white/50 dark:bg-neutral-950/40 backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:supports-[backdrop-filter]:bg-neutral-950/30"
      >
        <div className="container max-w-5xl flex items-center justify-between py-3">
          <Link href={`/${locale}`} className="font-semibold tracking-tight text-lg">
            <span className="mr-2">🌐</span> Multi-Lang Blog
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link href={`/${locale}/blog`} className="px-2 py-1 rounded hover:bg-neutral-100/80 dark:hover:bg-neutral-800/60 transition">
              Blog
            </Link>
            <ThemeToggle />
            <LocaleSwitcher />
          </nav>
        </div>
      </motion.header>
    </div>
  )
}
