// Lesson 9.4: stands in for a slow integration file (they share one database, so they run one after another). It takes 500 ms.
import { it, expect } from 'vitest';

it('file e takes 500 ms', async () => {
  const t0 = Date.now();
  await new Promise((resolve) => setTimeout(resolve, 500));
  expect(Date.now() - t0).toBeGreaterThanOrEqual(495);
});
