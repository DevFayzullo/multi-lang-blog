import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';
import type { Locale } from '@/lib/types';
import { getBaseUrl } from '@/lib/site';

export async function GET() {
  const base = getBaseUrl();
  const locales: readonly Locale[] = ['ko', 'en', 'uz'];

  const urls: string[] = [];

  for (const l of locales) {
    urls.push(`${base}/${l}`, `${base}/${l}/blog`);

    const posts = await getAllPosts(l);
    for (const p of posts) {
      urls.push(`${base}/${l}/blog/${encodeURIComponent(p.slug)}`);
    }
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>`;

  return new NextResponse(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
}
