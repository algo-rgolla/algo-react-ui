import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },    
    server: {
        port: 65231,
        proxy: {
            '/api': {
                //target: 'https://localhost:7033',
                target: 'http://algoapi/',
                changeOrigin: true,
                secure: false,
            },
        },
    }
})
