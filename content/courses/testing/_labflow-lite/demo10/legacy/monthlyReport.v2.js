// LabFlow v0 entry point, kept for its callers. Lesson 10.2, step 6: seams as named options, logic moved to src/report/monthly.js.
import { db } from './db.js';
import { buildMonthlyReport } from '../report/monthly.js';

const HOLIDAY_API = 'https://holidays.labflow.example/api/vn/';

async function loadHolidays(fetchFn, year) {
  try {
    return await (await fetchFn(HOLIDAY_API + year)).json();
  } catch {
    return []; // as in v0: no network, no holidays
  }
}

export async function monthlyReport(lab, { database = db, fetch: fetchFn = globalThis.fetch, now = () => new Date() } = {}) {
  const today = now();
  const month = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
  const rows = await database.all('SELECT * FROM bookings');
  const holidays = await loadHolidays(fetchFn, today.getFullYear());
  return buildMonthlyReport({ lab, month, rows, holidays });
}
