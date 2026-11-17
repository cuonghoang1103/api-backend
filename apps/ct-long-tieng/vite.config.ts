/** Dựng giao diện (renderer). Đường dẫn tương đối (`base: './'`) để chạy dưới `ctlt://app/`. */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  root: path.resolve(__dirname, 'src/renderer'),
  base: './',
  plugins: [react()],
  server: { port: 5287, strictPort: true, host: '127.0.0.1' },
  build: {
    outDir: path.resolve(__dirname, 'dist/renderer'),
    emptyOutDir: true,
    target: 'chrome130',
  },
  test: {
    root: path.resolve(__dirname),
    include: ['src/**/*.test.ts'],
  },
} as Parameters<typeof defineConfig>[0]);
