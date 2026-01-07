'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/types';

const LOCALES: readonly Locale[] = ['ko', 'en', 'uz'] as const;

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
          className={l === current ? 'font-bold underline' : 'opacity-70 hover:opacity-100'}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
