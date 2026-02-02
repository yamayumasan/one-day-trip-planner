// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
  ],

  nitro: {
    preset: 'cloudflare-pages',
  },

  i18n: {
    locales: [
      { code: 'ja', file: 'ja.json', name: '日本語' },
    ],
    defaultLocale: 'ja',
    lazy: true,
    langDir: 'locales',
    strategy: 'prefix_except_default',
  },

  runtimeConfig: {
    anthropicApiKey: '',
    googlePlacesApiKey: '',
    googleDirectionsApiKey: '',
    googleOauthClientId: '',
    googleOauthClientSecret: '',
    lineOauthChannelId: '',
    lineOauthChannelSecret: '',
    stripeSecretKey: '',
    stripeWebhookSecret: '',
    sessionSecret: '',
    public: {
      appName: '日帰り旅行プランナー',
      stripePriceAmount: 200,
    },
  },
})
