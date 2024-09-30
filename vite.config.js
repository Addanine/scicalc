import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure this is correct
  },
  root: 'frontend', // Set the root to `frontend` if your `index.html` is in `frontend/`
  publicDir: 'public', // Static files served from `frontend/public`
});