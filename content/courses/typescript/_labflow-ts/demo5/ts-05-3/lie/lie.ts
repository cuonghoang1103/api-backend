import type { BookingRecord } from '../../../src/rules/model.ts';

type BookingState = { step: 'pending'; record: BookingRecord } | { step: 'cancelled'; record: BookingRecord; reason: string };

// A predicate is a PROMISE tsc trusts — it never checks the body against the return type. This one lies.
function isCancelled(s: BookingState): s is { step: 'cancelled'; record: BookingRecord; reason: string } {
  return s.step === 'pending'; // the wrong step
}

const rec: BookingRecord = { id: 7, createdAt: '2026-11-03', lab: 'BE-201', userId: 1, range: [480, 600], seats: 30, status: 'PENDING', note: null };
function load(): BookingState {
  return { step: 'pending', record: rec };
}

const s = load(); // s: BookingState — tsc does not know which member
if (isCancelled(s)) {
  // tsc is sure s is the cancelled member, so s.reason is a string. At runtime it is undefined.
  console.log('reason in caps:', s.reason.toUpperCase());
}
