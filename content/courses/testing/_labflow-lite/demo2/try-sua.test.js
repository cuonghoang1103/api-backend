import { it, expect } from 'vitest';
import { bookLab, createMemoryRepo } from '../src/booking/service.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it('rejects 06:00 with OUTSIDE_HOURS', async () => {
  await expect(bookLab(createMemoryRepo(), { ...input, start: '06:00' }))
    .rejects.toMatchObject({ code: 'OUTSIDE_HOURS' });
});

it('the same mistake as the trap (valid input) now fails loudly', async () => {
  await expect(bookLab(createMemoryRepo(), input))
    .rejects.toMatchObject({ code: 'OUTSIDE_HOURS' });
});
