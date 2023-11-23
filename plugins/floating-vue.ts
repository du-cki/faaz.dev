import FloatingVue from 'floating-vue'

export default defineNuxtPlugin(() => {
  FloatingVue.options.themes.glass = {
    ...FloatingVue.options.themes.tooltip,
    $resetCss: true,
    placement: 'top'
  }

  useNuxtApp().vueApp.use(FloatingVue)
})
