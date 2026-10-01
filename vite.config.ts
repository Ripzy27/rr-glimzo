import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // Absolute asset URLs: the admin panel lives at a nested path (/0/v1/admin), so relative ones would break there.
  base: '/',
  server: {
    // The API lives in the separate rr-glimzo-server repo; forward /api to it in development.
    proxy: { '/api': process.env.API_URL ?? 'http://localhost:3001' },
  },
})
