import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Multi-page build: index.html and privacy.html keep their existing URLs.
// https://vite.dev/guide/build#multi-page-app
export default defineConfig({
  plugins: [react()],
  // Relative asset URLs, so dist/ works from a domain root or a subfolder.
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        privacy: resolve(import.meta.dirname, 'privacy.html'),
      },
    },
  },
})
