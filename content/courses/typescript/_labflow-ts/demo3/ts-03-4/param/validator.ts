// Same validator, now with a this parameter: run must be called ON a Validator.
import { checkSlot } from '../../../src/rules/booking.ts';
import type { BookingInput } from '../../../src/rules/booking.ts';
import type { Problem, Rule } from '../lost/validator.ts';

export type Validator = {
  name: string;
  rules: readonly Rule[];
  run(this: Validator, input: BookingInput): Problem[];
};

const slotRule: Rule = ({ start, end }) => {
  const slot = checkSlot(start, end);
  return slot.ok ? null : { code: slot.code, message: start + '–' + end + ' is not a valid slot' };
};

export const validator: Validator = {
  name: 'booking-form',
  rules: [slotRule],
  run(input) {
    const found: Problem[] = [];
    for (const rule of this.rules) {
      const p = rule(input);
      if (p !== null) found.push(p);
    }
    return found;
  },
};
