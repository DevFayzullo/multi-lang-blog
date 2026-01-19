import type { Metadata } from "next";
import { Suspense } from "react";

import type { Locale } from "@/lib/types";
import { getAllPosts } from "@/lib/posts";
import BlogIndexClient from "./BlogIndexClient";
import { altLocales, site, getBaseUrl } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === "ko" ? "블로그" : "Blog";
  const description = site.description;

  const base = getBaseUrl();
  const url = new URL(`/${locale}/blog`, base).toString();

  const og = new URL(`/${locale}/og`, base);
  og.searchParams.set("title", `${title} - ${site.name}`);

  return {
    title,
    description,
    alternates: altLocales(locale, "/blog"),
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [{ url: og.toString(), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [og.toString()],
    },
  };
}

function BlogIndexFallback() {
  return (
    <div className="mt-6 rounded-3xl border border-neutral-200/60 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/40">
      <div className="h-9 w-full rounded-2xl bg-neutral-200/60 dark:bg-neutral-800/60" />
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-3xl border border-neutral-200/60 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/40"
          />
        ))}
      </div>
    </div>
  );
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const posts = await getAllPosts(locale);

  const allTags = Array.from(
    new Set(posts.flatMap((p) => p.tags ?? []))
  ).sort((a, b) => a.localeCompare(b));

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
        Blog
      </h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        {site.description}
      </p>

      <Suspense fallback={<BlogIndexFallback />}>
        <BlogIndexClient locale={locale} posts={posts} allTags={allTags} />
      </Suspense>
    </main>
  );
}
