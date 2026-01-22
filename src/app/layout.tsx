import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { Inter, Noto_Sans_KR } from "next/font/google";
import { getBaseUrl, site } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoKR = Noto_Sans_KR({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-notokr",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  applicationName: site.name,
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${notoKR.variable} min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
