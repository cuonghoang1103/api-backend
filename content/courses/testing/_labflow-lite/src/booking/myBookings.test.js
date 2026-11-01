// US-11 "My bookings" — the service on the in-memory repository (Chapter 11). The clock is a parameter.
import { describe, it, expect } from 'vitest';
import { bookLab, createMemoryRepo } from './service.js';
import { listMyBookings, cancelMyBooking } from './myBookings.js';

const at = (clock) => new Date('2026-11-16T' + clock + ':00+07:00');
const an = { id: 'an', role: 'STUDENT' };
const input = (overrides = {}) => ({ lab: 'BE-201', date: '2026-11-16', start: '09:00', end: '11:00', seats: 20, role: 'STUDENT', userId: 'an', ...overrides });

describe('listMyBookings (US-11)', () => {
  it('only my bookings, by date then start (AC1)', async () => {
    const repo = createMemoryRepo();
    await bookLab(repo, input({ date: '2026-11-17', start: '08:00', end: '09:00' }));
    await bookLab(repo, input({ lab: 'BE-305', userId: 'binh' }));
    await bookLab(repo, input({ start: '13:00', end: '14:00' }));
    await bookLab(repo, input());
    const mine = await listMyBookings(repo, 'an');
    expect(mine.map((b) => b.date + ' ' + b.start)).toEqual(['2026-11-16 09:00', '2026-11-16 13:00', '2026-11-17 08:00']);
  });
});

describe('cancelMyBooking (US-11)', () => {
  it('cancels: the booking comes back CANCELLED and stays in my list (AC1, AC2)', async () => {
    const repo = createMemoryRepo();
    const { id } = await bookLab(repo, input());
    const result = await cancelMyBooking(repo, { id, user: an, now: at('07:00') });
    expect(result).toMatchObject({ ok: true, booking: { id, status: 'CANCELLED' } });
    expect((await listMyBookings(repo, 'an')).map((b) => b.status)).toEqual(['CANCELLED']);
  });

  it('a cancelled slot can be booked again (AC5)', async () => {
    const repo = createMemoryRepo();
    const { id } = await bookLab(repo, input());
    await cancelMyBooking(repo, { id, user: an, now: at('07:00') });
    await expect(bookLab(repo, input({ userId: 'binh' }))).resolves.toMatchObject({ status: 'CONFIRMED' });
  });

  it('refuses inside the last hour and changes nothing (AC2)', async () => {
    const repo = createMemoryRepo();
    const { id } = await bookLab(repo, input());
    expect(await cancelMyBooking(repo, { id, user: an, now: at('08:01') })).toEqual({ ok: false, code: 'TOO_LATE_TO_CANCEL' });
    expect((await repo.findById(id)).status).toBe('CONFIRMED');
  });

  it("someone else's booking looks missing, and stays booked (AC3)", async () => {
    const repo = createMemoryRepo();
    const { id } = await bookLab(repo, input());
    expect(await cancelMyBooking(repo, { id, user: { id: 'binh', role: 'STUDENT' }, now: at('07:00') })).toEqual({ ok: false, code: 'NOT_FOUND' });
    expect((await repo.findById(id)).status).toBe('CONFIRMED');
  });

  it('twice → ALREADY_CANCELLED the second time (AC4)', async () => {
    const repo = createMemoryRepo();
    const { id } = await bookLab(repo, input());
    await cancelMyBooking(repo, { id, user: an, now: at('07:00') });
    expect(await cancelMyBooking(repo, { id, user: an, now: at('07:00') })).toEqual({ ok: false, code: 'ALREADY_CANCELLED' });
  });

  it('two cancels at the same moment: exactly one wins (AC4)', async () => {
    const repo = createMemoryRepo();
    const { id } = await bookLab(repo, input());
    const results = await Promise.all([1, 2].map(() => cancelMyBooking(repo, { id, user: an, now: at('07:00') })));
    expect(results.map((r) => r.ok).sort()).toEqual([false, true]);
    expect(results.find((r) => !r.ok)).toEqual({ ok: false, code: 'ALREADY_CANCELLED' });
  });
});
