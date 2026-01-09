export function getBaseUrl() {
  if (process.env.NODE_ENV === 'development') return 'http://localhost:3000';

  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;

  const netlify = process.env.URL || process.env.DEPLOY_PRIME_URL;
  if (netlify) return netlify;

  return 'https://multi-lang-blog.netlify.app';
}
