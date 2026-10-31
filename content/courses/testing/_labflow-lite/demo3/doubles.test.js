import { describe, it, expect, vi } from 'vitest';
import { bookAndNotify, APPROVER } from '../src/notify/notify.js';
import { createMemoryRepo } from '../src/booking/service.js';
import { createFakeMailer } from '../test/support/fakes.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00', email: 'an@fpt.edu.vn' };

describe('five kinds of test double around bookAndNotify', () => {
  it('dummy: the log is required but never used on this path', async () => {
    const dummyLog = {};                                   // would crash if touched
    const booking = await bookAndNotify({ repo: createMemoryRepo(), mailer: { send: async () => 'x' }, log: dummyLog }, input);
    expect(booking.notified).toBe(true);
  });

  it('stub: a mailer that always fails, to reach the catch branch', async () => {
    const stubMailer = { send: async () => { throw new Error('SMTP down'); } };
    const booking = await bookAndNotify({ repo: createMemoryRepo(), mailer: stubMailer, log: { warn() {} } }, input);
    expect(booking).toMatchObject({ status: 'CONFIRMED', notified: false });
  });

  it('spy: vi.fn records how it was called', async () => {
    const send = vi.fn().mockResolvedValue('msg-1');
    await bookAndNotify({ repo: createMemoryRepo(), mailer: { send } }, input);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith({ to: 'an@fpt.edu.vn', subject: 'Booking confirmed: BE-201 on 2026-11-16 at 08:00' });
  });

  it('mock: the expectation IS the test — a warning must be logged', async () => {
    const log = { warn: vi.fn() };
    await bookAndNotify({ repo: createMemoryRepo(), mailer: { send: vi.fn().mockRejectedValue(new Error('SMTP down')) }, log }, input);
    expect(log.warn).toHaveBeenCalledWith('mail failed for booking 1: SMTP down');
  });

  it('fake: a working in-memory mailer — assert on its state', async () => {
    const mailer = createFakeMailer();
    await bookAndNotify({ repo: createMemoryRepo(), mailer }, { ...input, seats: 31 });
    expect(mailer.outbox).toEqual([{ to: APPROVER, subject: 'Approval needed: 31 seats, BE-201 on 2026-11-16 at 08:00' }]);
  });

  it('vi.spyOn: watch a real object without replacing what it does', async () => {
    const mailer = createFakeMailer();
    const send = vi.spyOn(mailer, 'send');
    await bookAndNotify({ repo: createMemoryRepo(), mailer }, input);
    expect(send).toHaveBeenCalledOnce();
    expect(mailer.outbox).toHaveLength(1);                 // the real fake still ran
  });
});
