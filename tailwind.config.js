/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#1a1a1a',
        secondary: '#666666',
        accent: '#d4a574',
        light: '#f5f5f5',
      },
    },
  },
  plugins: [],
}
