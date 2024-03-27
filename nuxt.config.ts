// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  spaLoadingTemplate: false,
  ssr: true,

  components: [
    { global: true, path: '@/components' },
    { global: true, path: '@/components/logos' },
    { global: true, path: '@/components/segments' }

  ],

  css: [
    '@/styles/global.css'
  ],

  modules: [
    'nuxt-og-image',
    '@nuxtjs/tailwindcss',
    'floating-vue/nuxt'
  ],

  plugins: [
    '@/plugins/floating-vue'
  ],

  app: {
    head: {
      link: [
        {
          key: 'apple-touch-icon',
          rel: 'apple-touch-icon',
          href: '/apple-touch-icon.png'
        },
        {
          key: 'manifest',
          rel: 'manifest',
          href: '/web-manifest.json'
        }
      ],
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'faaz.dev',
      base: {
        target: '_blank'
      },
      meta: [
        {
          key: 'description',
          name: 'description',
          content: "I'm a self-taught full-stack developer, who loves tinkering with stuff."
        },
        {
          key: 'color-scheme',
          name: 'color-scheme',
          content: '#FFD1DC'
        }
      ]
    }
  },

  devtools: {
    enabled: true
  },

  runtimeConfig: {
    LAST_FM_API_KEY: process.env.LAST_FM_API_KEY,
    public: {
      IS_DEV: process.env.IS_DEV,
      DATE_OF_BIRTH: process.env.DATE_OF_BIRTH,
      USER_ID: process.env.USER_ID
    }
  }
})
