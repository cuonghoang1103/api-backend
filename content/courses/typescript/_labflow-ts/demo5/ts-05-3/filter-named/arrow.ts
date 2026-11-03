import type { BookingRecord } from '../../../src/rules/model.ts';

type BookingState = { step: 'draft' } | { step: 'confirmed'; record: BookingRecord };
type Active = { step: 'confirmed'; record: BookingRecord };

const states: BookingState[] = [{ step: 'draft' }];

// A NAMED helper that returns plain `boolean` does NOT narrow — filter still gives BookingState[].
function liveFlag(s: BookingState): boolean {
  return s.step === 'confirmed';
}
const named: Active[] = states.filter(liveFlag);

// The SAME condition written inline is inferred as a predicate (TypeScript 5.5+), so this one narrows.
const inline: Active[] = states.filter((s) => s.step === 'confirmed');
console.log(named, inline);
