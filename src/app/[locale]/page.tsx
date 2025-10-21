import { getTranslations } from 'next-intl/server';
import { altLocales } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{locale: string}> }) {
  const { locale } = await params;
  return {
    title: 'Home',
    description: 'TypeScript + Next.js multi-language blog',
    alternates: altLocales(locale, ''),
  };
}
