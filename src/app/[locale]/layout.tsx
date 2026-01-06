import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from 'next-themes';

const LOCALES = ['ko', 'en', 'uz'] as const;
type Locale = (typeof LOCALES)[number];

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  if (!LOCALES.includes(locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NextIntlClientProvider messages={messages} locale={locale} timeZone="Asia/Seoul">
        <Header />
        <main className="container max-w-5xl px-4">{children}</main>
        <Footer />
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
