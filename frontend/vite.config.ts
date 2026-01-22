import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import router from '@tanstack/router-plugin/vite';
// https://vite.dev/config/
export default defineConfig({
  plugins: [router(), react()],
  test: {
    environment: 'happy-dom',
  },
});
