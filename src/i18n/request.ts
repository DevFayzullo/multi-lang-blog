import {getRequestConfig} from 'next-intl/server';

const SUPPORTED = ['ko', 'en', 'uz'] as const;
type Locale = (typeof SUPPORTED)[number];

const FALLBACK: Locale = 'ko';

export default getRequestConfig(async ({locale}) => {
  const normalized: Locale =
    SUPPORTED.includes(locale as Locale) ? (locale as Locale) : FALLBACK;

  const messages = (await import(`./messages/${normalized}.json`)).default;
  return {locale: normalized, messages};
});
