import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';

const rehypePrettyCodeOptions = {
  theme: 'one-dark-pro', 
  keepBackground: false
};

export function Mdx({ source }: { source: string }) {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <MDXRemote
        source={source}
        options={{
          parseFrontmatter: true,
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]]
          }
        }}
      />
    </article>
  );
}
