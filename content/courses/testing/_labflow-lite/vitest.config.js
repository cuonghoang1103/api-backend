import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: ['tree'],                 // print the describe → it tree
    expect: { requireAssertions: true }, // a test without any expect fails (lesson 1.1)
    restoreMocks: true,                  // undo every vi.spyOn before each test (lesson 2.4)
    exclude: [...configDefaults.exclude, 'test/integration/**', 'demo4/**', 'web/**', 'demo6/**', 'e2e/**', 'demo7/**', '.stryker-tmp/**', 'demo11/ui/**', 'demo11/pw/**', 'demo11/th112/**'], // database: test:int · React: test:web · browser: test:e2e · Stryker sandboxes (8.2)
    coverage: {                          // lesson 8.1: npm run test:cov
      provider: 'v8',
      include: ['src/**/*.js'],          // count every source file, also the ones no test imports
      exclude: ['src/**/*.test.js', 'src/api/main.js', 'src/booking/pgRepo.js', 'src/app.js', 'src/legacy/db.js'], // main.js only calls listen · pgRepo.js: test:int · app.js: lesson 0.2, tested by test/pyramid.* · legacy/db.js: the real connection, replaced by a seam (10.2)
      reporter: [['text', { skipFull: false }], 'html', 'json-summary'],
      thresholds: { lines: 97, branches: 91, functions: 96, statements: 97 },   // lesson 11.4: ratchet — 85/80/80/85 in Ch8, now just under what we measured
    },
    tags: [{ name: 'quarantine', description: 'known flaky: has an issue and an owner, not run in the main suite (lesson 8.3)' }],
  },
});
