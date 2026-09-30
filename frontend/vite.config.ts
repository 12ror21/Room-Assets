import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // теперь можно import '@/components/Button'
    },
  },
  server: {
    host: true,        // эквивалент "0.0.0.0"
    port: 5173,        // порт по умолчанию
    strictPort: true   // если занят — не переключаться автоматически
  },
})
