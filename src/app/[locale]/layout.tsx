import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

export function generateStaticParams() {
  return [{ locale: 'ko' }, { locale: 'en' }, { locale: 'uz' }];
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <>
      <NextIntlClientProvider messages={messages} locale={locale} timeZone="Asia/Seoul">
        {children}
      </NextIntlClientProvider>
    </>
  );
}
