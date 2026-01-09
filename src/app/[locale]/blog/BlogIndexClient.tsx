'use client';

import { useEffect, useMemo, useState, useTransition, useDeferredValue } from 'react';
import Fuse from 'fuse.js';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import PostCard from '@/components/blog/PostCard';
import type { Locale, PostMeta } from '@/lib/types';

type Props = { locale: Locale; posts: PostMeta[]; allTags: string[] };

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export default function BlogIndexClient({ locale, posts, allTags }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const q0 = searchParams.get('q') ?? '';
  const t0 = searchParams.get('tag') ?? '';

  const [q, setQ] = useState(q0);
  const [tag, setTag] = useState(t0);

  const deferredQ = useDeferredValue(q);

  useEffect(() => {
    const handle = setTimeout(() => {
      const sp = new URLSearchParams(searchParams.toString());

      if (q.trim()) sp.set('q', q.trim());
      else sp.delete('q');

      if (tag) sp.set('tag', tag);
      else sp.delete('tag');

      const nextUrl = sp.size ? `${pathname}?${sp.toString()}` : pathname;
      const currentUrl = searchParams.size ? `${pathname}?${searchParams.toString()}` : pathname;

      if (nextUrl !== currentUrl) {
        startTransition(() => {
          router.replace(nextUrl, { scroll: false });
        });
      }
    }, 150);

    return () => clearTimeout(handle);
  }, [q, tag, pathname, router]);

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: ['title', 'summary', 'tags'],
        threshold: 0.35,
        ignoreLocation: true
      }),
    [posts]
  );

  const filtered = useMemo(() => {
    const term = deferredQ.trim();
    const base = term ? fuse.search(term).map((r) => r.item) : posts;
    return tag ? base.filter((p) => (p.tags ?? []).includes(tag)) : base;
  }, [deferredQ, fuse, posts, tag]);

  const hasActiveFilters = Boolean(q.trim() || tag);

  const clearAll = () => {
    setQ('');
    setTag('');
  };

  return (
    <section className="mt-6">
      {/* Controls */}
      <div className="rounded-3xl border border-neutral-200/60 bg-white/60 p-4 shadow-sm backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/40">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') clearAll();
              }}
              placeholder="Search by title, summary or tag…"
              aria-label="Search posts"
              className="w-full rounded-2xl border border-neutral-200/70 bg-white/70 px-4 py-2.5 pr-24 text-sm text-neutral-900 shadow-sm outline-none transition placeholder:text-neutral-500 focus:border-neutral-300 dark:border-neutral-800/70 dark:bg-neutral-950/40 dark:text-neutral-100 dark:placeholder:text-neutral-400 dark:focus:border-neutral-700"
            />

            {/* Clear (x) */}
            {q.trim() ? (
              <button
                type="button"
                onClick={() => setQ('')}
                className="absolute right-14 top-1/2 -translate-y-1/2 rounded-xl border border-neutral-200/70 bg-white/70 px-2 py-1 text-xs text-neutral-700 shadow-sm hover:bg-white dark:border-neutral-800/70 dark:bg-neutral-950/40 dark:text-neutral-200 dark:hover:bg-neutral-900/60"
                aria-label="Clear search"
                title="Clear search"
              >
                ✕
              </button>
            ) : null}

            {/* Count */}
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 dark:text-neutral-400">
              {isPending ? '…' : `${filtered.length}/${posts.length}`}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters ? (
              <button
                onClick={clearAll}
                className="rounded-2xl border border-neutral-200/70 bg-white/70 px-3 py-2 text-xs text-neutral-700 shadow-sm hover:bg-white dark:border-neutral-800/70 dark:bg-neutral-950/40 dark:text-neutral-200 dark:hover:bg-neutral-900/60"
              >
                Reset
              </button>
            ) : (
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Tip: filter by tags or search.
              </span>
            )}
          </div>
        </div>

        {/* Tag chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setTag('')}
            aria-pressed={!tag}
            className={cx(
              'rounded-full border px-3 py-1 text-xs transition',
              !tag
                ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black'
                : 'border-neutral-200/70 bg-white/70 text-neutral-700 hover:bg-white dark:border-neutral-800/70 dark:bg-neutral-950/40 dark:text-neutral-200 dark:hover:bg-neutral-900/60'
            )}
          >
            All
          </button>

          {allTags.map((t) => {
            const active = tag === t;
            return (
              <button
                type="button"
                key={t}
                onClick={() => setTag(active ? '' : t)}
                aria-pressed={active}
                className={cx(
                  'rounded-full border px-3 py-1 text-xs transition',
                  active
                    ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black'
                    : 'border-neutral-200/70 bg-white/70 text-neutral-700 hover:bg-white dark:border-neutral-800/70 dark:bg-neutral-950/40 dark:text-neutral-200 dark:hover:bg-neutral-900/60'
                )}
              >
                #{t}
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {filtered.map((p) => (
          <PostCard key={`${locale}-${p.slug}`} locale={locale} post={p} />
        ))}
      </ul>

      {/* Empty state */}
      {!filtered.length && (
        <div className="mt-8 rounded-3xl border border-neutral-200/60 bg-white/60 p-8 text-center shadow-sm backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/40">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            No results{q ? ` for “${q}”` : ''}{tag ? ` in #${tag}` : ''}.
          </p>
          <button
            onClick={clearAll}
            className="mt-4 rounded-2xl border border-neutral-200/70 bg-white/70 px-4 py-2 text-sm text-neutral-700 shadow-sm hover:bg-white dark:border-neutral-800/70 dark:bg-neutral-950/40 dark:text-neutral-200 dark:hover:bg-neutral-900/60"
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
