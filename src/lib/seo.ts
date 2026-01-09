type Locale = 'ko' | 'en' | 'uz';
const LOCALES: Locale[] = ['ko', 'en', 'uz'];

function normalizePath(path: string) {
  if (!path || path === '/') return '';
  return path.startsWith('/') ? path : `/${path}`;
}

export function altLocales(locale: string, path: string) {
  const normalized = normalizePath(path);
  const current = (LOCALES.includes(locale as Locale) ? locale : 'ko') as Locale;

  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `/${l}${normalized}`;
  languages['x-default'] = `/ko${normalized}`;

  return {
    canonical: `/${current}${normalized}`,
    languages
  };
}
