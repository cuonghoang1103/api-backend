// Practice 8.2: kills the two retry.js mutants that survived — a pointless wait after the last attempt.
import { it, expect, vi, beforeEach, afterEach } from 'vitest';
import { retry } from './retry.js';

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });

it('gives up right after the 3rd attempt: no wait after the last one', async () => {
  const fn = vi.fn().mockRejectedValue(new Error('SMTP down'));
  let done = false;
  const result = retry(fn).catch((err) => { done = true; return err; });
  await vi.advanceTimersByTimeAsync(1000 + 2000);          // exactly the two waits between attempts
  expect(fn).toHaveBeenCalledTimes(3);
  expect(done).toBe(true);
  expect((await result).message).toBe('SMTP down');
});
