import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default {
  server: {
    proxy: {
      '/calculate': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/history': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
};
