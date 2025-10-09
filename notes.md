# 🎯 Project Overview

A production‑ready, multi‑language blog platform targeting Korean employers. Stack: **Next.js (App Router) + TypeScript + Tailwind CSS + next-intl (or next-i18next) + MDX** (with optional CMS later), **Prisma + SQLite/PostgreSQL** (optional), **Zustand** for light client state, **Playwright** for e2e, **ESLint/Prettier** for quality, and **Vercel** for deploy.

---

## 🧭 Goals & Hiring Signals

1. **Internationalization expertise** (KO/EN/UZ with SEO-friendly routes)
2. **Content authoring UX** (MDX, code blocks, images, TOC)
3. **Performance & SEO** (Core Web Vitals, metadata, OG images)
4. **Clean TS design** (types, generics, Zod validation)
5. **Team-ready repo** (CI, tests, issues board, good README in EN+KO)

---

## 🗺️ Milestones (2–3 Weeks)

### Week 1 — Foundations

- [ ] Initialize Next.js (App Router), TypeScript, Tailwind
- [ ] Setup i18n (next-intl or next-i18next) with `ko`, `en`, `uz`
- [ ] Design routing: `/ko`, `/en`, `/uz` + localized slugs `/ko/blog/…`
- [ ] Content model: MDX posts with frontmatter (title, date, tags, summary, lang, slug)
- [ ] Layouts: `RootLayout`, `LocaleLayout`, `BlogLayout`; Header/Footer/Nav
- [ ] Home page (localized), Blog index (filters by lang & tag), Post page (MDX)
- [ ] Basic SEO: `<Metadata>`, sitemap, robots.txt, canonical, hreflang

### Week 2 — Authoring & UX

- [ ] MDX features: code highlight, callouts, TOC auto-gen, image captions
- [ ] Search (by title/tag) + tag chips; client + static index
- [ ] Drafts support (frontmatter `draft: true` hidden in prod)
- [ ] Dark/Light mode with system preference (tailwind `class` strategy)
- [ ] OG image generation route (dynamic based on title)
- [ ] RSS/Atom feeds per locale

### Week 3 — Quality & Deploy

- [ ] Accessibility pass (aria, focus rings, color contrast)
- [ ] Testing: unit (Vitest), e2e (Playwright) for critical flows
- [ ] CI/CD: GitHub Actions — lint, type-check, build, tests
- [ ] Analytics (Vercel Analytics + optional Plausible)
- [ ] Deploy to Vercel; set preview branches
- [ ] Polish README (EN + KO), add demo screenshots, badges

---

## 🧱 Architecture

- **Rendering:** Next.js App Router, SSG for public pages, ISR optional
- **Content Source:**

  - Phase 1: Local MDX in `/content/<locale>/posts/*.mdx`
  - Phase 2 (optional): Headless CMS (Contentlayer, Contentful, Sanity)

- **State:** minimal; search UI + theme with Zustand
- **Validation:** Zod for parsing frontmatter and route params
- **Styling:** Tailwind + clsx + tailwind-merge
- **Icons:** `lucide-react`
- **Code blocks:** `rehype-pretty-code`

---

## 📁 Folder Structure (App Router)

