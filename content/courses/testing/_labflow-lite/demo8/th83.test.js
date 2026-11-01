// Practice 8.3 (solution): fake timers are global — whoever turns them on must turn them off.
import { it, expect, vi, afterEach } from 'vitest';
import { retry } from '../src/lib/retry.js';

afterEach(() => { vi.useRealTimers(); });

it('a mail that works on the 2nd try is sent', async () => {
  const send = vi.fn().mockRejectedValueOnce(new Error('timeout')).mockResolvedValue('sent');
  await expect(retry(send, { delayMs: 10 })).resolves.toBe('sent');
});

it('waits 1 s, then 2 s between attempts', async () => {
  vi.useFakeTimers();
  const send = vi.fn().mockRejectedValueOnce(new Error('timeout')).mockRejectedValueOnce(new Error('timeout')).mockResolvedValue('sent');
  const result = retry(send);
  await vi.advanceTimersByTimeAsync(3000);
  await expect(result).resolves.toBe('sent');
});
