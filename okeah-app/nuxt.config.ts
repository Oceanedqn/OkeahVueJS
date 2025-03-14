// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  typescript: {
    strict: true // Active les vérifications strictes
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})
