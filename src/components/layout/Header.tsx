'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import LocaleSwitcher from './LocaleSwitcher'
import { motion } from 'framer-motion'

const SUPPORTED_LOCALES = ['ko', 'en', 'uz'] as const

type LocaleCode = (typeof SUPPORTED_LOCALES)[number]

const LOCALE_LABELS: Record<LocaleCode, string> = {
  ko: 'Korean',
  en: 'English',
  uz: 'Uzbek'
}

function formatSegmentLabel(segment: string) {
  return segment
    .split(/[-_]+/)
    .filter(Boolean)
    .map((chunk) => chunk[0]?.toUpperCase() + chunk.slice(1))
    .join(' ')
}

export default function Header() {
  const pathname = usePathname()
  const parts = pathname.split('/').filter(Boolean)
  const locale = SUPPORTED_LOCALES.includes(parts[0] as LocaleCode)
    ? (parts[0] as LocaleCode)
    : SUPPORTED_LOCALES[0]

  const restParts = parts.slice(1)
  const breadcrumbs = (() => {
    const crumbs = [{ label: 'Home', href: `/${locale}` }]

    if (restParts[0] === 'blog') {
      crumbs.push({ label: 'Blog', href: `/${locale}/blog` })

      if (restParts[1]) {
        crumbs.push({
          label: formatSegmentLabel(restParts[1]),
          href: pathname,
        })
      }
    }

    return crumbs
  })()

  return (
    <div className="sticky top-0 z-50">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="border-b border-neutral-200/50 dark:border-neutral-800/50 bg-white/50 dark:bg-neutral-950/40 backdrop-blur supports-backdrop-filter:bg-white/40 dark:supports-backdrop-filter:bg-neutral-950/30"
      >
        <div className="mx-auto w-full max-w-5xl px-6 flex items-center justify-between py-3">
          <Link
            href={`/${locale}`}
            className="font-semibold tracking-tight text-lg flex items-center gap-2"
            aria-label="Go to multilingual blog home"
          >
            <span className="sr-only">Home</span>
            <span aria-hidden="true">🌐</span>
            <span>Multi-Lang Blog</span>
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link
              href={`/${locale}/blog`}
              className="px-2 py-1 rounded hover:bg-neutral-100/80 dark:hover:bg-neutral-800/60 transition"
              aria-label="View the blog index"
            >
              Blog
            </Link>
            <ThemeToggle />
            <LocaleSwitcher />
          </nav>
        </div>

        <div className="mx-auto w-full max-w-5xl px-6 py-2 text-xs uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400">
          <p className="text-xs lg:text-sm">
            Browse articles in {LOCALE_LABELS[locale]} and switch anytime with the buttons above.
          </p>
        </div>

        {breadcrumbs.length > 1 && (
          <nav
            aria-label="Breadcrumb"
            className="border-t border-neutral-200/30 dark:border-neutral-800/30 px-6 py-2 text-xs tracking-wide text-neutral-600 dark:text-neutral-400"
          >
            <div className="flex flex-wrap items-center gap-2">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1
                return (
                  <span key={`${crumb.label}-${index}`} className="inline-flex items-center gap-1">
                    {isLast ? (
                      <span aria-current="page" className="font-semibold text-neutral-900 dark:text-neutral-50">
                        {crumb.label}
                      </span>
                    ) : (
                      <Link
                        href={crumb.href}
                        className="transition hover:text-neutral-900 dark:hover:text-neutral-100"
                      >
                        {crumb.label}
                      </Link>
                    )}
                    {index < breadcrumbs.length - 1 && <span aria-hidden="true">/</span>}
                  </span>
                )
              })}
            </div>
          </nav>
        )}
      </motion.header>
    </div>
  )
}
