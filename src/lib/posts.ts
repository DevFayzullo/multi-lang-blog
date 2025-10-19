import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';
import type { Locale, PostMeta } from './types';

const fmSchema = z.object({
  title: z.string().min(3),
  date: z.string(), 
  slug: z.string().min(1),
  summary: z.string().optional(),
  tags: z.array(z.string()).optional(),
  cover: z.string().optional(),
  draft: z.boolean().default(false),
  lang: z.enum(['ko','en','uz']),
});

const CONTENT_DIR = path.join(process.cwd(), 'content');

export async function getAllPosts(locale: Locale): Promise<PostMeta[]> {
  const dir = path.join(CONTENT_DIR, locale, 'posts');
  const files = await safeReaddir(dir);
  const out: PostMeta[] = [];

  for (const f of files) {
    if (!f.endsWith('.mdx') && !f.endsWith('.md')) continue;
    const filepath = path.join(dir, f);
    const src = await fs.readFile(filepath, 'utf8');
    const { data, content } = matter(src);
    const fm = fmSchema.parse({ ...data, lang: locale });

    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.round(words / 200));

    out.push({ ...fm, words, readingTime, filepath });
  }

  return out
    .filter(p => !p.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function getPostBySlug(locale: Locale, slug: string) {
  const posts = await getAllPosts(locale);
  return posts.find(p => p.slug === slug) ?? null;
}

async function safeReaddir(dir: string): Promise<string[]> {
  try { return await fs.readdir(dir); }
  catch { return []; }
}
