// LabFlow — the booking lifecycle as a labelled (discriminated) union (Chapter 5, = Lab 5 reference solution).
import type { BookingRecord } from './model.ts';
import type { SlotCode } from './booking.ts';

// One booking request moves through a few steps, and each step carries ONLY the data it has:
// a draft has nothing yet; an invalid request keeps the reason the slot failed; the three stored
// steps carry the BookingRecord; a cancelled one also carries a reason. `step` is the DISCRIMINANT
// (nhãn) — the one field every member shares with a different literal, so a single test on it
// narrows the whole object.
export type BookingState =
  | { step: 'draft' }
  | { step: 'invalid'; code: SlotCode }
  | { step: 'pending'; record: BookingRecord }
  | { step: 'confirmed'; record: BookingRecord }
  | { step: 'cancelled'; record: BookingRecord; reason: string }; // +F keep this marker: Lab 5 grader adds a state here

// The set of labels, derived from the union — never copied by hand.
export type Step = BookingState['step'];

// The two "live" steps a booking can still be acted on. Named so a type predicate can point at it.
export type ActiveState =
  | { step: 'pending'; record: BookingRecord }
  | { step: 'confirmed'; record: BookingRecord };

// A one-line description. The switch is EXHAUSTIVE: every known step returns, and the default hands
// an impossible value to assertNever — so adding a step to the union turns this line into a compile error.
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

// An assertion function: giving it anything other than `never` is a compile error, and at runtime it throws.
export function assertNever(x: never): never {
  throw new Error('Unhandled booking state: ' + JSON.stringify(x));
}

// A type predicate (vị từ kiểu): the `state is ActiveState` return tells tsc to narrow the caller's variable.
export function isActive(state: BookingState): state is ActiveState {
  return state.step === 'pending' || state.step === 'confirmed';
}

// Not every state has a record (draft and invalid do not). `'record' in state` narrows to the ones that do.
export function recordOf(state: BookingState): BookingRecord | null {
  return 'record' in state ? state.record : null;
}

export function canCancel(state: BookingState): boolean {
  return isActive(state);
}

// A transition: cancel a live booking. The return is a NEW state; the input is never changed in place.
export function cancel(state: BookingState, reason: string): BookingState {
  if (!isActive(state)) return state;
  return { step: 'cancelled', record: state.record, reason };
}

// A closed label table keyed by the union's own steps — add a step and this breaks too (a missing key).
export const STEP_LABEL: Record<Step, string> = {
  draft: 'Draft',
  invalid: 'Invalid',
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
};
