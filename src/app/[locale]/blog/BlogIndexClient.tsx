'use client';
import { useMemo, useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import PostCard from '@/components/blog/PostCard';
import type { PostMeta } from '@/lib/types';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

type Props = { locale: string; posts: PostMeta[]; allTags: string[] };

export default function BlogIndexClient({ locale, posts, allTags }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const q0 = searchParams.get('q') ?? '';
  const t0 = searchParams.get('tag') ?? '';

  const [q, setQ] = useState(q0);
  const [tag, setTag] = useState(t0);

  useEffect(() => {
    const sp = new URLSearchParams();
    if (q) sp.set('q', q);
    if (tag) sp.set('tag', tag);
    router.replace(sp.size ? `${pathname}?${sp.toString()}` : pathname);
  }, [q, tag, pathname, router]);

  const fuse = useMemo(() => new Fuse(posts, {
    keys: ['title', 'summary', 'tags'],
    threshold: 0.35
  }), [posts]);

  const filtered = useMemo(() => {
    const base = q ? fuse.search(q).map(r => r.item) : posts;
    return tag ? base.filter(p => (p.tags ?? []).includes(tag)) : base;
  }, [fuse, posts, q, tag]);

  return (
    <section className="mt-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title, summary or tag…"
          className="w-full md:w-1/2 rounded-xl border border-neutral-300/70 dark:border-neutral-700/70 px-3 py-2 text-sm bg-white/60 dark:bg-neutral-900/60 backdrop-blur"
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setTag('')}
            className={`px-2 py-1 rounded-xl text-xs border ${!tag ? 'bg-neutral-900 text-white dark:bg-white dark:text-black' : 'border-neutral-300/70 dark:border-neutral-700/70'}`}
          >
            All
          </button>
          {allTags.map(t => (
            <button
              key={t}
              onClick={() => setTag(tag === t ? '' : t)}
              className={`px-2 py-1 rounded-xl text-xs border ${tag === t ? 'bg-neutral-900 text-white dark:bg-white dark:text-black' : 'border-neutral-300/70 dark:border-neutral-700/70'}`}
            >
              #{t}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-6 space-y-6">
        {filtered.map(p => (<PostCard key={p.slug} locale={locale as any} post={p} />))}
      </ul>

      {!filtered.length && (
        <p className="mt-8 text-neutral-500">
          No results{q ? ` for “${q}”` : ''}{tag ? ` in #${tag}` : ''}.
        </p>
      )}
    </section>
  );
}
