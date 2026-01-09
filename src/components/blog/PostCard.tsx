'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { PostMeta, Locale } from '@/lib/types';

type Props = {
  locale: Locale;
  post: PostMeta;
};

function formatDate(date: string, locale: Locale) {
  const map: Record<Locale, string> = { ko: 'ko-KR', en: 'en-US', uz: 'uz-UZ' };
  return new Date(date).toLocaleDateString(map[locale] ?? 'en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
}

export default function PostCard({ locale, post }: Props) {
  const href = `/${locale}/blog/${post.slug}`;
  const dateText = formatDate(post.date, locale);

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.25 }}
      className="group"
    >
      <Link
        href={href}
        className={[
          'relative block overflow-hidden rounded-3xl border',
          'border-neutral-200/60 bg-white/60 shadow-sm backdrop-blur',
          'transition will-change-transform',
          'hover:-translate-y-0.5 hover:shadow-md hover:bg-white/70',
          'dark:border-neutral-800/60 dark:bg-neutral-950/40 dark:hover:bg-neutral-950/50'
        ].join(' ')}
      >
        <div className="pointer-events-none absolute inset-0 opacity-60 mask-[radial-gradient(60%_60%_at_30%_0%,black,transparent)]">
          <div className="absolute -top-24 left-0 h-72 w-160 rounded-full bg-linear-to-r from-neutral-200 to-neutral-100 blur-3xl dark:from-neutral-900 dark:to-neutral-950" />
        </div>

        <div className="relative p-6 sm:p-7">
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="inline-flex items-center rounded-full border border-neutral-200/70 bg-white/70 px-2.5 py-1 dark:border-neutral-800/70 dark:bg-neutral-950/40">
              {dateText}
            </span>

            <span className="inline-flex items-center rounded-full border border-neutral-200/70 bg-white/70 px-2.5 py-1 dark:border-neutral-800/70 dark:bg-neutral-950/40">
              {post.readingTime} min read
            </span>

            {post.draft ? (
              <span className="inline-flex items-center rounded-full border border-amber-200/80 bg-amber-50/70 px-2.5 py-1 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                Draft
              </span>
            ) : null}
          </div>

          {/* Title */}
          <h2 className="mt-4 text-lg font-semibold tracking-tight text-neutral-900 transition group-hover:text-neutral-950 dark:text-neutral-50 dark:group-hover:text-white sm:text-xl">
            {post.title}
          </h2>

          {/* Summary */}
          {post.summary ? (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {post.summary}
            </p>
          ) : (
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Read the full post →
            </p>
          )}

          {/* Tags */}
          {post.tags?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.slice(0, 6).map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full border border-neutral-200/70 bg-neutral-50/70 px-3 py-1 text-xs text-neutral-700 dark:border-neutral-800/70 dark:bg-neutral-900/30 dark:text-neutral-200"
                >
                  #{t}
                </span>
              ))}
              {post.tags.length > 6 ? (
                <span className="inline-flex items-center rounded-full border border-neutral-200/70 bg-neutral-50/70 px-3 py-1 text-xs text-neutral-500 dark:border-neutral-800/70 dark:bg-neutral-900/30 dark:text-neutral-400">
                  +{post.tags.length - 6}
                </span>
              ) : null}
            </div>
          ) : null}

          {/* CTA */}
          <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-neutral-700 transition group-hover:text-neutral-900 dark:text-neutral-300 dark:group-hover:text-neutral-100">
            <span>Read</span>
            <span aria-hidden="true" className="transition group-hover:translate-x-0.5">
              →
            </span>
          </div>
        </div>
      </Link>
    </motion.li>
  );
}
