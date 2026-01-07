'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark';

function isThemeMode(v: unknown): v is ThemeMode {
  return v === 'light' || v === 'dark';
}

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const effective: ThemeMode = (() => {
    if (theme === 'system') return isThemeMode(systemTheme) ? systemTheme : 'dark';
    return isThemeMode(theme) ? theme : 'dark';
  })();

  const nextTheme: ThemeMode = effective === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      className="rounded-xl border border-neutral-200/60 dark:border-neutral-700/60 px-3 py-1.5 text-sm backdrop-blur hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 transition"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {effective === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
