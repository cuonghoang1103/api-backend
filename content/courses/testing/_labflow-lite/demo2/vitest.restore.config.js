import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: ['tree'],
    expect: { requireAssertions: true },
    restoreMocks: true, // restore every vi.spyOn before each test
  },
});
