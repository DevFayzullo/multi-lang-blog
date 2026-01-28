import type { MetadataRoute } from "next";
import { LOCALES, getBaseUrl } from "@/lib/seo";
import { getAllPosts } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseUrl();
  const now = new Date();

  const items: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    // Home
    items.push({
      url: `${base}/${locale}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });

    // Blog index
    items.push({
      url: `${base}/${locale}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    });

    // Posts
    const posts = await getAllPosts(locale);
    for (const p of posts) {
      items.push({
        url: `${base}/${locale}/blog/${p.slug}`,
        lastModified: new Date(p.date),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return items;
}
