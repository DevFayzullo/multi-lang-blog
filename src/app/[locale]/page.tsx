import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function HomePage() {
  const t = await getTranslations('home');
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold">{t('title')}</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">{t('desc')}</p>
      <div className="mt-6">
        <Link href="./blog" className="underline">Blog →</Link>
      </div>
    </main>
  );
}
