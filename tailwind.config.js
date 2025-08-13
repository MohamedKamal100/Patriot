/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // أو 'media' لو عايز يعتمد على إعداد الجهاز
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}