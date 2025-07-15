/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // ensure Tailwind scans your components
  ],
  darkMode: 'class', // enable class-based dark mode
  theme: {
    extend: {},
  },
  plugins: [],
}
