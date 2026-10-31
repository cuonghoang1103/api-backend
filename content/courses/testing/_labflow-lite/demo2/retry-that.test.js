import { it, expect } from 'vitest';
import { retry } from '../src/lib/retry.js';

it('real timers: succeeds on the 3rd attempt (and really waits)', async () => {
  let calls = 0;
  const flakyMailer = async () => {
    calls++;
    if (calls < 3) throw new Error('SMTP timeout');
    return 'sent';
  };
  await expect(retry(flakyMailer)).resolves.toBe('sent');
  expect(calls).toBe(3);
});
