// FAST: the same two tests with fake timers (lesson 2.2) — the waits are checked, not waited for.
import { it, expect, vi, beforeEach, afterEach } from 'vitest';
import { retry } from '../../src/lib/retry.js';

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });

it('a mail that works on the 3rd try is sent', async () => {
  const send = vi.fn().mockRejectedValueOnce(new Error('timeout')).mockRejectedValueOnce(new Error('timeout')).mockResolvedValue('sent');
  const result = retry(send);
  await vi.advanceTimersByTimeAsync(1000 + 2000);
  await expect(result).resolves.toBe('sent');
});

it('gives up after 3 attempts with the last error', async () => {
  const send = vi.fn().mockRejectedValue(new Error('SMTP down'));
  const result = expect(retry(send)).rejects.toThrow('SMTP down');
  await vi.runAllTimersAsync();
  await result;
  expect(send).toHaveBeenCalledTimes(3);
});
