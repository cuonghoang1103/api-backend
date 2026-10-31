import { describe, it, expect } from 'vitest';
import { bookLab, createMemoryRepo, BookingError } from '../src/booking/service.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

describe('bookLab — failure paths', () => {
  it('a rule violation is a BookingError with the rule code', async () => {
    const error = await bookLab(createMemoryRepo(), { ...input, start: '06:00' }).catch((e) => e);
    expect(error).toBeInstanceOf(BookingError);
    expect(error).toMatchObject({ name: 'BookingError', code: 'OUTSIDE_HOURS', message: 'OUTSIDE_HOURS' });
  });

  it('a database failure becomes STORAGE_DOWN and keeps the original cause', async () => {
    const brokenRepo = {
      findOverlap: async () => { throw new Error('connect ECONNREFUSED 127.0.0.1:5432'); },
      insert: async () => { throw new Error('should not be called'); },
    };
    const error = await bookLab(brokenRepo, input).catch((e) => e);
    expect(error.code).toBe('STORAGE_DOWN');
    expect(error.cause.message).toBe('connect ECONNREFUSED 127.0.0.1:5432');
  });

  it('a failure while saving is also STORAGE_DOWN', async () => {
    const repo = { findOverlap: async () => null, insert: async () => { throw new Error('disk full'); } };
    await expect(bookLab(repo, input)).rejects.toMatchObject({ code: 'STORAGE_DOWN' });
  });
});
