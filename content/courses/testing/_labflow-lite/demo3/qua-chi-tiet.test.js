// Over-specified: asserts HOW bookLab talks to the repository, call by call.
import { it, expect, vi } from 'vitest';
import { bookLab } from '../src/booking/service.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it('checks for an overlap, then inserts exactly this row', async () => {
  const repo = { findOverlap: vi.fn().mockResolvedValue(null), insert: vi.fn().mockResolvedValue({ id: 1 }) };
  await bookLab(repo, input);
  expect(repo.findOverlap).toHaveBeenCalledWith('BE-201', '2026-11-16', '08:00', '10:00');
  expect(repo.insert).toHaveBeenCalledWith({ ...input, minutes: 120, status: 'CONFIRMED' });
});
