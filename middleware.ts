import createMiddleware from 'next-intl/middleware';
import nextIntlConfig from './next-intl.config';

export default createMiddleware(nextIntlConfig);

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
