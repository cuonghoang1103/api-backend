// Practice 8.4 (given): correct, green — and slow. Make it fast without checking less.
import { it, expect } from 'vitest';
import { bookAndNotify } from '../src/notify/notify.js';
import { createMemoryRepo } from '../src/booking/service.js';
import { createFakeMailer } from '../test/support/fakes.js';
import { retry } from '../src/lib/retry.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00', email: 'an@fpt.edu.vn' };

it('a confirmed booking e-mails the student', async () => {
  const mailer = createFakeMailer();
  bookAndNotify({ repo: createMemoryRepo(), mailer }, input);
  await sleep(1000);                                   // "give the e-mail time to be sent"
  expect(mailer.outbox).toEqual([{ to: 'an@fpt.edu.vn', subject: 'Booking confirmed: BE-201 on 2026-11-16 at 08:00' }]);
});

it('a 31-seat booking asks the approver', async () => {
  const mailer = createFakeMailer();
  bookAndNotify({ repo: createMemoryRepo(), mailer }, { ...input, seats: 31 });
  await sleep(1000);
  expect(mailer.outbox[0].to).toBe('approvals@labflow.example');
});

it('a provider that fails twice is retried until it works', async () => {
  let calls = 0;
  const send = async () => { calls++; if (calls < 3) throw new Error('timeout'); return 'sent'; };
  await expect(retry(send)).resolves.toBe('sent');
  expect(calls).toBe(3);
});
