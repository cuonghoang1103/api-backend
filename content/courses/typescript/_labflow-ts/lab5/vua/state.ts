// Attempt B — an exhaustive union with assertNever, but an open label table.
import type { BookingRecord } from '../src/model.ts';
import type { SlotCode } from '../src/booking.ts';

export type BookingState =
  | { step: 'draft' }
  | { step: 'invalid'; code: SlotCode }
  | { step: 'pending'; record: BookingRecord }
  | { step: 'confirmed'; record: BookingRecord }
  | { step: 'cancelled'; record: BookingRecord; reason: string }; // +F keep this marker

export type Step = BookingState['step'];
export type ActiveState =
  | { step: 'pending'; record: BookingRecord }
  | { step: 'confirmed'; record: BookingRecord };

export function describe(state: BookingState): string {
  switch (state.step) {
    case 'draft':
      return 'Draft — nothing chosen yet';
    case 'invalid':
      return 'Invalid slot: ' + state.code;
    case 'pending':
      return 'Pending approval (#' + state.record.id + ')';
    case 'confirmed':
      return 'Confirmed (#' + state.record.id + ')';
    case 'cancelled':
      return 'Cancelled (#' + state.record.id + '): ' + state.reason;
    default:
      return assertNever(state);
  }
}

export function assertNever(x: never): never {
  throw new Error('Unhandled booking state: ' + JSON.stringify(x));
}

export function isActive(state: BookingState): state is ActiveState {
  return state.step === 'pending' || state.step === 'confirmed';
}

export function recordOf(state: BookingState): BookingRecord | null {
  return 'record' in state ? state.record : null;
}

export function canCancel(state: BookingState): boolean {
  return isActive(state);
}

export function cancel(state: BookingState, reason: string): BookingState {
  if (!isActive(state)) return state;
  return { step: 'cancelled', record: state.record, reason };
}

// An open table — nothing forces an entry for a new step, so one can ship unlabelled.
export const STEP_LABEL: { [step: string]: string } = {
  draft: 'Draft',
  invalid: 'Invalid',
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
};
