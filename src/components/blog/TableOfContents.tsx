import Link from 'next/link';

export type TocItem = {
  id: string;
  title: string;
  level: 2 | 3;
};

export default function TableOfContents({ items }: { items: TocItem[] }) {
  if (!items.length) return null;

  return (
    <div className="rounded-3xl border border-neutral-200/60 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/40">
      <h2 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
        On this page
      </h2>

      <nav className="mt-4">
        <ul className="space-y-2 text-sm">
          {items.map((it) => (
            <li key={it.id} className={it.level === 3 ? 'pl-4' : ''}>
              <Link
                href={`#${it.id}`}
                className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              >
                {it.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
