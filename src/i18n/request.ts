import { getRequestConfig } from 'next-intl/server';

const SUPPORTED = ['ko', 'en', 'uz'] as const;
const FALLBACK = 'en' as const;

export default getRequestConfig(async ({ locale }) => {
  const normalized =
    (locale && SUPPORTED.includes(locale as any) ? locale : FALLBACK) as typeof SUPPORTED[number];

  try {
    const messages = (await import(`./messages/${normalized}.json`)).default;
    return { locale: normalized, messages };
  } catch {
    const messages = (await import(`./messages/${FALLBACK}.json`)).default;
    return { locale: FALLBACK, messages };
  }
});gg
