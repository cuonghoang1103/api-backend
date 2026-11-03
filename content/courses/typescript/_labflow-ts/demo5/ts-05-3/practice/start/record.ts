import type { BookingRecord } from '../../../../src/rules/model.ts';
import type { SlotCode } from '../../../../src/rules/booking.ts';

type BookingState =
  | { step: 'draft' }
  | { step: 'invalid'; code: SlotCode }
  | { step: 'confirmed'; record: BookingRecord };

// Return the record when there is one. tsc refuses this — draft and invalid have no record.
export function recordOf(state: BookingState): BookingRecord | null {
  return state.record;
}
