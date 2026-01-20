import { getTranslations } from 'next-intl/server';
import { altLocales } from '@/lib/seo'; 
import type { Locale } from '@/lib/types';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return {
    title: 'Home',
    description: 'TypeScript + Next.js multi-language blog',
    alternates: altLocales(locale, '')
  };
}


export default async function LocaleHome({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold">{t('title')}</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">{t('desc')}</p>
      <div className="mt-6">
        <a href={`/${locale}/blog`} className="underline">Blog →</a>
      </div>
    </main>
  );
}
