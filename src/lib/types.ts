export type Locale = 'ko' | 'en' | 'uz';

export interface PostFrontmatter {
  title: string;
  date: string;        
  slug: string;       
  summary?: string;
  description?: string;
  tags?: string[];
  cover?: string;     
  draft?: boolean;     
  lang: Locale;
}

export interface PostMeta extends PostFrontmatter {
  words: number;
  readingTime: number;
  filepath: string;
}
