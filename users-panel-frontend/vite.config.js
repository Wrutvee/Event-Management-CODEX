import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175, // Changed to 5175 since 5174 is in use
    strictPort: false, // Allow Vite to try the next available port
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    }
  }
})
