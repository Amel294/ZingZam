import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      host: 'zingzam.in',
      port: 5173,
    },
    proxy: {
      '/api': {
        target: 'http://zingzam.in/backend',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      },
      '/ws': {
        target: 'http://zingzam.in/ws',
        ws: true,
        changeOrigin: true,
      }
    }
  }
})
