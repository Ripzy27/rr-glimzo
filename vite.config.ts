import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // Relative asset URLs, so dist/ works from a domain root or a subfolder.
  base: './',
})
