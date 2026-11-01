// "as any as X" — two casts that switch the checker off for one value.
import { usageRate, type Booking } from '../../../src/rules/booking.ts';

const row = { lab: 'BE-201', minute: 120 };          // typo: minute
const b1 = row as Booking;                           // one cast: tsc still objects
const b2 = row as any as Booking;                    // two casts: tsc is silent
console.log(usageRate([b2]));                        // NaN at runtime
console.log(b1.lab);
