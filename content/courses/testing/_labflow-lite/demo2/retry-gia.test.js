import { it, expect, vi, afterEach } from 'vitest';
import { retry } from '../src/lib/retry.js';

afterEach(() => {
  vi.useRealTimers();
});

it('fake timers: waits 1 s, then 2 s, between attempts', async () => {
  vi.useFakeTimers();
  const mailer = vi.fn()
    .mockRejectedValueOnce(new Error('SMTP timeout'))
    .mockRejectedValueOnce(new Error('SMTP timeout'))
    .mockResolvedValue('sent');

  const result = retry(mailer);              // start — do not await yet
  await vi.advanceTimersByTimeAsync(0);
  expect(mailer).toHaveBeenCalledTimes(1);   // first attempt, immediately

  await vi.advanceTimersByTimeAsync(999);
  expect(mailer).toHaveBeenCalledTimes(1);   // 1 s not over yet
  await vi.advanceTimersByTimeAsync(1);
  expect(mailer).toHaveBeenCalledTimes(2);   // second attempt at 1 000 ms

  await vi.advanceTimersByTimeAsync(2000);
  expect(mailer).toHaveBeenCalledTimes(3);   // third attempt 2 000 ms later
  await expect(result).resolves.toBe('sent');
});

it('fake timers: gives up after 3 attempts with the last error', async () => {
  vi.useFakeTimers();
  const mailer = vi.fn().mockRejectedValue(new Error('SMTP down'));
  const result = retry(mailer);
  const check = expect(result).rejects.toThrow('SMTP down');
  await vi.runAllTimersAsync();
  await check;
  expect(mailer).toHaveBeenCalledTimes(3);
});
