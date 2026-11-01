// Advanced: method syntax vs property syntax under strictFunctionTypes.
import type { BookingInput } from '../../../src/rules/booking.ts';

type Admin = { lab: string; seats: number; role: 'ADMIN'; start: string; end: string };
const onlyAdmins = (input: Admin) => input.seats;   // handles a NARROWER input than BookingInput

type AsProperty = { check: (input: BookingInput) => number };
type AsMethod = { check(input: BookingInput): number };

const a: AsProperty = { check: onlyAdmins };   // refused: a student request could reach it
const b: AsMethod = { check: onlyAdmins };     // accepted: methods are checked "bivariantly"
console.log(a, b);
