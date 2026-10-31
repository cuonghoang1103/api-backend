import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { retry } from './retry.js';

describe('retry', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('returns at once when the first attempt works', async () => {
    const fn = vi.fn().mockResolvedValue('sent');
    await expect(retry(fn)).resolves.toBe('sent');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('waits 1 s then 2 s between attempts', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('timeout'))
      .mockRejectedValueOnce(new Error('timeout'))
      .mockResolvedValue('sent');
    const result = retry(fn);
    await vi.advanceTimersByTimeAsync(999);
    expect(fn).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(fn).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(1999);
    expect(fn).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(1);
    expect(fn).toHaveBeenCalledTimes(3);
    await expect(result).resolves.toBe('sent');
  });

  it('gives up after 3 attempts and rethrows the last error', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('SMTP down'));
    const check = expect(retry(fn)).rejects.toThrow('SMTP down');
    await vi.runAllTimersAsync();
    await check;
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
