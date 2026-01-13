import Image from "next/image";
import Link from "next/link";
import type { Locale, PostMeta } from "@/lib/types";

function formatDate(date: string, locale: Locale) {
  const map: Record<Locale, string> = { ko: "ko-KR", en: "en-US", uz: "uz-UZ" };
  return new Date(date).toLocaleDateString(map[locale] ?? "en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function NeighborCard({
  locale,
  direction,
  post,
}: {
  locale: Locale;
  direction: "prev" | "next";
  post: Pick<PostMeta, "slug" | "title" | "date" | "readingTime" | "summary" | "cover">;
}) {
  const href = `/${locale}/blog/${post.slug}`;
  const isPrev = direction === "prev";

  return (
    <li className="group">
      <Link
        href={href}
        className="block overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/60 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800/60 dark:bg-neutral-950/40"
      >
        {/* Cover (premium) */}
        <div className="relative h-28 w-full">
          {post.cover ? (
            <Image
              src={post.cover}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 320px, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority={false}
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-neutral-100 via-neutral-50 to-neutral-200 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900" />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/0 to-black/0" />

          {/* Badge */}
          <div className="absolute left-4 top-4 inline-flex items-center rounded-full border border-white/25 bg-black/25 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white backdrop-blur">
            {isPrev ? "← Newer" : "Older →"}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="min-w-0 text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              <span className="line-clamp-2">{post.title}</span>
            </h3>

            <span className="shrink-0 text-[11px] text-neutral-500 dark:text-neutral-400">
              {formatDate(post.date, locale)}
            </span>
          </div>

          {post.summary ? (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {post.summary}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-neutral-200/70 bg-white/70 px-3 py-1 text-[11px] text-neutral-700 dark:border-neutral-800/70 dark:bg-neutral-950/40 dark:text-neutral-200">
              {post.readingTime} min
            </span>

            <span className="ml-auto inline-flex items-center gap-1 text-xs text-neutral-500 transition group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-100">
              Open <span aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}

export default function PostNeighbors({
  locale,
  prev,
  next,
}: {
  locale: Locale;
  prev: PostMeta | null;
  next: PostMeta | null;
}) {
  if (!prev && !next) return null;

  return (
    <section className="mt-10 border-t border-neutral-200/60 pt-8 dark:border-neutral-800/60">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Continue reading
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {prev || next ? "Prev / Next" : ""}
        </p>
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {prev ? <NeighborCard locale={locale} direction="prev" post={prev} /> : <li className="hidden md:block" />}
        {next ? <NeighborCard locale={locale} direction="next" post={next} /> : <li className="hidden md:block" />}
      </ul>
    </section>
  );
}
