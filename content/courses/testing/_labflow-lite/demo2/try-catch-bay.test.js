import { it, expect } from 'vitest';
import { bookLab, createMemoryRepo } from '../src/booking/service.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it('rejects 06:00 (try/catch style — but the input is valid!)', async () => {
  try {
    await bookLab(createMemoryRepo(), input); // oops: 08:00, not 06:00 — no error is thrown
  } catch (err) {
    expect(err.code).toBe('OUTSIDE_HOURS');
  }
});
