import type { Locale } from "@/lib/types";

export const site = {
  name: "Multi-Lang Blog",
  description: "TypeScript + Next.js multi-language blog",
  author: "DevFayzullo",
  twitterHandle: "@FayzulloDev",
};

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
}

export const locales: Locale[] = ["ko", "en", "uz"];

export function canonicalUrl(locale: Locale, pathname: string) {
  const base = getBaseUrl();
  return new URL(`/${locale}${pathname}`, base).toString();
}

export function alternatesForLocale(locale: Locale, pathname: string) {
  const base = getBaseUrl();

  const languages = Object.fromEntries(
    locales.map((l) => [l, new URL(`/${l}${pathname}`, base).toString()])
  ) as Record<Locale, string>;

  return {
    canonical: new URL(`/${locale}${pathname}`, base).toString(),
    languages,
  };
}
