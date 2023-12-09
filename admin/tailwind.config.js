/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'error': '#ff4d4f'
      },
      boxShadow: {
        'input': '0 0 0 2px rgba(24, 144, 255, .2)',
      }
    },
  },
  plugins: [],
}