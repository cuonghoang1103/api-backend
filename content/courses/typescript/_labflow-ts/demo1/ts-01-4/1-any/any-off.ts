// Every line below is a bug. With "any", tsc reports none of them.
import { createBooking } from '../../../src/rules/booking.ts';

const x: any = 'hello';
x.foo.bar.baz();                 // calling methods that do not exist
const n: number = x;             // a string stored in a number
const b = createBooking(x);      // a string passed where a booking input belongs
console.log(n + 1, b.status);
