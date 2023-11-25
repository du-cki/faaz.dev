import defaultTheme from 'tailwindcss/defaultTheme'
import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        'light-mode': '#ffffff',
        'dark-mode': '#111111',
        'dark-secondary': '#0F0F0F',
        'dark-text': 'white',
        'light-secondary': '#F9F9F9',
        'light-text': 'black',
        highlight: '#f85b85'
      }
    },
    screens: {
      xs: '480px',
      ...defaultTheme.screens
    }
  }
}
