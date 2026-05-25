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
          light: '#c084fc', // purple-400
          DEFAULT: '#a855f7', // purple-500
          dark: '#7e22ce', // purple-700
          blue: '#3b82f6', // blue-500
          purple: '#8b5cf6', // purple-600
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
