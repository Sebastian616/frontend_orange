import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Apunta a la raíz del dominio personalizado
  server: {
    port: 5173,
  },
});