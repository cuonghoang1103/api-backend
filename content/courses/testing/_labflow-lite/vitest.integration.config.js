import { defineConfig } from 'vitest/config';

// Integration tests talk to a real PostgreSQL. Run with: npm run test:int
export default defineConfig({
  test: {
    include: ['test/integration/**/*.int.test.js', 'demo4/**/*.int.test.js'],
    globalSetup: ['test/integration/global-setup.js'],
    fileParallelism: false,               // one database, so test files take turns (lesson 4.4)
    reporters: ['tree'],
    expect: { requireAssertions: true },
    restoreMocks: true,
    testTimeout: 15000,
  },
});
