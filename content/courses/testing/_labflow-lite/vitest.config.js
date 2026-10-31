import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: ['tree'],                 // print the describe → it tree
    expect: { requireAssertions: true }, // a test without any expect fails (lesson 1.1)
  },
});
