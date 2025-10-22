import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['ko','en','uz'],
  defaultLocale: 'ko',
  localePrefix: 'always'
});

export const config = { matcher: ['/((?!_next|.*\\..*$).*)'] };
