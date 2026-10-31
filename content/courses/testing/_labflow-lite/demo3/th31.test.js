import { describe, it, expect, vi } from 'vitest';
import { bookAndNotify, APPROVER } from '../src/notify/notify.js';
import { createMemoryRepo } from '../src/booking/service.js';
import { createFakeMailer } from '../test/support/fakes.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00', email: 'an@fpt.edu.vn' };

describe('practice 3.1', () => {
  it('a PENDING booking e-mails the approver, not the student (fake mailer)', async () => {
    const mailer = createFakeMailer();
    await bookAndNotify({ repo: createMemoryRepo(), mailer }, input);
    expect(mailer.outbox).toHaveLength(1);
    expect(mailer.outbox[0].to).toBe(APPROVER);
  });

  it('when the mailer fails, the booking is still stored and marked notified: false (stub)', async () => {
    const repo = createMemoryRepo();
    const failing = { send: async () => { throw new Error('SMTP down'); } };
    const booking = await bookAndNotify({ repo, mailer: failing, log: { warn() {} } }, input);
    expect(booking.notified).toBe(false);
    expect(repo.count()).toBe(1);
  });

  it('the approver mail mentions the number of seats (spy)', async () => {
    const send = vi.fn().mockResolvedValue('m');
    await bookAndNotify({ repo: createMemoryRepo(), mailer: { send } }, input);
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: APPROVER, subject: expect.stringContaining('31 seats') }));
  });
});
