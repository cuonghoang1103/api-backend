// Lab 10 — BR-10 weekly repeating bookings, written test-first (the order of the tests is the order they were written).
import { describe, it, expect } from 'vitest';
import { weeklyDates, MAX_WEEKS } from './recurring.js';

const TERM_END = '2026-12-31';

describe('weeklyDates', () => {
  it('books the first date and the same weekday in each following week', () => {
    expect(weeklyDates({ firstDate: '2026-11-02', weeks: 3, until: TERM_END })).toEqual({
      ok: true, dates: ['2026-11-02', '2026-11-09', '2026-11-16'], skipped: [],
    });
  });

  it('skips a holiday without adding an extra week', () => {
    expect(weeklyDates({ firstDate: '2026-11-02', weeks: 3, until: TERM_END, holidays: ['2026-11-09'] })).toEqual({
      ok: true, dates: ['2026-11-02', '2026-11-16'], skipped: [{ date: '2026-11-09', reason: 'HOLIDAY' }],
    });
  });

  it('keeps a class on the last day of term and drops the weeks after it', () => {
    expect(weeklyDates({ firstDate: '2026-12-17', weeks: 3, until: TERM_END })).toEqual({
      ok: true, dates: ['2026-12-17', '2026-12-24', '2026-12-31'], skipped: [],
    });
    expect(weeklyDates({ firstDate: '2026-12-17', weeks: 4, until: TERM_END }).skipped).toEqual([{ date: '2027-01-07', reason: 'AFTER_TERM' }]);
  });

  it('reports HOLIDAY inside the term, but AFTER_TERM for a holiday after it', () => {
    expect(weeklyDates({ firstDate: '2026-12-24', weeks: 2, until: TERM_END, holidays: ['2026-12-31'] }).skipped).toEqual([{ date: '2026-12-31', reason: 'HOLIDAY' }]);
    expect(weeklyDates({ firstDate: '2026-12-31', weeks: 2, until: TERM_END, holidays: ['2027-01-07'] }).skipped).toEqual([{ date: '2027-01-07', reason: 'AFTER_TERM' }]);
  });

  it('crosses a month and a year correctly', () => {
    expect(weeklyDates({ firstDate: '2026-12-28', weeks: 2, until: '2027-06-30' }).dates).toEqual(['2026-12-28', '2027-01-04']);
  });

  it.each([1, MAX_WEEKS])('accepts %i week(s)', (weeks) => {
    expect(weeklyDates({ firstDate: '2026-01-05', weeks, until: TERM_END }).dates).toHaveLength(weeks);
  });

  it.each([0, MAX_WEEKS + 1, 2.5])('refuses %s weeks with BAD_WEEKS', (weeks) => {
    expect(weeklyDates({ firstDate: '2026-11-02', weeks, until: TERM_END })).toEqual({ ok: false, code: 'BAD_WEEKS' });
  });

  it('refuses a series that starts after the term, and accepts one that starts on its last day', () => {
    expect(weeklyDates({ firstDate: '2027-01-04', weeks: 1, until: TERM_END })).toEqual({ ok: false, code: 'STARTS_AFTER_TERM' });
    expect(weeklyDates({ firstDate: TERM_END, weeks: 1, until: TERM_END }).dates).toEqual([TERM_END]);
  });
});
