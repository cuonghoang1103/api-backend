import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.js'],
    environment: 'node',          // DOM tests opt in per file with a comment
  },
});
