import type { BookingRecord } from '../../../src/rules/model.ts';
import type { SlotCode } from '../../../src/rules/booking.ts';

// Every member shares one field — `step` — with a DIFFERENT literal. That field is the discriminant.
type BookingState =
  | { step: 'draft' }
  | { step: 'invalid'; code: SlotCode }
  | { step: 'pending'; record: BookingRecord }
  | { step: 'confirmed'; record: BookingRecord }
  | { step: 'cancelled'; record: BookingRecord; reason: string };

// One test on state.step narrows the WHOLE object — code here, record there, reason only in cancelled.
function describe(state: BookingState): string {
  switch (state.step) {
    case 'draft':     return 'Draft';
    case 'invalid':   return 'Invalid: ' + state.code;
    case 'pending':   return 'Pending #' + state.record.id;
    case 'confirmed': return 'Confirmed #' + state.record.id;
    case 'cancelled': return 'Cancelled #' + state.record.id + ' (' + state.reason + ')';
  }
}

const rec: BookingRecord = { id: 7, createdAt: '2026-11-03', lab: 'BE-201', userId: 1, range: [480, 600], seats: 30, status: 'PENDING', note: null };
console.log(describe({ step: 'draft' }));
console.log(describe({ step: 'invalid', code: 'TOO_LONG' }));
console.log(describe({ step: 'cancelled', record: rec, reason: 'exam week' }));
