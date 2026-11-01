// Using the rules whose return types were inferred (infer/booking.ts).
import { checkSlot, createBooking } from './infer/booking.ts';

const slot = checkSlot('08:00', '10:00');
if (!slot.ok) throw new Error(slot.code);
const minutes: number = slot.minutes;           // after the throw, surely a number?

const booking = createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' });
const status: 'PENDING' | 'CONFIRMED' = booking.status;
console.log(minutes, status);
