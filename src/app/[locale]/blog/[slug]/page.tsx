import fs from 'node:fs/promises';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';

import type { Locale } from '@/lib/types';
import { getPostBySlug } from '@/lib/posts';
import { Mdx } from '@/lib/mdx';
import { altLocales } from '@/lib/seo';
import ReadingProgress from '@/components/blog/ReadingProgress';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const title = `Blog — ${slug}`;

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const og = new URL(`/${locale}/og`, base);
  og.searchParams.set('title', title);

  return {
    title,
    alternates: altLocales(locale, `/blog/${slug}`),
    openGraph: {
      title,
      images: [{ url: og.toString(), width: 1200, height: 630 }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
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

  return (
    <>
      <ReadingProgress />

      <main className="mx-auto max-w-3xl px-6 py-12">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">{meta.title}</h1>
          <p className="mt-2 text-sm text-neutral-500">
            {new Date(meta.date).toLocaleDateString()} • {meta.readingTime} min
          </p>
          {meta.tags?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {meta.tags.map((t) => (
                <span key={t} className="rounded-full border px-2 py-0.5 text-xs">
                  #{t}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        <article className="mt-8 prose prose-neutral dark:prose-invert max-w-none">
          <Mdx source={content} />
        </article>
      </main>
    </>
  );
}
