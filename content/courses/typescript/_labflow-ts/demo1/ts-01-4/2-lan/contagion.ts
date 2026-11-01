// A request body arrives as text. JSON.parse returns any — and any spreads.
import { createBooking, usageRate } from '../../../src/rules/booking.ts';

const body = '{"lab":"BE-201","seats":31,"role":"lecturer","start":"08:00","end":"10:00"}';
const input = JSON.parse(body);          // input: any

const booking = createBooking(input);   // no error: any fits every parameter
const seatsText: string = input.seats;   // no error: any fits every variable
console.log(booking.status, typeof seatsText);

const rate = usageRate(input.history);   // no error: there is no "history" field
console.log(rate);
