export type Locale = 'ko' | 'en' | 'uz';

export interface PostFrontmatter {
  title: string;
  date: string;        // ISO format (e.g. 2025-10-19)
  slug: string;        // URL segment (unique per locale)
  summary?: string;
  tags?: string[];
  cover?: string;      // optional image path
  draft?: boolean;     // true => hidden in production
  lang: Locale;
}

export interface PostMeta extends PostFrontmatter {
  words: number;        // total word count
  readingTime: number;  // minutes (auto-calculated)
  filepath: string;     // absolute path (for reading MDX)
}
