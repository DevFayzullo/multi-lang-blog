'use client'
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { PostMeta } from '@/lib/types';
import type { Locale } from '@/lib/types';

type Props = {
  locale: Locale;
  post: PostMeta;
};

export default function PostCard({ locale, post }: Props) {
  return (
    <motion.li initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.25 }}
    className="border-b pb-4">
      <Link className="text-lg font-medium underline" href={`/${locale}/blog/${post.slug}`}>
        {post.title}
      </Link>
      <p className="text-sm text-neutral-500">
        {new Date(post.date).toLocaleDateString()} • {post.readingTime} min
      </p>
      {post.summary && (
        <p className="mt-1 text-neutral-700 dark:text-neutral-300">{post.summary}</p>
      )}
      {post.tags?.length ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span key={t} className="rounded-full border px-2 py-0.5 text-xs">#{t}</span>
          ))}
        </div>
      ) : null}
    </motion.li>
  );
}
