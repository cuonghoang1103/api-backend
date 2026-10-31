import { describe, it, expect } from 'vitest';
import { createBooking } from '../src/rules/booking.js';

describe('createBooking — a 31-seat student booking, 08:00–10:00', () => {
  const input = { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' };

  it('waits for approval (PENDING)', () => {
    expect(createBooking(input).status).toBe('PENDING');
  });

  it('lasts 120 minutes', () => {
    expect(createBooking(input).minutes).toBe(120);
  });

  it('keeps the lab code', () => {
    expect(createBooking(input).lab).toBe('BE-201');
  });
});
