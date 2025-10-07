import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  try {
    const messages = (await import(`./messages/${locale}.json`)).default;
    return { messages };
  } catch {
    const messages = (await import('./messages/en.json')).default;
    return { messages };
  }
});
