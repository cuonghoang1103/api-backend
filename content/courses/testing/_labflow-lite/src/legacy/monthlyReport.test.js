// Characterization tests of the monthly report (lesson 10.2). They pin what v0 printed — bugs and all — so that the
// code can be refactored under them. The approved file was written by v0 and has not changed since.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { monthlyReport } from './monthlyReport.js';
import { ROWS, HOLIDAYS } from '../../test/support/report-rows.js';

vi.mock('./db.js', () => ({ db: { all: async () => ROWS } })); // link seam: works for v0 and for every later version

describe('monthlyReport (characterization)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.stubGlobal('fetch', async () => ({ json: async () => HOLIDAYS }));
    return () => { vi.useRealTimers(); vi.unstubAllGlobals(); };
  });

  it('prints the same reports as v0, for every lab and month we keep', async () => {
    let all = '';
    for (const today of ['2026-09-30T12:00:00+07:00', '2026-10-31T12:00:00+07:00', '2026-11-15T12:00:00+07:00']) {
      vi.setSystemTime(new Date(today));
      for (const lab of ['BE-201', 'BE-305']) all += await monthlyReport(lab) + '----\n';
    }
    await expect(all).toMatchFileSnapshot('./__approved__/monthly-report.txt');
  });

  it('counts no holiday when the holiday service cannot be reached, as v0 did', async () => {
    vi.setSystemTime(new Date('2026-09-30T12:00:00+07:00'));
    vi.stubGlobal('fetch', async () => { throw new TypeError('fetch failed'); });
    expect(await monthlyReport('BE-201')).toContain('Weekend/holiday: 0\n');
  });
});
