/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-yellow':'#BAA333',
        'bgcolor':'#024950',
      }
    },
  },
  plugins: [],
}
