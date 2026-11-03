// LabFlow — the booking lifecycle (a teammate's first version). It compiles under strict. Is it right?
import type { BookingRecord } from './model.ts';

// One wide object for every step. The optional fields say "sometimes there, sometimes not".
export type BookingState = {
  step: string; // 'draft' | 'invalid' | 'pending' | 'confirmed' | 'cancelled'
  code?: string; // only when invalid
  record?: BookingRecord; // absent for draft / invalid
  reason?: string; // only when cancelled
}; // +F keep this marker: the Lab 5 grader adds a state here

export type Step = string;
export type ActiveState = BookingState;

export function describe(state: BookingState): string {
  switch (state.step) {
    case 'draft':
      return 'Draft — nothing chosen yet';
    case 'invalid':
      return 'Invalid slot: ' + state.code;
    case 'pending':
      return 'Pending approval (#' + state.record?.id + ')';
    case 'confirmed':
      return 'Confirmed (#' + state.record?.id + ')';
    case 'cancelled':
      return 'Cancelled (#' + state.record?.id + '): ' + state.reason;
    default:
      return 'Unknown'; // a catch-all: a new step shows "Unknown" and nobody notices
  }
}

export function isActive(state: BookingState): boolean {
  return state.step === 'pending' || state.step === 'confirmed';
}

export function recordOf(state: BookingState): BookingRecord | null {
  return state.record ?? null;
}

export function canCancel(state: BookingState): boolean {
  return isActive(state);
}

export function cancel(state: BookingState, reason: string): BookingState {
  state.step = 'cancelled'; // changes the object it was given
  state.reason = reason;
  return state;
}

export const STEP_LABEL: { [step: string]: string } = {
  draft: 'Draft',
  invalid: 'Invalid',
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
};
