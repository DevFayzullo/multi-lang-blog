import React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';

const rehypePrettyCodeOptions = {
  theme: 'one-dark-pro',
  keepBackground: false
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function CodeBlock({
  children,
  'data-language': lang
}: React.HTMLAttributes<HTMLPreElement> & { 'data-language'?: string }) {
  return (
    <div className="group relative my-6 overflow-hidden rounded-2xl border border-neutral-200/60 bg-white/60 shadow-sm backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/40">
      <div className="flex items-center justify-between border-b border-neutral-200/50 px-4 py-2 text-xs text-neutral-600 dark:border-neutral-800/50 dark:text-neutral-300">
        <span className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-neutral-400/80 dark:bg-neutral-500/80" />
          <span className="font-medium">{lang ?? 'code'}</span>
        </span>

        <CopyButton />
      </div>

      <pre className="m-0 overflow-x-auto p-4 text-[13px] leading-relaxed" data-language={lang}>
        {children}
      </pre>
    </div>
  );
}

// Must be client for clipboard
function CopyButton() {
  // inline client boundary
  return (
    <ClientCopyButton />
  );
}

function ClientCopyButton() {
  'use client';
  const [copied, setCopied] = React.useState(false);

  async function onCopy() {
    try {
      // Find nearest <pre> then read its text
      const pre = (document.activeElement as HTMLElement | null)?.closest?.('div')?.querySelector('pre');
      const text = pre?.innerText ?? '';
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 900);
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="rounded-lg border border-neutral-200/70 bg-white/70 px-2 py-1 text-[11px] text-neutral-700 shadow-sm transition hover:bg-white dark:border-neutral-800/70 dark:bg-neutral-950/40 dark:text-neutral-200 dark:hover:bg-neutral-900/60"
      aria-label="Copy code"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function HeadingWithAnchor({
  as: Tag,
  children
}: {
  as: 'h2' | 'h3';
  children: React.ReactNode;
}) {
  const text = React.Children.toArray(children).join('').toString();
  const id = slugify(text);

  return (
    <Tag id={id} className="group scroll-mt-24">
      <a
        href={`#${id}`}
        className="no-underline"
        aria-label="Anchor"
      >
        <span className="mr-2 inline-block opacity-0 transition group-hover:opacity-60">#</span>
      </a>
      {children}
    </Tag>
  );
}

const mdxComponents = {
  // Premium headings with anchors
  h2: (props: any) => <HeadingWithAnchor as="h2" {...props} />,
  h3: (props: any) => <HeadingWithAnchor as="h3" {...props} />,

  // Code blocks: override pre
  pre: (props: any) => <CodeBlock {...props} />,

  // Better inline code styling
  code: (props: any) => (
    <code
      {...props}
      className={[
        'rounded-md border border-neutral-200/60 bg-neutral-50 px-1 py-0.5 text-[0.92em] dark:border-neutral-800/60 dark:bg-neutral-950/40',
        props.className
      ]
        .filter(Boolean)
        .join(' ')}
    />
  ),

  // Links
  a: (props: any) => (
    <a
      {...props}
      className={[
        'underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-500 dark:decoration-neutral-700 dark:hover:decoration-neutral-400',
        props.className
      ]
        .filter(Boolean)
        .join(' ')}
      rel={props.target === '_blank' ? 'noreferrer' : props.rel}
    />
  )
};

export function Mdx({ source }: { source: string }) {
  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:tracking-tight prose-pre:p-0">
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={{
          parseFrontmatter: true,
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]]
          }
        }}
      />
    </div>
  );
}
