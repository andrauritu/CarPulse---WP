// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Determine the backend URL based on environment
const backendUrl = process.env.NODE_ENV === 'production' 
  ? 'http://backend:8080'  // Docker service name in production
  : 'http://localhost:8080' // Local development

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/admin': {
        target: backendUrl,
        changeOrigin: true,
      },
      '/signup': {
        target: backendUrl,
        changeOrigin: true,
      },
      '/login': {
        target: backendUrl,
        changeOrigin: true,
      },
    }
  },
  // Add environment variables to be available in the client code
  define: {
    'process.env.BACKEND_URL': JSON.stringify(backendUrl)
  }
})
