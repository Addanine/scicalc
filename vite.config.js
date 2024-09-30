import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'frontend', // Specifies the root for Vite to look for `index.html`
  build: {
    outDir: 'dist', // Output directory for production build
    rollupOptions: {
      // Additional options can be placed here
    }
  },
  publicDir: 'public' // Points to `frontend/public` for serving static assets
});
