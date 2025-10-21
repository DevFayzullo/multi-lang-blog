'use client';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const effective = theme === 'system' ? systemTheme : theme;

  return (
    <button
      onClick={() => setTheme(effective === 'dark' ? 'light' : 'dark')}
      className="rounded border px-3 py-1 text-sm"
      aria-label="Toggle theme"
    >
      {effective === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
