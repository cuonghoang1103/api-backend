import { describe, it, expect } from 'vitest';
import { bookLab, BookingError } from '../src/booking/service.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

describe('practice 2.3', () => {
  it('a failing insert becomes STORAGE_DOWN and keeps "disk full" as the cause', async () => {
    const repo = { findOverlap: async () => null, insert: async () => { throw new Error('disk full'); } };
    const error = await bookLab(repo, input).catch((e) => e);
    expect(error).toBeInstanceOf(BookingError);
    expect(error).toMatchObject({ code: 'STORAGE_DOWN', cause: { message: 'disk full' } });
  });

  it('an invalid slot never reaches the database', async () => {
    let called = false;
    const repo = { findOverlap: async () => { called = true; return null; }, insert: async () => null };
    await expect(bookLab(repo, { ...input, end: '12:30' })).rejects.toMatchObject({ code: 'TOO_LONG' });
    expect(called).toBe(false);
  });
});
