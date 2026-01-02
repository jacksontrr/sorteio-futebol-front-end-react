import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", (import.meta as any).url)),
    },
  },
  optimizeDeps: {
    include: ['@react-oauth/google'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7035',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
