import Link from 'next/link';
import type { Locale, PostMeta } from '@/lib/types';

function formatDate(date: string, locale: Locale) {
  const map: Record<Locale, string> = { ko: 'ko-KR', en: 'en-US', uz: 'uz-UZ' };
  return new Date(date).toLocaleDateString(map[locale] ?? 'en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
}

export default function PostCard({ locale, post }: { locale: Locale; post: PostMeta }) {
  const href = `/${locale}/blog/${post.slug}`;

  return (
    <li className="group">
      <Link
        href={href}
        className="block rounded-3xl border border-neutral-200/60 bg-white/60 p-6 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800/60 dark:bg-neutral-950/40"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              {post.title}
            </h3>

            {post.summary ? (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {post.summary}
              </p>
            ) : null}
          </div>

          <span className="shrink-0 text-xs text-neutral-500 dark:text-neutral-400">
            {formatDate(post.date, locale)}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-neutral-200/70 bg-white/70 px-3 py-1 text-xs text-neutral-700 dark:border-neutral-800/70 dark:bg-neutral-950/40 dark:text-neutral-200">
            {post.readingTime} min
          </span>

          {post.tags?.slice(0, 3).map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-full border border-neutral-200/70 bg-white/70 px-3 py-1 text-xs text-neutral-700 dark:border-neutral-800/70 dark:bg-neutral-950/40 dark:text-neutral-200"
            >
              #{t}
            </span>
          ))}

          {post.tags && post.tags.length > 3 ? (
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              +{post.tags.length - 3} more
            </span>
          ) : null}

          <span className="ml-auto inline-flex items-center gap-1 text-xs text-neutral-500 transition group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-100">
            Read
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </li>
  );
}
