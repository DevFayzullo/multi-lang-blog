import Link from 'next/link';
import { getAllPosts } from '@/src/lib/posts';
import type { Locale } from '@/src/lib/types';
import PostCard from '@/src/components/blog/PostCard';

export default async function BlogIndex({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const posts = await getAllPosts(locale);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Blog</h1>
        <Link href={`/${locale}`} className="text-sm underline opacity-80 hover:opacity-100">
          ← Home
        </Link>
      </div>

      {!posts.length ? (
        <p className="mt-8 text-neutral-500">No posts yet.</p>
      ) : (
        <ul className="mt-6 space-y-6">
          {posts.map(p => (<PostCard key={p.slug} locale={locale} post={p} />))}
        </ul>
      )}
    </main>
  );
}
