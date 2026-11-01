import type { SlotResult } from '../../src/rules/booking.ts';

// Same typo ('OFF_GRIDD') in two functions. Only one of them says what it returns.
export function checkA(start: number, end: number) {
  if (start % 30 !== 0 || end % 30 !== 0) return { ok: false, code: 'OFF_GRIDD' };
  return { ok: true, minutes: end - start };
}

export function checkB(start: number, end: number): SlotResult {
  if (start % 30 !== 0 || end % 30 !== 0) return { ok: false, code: 'OFF_GRIDD' };
  return { ok: true, minutes: end - start };
}
