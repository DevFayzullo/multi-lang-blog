import LocaleSwitcher from './LocaleSwitcher';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-white/70 backdrop-blur dark:bg-neutral-900/70 70">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/ko" className="font-semibold">Multi-Lang Blog</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/ko/blog" className="hover:underline">Blog</Link>
          <LocaleSwitcher />
        </nav>
      </div>
    </header>
  );
}

