import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-gray-900 dark:bg-neutral-900 dark:text-neutral-100">
        {children}
      </body>
    </html>
  );
}
