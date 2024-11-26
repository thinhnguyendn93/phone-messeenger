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
  build: {
    transpile: ['vue3-emoji-picker']
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
  fonts: {
    families: [{ name: 'Roboto', provider: 'google' }],
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
  },
  tailwindcss: {
    viewer: false,
  },
  vite: {
    build: {
      sourcemap: true,
    },
    plugins: [
      ViteMinifyPlugin({
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
      }),
    ],
  },
  runtimeConfig: {
    public: {
      // your public env
      API_URL: process.env.API_URL,
    },
  },
  compatibilityDate: '2024-08-02',
})
