import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default {
  server: {
    proxy: {
      '/calculate': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/history': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
};
