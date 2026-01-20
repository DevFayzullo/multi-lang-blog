import { Suspense } from "react";
import type { Metadata } from "next";

import { getAllPosts } from "@/lib/posts";
import type { Locale } from "@/lib/types";
import { altLocales, ogImageUrl, site } from "@/lib/seo";

import BlogIndexClient from "./BlogIndexClient";

const LOCALES: Locale[] = ["ko", "en", "uz"];

export function generateStaticParams(): Array<{ locale: Locale }> {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === "ko" ? "블로그" : "Blog";
  const description = site.description;

  const alternates = altLocales(locale, "/blog");
  const og = ogImageUrl(locale, `${title} | ${site.name}`);

  return {
    title,
    description,
    alternates,
    openGraph: {
      type: "website",
      title,
      description,
      url: alternates.canonical,
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [og],
    },
  };
}

export default async function BlogIndex({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const posts = await getAllPosts(locale);
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags ?? []))).sort();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Blog
        </h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          {posts.length} posts
        </p>
      </div>

      <Suspense
        fallback={
          <div className="rounded-3xl border border-neutral-200/60 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/40">
            <div className="h-10 w-full rounded-2xl bg-neutral-200/60 dark:bg-neutral-800/60" />
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="h-32 rounded-3xl bg-neutral-200/60 dark:bg-neutral-800/60" />
              <div className="h-32 rounded-3xl bg-neutral-200/60 dark:bg-neutral-800/60" />
            </div>
          </div>
        }
      >
        <BlogIndexClient locale={locale} posts={posts} allTags={tags} />
      </Suspense>
    </main>
  );
}
