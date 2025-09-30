import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  base: '/',
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT, 10) || 4173,
    strictPort: true,
    // Разрешить Render-хост
    allowedHosts: ['randomfilm.onrender.com']
  }
})
