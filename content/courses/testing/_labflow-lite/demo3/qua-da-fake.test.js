// Fake-based: real bookLab + in-memory repository + fake mailer. Assert what a user would see.
import { describe, it, expect } from 'vitest';
import { bookAndNotify, APPROVER } from '../src/notify/notify.js';
import { createMemoryRepo } from '../src/booking/service.js';
import { createFakeMailer } from '../test/support/fakes.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00', email: 'an@fpt.edu.vn' };

describe('bookAndNotify — with fakes', () => {
  it('a 31-seat student booking is PENDING and goes to the approver', async () => {
    const mailer = createFakeMailer();
    const booking = await bookAndNotify({ repo: createMemoryRepo(), mailer }, input);
    expect(booking).toMatchObject({ status: 'PENDING', notified: true });
    expect(mailer.outbox.map((m) => m.to)).toEqual([APPROVER]);
  });

  it('the booking is really stored', async () => {
    const repo = createMemoryRepo();
    await bookAndNotify({ repo, mailer: createFakeMailer() }, input);
    expect(repo.count()).toBe(1);
  });
});
