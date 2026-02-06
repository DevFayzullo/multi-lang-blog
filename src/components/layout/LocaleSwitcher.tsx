'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/types';

const LOCALES: readonly Locale[] = ['ko', 'en', 'uz'] as const;

const LOCALE_LABELS: Record<Locale, string> = {
  ko: 'Korean',
  en: 'English',
  uz: 'Uzbek',
};

const ACTIVE_CLASSES =
  'rounded-full border border-neutral-900 bg-neutral-900 px-3 py-1 text-xs font-semibold text-white shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-white dark:bg-white dark:text-black';

const INACTIVE_CLASSES =
  'rounded-full border border-neutral-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-800/70 dark:bg-neutral-950/40 dark:text-neutral-200 dark:hover:border-white dark:hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-white';

function isLocale(v: string | undefined): v is Locale {
  return typeof v === 'string' && (LOCALES as readonly string[]).includes(v);
}

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const parts = pathname.split('/').filter(Boolean);

  const first = parts[0];
  const hasLocale = isLocale(first);

  const rest = hasLocale ? parts.slice(1) : parts;
  const current: Locale = hasLocale ? first : 'ko';

  return (
    <div className="flex gap-2 text-sm">
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={`/${[l, ...rest].join('/')}`}
          className={l === current ? ACTIVE_CLASSES : INACTIVE_CLASSES}
          aria-current={l === current ? 'page' : undefined}
          aria-label={`Switch to ${LOCALE_LABELS[l]} language`}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
