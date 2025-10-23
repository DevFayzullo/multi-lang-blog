import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ThemeProvider } from 'next-themes'

export function generateStaticParams() {
  return [{ locale: 'ko' }, { locale: 'en' }, { locale: 'uz' }]
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NextIntlClientProvider messages={messages} locale={locale} timeZone="Asia/Seoul">
        <Header />
        <main className="container max-w-5xl px-4">{children}</main>
        <Footer />
      </NextIntlClientProvider>
    </ThemeProvider>
  )
}
