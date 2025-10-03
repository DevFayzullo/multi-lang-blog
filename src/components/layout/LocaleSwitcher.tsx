'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
const locales = ['ko','en','uz'] as const;

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const parts = pathname.split('/').filter(Boolean);
  const hasLocale = locales.includes(parts[0] as any);
  const rest = hasLocale ? parts.slice(1) : parts;
  const current = hasLocale ? (parts[0] as string) : 'ko';

  return (
    <div className="flex gap-2 text-sm">
      {locales.map(l => (
        <Link key={l}
              href={`/${[l, ...rest].join('/')}`}
              className={l===current ? 'font-bold underline' : 'opacity-70 hover:opacity-100'}>
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
