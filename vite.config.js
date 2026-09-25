import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: 'https://www.stororange.lat' // Apunta a la raíz del dominio personalizado
});