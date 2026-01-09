import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';
import type { Locale } from '@/lib/types';
import { getBaseUrl } from '@/lib/site';

const LOCALES: readonly Locale[] = ['ko', 'en', 'uz'] as const;

function isLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale: localeStr } = await params;
  const locale: Locale = isLocale(localeStr) ? localeStr : 'ko';

  const base = getBaseUrl();

  const posts = await getAllPosts(locale);
  const items = posts
    .map((p) => {
      const url = `${base}/${locale}/blog/${encodeURIComponent(p.slug)}`;
      return `
      <item>
        <title>${escapeXml(p.title)}</title>
        <link>${url}</link>
        <guid>${url}</guid>
        <pubDate>${new Date(p.date).toUTCString()}</pubDate>
        ${p.summary ? `<description>${escapeXml(p.summary)}</description>` : ''}
      </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
 <channel>
  <title>${locale.toUpperCase()} Feed - Multi-Language Blog</title>
  <link>${base}/${locale}/blog</link>
  <description>Latest posts</description>
  ${items}
 </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
  });
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
