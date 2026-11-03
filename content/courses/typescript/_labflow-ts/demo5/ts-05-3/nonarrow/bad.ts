import type { BookingRecord } from '../../../src/rules/model.ts';
import type { SlotCode } from '../../../src/rules/booking.ts';

type BookingState =
  | { step: 'draft' }
  | { step: 'invalid'; code: SlotCode }
  | { step: 'pending'; record: BookingRecord };

export function idOf(state: BookingState): number {
  return state.record.id; // record is on only one member
}
