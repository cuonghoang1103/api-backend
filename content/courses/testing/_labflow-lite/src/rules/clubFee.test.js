// The pure quote (Lab 10): "today" is a parameter now, so no fake clock is needed.
import { describe, it, expect } from 'vitest';
import { quoteClubFee } from './clubFee.js';

const base = { member: false, lab: 'BE-201', start: '08:00', end: '10:00', seats: 30 };

describe('quoteClubFee', () => {
  it('charges 1.5 times on a Sunday and the plain price on a Monday', () => {
    expect(quoteClubFee({ ...base, today: new Date('2026-11-22T10:00:00+07:00') })).toBe(600000);
    expect(quoteClubFee({ ...base, today: new Date('2026-11-23T10:00:00+07:00') })).toBe(400000);
  });
});
