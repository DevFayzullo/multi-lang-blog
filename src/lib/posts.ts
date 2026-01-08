import fs from 'node:fs/promises';
import * as fsSync from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';
import type { Locale, PostMeta } from './types';

const fmSchema = z.object({
  title: z.string().min(3),
  date: z.string(),
  slug: z.string().min(1),
  summary: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  cover: z.string().optional(),
  draft: z.boolean().default(false),
  lang: z.enum(["ko", "en", "uz"]),
});

function getContentDir(): string {
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, 'src', 'content'),
    path.join(cwd, 'content'),
  ];

  for (const candidate of candidates) {
    try {
      fsSync.accessSync(candidate);
      return candidate;
    } catch {
      // not found, continue
    }
  }

  console.warn('⚠️ No content folder found. Expected `src/content` or `content`.');
  return path.join(cwd, 'content');
}


const CONTENT_DIR = getContentDir();

export async function getAllPosts(locale: Locale): Promise<PostMeta[]> {
  const dir = path.join(CONTENT_DIR, locale, "posts");
  const files = await safeReaddir(dir);
  const out: PostMeta[] = [];

  for (const f of files) {
    if (!f.endsWith(".mdx") && !f.endsWith(".md")) continue;
    const filepath = path.join(dir, f);

    try {
      const src = await fs.readFile(filepath, "utf8");
      const { data, content } = matter(src);

      const fm = fmSchema.parse({ ...data, lang: locale });
      const words = content.trim().split(/\s+/).filter(Boolean).length;
      const readingTime = Math.max(1, Math.round(words / 200));

      out.push({
        ...fm,
        description: fm.description ?? fm.summary,
        words,
        readingTime,
        filepath,
      });
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

async function safeReaddir(dir: string): Promise<string[]> {
  try {
    return await fs.readdir(dir);
  } catch {
    console.warn(`⚠️ Directory not found: ${dir}`);
    return [];
  }
}
