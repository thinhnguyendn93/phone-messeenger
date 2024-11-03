import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, '.'),
      '@': path.resolve(__dirname, '.'),
      '#app': path.resolve(__dirname, 'node_modules/nuxt/dist/app'),
    },
  },
  test: {
    environment: 'jsdom', // or 'node', depending on your needs
    setupFiles: './tests/setup.ts', // Setup file to mock runtime config
  },
})
