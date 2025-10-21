import { altLocales } from '@/lib/seo';
export async function generateMetadata({ params }: { params: Promise<{locale: string}> }) {
  const { locale } = await params;
  return { title: 'Blog', alternates: altLocales(locale, '/blog') };
}
