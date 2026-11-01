// Practice 8.3 (given): green when run in file order. Is it?
import { it, expect, vi } from 'vitest';
import { retry } from '../src/lib/retry.js';

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
