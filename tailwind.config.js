/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#090817',
        plum: '#20132F',
        royal: '#382044',
        violet: '#49305F',
        orchid: '#A76BBD',
        rose: '#F18EBA',
        champagne: '#F3D9AC',
        soft: '#FFF8FC'
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Manrope', 'Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}
