// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@vite-pwa/nuxt'

  ],
  pwa: {
    manifest: {
      name: "TaskHive",
      short_name: "TaskHive",
      description: "A modern, sleek, and intuitive to-do list web app built with Nuxt 3."
    },
    workbox: {
      navigateFallback: '/',
    },
    devOptions:{
      enabled: true,
      type: "module",
    }
  },
  css: ['~/assets/css/main.css']
})
//TODO: Look into the manifest and configurate the PWA better, so it works...