import { describe, it, expect } from 'vitest';
import { bookLab, createMemoryRepo, BookingError } from './service.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

describe('bookLab', () => {
  it('stores a confirmed booking', async () => {
    await expect(bookLab(createMemoryRepo(), input)).resolves.toMatchObject({ id: 1, status: 'CONFIRMED', minutes: 120 });
  });

  it('rejects a rule violation with its code before touching the database', async () => {
    const repo = { findOverlap: async () => { throw new Error('must not be called'); }, insert: async () => null };
    await expect(bookLab(repo, { ...input, start: '06:00' })).rejects.toMatchObject({ name: 'BookingError', code: 'OUTSIDE_HOURS' });
  });

  it('rejects an overlapping booking with OVERLAP', async () => {
    const repo = createMemoryRepo();
    await bookLab(repo, input);
    await expect(bookLab(repo, { ...input, start: '09:00', end: '11:00' })).rejects.toMatchObject({ code: 'OVERLAP' });
  });

  it('accepts the slot that starts when the previous one ends', async () => {
    const repo = createMemoryRepo();
    await bookLab(repo, input);
    await expect(bookLab(repo, { ...input, start: '10:00', end: '12:00' })).resolves.toMatchObject({ id: 2 });
  });

  it('turns a failing lookup into STORAGE_DOWN and keeps the cause', async () => {
    const repo = { findOverlap: async () => { throw new Error('ECONNREFUSED'); }, insert: async () => null };
    const error = await bookLab(repo, input).catch((e) => e);
    expect(error).toBeInstanceOf(BookingError);
    expect(error.code).toBe('STORAGE_DOWN');
    expect(error.cause.message).toBe('ECONNREFUSED');
  });

  it('turns a failing insert into STORAGE_DOWN', async () => {
    const repo = { findOverlap: async () => null, insert: async () => { throw new Error('disk full'); } };
    await expect(bookLab(repo, input)).rejects.toMatchObject({ code: 'STORAGE_DOWN' });
  });
});
