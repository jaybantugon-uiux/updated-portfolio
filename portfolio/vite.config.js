import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    ViteImageOptimizer({
      png:  { quality: 80 },
      jpg:  { quality: 80 },
      jpeg: { quality: 80 },
      webp: { lossless: false, quality: 80 },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // Route-based code splitting — each page becomes its own chunk
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          if (id.includes('src/pages/DesignsRUs')) {
            return 'page-designs';
          }
          if (id.includes('src/pages/AttendSmart')) {
            return 'page-attend';
          }
          if (id.includes('src/pages/Candy')) {
            return 'page-candy';
          }
        },
      },
    },
  },
})
