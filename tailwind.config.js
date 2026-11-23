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
        bdgreen: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        bdred: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        paper: {
          50: '#fdfdfc',
          100: '#fbfbf9',
          200: '#f4f4ef',
          300: '#e8e8df',
          800: '#1c1f24',
          900: '#111418',
        }
      },
      fontFamily: {
        sans: ['"Hind Siliguri"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif Bengali"', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'newspaper': '0 1px 3px rgba(0,0,0,0.05), 0 10px 20px -5px rgba(0,0,0,0.04)',
        'premium': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
