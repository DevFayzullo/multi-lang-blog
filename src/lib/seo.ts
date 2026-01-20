import type { Locale } from "@/lib/types";

export const LOCALES: readonly Locale[] = ["ko", "en", "uz"] as const;
export const DEFAULT_LOCALE: Locale = "ko";

export const site = {
  name: "Multi-Lang Blog",
  description: "TypeScript + Next.js multi-language blog",
} as const;

export function getBaseUrl(): string {
  const explicit =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL;

  if (explicit) return stripTrailingSlash(explicit);

  const netlify =
    process.env.URL || process.env.DEPLOY_PRIME_URL || process.env.CONTEXT;

  if (typeof netlify === "string" && netlify.startsWith("http")) {
    return stripTrailingSlash(netlify);
  }

  return "http://localhost:3000";
}

function stripTrailingSlash(url: string) {
  return url.replace(/\/+$/, "");
}

export function altLocales(locale: Locale, path: string) {
  const base = getBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${base}/${l}${cleanPath}`;
  }

  return {
    canonical: `${base}/${locale}${cleanPath}`,
    languages: {
      ...languages,
      "x-default": `${base}/${DEFAULT_LOCALE}${cleanPath}`,
    },
  };
}

export function ogImageUrl(locale: Locale, title: string) {
  const base = getBaseUrl();
  const og = new URL(`/${locale}/og`, base);
  og.searchParams.set("title", title);
  return og.toString();
}
