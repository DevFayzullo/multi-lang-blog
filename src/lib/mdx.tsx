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

function ClientCopyButton({ getText }: { getText: () => string }) {
  'use client';
  const [copied, setCopied] = React.useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(getText());
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

function CodeBlock(
  props: React.ComponentPropsWithoutRef<'pre'> & { 'data-language'?: string }
) {
  const { children } = props;
  const lang = props['data-language'];

  const getText = () => {
    if (typeof children === 'string') return children;
    try {
      return String(children ?? '');
    } catch {
      return '';
    }
  };

  return (
    <div className="group relative my-6 overflow-hidden rounded-2xl border border-neutral-200/60 bg-white/60 shadow-sm backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/40">
      <div className="flex items-center justify-between border-b border-neutral-200/50 px-4 py-2 text-xs text-neutral-600 dark:border-neutral-800/50 dark:text-neutral-300">
        <span className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-neutral-400/80 dark:bg-neutral-500/80" />
          <span className="font-medium">{lang ?? 'code'}</span>
        </span>

        <ClientCopyButton getText={getText} />
      </div>

      <pre className="m-0 overflow-x-auto p-4 text-[13px] leading-relaxed" data-language={lang}>
        {children}
      </pre>
    </div>
  );
}

function HeadingAnchor({
  level,
  children
}: {
  level: 2 | 3;
  children: React.ReactNode;
}) {
  const text = React.Children.toArray(children)
    .map((c) => (typeof c === 'string' ? c : ''))
    .join('');
  const id = slugify(text || 'section');

  const Tag = level === 2 ? ('h2' as const) : ('h3' as const);

  return (
    <Tag id={id} className="group scroll-mt-24">
      <a href={`#${id}`} className="no-underline" aria-label="Anchor">
        <span className="mr-2 inline-block opacity-0 transition group-hover:opacity-60">#</span>
      </a>
      {children}
    </Tag>
  );
}

const mdxComponents = {
  h2: (props: React.ComponentPropsWithoutRef<'h2'>) => (
    <HeadingAnchor level={2}>{props.children}</HeadingAnchor>
  ),
  h3: (props: React.ComponentPropsWithoutRef<'h3'>) => (
    <HeadingAnchor level={3}>{props.children}</HeadingAnchor>
  ),

  pre: (props: React.ComponentPropsWithoutRef<'pre'> & { 'data-language'?: string }) => (
    <CodeBlock {...props} />
  ),

  code: (props: React.ComponentPropsWithoutRef<'code'>) => (
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

  a: (props: React.ComponentPropsWithoutRef<'a'>) => (
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
} satisfies Record<string, React.ComponentType<unknown>>;

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
