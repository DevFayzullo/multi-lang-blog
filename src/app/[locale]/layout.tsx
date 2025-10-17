import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import type {ReactNode} from 'react';

export function generateStaticParams() {
  return [{locale: 'ko'}, {locale: 'en'}, {locale: 'uz'}];
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: {locale: string};
}) {
  const {locale} = params;
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale} timeZone="Asia/Seoul">
      {children}
    </NextIntlClientProvider>
  );
}
