// Lab 8 starting point: every line of checkin.js runs, the suite is green... usually.
import { describe, it, expect } from 'vitest';
import { checkIn, bannedUntil, createNoShowLog } from '../src/rules/checkin.js';

const log = createNoShowLog();                      // one log for the whole file
const booking = { lab: 'BE-201', start: '08:00', end: '10:00', status: 'CONFIRMED' };

describe('checkIn', () => {
  it('too early', () => {
    expect(checkIn(booking, '07:00').ok).toBe(false);
  });
  it('on time', () => {
    expect(checkIn(booking, '08:05')).toBeTruthy();
  });
  it('too late', () => {
    expect(checkIn(booking, '09:00').code).toBeDefined();
  });
  it('pending booking', () => {
    expect(checkIn({ ...booking, status: 'PENDING' }, '08:00').ok).toBe(false);
  });
});

describe('no-shows', () => {
  it('records a no-show', () => {
    log.record('an', '2026-11-01');
    expect(log.datesFor('an')).toHaveLength(1);
  });
  it('three no-shows ban the student', () => {
    log.record('an', '2026-11-05');
    log.record('an', '2026-11-10');
    expect(bannedUntil(log.datesFor('an'), '2026-11-12')).not.toBeNull();
  });
  it('a ban ends', () => {
    expect(bannedUntil(log.datesFor('an'), '2026-12-30')).toBeNull();
  });
  it('a student without no-shows', () => {
    expect(log.datesFor('binh')).toEqual([]);
  });
});
