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
    <div className="mt-6 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="h-10 w-full md:w-1/2 rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white/40 dark:bg-neutral-950/30" />
        <div className="flex flex-wrap items-center gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-7 w-16 rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white/40 dark:bg-neutral-950/30"
            />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-3xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white/40 dark:bg-neutral-950/30"
          />
        ))}
      </div>
    </div>
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
