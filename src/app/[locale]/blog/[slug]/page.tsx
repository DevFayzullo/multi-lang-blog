import fs from 'node:fs/promises';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/posts';
import type { Locale } from '@/lib/types';
import { Mdx } from '@/lib/mdx';
import { altLocales } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{locale: string; slug: string}> }) {
  const { locale, slug } = await params;
  return { title: `Blog — ${slug}`, alternates: altLocales(locale, `/blog/${slug}`) };
}


export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;  
  const meta = await getPostBySlug(locale, slug);
  if (!meta) return notFound();

  const src = await fs.readFile(meta.filepath, 'utf8');
  const { content } = matter(src);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold">{meta.title}</h1>
      <p className="mt-2 text-sm text-neutral-500">
        {new Date(meta.date).toLocaleDateString()} • {meta.readingTime} min
      </p>

      <div className="mt-8">
        <Mdx source={content} />
      </div>
    </main>
  );
}
