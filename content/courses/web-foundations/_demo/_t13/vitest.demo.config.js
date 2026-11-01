import { defineConfig } from 'vitest/config';

// Deliberately failing experiments live in demo/ so that "npx vitest run" (test/ only) stays green
export default defineConfig({ test: { include: ['demo/**/*.test.js'], environment: 'node' } });
