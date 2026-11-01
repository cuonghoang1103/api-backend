// SLOW: retry() really waits 1 s, then 2 s, between attempts.
import { it, expect, vi } from 'vitest';
import { retry } from '../../src/lib/retry.js';

it('a mail that works on the 3rd try is sent', async () => {
  const send = vi.fn().mockRejectedValueOnce(new Error('timeout')).mockRejectedValueOnce(new Error('timeout')).mockResolvedValue('sent');
  await expect(retry(send)).resolves.toBe('sent');
});

it('gives up after 3 attempts with the last error', async () => {
  const send = vi.fn().mockRejectedValue(new Error('SMTP down'));
  await expect(retry(send)).rejects.toThrow('SMTP down');
  expect(send).toHaveBeenCalledTimes(3);
});
