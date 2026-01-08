import fs from 'node:fs/promises';
import matter from 'gray-matter';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import type { Locale } from '@/lib/types';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { Mdx } from '@/lib/mdx';
import { altLocales } from '@/lib/seo';
import ReadingProgress from '@/components/blog/ReadingProgress';
import TableOfContents, { type TocItem } from '@/components/blog/TableOfContents';
import { slugify } from '@/lib/slug';

export const dynamicParams = false;

const LOCALES: readonly Locale[] = ['ko', 'en', 'uz'];

function formatDate(date: string, locale: Locale) {
  const map: Record<Locale, string> = { ko: 'ko-KR', en: 'en-US', uz: 'uz-UZ' };
  return new Date(date).toLocaleDateString(map[locale] ?? 'en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
}

function stripCodeFences(md: string) {
  return md
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '');
}

function extractToc(md: string): TocItem[] {
  const clean = stripCodeFences(md);
  const lines = clean.split('\n');

  const items: TocItem[] = [];
  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)\s*$/);
    const h3 = line.match(/^###\s+(.+)\s*$/);

    const raw = (h2?.[1] ?? h3?.[1])?.trim();
    if (!raw) continue;

    const title = raw
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/[*_`]/g, '')
      .trim();

    const id = slugify(title);
    items.push({ id, title, level: h2 ? 2 : 3 });
  }
  return items;
}

export async function generateStaticParams() {
  const all = await Promise.all(
    LOCALES.map(async (locale) => {
      const posts = await getAllPosts(locale);
      return posts.map((p) => ({ locale, slug: p.slug }));
    })
  );
  return all.flat();
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
  const description = meta.description ?? meta.summary ?? 'Multi-language blog post';

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

export default async function PostPage({
  params
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;

  const meta = await getPostBySlug(locale, slug);
  if (!meta) return notFound();

  const src = await fs.readFile(meta.filepath, 'utf8');
  const { content } = matter(src);

  // TOC
  const toc = extractToc(content);

  // prev/next + related
  const all = await getAllPosts(locale);
  const idx = all.findIndex((p) => p.slug === slug);

  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  const tags = meta.tags ?? [];
  const related = all
    .filter((p) => p.slug !== slug)
    .map((p) => {
      const overlap = (p.tags ?? []).filter((t) => tags.includes(t)).length;
      return { p, overlap };
    })
    .filter((x) => x.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || +new Date(b.p.date) - +new Date(a.p.date))
    .slice(0, 3)
    .map((x) => x.p);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const canonical = `${baseUrl}/${locale}/blog/${slug}`;

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
            <div className="absolute -top-24 left-1/2 h-72 w-184 -translate-x-1/2 rounded-full bg-linear-to-r from-neutral-200 to-neutral-100 blur-3xl dark:from-neutral-900 dark:to-neutral-950" />
          </div>

          <div className="relative">
            <p className="text-xs font-medium tracking-wider text-neutral-500 dark:text-neutral-400">
              ARTICLE
            </p>

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

            {meta.cover ? (
              <div className="mt-7 overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60">
                <Image
                  src={meta.cover}
                  alt={meta.title}
                  width={1600}
                  height={900}
                  className="h-auto w-full object-cover"
                  priority
                />
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
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-neutral-200/60 bg-white/50 p-5 dark:border-neutral-800/60 dark:bg-neutral-950/30">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Newer</p>
                {newer ? (
                  <Link
                    href={`/${locale}/blog/${newer.slug}`}
                    className="mt-1 block font-medium text-neutral-900 hover:underline dark:text-neutral-100"
                  >
                    {newer.title}
                  </Link>
                ) : (
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">No newer post</p>
                )}
              </div>

              <div className="rounded-2xl border border-neutral-200/60 bg-white/50 p-5 dark:border-neutral-800/60 dark:bg-neutral-950/30">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Older</p>
                {older ? (
                  <Link
                    href={`/${locale}/blog/${older.slug}`}
                    className="mt-1 block font-medium text-neutral-900 hover:underline dark:text-neutral-100"
                  >
                    {older.title}
                  </Link>
                ) : (
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">No older post</p>
                )}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 h-fit space-y-4">
            <TableOfContents items={toc} />

            <div className="rounded-3xl border border-neutral-200/60 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/40">
              <h2 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                Share
              </h2>
              <div className="mt-4 flex flex-wrap gap-3 text-xs">
                <a
                  className="underline text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(meta.title)}&url=${encodeURIComponent(
                    canonical
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Share on X
                </a>
                <a
                  className="underline text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonical)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Share on LinkedIn
                </a>
              </div>
            </div>

            {related.length ? (
              <div className="rounded-3xl border border-neutral-200/60 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/40">
                <h2 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                  Related posts
                </h2>
                <ul className="mt-4 space-y-3 text-sm">
                  {related.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/${locale}/blog/${p.slug}`}
                        className="text-neutral-700 hover:text-neutral-900 hover:underline dark:text-neutral-300 dark:hover:text-neutral-100"
                      >
                        {p.title}
                      </Link>
                      <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        {formatDate(p.date, locale)} • {p.readingTime} min
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="rounded-3xl border border-neutral-200/60 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/40">
              <h2 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                Details
              </h2>
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
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}
