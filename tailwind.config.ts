import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.ts',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f4',
          100: '#dbf0e3',
          200: '#bae0ca',
          300: '#8ccaa8',
          400: '#5aad82',
          500: '#389166',
          600: '#287550',
          700: '#215e42',
          800: '#1d4b36',
          900: '#193e2e',
          950: '#0c231a',
        },
        accent: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fad7ad',
          300: '#f6ba78',
          400: '#f19442',
          500: '#ee7820',
          600: '#df5e14',
          700: '#b94613',
          800: '#933817',
          900: '#773016',
          950: '#401609',
        },
      },
      fontFamily: {
        sans: [
          '"Noto Sans JP"',
          '"Hiragino Kaku Gothic ProN"',
          '"Hiragino Sans"',
          'Meiryo',
          'sans-serif',
        ],
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
} satisfies Config
