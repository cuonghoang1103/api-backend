// A LabFlow validator as an object: run() reads its rules through this.
import { checkSlot } from '../../../src/rules/booking.ts';
import type { BookingInput } from '../../../src/rules/booking.ts';

export type Problem = { code: string; message: string };
export type Rule = (input: BookingInput) => Problem | null;

const slotRule: Rule = ({ start, end }) => {
  const slot = checkSlot(start, end);
  return slot.ok ? null : { code: slot.code, message: start + '–' + end + ' is not a valid slot' };
};
const seatRule: Rule = ({ seats }) => (seats > 40 ? { code: 'TOO_MANY_SEATS', message: 'At most 40 seats' } : null);

export const validator = {
  name: 'booking-form',
  rules: [slotRule, seatRule],
  run(input: BookingInput): Problem[] {
    const found: Problem[] = [];
    for (const rule of this.rules) {
      const p = rule(input);
      if (p !== null) found.push(p);
    }
    return found;
  },
};
