import type { BookingRecord } from '../../../../src/rules/model.ts';
import type { SlotCode } from '../../../../src/rules/booking.ts';

type BookingState =
  | { step: 'draft' }
  | { step: 'invalid'; code: SlotCode }
  | { step: 'confirmed'; record: BookingRecord };

export function recordOf(state: BookingState): BookingRecord | null {
  if ('record' in state) return state.record;
  return null;
}
