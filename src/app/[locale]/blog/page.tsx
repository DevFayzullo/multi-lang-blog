import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { altLocales, site, getBaseUrl } from "@/lib/seo";

import { getAllPosts } from "@/lib/posts";
import BlogIndexClient from "./BlogIndexClient";
import { Suspense } from "react";

function BlogIndexSkeleton() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-40 rounded-3xl border border-neutral-200/60 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/40"
        />
      ))}
    </div>
  );
}

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

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const posts = await getAllPosts(locale);

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags ?? []))).sort(
    (a, b) => a.localeCompare(b)
  );

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8">
      <h1 className="text-3xl font-semibold tracking-tight">
        {locale === "ko" ? "블로그" : "Blog"}
      </h1>

      <Suspense fallback={<BlogIndexSkeleton />}>
        <BlogIndexClient locale={locale} posts={posts} allTags={allTags} />
      </Suspense>
    </main>
  );
}
