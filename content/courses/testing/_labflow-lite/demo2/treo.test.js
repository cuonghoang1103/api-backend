import { it, expect } from 'vitest';

it('waits for a confirmation e-mail that never comes', async () => {
  const sent = await new Promise(() => {}); // never resolves
  expect(sent).toBe(true);
});
