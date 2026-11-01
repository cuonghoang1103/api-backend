// Monthly usage report for the faculty office — refactored from LabFlow v0 in lesson 10.2, under characterization tests.
// The TEXT must stay exactly what v0 printed: the office pastes it into Excel. Pure: no database, no network, no clock.
import { parseTime } from '../rules/time.js';

export const LARGE_SEATS = 30;

const isWeekend = (iso) => [0, 6].includes(new Date(iso + 'T00:00:00Z').getUTCDay());
const hours = (minutes) => Math.round((minutes / 60) * 10) / 10; // v0 prints "9", not "9.0" — keep it

// rows: every booking; month: "YYYY-MM"; holidays: ["YYYY-MM-DD", …]
export function buildMonthlyReport({ lab, month, rows, holidays }) {
  const kept = rows.filter((b) => b.lab === lab && b.date.startsWith(month) && b.status !== 'CANCELLED');
  const head = 'LAB ' + lab + ' - ' + month.replace('-', '/') + '\n';
  if (kept.length === 0) return head + 'No bookings.\n';
  const lines = kept.map((b) => b.date + ' ' + b.start + '-' + b.end + ' ' + b.seats + ' seats' + (b.status === 'PENDING' ? ' (pending)' : '') + '\n');
  const minutes = kept.reduce((sum, b) => sum + parseTime(b.end) - parseTime(b.start), 0);
  const large = kept.filter((b) => b.seats > LARGE_SEATS).length;
  const offDays = kept.filter((b) => isWeekend(b.date) || holidays.includes(b.date)).length;
  return head + lines.join('') +
    'Bookings: ' + kept.length + '\n' +
    'Hours: ' + hours(minutes) + '\n' +
    'Large (>30 seats): ' + large + '\n' +
    'Weekend/holiday: ' + offDays + '\n';
}
