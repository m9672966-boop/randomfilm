import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  base: '/',
  css: {
    postcss: './postcss.config.js', // Добавляем эту строку
  },
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT, 10) || 4173,
    allowedHosts: ['randomfilm.onrender.com']
  }
})
