import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      host: 'localhost.com',
      port: 5173,
    },
    proxy: {
      '/api': {
        target: process.env.VITE_BASE_URL_BACKEND, 
        changeOrigin: true,
      },
    },
  },
})
