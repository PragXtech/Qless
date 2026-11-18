/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0ECFF',
          100: '#E8E0FF',
          200: '#D2C3FF',
          300: '#B69EFF',
          400: '#9278FF',
          500: '#6D4AFF', // Primary purple
          600: '#5A36EC',
          700: '#5034C9', // Dark purple
          800: '#3D259C',
          900: '#2A176E',
        },
        surface: {
          light: '#F8F9FC',
          cardLight: '#FFFFFF',
          dark: '#11111B',
          cardDark: '#1B1B29',
          secondaryDark: '#242437',
        },
        text: {
          mainLight: '#171725',
          secLight: '#707080',
          mainDark: '#F5F4FA',
          secDark: '#A7A6B7',
        },
        border: {
          light: '#E7E7EF',
          dark: '#2E2E42',
        },
        status: {
          waiting: '#3B82F6',     // Blue
          approaching: '#F97316', // Orange
          serving: '#10B981',     // Green
          missed: '#EF4444',      // Red
          completed: '#6B7280',   // Grey
          emergency: '#DC2626',   // Red
          normal: '#2563EB',      // Blue
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(109, 74, 255, 0.05)',
        'premium': '0 10px 30px -5px rgba(109, 74, 255, 0.1)',
        'glass': '0 8px 32px 0 rgba(109, 74, 255, 0.08)',
        'glow': '0 0 20px rgba(109, 74, 255, 0.35)',
      }
    },
  },
  plugins: [],
}
