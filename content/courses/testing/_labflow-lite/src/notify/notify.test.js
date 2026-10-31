import { describe, it, expect, vi } from 'vitest';
import { bookAndNotify, buildMail, APPROVER } from './notify.js';
import { createMemoryRepo } from '../booking/service.js';
import { createFakeMailer } from '../../test/support/fakes.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00', email: 'an@fpt.edu.vn' };
const failing = () => ({ send: async () => { throw new Error('SMTP down'); } });

describe('buildMail (pure)', () => {
  it.each([
    ['CONFIRMED', 20, 'an@fpt.edu.vn', 'Booking confirmed: BE-201 on 2026-11-16 at 08:00'],
    ['PENDING', 31, APPROVER, 'Approval needed: 31 seats, BE-201 on 2026-11-16 at 08:00'],
  ])('%s booking with %i seats → mail to %s', (status, seats, to, subject) => {
    expect(buildMail({ lab: 'BE-201', date: '2026-11-16', start: '08:00', status, seats }, 'an@fpt.edu.vn')).toEqual({ to, subject });
  });
});

describe('bookAndNotify', () => {
  it('a confirmed booking e-mails the student once', async () => {
    const mailer = createFakeMailer();
    const booking = await bookAndNotify({ repo: createMemoryRepo(), mailer }, input);
    expect(booking).toMatchObject({ id: 1, status: 'CONFIRMED', notified: true });
    expect(mailer.outbox).toEqual([buildMail(booking, 'an@fpt.edu.vn')]);
  });

  it('a 31-seat student booking e-mails only the approver', async () => {
    const mailer = createFakeMailer();
    await bookAndNotify({ repo: createMemoryRepo(), mailer }, { ...input, seats: 31 });
    expect(mailer.outbox.map((m) => m.to)).toEqual([APPROVER]);
  });

  it('a failed e-mail keeps the booking and reports notified: false', async () => {
    const repo = createMemoryRepo();
    const booking = await bookAndNotify({ repo, mailer: failing(), log: { warn() {} } }, input);
    expect(booking).toMatchObject({ status: 'CONFIRMED', notified: false });
    expect(repo.count()).toBe(1);
  });

  it('a failed e-mail is logged with the booking id and the reason', async () => {
    const log = { warn: vi.fn() };
    await bookAndNotify({ repo: createMemoryRepo(), mailer: failing(), log }, input);
    expect(log.warn).toHaveBeenCalledWith('mail failed for booking 1: SMTP down');
  });

  it('a rejected booking sends no e-mail', async () => {
    const mailer = createFakeMailer();
    await expect(bookAndNotify({ repo: createMemoryRepo(), mailer }, { ...input, start: '06:00' }))
      .rejects.toMatchObject({ code: 'OUTSIDE_HOURS' });
    expect(mailer.outbox).toEqual([]);
  });
});
