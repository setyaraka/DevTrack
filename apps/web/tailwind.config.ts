import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f7f8fa',
          100: '#eef1f4',
          200: '#d8dee6',
          500: '#667085',
          700: '#344054',
          900: '#101828',
        },
        accent: {
          500: '#2563eb',
          600: '#1d4ed8',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(16, 24, 40, 0.06), 0 1px 3px rgba(16, 24, 40, 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config;
