import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/futebol/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", (import.meta as any).url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Garantir que cada build gere nomes únicos
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`
      }
    }
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
}))
