// Lab 10 — characterization tests of the club fee quote. They pin what v0 returns TODAY, bugs included,
// and must stay green, unchanged, on v0 and on the refactored code.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clubFee } from './clubFee.js';

const DAYS = { WED: '2026-11-18T10:00:00+07:00', SAT: '2026-11-21T10:00:00+07:00', SUN: '2026-11-22T10:00:00+07:00' };
const EVENT = '2026-12-02'; // a Wednesday; v0 never reads it (issue LF-212)

function quote(day, member, lab, start, end, seats) {
  vi.setSystemTime(new Date(DAYS[day]));
  return clubFee({ member }, lab, EVENT, start, end, seats);
}

describe('clubFee (characterization of v0)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    return () => vi.useRealTimers();
  });

  it.each([
    ['WED', false, 'BE-201', '08:00', '10:00', 30, 400000],
    ['WED', true, 'BE-201', '08:00', '10:00', 30, 320000],
    ['WED', false, 'BE-201', '08:00', '10:00', 40, 400000],
    ['WED', false, 'BE-201', '08:00', '10:00', 41, 500000],
    ['WED', false, 'BE-201', '08:00', '11:30', 30, 700000],
    ['WED', false, 'BE-201', '08:00', '12:00', 30, 750000],
    ['WED', true, 'AL-105', '08:00', '08:30', 30, 140000],
    ['SAT', true, 'AL-105', '08:00', '08:30', 30, 210000],
    ['SUN', false, 'AL-105', '08:00', '08:30', 30, 263000],
    ['WED', false, 'BE-201', '10:00', '08:00', 30, 0],
    ['WED', 1, 'BE-201', '08:00', '10:00', 30, 320000],
    ['WED', 'yes', 'BE-201', '08:00', '10:00', 30, 400000],
  ])('quoted on %s: member %s, %s %s–%s, %i seats ⇒ %i VND', (day, member, lab, start, end, seats, expected) => {
    expect(quote(day, member, lab, start, end, seats)).toBe(expected);
  });

  it('charges the weekend rate when the QUOTE is made on a weekend, whatever the event date (LF-212, pinned)', () => {
    expect(quote('SAT', false, 'BE-201', '08:00', '10:00', 30)).toBe(600000);
  });

  it('returns NaN for a building it has no price for', () => {
    expect(quote('WED', false, 'XX-001', '08:00', '10:00', 30)).toBeNaN();
  });
});
