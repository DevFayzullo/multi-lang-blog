import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: [
    './src/app/**/*.{ts,tsx,mdx}',
    './src/components/**/*.{ts,tsx,mdx}',
    './src/content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      container: { center: true, padding: '1rem' },
      colors: { brand: { 500: '#3b82f6' } },
    },
  },
  plugins: [typography],
} satisfies Config
