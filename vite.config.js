import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: "/druifdruif",
  plugins: [react()],
  server: {
    proxy: {
      '/results.json': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
});
