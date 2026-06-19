import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
  server: {
    proxy: {
      '/api/vieneu': {
        target: 'https://api.vieneu.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/vieneu/, '/api'),
      },
    },
  },
})
