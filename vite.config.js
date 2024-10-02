import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '/dist/**',
  },
  root: 'frontend',
  publicDir: 'public', // Static files served from `frontend/public`
});