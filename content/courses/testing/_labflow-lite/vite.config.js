import { defineConfig } from 'vite';

// Builds the LabFlow Lite web app into dist-web/ (Chapter 7). Tests of the components still run in jsdom (Chapter 6).
export default defineConfig({
  root: 'web/app',
  build: {
    outDir: '../../dist-web',
    emptyOutDir: true,
    rollupOptions: {
      // 'use client' marks Next.js client components (lesson 6.4); a plain bundle has no use for it.
      onwarn(warning, warn) { if (warning.code !== 'MODULE_LEVEL_DIRECTIVE') warn(warning); },
    },
  },
});
