import { describe, it, expect } from 'vitest';
import { bookLab, createMemoryRepo } from './service.js';
import { listMyBookings, cancelMyBooking } from './myBookings.js';

describe('my bookings', () => {
  it('should list my bookings', async () => {
    const repo = createMemoryRepo();
    await bookLab(repo, { lab: 'BE-201', date: '2026-11-16', start: '09:00', end: '11:00', seats: 20, role: 'STUDENT', userId: 'an' });
    expect(await listMyBookings(repo, 'an')).toHaveLength(1);
  });
  it('should cancel', async () => {
    const repo = createMemoryRepo();
    const { id } = await bookLab(repo, { lab: 'BE-201', date: '2026-11-16', start: '09:00', end: '11:00', seats: 20, role: 'STUDENT', userId: 'an' });
    const result = await cancelMyBooking(repo, { id, user: { id: 'an', role: 'STUDENT' }, now: new Date('2026-11-16T07:00:00+07:00') });
    expect(result.ok).toBe(true);
  });
});
