// A helper that never returns: it always throws.
import { checkSlot } from '../../../src/rules/booking.ts';

export function fail(message: string): never {
  throw new Error(message);
}

// The same helper WITHOUT a return type: what does tsc infer?
export function failInferred(message: string) {
  throw new Error(message);
}
export const failArrow = (message: string) => {
  throw new Error(message);
};

const slot = checkSlot('08:00', '10:00');
// fail(...) is never, so the whole expression is just number.
export const minutes = slot.ok ? slot.minutes : fail(slot.code);
// The inferred helper gives number | void instead.
export const minutes2 = slot.ok ? slot.minutes : failInferred(slot.code);