```
.
├─ app
│  ├─ (marketing)
│  │  ├─ [locale]
│  │  │  ├─ layout.tsx         // locale provider + nav/footer
│  │  │  ├─ page.tsx           // localized landing
│  │  │  ├─ blog
│  │  │  │  ├─ page.tsx        // blog index for locale
│  │  │  │  └─ [slug]
│  │  │  │     └─ page.tsx     // post page
│  │  │  ├─ tags
│  │  │  │  └─ [tag]
│  │  │  │     └─ page.tsx
│  │  │  ├─ feed.xml/route.ts  // RSS per locale
│  │  │  └─ og/route.ts        // dynamic OG image
│  ├─ sitemap.xml/route.ts
│  └─ robots.txt/route.ts
├─ components
│  ├─ ui/* (Button, Chip, Badge, ToggleTheme, Pagination, TOC)
│  ├─ mdx/* (Callout, CodeBlock, Image, Prose)
│  └─ layout/* (Header, Footer, LocaleSwitcher)
├─ content
│  ├─ en/posts/*.mdx
│  ├─ ko/posts/*.mdx
│  └─ uz/posts/*.mdx
├─ lib
│  ├─ i18n/
│  │  ├─ config.ts
│  │  └─ messages/{en,ko,uz}.json
│  ├─ mdx.ts   // mdx compiler config (remark/rehype)
│  ├─ posts.ts // load/validate posts, build indexes
│  ├─ seo.ts   // metadata, hreflang, canonical utils
│  ├─ rss.ts   // RSS builders
│  ├─ search.ts
│  └─ types.ts // shared TS types (Post, Tag, Locale)
├─ public
│  ├─ images/*  // logos, og templates
│  └─ favicons/*
├─ styles
│  └─ globals.css
├─ tests (vitest + playwright)
├─ .github/workflows/ci.yml
└─ README.md
```

---

## 🧬 Data Model (TypeScript)

```ts
export type Locale = "ko" | "en" | "uz";

export interface PostFrontmatter {
  title: string;
  date: string; // ISO
  slug: string; // locale-specific
  summary?: string;
  tags?: string[];
  cover?: string; // /public/images/...
  draft?: boolean;
  lang: Locale;
}

export interface PostMeta extends PostFrontmatter {
  readingTime: number; // minutes
  words: number;
}
```

**Zod validation**

```ts
import { z } from "zod";

export const frontmatterSchema = z.object({
  title: z.string().min(3),
  date: z.string().datetime(),
  slug: z.string().min(1),
  summary: z.string().optional(),
  tags: z.array(z.string()).default([]),
  cover: z.string().url().optional(),
  draft: z.boolean().default(false),
  lang: z.enum(["ko", "en", "uz"]),
});
```

---

## 🌐 i18n Strategy

- **Locales:** `ko` (default), `en`, `uz`
- **Localized Routes:** `/ko/blog/[slug]`, `/en/blog/[slug]`, `/uz/blog/[slug]`
- **Hreflang Links:** add `x-default` and per-locale alternates
- **Locale Switcher:** persists path when switching locales
- **Messages:** JSON namespaced: `common.json`, `home.json`, `blog.json`

---

## ✍️ MDX Authoring Features

- Syntax highlight (rehype-pretty-code) with copy button
- `<Callout type="info|warn|tip">` component
- Auto TOC from headings (`h2/h3`)
- Image component with captions + lazy loading
- Footnotes support (remark-footnotes)
- Embeds: YouTube, Twitter/X (as iframes or oEmbed proxy)

**Example frontmatter**

```mdx
---
title: "타입스크립트 제네릭 제대로 이해하기"
date: "2025-09-01"
slug: "ts-generics"
summary: "제네릭의 핵심 패턴과 실무 적용"
tags: ["typescript", "generics"]
lang: "ko"
---
```

---

## 🔎 Search

- Build a static index at build time (title, tags, summary)
- Client-side fuzzy search (Fuse.js) scoped to current locale
- Tag filters (chip UI) + query param sync

---

## 🚀 SEO & Performance

- Next.js `generateMetadata` per page
- Canonical + hreflang + structured data (BlogPosting)
- OG image route using `@vercel/og`
- Image optimization via `next/image`
- Strict TS, route handlers typed
- Lighthouse target: 95+ across the board

---

## 🧪 Testing & CI

- **Unit:** Vitest + Testing Library for components
- **E2E:** Playwright: locale navigation, post open, search, theme toggle
- **CI:** GH Actions: pnpm install, lint, `tsc --noEmit`, test, build

`/.github/workflows/ci.yml`

