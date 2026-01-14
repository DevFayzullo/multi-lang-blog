import "./globals.css";
import { Inter, Noto_Sans_KR } from "next/font/google";
import ThemeProvider from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const notoKR = Noto_Sans_KR({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-notokr", display: "swap" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${notoKR.variable} min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
