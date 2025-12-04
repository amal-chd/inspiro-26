/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#141414', // Netflix Black
        primary: '#E50914', // Netflix Red
        secondary: '#B81D24', // Darker Red
        'gray-base': '#808080',
        'gray-dark': '#333333',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Bebas Neue', 'sans-serif'], // For headers
        cinematic: ['Cinzel', 'serif'], // For Stranger Things vibe
      }
    },
  },
  plugins: [],
}
