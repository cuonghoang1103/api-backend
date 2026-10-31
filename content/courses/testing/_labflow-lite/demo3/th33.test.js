// Practice 3.3: both bad tests rewritten — real rules, fake infrastructure, assert outcomes.
import { it, expect } from 'vitest';
import { bookAndNotify, APPROVER } from '../src/notify/notify.js';
import { bookLab, createMemoryRepo } from '../src/booking/service.js';
import { createFakeMailer } from '../test/support/fakes.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00', email: 'an@fpt.edu.vn' };

it('a 31-seat student booking does NOT e-mail the student — it asks the approver', async () => {
  const mailer = createFakeMailer();
  await bookAndNotify({ repo: createMemoryRepo(), mailer }, input);
  expect(mailer.outbox).toEqual([expect.objectContaining({ to: APPROVER })]);
});

it('bookLab stores one booking with its length and status (outcome, not calls)', async () => {
  const repo = createMemoryRepo();
  const booking = await bookLab(repo, { ...input, seats: 20 });
  expect(booking).toMatchObject({ id: 1, minutes: 120, status: 'CONFIRMED' });
  expect(repo.count()).toBe(1);
});
