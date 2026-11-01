import { parseTime } from '../../../src/rules/time.ts';
import { STEP, OPEN, CLOSE, MAX_MINUTES, type SlotResult } from '../../../src/rules/booking.ts';

// A copy of checkSlot with ONE character changed: "<" instead of "<=".
export function checkSlot(start: string, end: string): SlotResult {
  const s = parseTime(start);
  const e = parseTime(end);
  if (s % STEP !== 0 || e % STEP !== 0) return { ok: false, code: 'OFF_GRID' };
  if (e < s) return { ok: false, code: 'END_BEFORE_START' };
  if (s < OPEN || e > CLOSE) return { ok: false, code: 'OUTSIDE_HOURS' };
  if (e - s > MAX_MINUTES) return { ok: false, code: 'TOO_LONG' };
  return { ok: true, minutes: e - s };
}
