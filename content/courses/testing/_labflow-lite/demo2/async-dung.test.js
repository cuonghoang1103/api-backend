import { describe, it, expect } from 'vitest';
import { bookLab, createMemoryRepo, BookingError } from '../src/booking/service.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

describe('bookLab (async)', () => {
  it('stores a confirmed booking — await the result, then assert', async () => {
    const repo = createMemoryRepo();
    const booking = await bookLab(repo, input);
    expect(booking).toMatchObject({ id: 1, status: 'CONFIRMED', minutes: 120 });
  });

  it('resolves: assert on the promise itself', async () => {
    await expect(bookLab(createMemoryRepo(), input)).resolves.toMatchObject({ status: 'CONFIRMED' });
  });

  it('rejects a second booking of the same slot with OVERLAP', async () => {
    const repo = createMemoryRepo();
    await bookLab(repo, input);
    await expect(bookLab(repo, input)).rejects.toThrow(BookingError);
    await expect(bookLab(repo, input)).rejects.toMatchObject({ code: 'OVERLAP' });
  });

  it('allows the next slot right after (10:00–12:00)', async () => {
    const repo = createMemoryRepo();
    await bookLab(repo, input);
    await expect(bookLab(repo, { ...input, start: '10:00', end: '12:00' })).resolves.toMatchObject({ id: 2 });
  });
});
