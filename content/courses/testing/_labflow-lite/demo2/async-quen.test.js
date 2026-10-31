import { it, expect } from 'vitest';
import { bookLab, createMemoryRepo } from '../src/booking/service.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it('forgot to await: the assertion runs after the test has ended', () => {
  const repo = createMemoryRepo();
  bookLab(repo, input).then((booking) => {
    expect(booking.status).toBe('WRONG ON PURPOSE');
  });
});

it('forgot to await rejects', () => {
  const repo = createMemoryRepo();
  expect(bookLab(repo, { ...input, start: '06:00' })).rejects.toThrow('THIS IS NOT THE CODE');
});
