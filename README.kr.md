# 🌐 다국어 블로그 플랫폼

[🇬🇧 English README](./README.md)

![Next.js](https://img.shields.io/badge/Next.js-15-blue?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/배포-Vercel-black?logo=vercel)
![CI/CD](https://img.shields.io/github/actions/workflow/status/DevFayzullo/multi-lang-blog/ci.yml?label=CI%2FCD&logo=github)
![License](https://img.shields.io/badge/License-MIT-green)

**Next.js (App Router)**와 **TypeScript**로 제작된 실무 수준의 다국어 블로그 플랫폼입니다.  
MDX 기반 글 작성, SEO 최적화, OG 이미지, 다크모드, 최신 UI 디자인을 포함합니다.

---

## 🌟 주요 기능

- 🌏 다국어 라우팅 (한국어 · 영어 · 우즈벡어)
- 📝 Frontmatter 기반 MDX 포스트 작성
- 🧭 SEO 최적화 (OG 태그, sitemap, RSS, `hreflang`)
- 🌓 다크/라이트 모드 지원
- 🔍 검색 및 태그 필터 (Fuse.js)
- 🎨 Tailwind CSS + Framer Motion 기반 프리미엄 UI
- ⚙️ GitHub Actions + Vercel 자동 배포
- 🧱 TypeScript + Zod 기반 타입 안정성

---

## 📦 기술 스택
| 분야 | 도구 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS + Typography |
| 콘텐츠 | MDX + gray-matter |
| 다국어 | next-intl |
| 애니메이션 | Framer Motion |
| 상태관리 | Zustand |
| 배포 | Vercel |
| 테스트 | Vitest + Playwright |

---

## 📁 폴도 구조
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

## 🚀 시작하기
```bash
git clone https://github.com/DevFayzullo/multi-lang-blog.git
cd multi-lang-blog
pnpm install
pnpm dev
```
실행 후: **http://localhost:3000/ko**

---

<!-- ## ⚙️ 환경 변수
```env
NEXT_PUBLIC_BASE_URL=https://yourdomain.vercel.app
NEXT_PUBLIC_DEFAULT_LOCALE=ko
NEXT_PUBLIC_LOCALES=ko,en,uz
``` 

----->

## 🧠 글 작성
`content/<locale>/posts/` 경로에 `.mdx` 파일 추가:
```mdx
---
title: "타입스크립트 제네릭 이해하기"
date: "2025-10-25"
slug: "ts-generics"
summary: "제네릭의 핵심 개념과 실무 활용 예시"
tags: ["typescript", "generics"]
lang: "ko"
---

여기에 **MDX 콘텐츠**를 작성하세요!
```

---

## 💼 개발자 정보

제작자: **[DevFayzullo](https://github.com/DevFayzullo)**  
기반지: 🇰🇷 서울 — **Full-Stack & Next.js 엔지니어링** 중심

---

## 🧠 인용문

> "오늘의 코드가 내일의 나를 성장시킨다."  
> — _매일 배우는 개발자의 마음으로_
