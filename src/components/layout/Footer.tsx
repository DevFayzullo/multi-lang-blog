'use client'
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200/50 dark:border-neutral-800/60">
      <div className="container max-w-5xl py-8 text-sm text-neutral-500 flex items-center justify-between">
        <p>© {new Date().getFullYear()} Multi-Lang Blog</p>
        <div className="flex gap-4">
          <a className="hover:underline" href="https://github.com/DevFayzullo" target="_blank">GitHub</a>
          <a className="hover:underline" href="https://www.linkedin.com/in/abduganiev-fayzullo" target="_blank">LinkedIn</a>
        </div>
      </div>
    </footer>
  )
}
