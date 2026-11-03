import type { BookingRecord } from '../../../src/rules/model.ts';

type BookingState = { step: 'draft' } | { step: 'pending'; record: BookingRecord } | { step: 'confirmed'; record: BookingRecord };
type ActiveState = { step: 'pending'; record: BookingRecord } | { step: 'confirmed'; record: BookingRecord };

// `asserts cond`: if this returns, cond was true — tsc narrows from here on.
function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// `asserts s is ActiveState`: if this returns, s is an ActiveState.
function assertActive(s: BookingState): asserts s is ActiveState {
  if (s.step !== 'pending' && s.step !== 'confirmed') throw new Error('not active: ' + s.step);
}

export function idOf(s: BookingState): number {
  assertActive(s);        // after this line, s is ActiveState — no narrowing block needed
  return s.record.id;
}

const note: string | null = 'hi';
assert(note !== null, 'note missing');
console.log(note.toUpperCase()); // note: string here
