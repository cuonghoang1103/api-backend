// Lab 8 reference: check-in window (BR-07) and the no-show ban (BR-08).
import { describe, it, expect } from 'vitest';
import { checkIn, bannedUntil, createNoShowLog } from './checkin.js';

const booking = { lab: 'BE-201', start: '08:00', end: '10:00', status: 'CONFIRMED' };

describe('checkIn (BR-07)', () => {
  it.each([
    ['07:49', { ok: false, code: 'TOO_EARLY' }],   // 11 minutes before
    ['07:50', { ok: true, late: false }],           // opens exactly 10 minutes before
    ['08:00', { ok: true, late: false }],           // on time is not late
    ['08:01', { ok: true, late: true }],
    ['08:15', { ok: true, late: true }],            // last minute of the grace period
    ['08:16', { ok: false, code: 'NO_SHOW' }],
  ])('at %s → %o', (now, expected) => {
    expect(checkIn(booking, now)).toEqual(expected);
  });

  it.each(['PENDING', 'CANCELLED'])('refuses a %s booking', (status) => {
    expect(checkIn({ ...booking, status }, '08:00')).toEqual({ ok: false, code: 'NOT_CONFIRMED' });
  });
});

describe('bannedUntil (BR-08)', () => {
  it('bans for 7 days after the third no-show', () => {
    expect(bannedUntil(['2026-11-01', '2026-11-05', '2026-11-10'], '2026-11-12')).toBe('2026-11-17');
  });
  it('counts from the latest no-show, whatever the order', () => {
    expect(bannedUntil(['2026-11-10', '2026-11-01', '2026-11-05'], '2026-11-12')).toBe('2026-11-17');
  });
  it('two no-shows are not enough', () => {
    expect(bannedUntil(['2026-11-05', '2026-11-10'], '2026-11-12')).toBeNull();
  });
  it('the ban still holds on its last day, and is over the day after', () => {
    const three = ['2026-11-01', '2026-11-05', '2026-11-10'];
    expect(bannedUntil(three, '2026-11-17')).toBe('2026-11-17');
    expect(bannedUntil(three, '2026-11-18')).toBeNull();
  });
  it('a no-show 30 days ago no longer counts; 29 days ago still does', () => {
    expect(bannedUntil(['2026-10-13', '2026-11-05', '2026-11-10'], '2026-11-12')).toBeNull();
    expect(bannedUntil(['2026-10-14', '2026-11-05', '2026-11-10'], '2026-11-12')).toBe('2026-11-17');
  });
  it('a no-show today already counts', () => {                     // found by Stryker, not by the 8 hand-made mutants
    expect(bannedUntil(['2026-11-05', '2026-11-10', '2026-11-12'], '2026-11-12')).toBe('2026-11-19');
  });
  it('ignores no-shows dated after today', () => {
    expect(bannedUntil(['2026-11-05', '2026-11-10', '2026-11-20'], '2026-11-12')).toBeNull();
  });
});

describe('createNoShowLog', () => {
  it('keeps each student separate, in order', () => {
    const log = createNoShowLog();       // a fresh log per test: no shared state
    log.record('an', '2026-11-01');
    log.record('binh', '2026-11-02');
    log.record('an', '2026-11-05');
    expect(log.datesFor('an')).toEqual(['2026-11-01', '2026-11-05']);
    expect(log.datesFor('binh')).toEqual(['2026-11-02']);
    expect(log.datesFor('chi')).toEqual([]);
  });
});
