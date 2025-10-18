import './globals.css';
import {getLocale} from 'next-intl/server';

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-white text-gray-900 dark:bg-neutral-900 dark:text-neutral-100">
        {children}
        <h1>Hi</h1>
      </body>
    </html>
  );
}
