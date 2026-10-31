import { describe, it, expect } from 'vitest';
import { bookLab, createMemoryRepo } from '../src/booking/service.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

describe('practice 2.1', () => {
  it('awaits the booking before asserting', async () => {
    const booking = await bookLab(createMemoryRepo(), input);
    expect(booking.status).toBe('CONFIRMED');
  });

  it('awaits rejects for an invalid slot', async () => {
    await expect(bookLab(createMemoryRepo(), { ...input, start: '06:00' })).rejects.toThrow('OUTSIDE_HOURS');
  });

  it('a 31-seat student booking is stored as PENDING', async () => {
    await expect(bookLab(createMemoryRepo(), { ...input, seats: 31 })).resolves.toMatchObject({ status: 'PENDING' });
  });

  it('a booking in another lab at the same time is fine', async () => {
    const repo = createMemoryRepo();
    await bookLab(repo, input);
    await expect(bookLab(repo, { ...input, lab: 'BE-305' })).resolves.toMatchObject({ id: 2 });
  });
});
