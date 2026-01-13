import fs from 'node:fs/promises';
import { accessSync, constants } from 'node:fs';
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
  lang: z.enum(['ko', 'en', 'uz']),
  description: z.string().optional()
});

function getContentDir(): string {
  const cwd = process.cwd();
  const candidates = [path.join(cwd, 'src', 'content'), path.join(cwd, 'content')];

  for (const candidate of candidates) {
    try {
      accessSync(candidate, constants.F_OK);
      return candidate;
    } catch {
      // skip if not found
    }
  }

  console.warn('⚠️ No content folder found. Expected `src/content` or `content`.');
  return path.join(cwd, 'content');
}

const CONTENT_DIR = getContentDir();

export async function getAllPosts(locale: Locale): Promise<PostMeta[]> {
  const dir = path.join(CONTENT_DIR, locale, 'posts');
  const files = await safeReaddir(dir);
  const out: PostMeta[] = [];

  for (const f of files) {
    if (!f.endsWith('.mdx') && !f.endsWith('.md')) continue;
    const filepath = path.join(dir, f);

    try {
      const src = await fs.readFile(filepath, 'utf8');
      const { data, content } = matter(src);
      const fm = fmSchema.parse({ ...data, lang: locale });

      const words = content.trim().split(/\s+/).filter(Boolean).length;
      const readingTime = Math.max(1, Math.round(words / 200));

      out.push({ ...fm, words, readingTime, filepath } as PostMeta);
    } catch (err) {
      console.warn(`⚠️ Skip invalid frontmatter: ${filepath}`);
      console.warn(err);
    }
  }

  return out
    .filter((p) => !p.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function getPostBySlug(locale: Locale, slug: string) {
  const posts = await getAllPosts(locale);
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getPostNeighbors(locale: Locale, slug: string): Promise<{
  prev: PostMeta | null;
  next: PostMeta | null;
}> {
  const posts = await getAllPosts(locale);
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };

  const prev = idx > 0 ? posts[idx - 1] : null;
  const next = idx < posts.length - 1 ? posts[idx + 1] : null;

  return { prev, next };
}

async function safeReaddir(dir: string): Promise<string[]> {
  try {
    return await fs.readdir(dir);
  } catch {
    console.warn(`⚠️ Directory not found: ${dir}`);
    return [];
  }
}
