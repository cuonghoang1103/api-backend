// Lesson 10.2, step 4: a golden master. Many inputs chosen to reach every branch, the whole output kept in one
// approved file. Same link seams as step 3; the legacy file is still untouched.
import { it, expect, vi, beforeEach } from 'vitest';
import { monthlyReport } from '../legacy/monthlyReport.v0.js';
import { ROWS, HOLIDAYS } from './rows.js';

vi.mock('../legacy/db.js', () => ({ db: { all: async () => ROWS } }));

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.stubGlobal('fetch', async () => ({ json: async () => HOLIDAYS }));
  return () => { vi.useRealTimers(); vi.unstubAllGlobals(); };
});

it('prints the same reports as before, for every lab and month we keep', async () => {
  let all = '';
  for (const today of ['2026-09-30T12:00:00+07:00', '2026-10-31T12:00:00+07:00', '2026-11-15T12:00:00+07:00']) {
    vi.setSystemTime(new Date(today));
    for (const lab of ['BE-201', 'BE-305']) all += await monthlyReport(lab) + '----\n';
  }
  await expect(all).toMatchFileSnapshot('./__approved__/monthly-report.txt');
});
