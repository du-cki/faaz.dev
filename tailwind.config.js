/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,vue}'
  ],
  theme: {
    extend: {
      colors: {
        'dark-primary': '#111111',
        'dark-secondary': '#0F0F0F',
        'dark-text': 'white',
        'light-primary': '#FFFFFF',
        'light-secondary': '#F9F9F9',
        'light-text': 'black',
        highlight: '#F85B85'
      }
    },
    screens: {
      ...defaultTheme.screens,
      xs: { max: '639px' }
    }
  },
  plugins: []
}
