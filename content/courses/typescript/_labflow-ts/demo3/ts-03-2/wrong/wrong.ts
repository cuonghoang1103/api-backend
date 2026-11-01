// Which functions fit the Rule slot? tsc compares parameters and return types.
import type { Rule } from '../rules/rules.ts';
import type { BookingInput } from '../../../src/rules/booking.ts';

const fewer: Rule = () => null;                                    // fine: ignoring the input is allowed
const exact: Rule = (input) => (input.seats > 40 ? null : null);   // fine: the shape matches

const seatsOnly: Rule = (seats: number) => (seats > 40 ? { code: 'TOO_MANY_SEATS', message: 'Too many' } : null);
const needsDay: Rule = (input: BookingInput, day: string) => null;
const text: Rule = (input) => 'TOO_LONG';
const badCode: Rule = (input) => ({ code: 'TOO_LATE', message: 'Booked too late' });

console.log(fewer, exact, seatsOnly, needsDay, text, badCode);
