export default function BlogIndexSkeleton() {
  return (
    <section className="mt-6">
      <div className="rounded-3xl border border-neutral-200/60 bg-white/60 p-4 shadow-sm backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/40">
        <div className="h-10 w-full rounded-2xl bg-neutral-200/60 dark:bg-neutral-800/60" />
        <div className="mt-3 flex gap-2">
          <div className="h-7 w-14 rounded-full bg-neutral-200/60 dark:bg-neutral-800/60" />
          <div className="h-7 w-20 rounded-full bg-neutral-200/60 dark:bg-neutral-800/60" />
          <div className="h-7 w-24 rounded-full bg-neutral-200/60 dark:bg-neutral-800/60" />
        </div>
      </div>

      <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <li
            key={i}
            className="overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/40"
          >
            <div className="h-5 w-3/4 rounded bg-neutral-200/60 dark:bg-neutral-800/60" />
            <div className="mt-3 h-4 w-full rounded bg-neutral-200/60 dark:bg-neutral-800/60" />
            <div className="mt-2 h-4 w-5/6 rounded bg-neutral-200/60 dark:bg-neutral-800/60" />
            <div className="mt-5 flex gap-2">
              <div className="h-6 w-16 rounded-full bg-neutral-200/60 dark:bg-neutral-800/60" />
              <div className="h-6 w-20 rounded-full bg-neutral-200/60 dark:bg-neutral-800/60" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
