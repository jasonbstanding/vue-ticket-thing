import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Set VITE_BASE_URL to your GitHub Pages repo path, e.g. /gig-visualiser/
export default defineConfig({
  plugins: [vue()],
  base: process.env.VITE_BASE_URL || '/',
})
