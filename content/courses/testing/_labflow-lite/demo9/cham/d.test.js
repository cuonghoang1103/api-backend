// Lesson 9.4: stands in for a slow integration file (they share one database, so they run one after another). It takes 2500 ms.
import { it, expect } from 'vitest';

it('file d takes 2500 ms', async () => {
  const t0 = Date.now();
  await new Promise((resolve) => setTimeout(resolve, 2500));
  expect(Date.now() - t0).toBeGreaterThanOrEqual(2495);
});
