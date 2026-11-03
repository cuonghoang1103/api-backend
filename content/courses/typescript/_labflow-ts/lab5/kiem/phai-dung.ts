// Lab 5 — CORRECT uses. They must keep compiling with your types (part B).
import { describe, recordOf, isActive, canCancel, cancel, STEP_LABEL } from '../src/state.ts';
import type { BookingState, ActiveState } from '../src/state.ts';
import type { BookingRecord } from '../src/model.ts';

declare const rec: BookingRecord;

// Every variant is valid, each with exactly the data its step carries.
const states: BookingState[] = [
  { step: 'draft' },
  { step: 'invalid', code: 'OFF_GRID' },
  { step: 'pending', record: rec },
  { step: 'confirmed', record: rec },
  { step: 'cancelled', record: rec, reason: 'room closed' },
];
for (const st of states) console.log(describe(st), STEP_LABEL[st.step]);

// Narrowing by the discriminant gives the record with no check — and no `.record?.`:
function idOf(st: BookingState): number | null {
  if (st.step === 'pending' || st.step === 'confirmed') return st.record.id;
  return null;
}

// The type predicate narrows the caller's variable to ActiveState.
declare const some: BookingState;
if (isActive(some)) {
  const active: ActiveState = some; // narrowed, no cast
  console.log(active.record.id);
}

const maybe: BookingRecord | null = recordOf({ step: 'draft' });
const ok: boolean = canCancel({ step: 'confirmed', record: rec });
const next: BookingState = cancel({ step: 'pending', record: rec }, 'exam week');
console.log(idOf(states[2] ?? { step: 'draft' }), maybe, ok, next.step);