```yml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - run: pnpm i --frozen-lockfile
      - run: pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

---

## 🖼️ UI Components (MVP)

- **Layout:** Header, Footer, LocaleSwitcher, ThemeToggle
- **Blog:** PostCard, PostList, TagChip, Pagination, TOC, Prose(MDX)
- **MDX:** CodeBlock, Callout, ImageWithCaption, Quote
- **Common:** Button, Input, Badge, Skeleton

---

## 🧰 Scripts

- `pnpm dev` — dev server
- `pnpm build` — build
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm lint` — ESLint + Prettier
- `pnpm test` — Vitest
- `pnpm e2e` — Playwright
- `pnpm analyze` — bundle analyzer (optional)

---

## 🔐 Env & Config

- `.env.local` for optional CMS keys (later)
- `NEXT_PUBLIC_DEFAULT_LOCALE=ko`
- `NEXT_PUBLIC_LOCALES=ko,en,uz`

---

## 📄 README Outline (EN + KO)

1. Project intro + tech stack badges
2. Live demo (Vercel) + screenshots
3. Features (i18n, MDX, SEO, OG images, search, dark mode)
4. Getting started (pnpm, env, running commands)
5. Content writing guide (frontmatter schema)
6. i18n usage guide (how to add a new string)
7. Testing & CI
8. Roadmap & Contributing
9. License

---

## ✅ First Issues (copy to GitHub)

1. Feat: App Router init + Tailwind + ESLint/Prettier
2. Feat: i18n provider + localized routing (ko/en/uz)
3. Feat: Layouts + Header/Footer + LocaleSwitcher
4. Feat: MDX compile pipeline + Post loader + Zod validation
5. Feat: Blog index page + PostCard + Pagination
6. Feat: Post page with TOC + CodeHighlight + Prose
7. Feat: Search + Tag filter (Fuse.js)
8. Feat: OG image route
9. Feat: RSS feed per locale
10. Chore: CI workflow + basic tests

---

## 🧭 Sample User Stories

- As a reader, I can switch between **Korean/English/Uzbek** and keep the same URL context.
- As a reader, I can **search** posts within the current locale.
- As an author, I can write posts in **MDX** with code blocks and callouts.
- As an author, I can preview drafts locally but they won’t deploy in production.

---

## 🔄 Future Enhancements (Phase 2)

- Migrate content to **Contentlayer** or headless CMS (Sanity/Contentful)
- Add **Admin editor** (Next.js route handlers + Auth.js)
- Comments (giscus/Utterances) per locale
- Sitemap with **lastmod** per post via CMS
- Algolia search for large content sets

---

## 🧩 Example Component Snippets

```tsx
// components/layout/LocaleSwitcher.tsx
"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
const locales = ["ko", "en", "uz"] as const;
export default function LocaleSwitcher() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const current = locales.includes(parts[0] as any) ? parts[0] : "ko";
  const rest = locales.includes(parts[0] as any) ? parts.slice(1) : parts;
  return (
    <div className="flex gap-2">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${[l, ...rest].join("/")}`}
          className={`px-2 py-1 rounded ${
            l === current ? "font-bold underline" : ""
          }`}>
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
```

---

## 📝 Commit Convention (Korea‑friendly)

- `feat(app): add i18n provider (ko/en/uz)`
- `chore(ci): add GitHub Actions`
- `fix(blog): slug encoding for Korean`

---

## 🧪 Minimal Playwright Test Plan

- Locale routing keeps context when switching
- Blog index lists only current locale posts
- Post page renders MDX components (code, callout)
- Search returns expected post by tag/title

---

## 📌 Resume Bullets (to paste)

- Built a **multi-language blog** (KO/EN/UZ) with **Next.js + TypeScript**, implementing SEO-friendly localized routing and **hreflang** metadata.
- Engineered an **MDX authoring pipeline** with Zod-validated frontmatter, code highlighting, TOC, and dynamic OG image generation.
- Achieved **95+ Lighthouse** scores via image optimization, static generation, and careful bundle control; automated CI/CD with GitHub Actions and **Playwright** e2e tests.

---

## 🎁 Deliverables Checklist

- Public repo with clean commits
- Deployed Vercel link + preview branches
- README (EN + KO) with screenshots
- Sample posts: 2 per locale (total 6)
- Lighthouse report screenshot
- CI passing badge
