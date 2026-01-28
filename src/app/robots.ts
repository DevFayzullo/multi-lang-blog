import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/_next/",
          "/api/",
          "/og",
          "/*/og", // /ko/og, /en/og, /uz/og
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
