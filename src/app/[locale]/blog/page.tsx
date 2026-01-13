import { Suspense } from 'react';
import { getAllPosts } from '@/lib/posts';
import type { Locale } from '@/lib/types';
import { altLocales } from '@/lib/seo';
import BlogIndexClient from './BlogIndexClient';
import BlogIndexSkeleton from './BlogIndexSkeleton';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: 'Blog', alternates: altLocales(locale, '/blog') };
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
