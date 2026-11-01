// "Arrow functions keep this" — so make run an arrow? An arrow keeps the this of where it is WRITTEN: here, the module.
import type { BookingInput } from '../../../src/rules/booking.ts';
import type { Problem, Rule } from '../lost/validator.ts';

const seatRule: Rule = ({ seats }) => (seats > 40 ? { code: 'TOO_MANY_SEATS', message: 'At most 40 seats' } : null);

export const validator = {
  rules: [seatRule],
  run: (input: BookingInput): Problem[] => {
    const found: Problem[] = [];
    for (const rule of this.rules) {
      const p = rule(input);
      if (p !== null) found.push(p);
    }
    return found;
  },
};
