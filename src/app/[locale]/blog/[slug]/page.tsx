import fs from 'node:fs/promises';
import matter from 'gray-matter';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import type { Locale } from '@/lib/types';
import { getPostBySlug, getPostNeighbors } from '@/lib/posts';
import { Mdx } from '@/lib/mdx';
import { altLocales } from '@/lib/seo';
import ReadingProgress from '@/components/blog/ReadingProgress';

function formatDate(date: string, locale: Locale) {
  const map: Record<Locale, string> = { ko: 'ko-KR', en: 'en-US', uz: 'uz-UZ' };
  return new Date(date).toLocaleDateString(map[locale] ?? 'en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const meta = await getPostBySlug(locale as Locale, slug);
  if (!meta) return { title: 'Post not found' };

  const title = meta.title;
  const description = meta.description ?? 'Multi-language blog post';

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const og = new URL(`/${locale}/og`, base);
  og.searchParams.set('title', title);

  return {
    title,
    description,
    alternates: altLocales(locale, `/blog/${slug}`),
    openGraph: {
      title,
      description,
      images: [{ url: og.toString(), width: 1200, height: 630 }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [og.toString()]
    }
  };
}

function NavCard({
  locale,
  direction,
  post
}: {
  locale: Locale;
  direction: 'prev' | 'next';
  post: { slug: string; title: string; date: string; readingTime: number; summary?: string };
}) {
  const isPrev = direction === 'prev';
  const href = `/${locale}/blog/${post.slug}`;

  return (
    <Link
      href={href}
      className="group block rounded-3xl border border-neutral-200/60 bg-white/60 p-6 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800/60 dark:bg-neutral-950/40"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="text-xs font-medium tracking-wide text-neutral-500 dark:text-neutral-400">
          {isPrev ? '← Prev (Newer)' : 'Next (Older) →'}
        </div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400">
          {formatDate(post.date, locale)} • {post.readingTime} min
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          {post.title}
        </h3>
        {post.summary ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {post.summary}
          </p>
        ) : null}
      </div>

      <div className="mt-4 text-xs text-neutral-500 transition group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-100">
        Open post →
      </div>
    </Link>
  );
}

export default async function PostPage({
  params
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;

  const meta = await getPostBySlug(locale, slug);
  if (!meta) return notFound();

  const { prev, next } = await getPostNeighbors(locale, slug);

  const src = await fs.readFile(meta.filepath, 'utf8');
  const { content } = matter(src);

  return (
    <>
      <ReadingProgress />

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Top bar */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            <span aria-hidden="true">←</span>
            Back to Blog
          </Link>

          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {formatDate(meta.date, locale)} • {meta.readingTime} min read
          </div>
        </div>

        {/* Header card */}
        <section className="relative overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/40">
          <div className="pointer-events-none absolute inset-0 opacity-60 mask-[radial-gradient(60%_60%_at_50%_0%,black,transparent)]">
            <div className="absolute -top-24 left-1/2 h-72 w- -translate-x-1/2 rounded-full bg-linear-to-r from-neutral-200 to-neutral-100 blur-3xl dark:from-neutral-900 dark:to-neutral-950" />
          </div>

          <div className="relative">
            <p className="text-xs font-medium tracking-wider text-neutral-500 dark:text-neutral-400">ARTICLE</p>

            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              {meta.title}
            </h1>

            {meta.description ? (
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                {meta.description}
              </p>
            ) : null}

            {meta.tags?.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {meta.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full border border-neutral-200/70 bg-white/70 px-3 py-1 text-xs text-neutral-700 dark:border-neutral-800/70 dark:bg-neutral-950/40 dark:text-neutral-200"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <section className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          {/* Article */}
          <article className="rounded-3xl border border-neutral-200/60 bg-white/60 p-7 shadow-sm backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/40">
            <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:tracking-tight">
              <Mdx source={content} />
            </div>

            {/* Prev/Next */}
            {(prev || next) && (
              <div className="mt-10 border-t border-neutral-200/60 pt-8 dark:border-neutral-800/60">
                <h2 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                  Continue reading
                </h2>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {prev ? <NavCard locale={locale} direction="prev" post={prev} /> : <div />}
                  {next ? <NavCard locale={locale} direction="next" post={next} /> : <div />}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 h-fit space-y-4">
            <div className="rounded-3xl border border-neutral-200/60 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/40">
              <h2 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Details</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-neutral-600 dark:text-neutral-400">Locale</dt>
                  <dd className="font-medium text-neutral-900 dark:text-neutral-100">{locale.toUpperCase()}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-neutral-600 dark:text-neutral-400">Date</dt>
                  <dd className="font-medium text-neutral-900 dark:text-neutral-100">{formatDate(meta.date, locale)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-neutral-600 dark:text-neutral-400">Reading</dt>
                  <dd className="font-medium text-neutral-900 dark:text-neutral-100">{meta.readingTime} min</dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap gap-2">
                <a
                  className="text-xs underline text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(meta.title)}&url=${encodeURIComponent(
                    `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/${locale}/blog/${slug}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Share on X
                </a>
                <a
                  className="text-xs underline text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/${locale}/blog/${slug}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Share on LinkedIn
                </a>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}
