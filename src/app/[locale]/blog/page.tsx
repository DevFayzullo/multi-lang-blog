import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { alternatesForLocale, site, getBaseUrl } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === "ko" ? "블로그" : locale === "uz" ? "Blog" : "Blog";
  const description = site.description;

  const base = getBaseUrl();
  const url = new URL(`/${locale}/blog`, base).toString();

  const og = new URL(`/${locale}/og`, base);
  og.searchParams.set("title", `${title} - ${site.name}`);

  return {
    title,
    description,
    alternates: alternatesForLocale(locale, "/blog"),
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
