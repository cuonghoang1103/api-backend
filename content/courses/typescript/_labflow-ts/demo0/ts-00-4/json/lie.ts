import { createBooking, type BookingInput } from '../../../src/rules/booking.ts';

// Pretend this text arrived in an HTTP request body.
const body = '{"lab":"BE-201","seats":"31","role":"student","start":"08:00","end":"10:00"}';

const input = JSON.parse(body) as BookingInput;   // "trust me, it is a BookingInput"
console.log('role is', input.role, '- seats is a', typeof input.seats);
console.log(createBooking(input));
