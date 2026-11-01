import { createBooking } from '../../../src/rules/booking.ts';
import { BODIES } from './bodies.ts';
import { isBookingInput } from './guard-thieu.ts';

for (const [label, body] of BODIES) {
  const data: unknown = JSON.parse(body);
  console.log(label, '→', isBookingInput(data) ? JSON.stringify(createBooking(data)) : 'INVALID_BODY');
}
