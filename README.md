# 🌐 Multi-Language Blog Platform

[🇰🇷 한국어 README](./README.kr.md)

![Next.js](https://img.shields.io/badge/Next.js-15-blue?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)
![CI/CD](https://img.shields.io/github/actions/workflow/status/DevFayzullo/multi-lang-blog/ci.yml?label=CI%2FCD&logo=github)
![License](https://img.shields.io/badge/License-MIT-green)

A production-ready **multi-language blog platform** built with **Next.js (App Router)** and **TypeScript**.  
Includes MDX authoring, SEO optimization, dynamic OG images, dark/light mode, and a modern UI design.

---

## 🌟 Features

- 🌏 Multilingual routing (Korean · English · Uzbek)
- 📝 MDX authoring with frontmatter metadata
- 🧭 SEO optimized (OG tags, sitemap, RSS, `hreflang`)
- 🌓 Dark & Light theme (system-aware)
- 🔍 Search + tag filtering (Fuse.js)
- 🎨 Premium responsive UI using Tailwind CSS + Framer Motion
- ⚙️ CI/CD with GitHub Actions + Vercel deploy
- 🧱 Type-safe architecture with Zod + strict TypeScript

---

## 📦 Tech Stack

| Category | Tools |
|-----------|--------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Typography plugin |
| Content | MDX + gray-matter |
| i18n | next-intl |
| Animation | Framer Motion |
| State | Zustand (optional) |
| Deployment | Vercel |
| Testing | Vitest + Playwright |

---

## 📁 Folder Structure
```
src/
├── app/
│   ├── [locale]/blog/
│   ├── [locale]/layout.tsx
│   └── sitemap.xml/route.ts
├── components/
│   ├── layout/
│   └── blog/
├── i18n/
│   ├── messages/
│   └── request.ts
├── lib/
│   ├── posts.ts
│   ├── mdx.ts
│   ├── seo.ts
│   └── types.ts
└── content/
    ├── ko/posts/
    ├── en/posts/
    └── uz/posts/
```

---

## 🚀 Getting Started
```bash
git clone https://github.com/DevFayzullo/multi-lang-blog.git
cd multi-lang-blog
pnpm install
pnpm dev
```
Open: **http://localhost:3000/ko** (or `/en`, `/uz`)

---

<!-- ## ⚙️ Environment Variables
```env
NEXT_PUBLIC_BASE_URL=https://yourdomain.vercel.app
NEXT_PUBLIC_DEFAULT_LOCALE=ko
NEXT_PUBLIC_LOCALES=ko,en,uz
``` -->

---

## 🧠 Writing Posts
Add `.mdx` files to `content/<locale>/posts/`:
```mdx
---
title: "Understanding TypeScript Generics"
date: "2025-10-25"
slug: "ts-generics"
summary: "Deep dive into generics and real-world examples."
tags: ["typescript", "generics"]
lang: "en"
---

Your **MDX content** goes here!
```

---

## 💫 SEO & Social
- Sitemap → `/sitemap.xml`  
- RSS → `/<locale>/feed.xml`  
- OG Image → `/<locale>/og?title=My+Post`

---

<!-- ## 📸 Screenshots

| Light Mode | Dark Mode |
|-------------|------------|
| ![Light mode](./public/demo-light.png) | ![Dark mode](./public/demo-dark.png) | -->

---

## 💼 Developer Portfolio

Built by **[DevFayzullo](https://github.com/DevFayzullo)**  
Based in 🇰🇷 Seoul — focused on **Full-Stack & Next.js Engineering**

---

## 🧠 Quote

> "Create something today that your future self will thank you for."  
> — _Inspired by daily learning & clean code mindset_
