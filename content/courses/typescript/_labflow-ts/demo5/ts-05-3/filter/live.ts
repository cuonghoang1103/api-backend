import type { BookingRecord } from '../../../src/rules/model.ts';

type BookingState =
  | { step: 'draft' }
  | { step: 'pending'; record: BookingRecord }
  | { step: 'confirmed'; record: BookingRecord };
type ActiveState = { step: 'pending'; record: BookingRecord } | { step: 'confirmed'; record: BookingRecord };

function isActive(s: BookingState): s is ActiveState {
  return s.step === 'pending' || s.step === 'confirmed';
}

const rec: BookingRecord = { id: 7, createdAt: '2026-11-03', lab: 'BE-201', userId: 1, range: [480, 600], seats: 30, status: 'PENDING', note: null };
const states: BookingState[] = [{ step: 'draft' }, { step: 'pending', record: rec }];

const live: ActiveState[] = states.filter(isActive);         // narrowed array — ok
const ids: number[] = live.map((s) => s.record.id);
console.log(ids);
