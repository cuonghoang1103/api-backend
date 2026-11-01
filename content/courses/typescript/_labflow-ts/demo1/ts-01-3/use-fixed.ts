// The same two lines against the reference rules (src/rules/booking.ts), where checkSlot says ": SlotResult".
import { checkSlot, createBooking } from '../../src/rules/booking.ts';

const slot = checkSlot('08:00', '10:00');
if (!slot.ok) throw new Error(slot.code);
const minutes: number = slot.minutes;

const booking = createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' });
const status: 'PENDING' | 'CONFIRMED' = booking.status;
console.log(minutes, status);
