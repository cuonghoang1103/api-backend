import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: ['tree'],                 // print the describe → it tree
    expect: { requireAssertions: true }, // a test without any expect fails (lesson 1.1)
    restoreMocks: true,                  // undo every vi.spyOn before each test (lesson 2.4)
    exclude: [...configDefaults.exclude, 'test/integration/**', 'demo4/**', 'web/**', 'demo6/**', 'e2e/**', 'demo7/**'], // database: test:int · React: test:web · browser: test:e2e
  },
});
