import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF9',
          100: '#F8F6F0',
          200: '#F0ECE1',
          300: '#E5DEC9',
        },
        leaf: {
          50: '#F2FAF4',
          100: '#E1F4E7',
          200: '#C3E8CF',
          300: '#94D5AA',
          400: '#5CB97D',
          500: '#2E9455',
          600: '#1D7A41',
          700: '#176235',
          800: '#154E2C',
          900: '#124025',
          950: '#092313',
        },
        earth: {
          700: '#4A3B31',
          800: '#352A22',
          900: '#231C17',
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(18, 64, 37, 0.06)',
        card: '0 2px 12px -2px rgba(23, 28, 24, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
