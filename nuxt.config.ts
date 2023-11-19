// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  components: [
    { global: true, path: '@/components' },
    { global: true, path: '@/components/logos' }
  ],

  css: [
    '@/styles/global.css'
  ],

  modules: [
    '@nuxtjs/tailwindcss',
    'floating-vue/nuxt'
  ],

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'faaz.dev',
      base: {
        target: '_blank'
      },
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: "I'm a self-taught full-stack developer, who loves tinkering with stuff."
        }
      ]
    }
  },

  devtools: {
    enabled: true
  },

  runtimeConfig: {
    public: {
      IS_DEV: process.env.IS_DEV,
      PROJECT_DEFAULT_COLOR: process.env.PROJECT_DEFAULT_COLOR,
      DATE_OF_BIRTH: process.env.DATE_OF_BIRTH,
      USER_ID: process.env.USER_ID
    }
  }
})