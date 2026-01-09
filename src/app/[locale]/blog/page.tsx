import { Suspense } from 'react';
import { getAllPosts } from '@/lib/posts';
import type { Locale } from '@/lib/types';
import { altLocales } from '@/lib/seo';
import BlogIndexClient from './BlogIndexClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: 'Blog', alternates: altLocales(locale, '/blog') };
}

function BlogIndexSkeleton() {
  return (
    <section className="mt-6">
      <div className="rounded-3xl border border-neutral-200/60 bg-white/60 p-4 shadow-sm backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/40">
        <div className="h-10 w-full rounded-2xl bg-neutral-200/50 dark:bg-neutral-800/40" />
        <div className="mt-3 flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-7 w-20 rounded-full bg-neutral-200/50 dark:bg-neutral-800/40"
            />
          ))}
        </div>
      </div>

      <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <li
            key={i}
            className="h-44 rounded-3xl border border-neutral-200/60 bg-white/60 shadow-sm backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/40"
          />
        ))}
      </ul>
    </section>
  );
}

export default async function BlogIndex({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const posts = await getAllPosts(locale);
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags ?? []))).sort();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Blog</h1>

      <Suspense fallback={<BlogIndexSkeleton />}>
        <BlogIndexClient locale={locale} posts={posts} allTags={tags} />
      </Suspense>
    </main>
  );
}
