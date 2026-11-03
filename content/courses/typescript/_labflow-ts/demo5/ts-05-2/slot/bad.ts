import { checkSlot } from '../../../src/rules/booking.ts';
import type { SlotResult } from '../../../src/rules/booking.ts';

// A SlotResult is { ok: true; minutes } OR { ok: false; code }. minutes lives on only one member.
export function minutesOf(r: SlotResult): number {
  return r.minutes;
}
void checkSlot;
