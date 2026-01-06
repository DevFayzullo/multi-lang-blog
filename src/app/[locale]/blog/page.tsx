import { getAllPosts } from '@/lib/posts';
import type { Locale } from '@/lib/types';
import { altLocales } from '@/lib/seo';
import BlogIndexClient from './BlogIndexClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: 'Blog',
    description: 'Articles, notes, and insights',
    alternates: altLocales(locale, '/blog')
  };
}

export default async function BlogIndex({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const posts = await getAllPosts(locale);
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags ?? []))).sort();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/40">
        <div className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(60%_50%_at_50%_0%,black,transparent)]">
          <div className="absolute -top-24 left-1/2 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-neutral-200 to-neutral-100 blur-3xl dark:from-neutral-900 dark:to-neutral-950" />
        </div>

        <div className="relative">
          <p className="text-xs font-medium tracking-wider text-neutral-500 dark:text-neutral-400">
            MULTI-LANG BLOG
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Blog
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Posts in <span className="font-medium text-neutral-900 dark:text-neutral-100">{locale.toUpperCase()}</span>. Search, filter by tags, and
            read with clean typography.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full border border-neutral-200/70 bg-white/70 px-3 py-1 text-xs text-neutral-700 dark:border-neutral-800/70 dark:bg-neutral-950/40 dark:text-neutral-200">
              {posts.length} posts
            </span>
            <span className="inline-flex items-center rounded-full border border-neutral-200/70 bg-white/70 px-3 py-1 text-xs text-neutral-700 dark:border-neutral-800/70 dark:bg-neutral-950/40 dark:text-neutral-200">
              {tags.length} tags
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mt-10">
        <div className="rounded-3xl border border-neutral-200/60 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/40">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                Latest articles
              </h2>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                Use search and tags to quickly find what you need.
              </p>
            </div>
          </div>

          <BlogIndexClient locale={locale} posts={posts} allTags={tags} />
        </div>
      </section>
    </main>
  );
}
