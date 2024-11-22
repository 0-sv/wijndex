import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: '/wijndex',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['wine-glass.svg'],
      manifest: {
        name: 'Wijndex',
        short_name: 'Wijndex',
        description: 'Wine Recommendations App',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'wine-glass.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'wine-glass.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      '/results.json': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
