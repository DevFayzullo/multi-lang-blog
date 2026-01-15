import "./globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { Inter, Noto_Sans_KR } from "next/font/google";
import type { Metadata } from "next";
import { getBaseUrl, site } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const notoKR = Noto_Sans_KR({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-notokr", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: { default: "Multi-Lang Blog", template: "%s | Multi-Lang Blog" },
  description: "TypeScript + Next.js multi-language blog",
  openGraph: {
    type: "website",
    siteName: "Multi-Lang Blog",
    images: [
      {
        url: `/ko${site.ogImagePath}`, 
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [`/ko${site.ogImagePath}`],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoKR.variable} min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
