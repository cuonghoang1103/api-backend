import { defineConfig } from 'vitest/config';

// React component tests (Chapter 6). Run with: npm run test:web
export default defineConfig({
  test: {
    include: ['web/**/*.test.{js,jsx}', 'demo6/**/*.test.{js,jsx}'],
    environment: 'jsdom',
    setupFiles: ['web/test-setup.js'],
    reporters: ['tree'],
    expect: { requireAssertions: true },
    restoreMocks: true,
  },
});
