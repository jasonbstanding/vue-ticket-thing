import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Set VITE_BASE_URL to your GitHub Pages repo path, e.g. /gig-visualiser/
export default defineConfig({
  plugins: [vue()],
  base: process.env.VITE_BASE_URL || '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // This splits all third-party libraries into a separate 'vendor' chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
})
