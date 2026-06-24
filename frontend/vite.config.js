import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'bootstrap':    ['bootstrap', 'react-bootstrap'],
          'query':        ['@tanstack/react-query'],
          'supabase':     ['@supabase/supabase-js'],
        }
      }
    }
  }
})
