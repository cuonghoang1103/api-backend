import { checkSlot } from '../../../src/rules/booking.ts';

// ReturnType, written out: infer the type after the arrow.
type Return<F> = F extends (...args: never[]) => infer R ? R : never;

type SlotR = Return<typeof checkSlot>;   // SlotResult

const r: SlotR = { ok: true, minutes: 120 };
console.log(r.ok ? r.minutes : 'refused');
