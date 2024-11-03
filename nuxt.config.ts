import { createResolver } from '@nuxt/kit'
import { ViteMinifyPlugin } from 'vite-plugin-minify'

const { resolve } = createResolver(import.meta.url)

const isProd = process.env.NODE_ENV === 'production'

export default defineNuxtConfig({
  typescript: {
    typeCheck: true,
  },
  sourcemap: {
    server: !isProd,
    client: !isProd,
  },
  modules: [
    '@nuxt/devtools',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/eslint',
    '@nuxtjs/sitemap',
    '@nuxt/scripts',
    '@nuxtjs/robots',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/ionic',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],
  features: {
    inlineStyles: false,
  },
  robots: {
    groups: [
      {
        userAgent: [''],
        disallow: ['/account/'],
        allow: ['/'],
      },
    ],
    sitemap: [
      '/sitemap-general.xml',
      '/sitemap-promotions.xml',
      '/sitemap-categories.xml',
    ],
  },
  fonts: {
    families: [{ name: 'Inter', provider: 'google' }],
    defaults: {
      weights: [400],
      styles: ['normal', 'italic'],
      subsets: [
        'cyrillic-ext',
        'cyrillic',
        'greek-ext',
        'greek',
        'vietnamese',
        'latin-ext',
        'latin',
      ],
    },
  },
  imports: {
    autoImport: true, // Auto import must be true
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },
  css: [],
  alias: {
    '~': resolve('./'),
    'dayjs/plugin': '/node_modules/dayjs/plugin',
    dayjs: '/node_modules/dayjs/esm/index.js',
    lodash: '/node_modules/lodash',
    yup: '/node_modules/yup/index.esm.js', // Add alias
    'socket.io-client': '/node_modules/socket.io-client/lib/index.js', // Add alias
    'vuejs-paginate-next':
      '/node_modules/vuejs-paginate-next/dist/vuejs-paginate-next.es.js', // Add alias
  },
  vite: {
    build: {
      sourcemap: true,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
              @import "~/assets/styles/base/variables";
              @import "~/assets/styles/base/mixins";
              @import "~/assets/styles/base/common";
              @import "~/assets/styles/base/function";
            `,
        },
      },
    },
    plugins: [
      ViteMinifyPlugin({
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
      }),
    ],
  },
  scripts: {
    registry: {
      googleAnalytics: {
        id: process.env.GOOGLE_ANALYTICS_ID ?? '',
      },
      metaPixel: {
        id: process.env.META_PIXEL_ID ?? '',
      },
    },
  },
  runtimeConfig: {
    public: {
      // your public env
      GO88_URL: process.env.GO88_URL,
      DEPOSIT_METHODS_ENABLED: process.env.DEPOSIT_METHODS_ENABLED || '',
      PHONE_CARD_PROVIDERS_ENABLED:
        process.env.PHONE_CARD_PROVIDERS_ENABLED || '',
      MAIN_CREDIT_UNIT: process.env.MAIN_CREDIT_UNIT,
      FLAT_CURRENCY_UNIT: process.env.FLAT_CURRENCY_UNIT,
      TELEGRAM_NAME: process.env.TELEGRAM_NAME,
      TELEGRAM_LINK: process.env.TELEGRAM_LINK || '',
      TELEGRAM_CHAT_BOT: process.env.TELEGRAM_CHAT_BOT || '',
      YOUTUBE_LINK: process.env.YOUTUBE_LINK || '',
      FANPAGE_LINK: process.env.FANPAGE_LINK || '',
      SPORT_ENABLES: process.env.SPORT_ENABLES || '',
    },
  },
  compatibilityDate: '2024-08-02',
})
