/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          400: '#c4b5fd',
          500: '#8b5cf6',
        },
        zinc: {
          400: '#a1a1aa',
          500: '#71717a',
          800: '#27272a',
          900: '#18181b',
        }
      }
    },
  },
  plugins: [],
}
