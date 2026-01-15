import type { Locale } from "@/lib/types";

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
}

export const site = {
  name: "Multi-Lang Blog",
  description: "TypeScript + Next.js multi-language blog",
  ogImagePath: "/og", 
};

export const LOCALES: Locale[] = ["ko", "en", "uz"];

export function altLocales(locale: string, path: string) {
  const base = getBaseUrl();

  const normalized: Locale = (LOCALES as string[]).includes(locale)
    ? (locale as Locale)
    : "en";

  const languages = Object.fromEntries(
    LOCALES.map((l) => [l, new URL(`/${l}${path}`, base).toString()])
  ) as Record<Locale, string>;

  return {
    canonical: new URL(`/${normalized}${path}`, base).toString(),
    languages: {
      ...languages,
      "x-default": new URL(`/ko${path}`, base).toString(),
    } as Record<string, string>,
  };
}
