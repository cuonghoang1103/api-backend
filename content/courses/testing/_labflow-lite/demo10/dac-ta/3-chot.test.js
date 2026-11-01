// Lesson 10.2, step 3: the output printed by step 2, pasted in as the expected value. It pins what the code DOES today.
import { it, expect, vi, beforeEach } from 'vitest';
import { monthlyReport } from '../legacy/monthlyReport.v0.js';

vi.mock('../legacy/db.js', () => ({ db: { all: async () => [
  { lab: 'BE-201', date: '2026-10-05', start: '08:00', end: '10:00', seats: 20, status: 'CONFIRMED' },
  { lab: 'BE-201', date: '2026-10-12', start: '13:30', end: '15:00', seats: 25, status: 'CONFIRMED' },
  { lab: 'BE-201', date: '2026-10-19', start: '09:00', end: '11:00', seats: 18, status: 'CONFIRMED' },
] } }));

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });                              // seam 2: the clock
  vi.setSystemTime(new Date('2026-10-31T12:00:00+07:00'));
  vi.stubGlobal('fetch', async () => ({ json: async () => [] }));       // seam 3: the network
  return () => { vi.useRealTimers(); vi.unstubAllGlobals(); };
});

it('prints the report of BE-201', async () => {
  expect(await monthlyReport('BE-201')).toBe(
    'LAB BE-201 - 2026/10\n' +
    '2026-10-05 08:00-10:00 20 seats\n' +
    '2026-10-12 13:30-15:00 25 seats\n' +
    '2026-10-19 09:00-11:00 18 seats\n' +
    'Bookings: 3\nHours: 5.5\nLarge (>30 seats): 0\nWeekend/holiday: 0\n',
  );
});
