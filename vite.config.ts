import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
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
        '/api/vieneu-tts': {
          target: 'https://api.vieneu.io',
          changeOrigin: true,
          rewrite: () => '/api/v1/tts',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              const key = env.VITE_VIENEU_API_KEY || process.env.VITE_VIENEU_API_KEY || ''
              proxyReq.setHeader('X-API-Key', key)
            })
          },
        },
        '/api/vieneu-poll': {
          target: 'https://api.vieneu.io',
          changeOrigin: true,
          rewrite: (path) => {
            const url = new URL('http://localhost' + path)
            const jobId = url.searchParams.get('jobId')
            return `/api/v1/tts/${jobId}`
          },
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              const key = env.VITE_VIENEU_API_KEY || process.env.VITE_VIENEU_API_KEY || ''
              proxyReq.setHeader('X-API-Key', key)
            })
          },
        },
      },
    },
  }
})
