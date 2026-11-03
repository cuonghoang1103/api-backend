import type { BookingRecord } from '../../../src/rules/model.ts';

type BookingState =
  | { step: 'draft' }
  | { step: 'pending'; record: BookingRecord }
  | { step: 'confirmed'; record: BookingRecord };
type ActiveState = { step: 'pending'; record: BookingRecord } | { step: 'confirmed'; record: BookingRecord };

// `state is ActiveState` tells tsc: a true result means the argument is an ActiveState.
function isActive(state: BookingState): state is ActiveState {
  return state.step === 'pending' || state.step === 'confirmed';
}

const rec: BookingRecord = { id: 7, createdAt: '2026-11-03', lab: 'BE-201', userId: 1, range: [480, 600], seats: 30, status: 'PENDING', note: null };
const states: BookingState[] = [{ step: 'draft' }, { step: 'confirmed', record: rec }];
for (const s of states) {
  if (isActive(s)) console.log('active #' + s.record.id); // s narrowed to ActiveState — record is there
  else console.log('not active');
}
