// The sturdiest fix: no this at all. The rules live in a closure.
import { checkSlot } from '../../../src/rules/booking.ts';
import type { BookingInput } from '../../../src/rules/booking.ts';
import type { Problem, Rule } from '../lost/validator.ts';

export type Validator = { name: string; run: (input: BookingInput) => Problem[] };

export function createValidator(name: string, rules: readonly Rule[]): Validator {
  return {
    name,
    run: (input) => {                     // an arrow: nothing to lose, it never reads this
      const found: Problem[] = [];
      for (const rule of rules) {         // "rules" comes from the closure, not from this
        const p = rule(input);
        if (p !== null) found.push(p);
      }
      return found;
    },
  };
}

const slotRule: Rule = ({ start, end }) => {
  const slot = checkSlot(start, end);
  return slot.ok ? null : { code: slot.code, message: start + '–' + end + ' is not a valid slot' };
};
export const validator = createValidator('booking-form', [slotRule]);
