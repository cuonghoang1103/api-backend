// The pure core of the monthly report (lesson 10.2): no seams needed, no fake clock, any time zone.
import { describe, it, expect } from 'vitest';
import { buildMonthlyReport } from './monthly.js';
import { monthlyReport } from '../legacy/monthlyReport.js';
import { ROWS, HOLIDAYS } from '../../test/support/report-rows.js';

describe('buildMonthlyReport', () => {
  it('prints one line per kept booking and the four totals', () => {
    expect(buildMonthlyReport({ lab: 'BE-305', month: '2026-10', rows: ROWS, holidays: [] })).toBe(
      'LAB BE-305 - 2026/10\n2026-10-06 10:00-12:30 40 seats\nBookings: 1\nHours: 2.5\nLarge (>30 seats): 1\nWeekend/holiday: 0\n',
    );
  });

  it('counts Saturday and Sunday by the calendar date, whatever the time zone of the machine', () => {
    const rows = [{ lab: 'L', date: '2026-10-03', start: '08:00', end: '09:00', seats: 1, status: 'CONFIRMED' }];
    expect(buildMonthlyReport({ lab: 'L', month: '2026-10', rows, holidays: [] })).toContain('Weekend/holiday: 1\n');
  });
});

describe('monthlyReport with injected dependencies (object seams)', () => {
  it('reads the bookings, the holidays and today from what it is given', async () => {
    const report = await monthlyReport('BE-201', {
      database: { all: async () => ROWS },
      fetch: async () => ({ json: async () => HOLIDAYS }),
      now: () => new Date('2026-09-30T12:00:00+07:00'),
    });
    expect(report).toContain('Weekend/holiday: 2\n');
  });
});
