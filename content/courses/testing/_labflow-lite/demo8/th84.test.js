// Practice 8.4 (solution): await the work instead of sleeping; fake the clock for retry.
import { it, expect, vi, afterEach } from 'vitest';
import { bookAndNotify } from '../src/notify/notify.js';
import { createMemoryRepo } from '../src/booking/service.js';
import { createFakeMailer } from '../test/support/fakes.js';
import { retry } from '../src/lib/retry.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00', email: 'an@fpt.edu.vn' };
afterEach(() => { vi.useRealTimers(); });

it('a confirmed booking e-mails the student', async () => {
  const mailer = createFakeMailer();
  await bookAndNotify({ repo: createMemoryRepo(), mailer }, input);      // done means done: no sleep
  expect(mailer.outbox).toEqual([{ to: 'an@fpt.edu.vn', subject: 'Booking confirmed: BE-201 on 2026-11-16 at 08:00' }]);
});

it('a 31-seat booking asks the approver', async () => {
  const mailer = createFakeMailer();
  await bookAndNotify({ repo: createMemoryRepo(), mailer }, { ...input, seats: 31 });
  expect(mailer.outbox[0].to).toBe('approvals@labflow.example');
});

it('a provider that fails twice is retried until it works', async () => {
  vi.useFakeTimers();
  let calls = 0;
  const send = async () => { calls++; if (calls < 3) throw new Error('timeout'); return 'sent'; };
  const result = retry(send);
  await vi.advanceTimersByTimeAsync(1000 + 2000);
  await expect(result).resolves.toBe('sent');
  expect(calls).toBe(3);
});
