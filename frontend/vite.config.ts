import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'react-apexcharts': path.resolve(__dirname, 'node_modules/react-apexcharts'),
      nouislider: path.resolve(__dirname, 'node_modules/nouislider'),
      'jsvectormap/dist/css/jsvectormap.css': path.resolve(__dirname, 'node_modules/jsvectormap/dist/jsvectormap.css'),
      jsvectormap: path.resolve(__dirname, 'node_modules/jsvectormap'),
      'swiper/css/pagination': path.resolve(__dirname, 'node_modules/swiper/modules/pagination.css'),
      'swiper/css': path.resolve(__dirname, 'node_modules/swiper/swiper.css'),
      'swiper/react': path.resolve(__dirname, 'node_modules/swiper/swiper-react.mjs'),
      'swiper-core': path.resolve(__dirname, 'node_modules/swiper'),
      'swiper': path.resolve(__dirname, 'src/lib/swiper-shim.js'),
    },
  },
  server: {
    fs: { allow: [path.resolve(__dirname, '..')] },
    port: 5173,
    hmr: false,
    proxy: {
      '/api': {
        target: 'http://localhost:1337',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:1337',
        changeOrigin: true,
      },
    },
  },
})
