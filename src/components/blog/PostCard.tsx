import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import type { Locale } from '@/lib/types';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const { locale } = params;
  return { title: 'Blog' };
}

export default async function BlogPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const posts = await getAllPosts(locale);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Blog</h1>
      <div className="mt-6 space-y-6">
        {posts.length === 0 && <p className="text-neutral-500">No posts yet.</p>}
        {posts.map((p) => (
          <article key={p.slug}>
            <h2 className="text-xl font-medium">
              <Link href={`/${locale}/blog/${p.slug}`}>{p.title}</Link>
            </h2>
            <p className="text-sm text-neutral-500">
              {new Date(p.date).toLocaleDateString()} • {p.readingTime} min
            </p>
            {p.summary && <p className="mt-2 text-neutral-600">{p.summary}</p>}
          </article>
        ))}
      </div>
    </main>
  );
}