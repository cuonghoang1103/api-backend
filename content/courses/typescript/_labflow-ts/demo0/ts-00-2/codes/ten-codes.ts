import { parseTime } from '../../../src/rules/time.ts';
import { checkSlot, needsApproval, createBooking, type Booking } from '../../../src/rules/booking.ts';
import { sendMail } from '../../../src/notify/mailer.ts';

const opening: string = parseTime('07:00');
const b1 = parseTime(420);
const b2 = createBooking({ lab: 'BE-201', seats: 5, role: 'STUDENT', start: '08:00', end: '09:00' });
console.log(b2.room);
console.log(b2.minute);
const b3 = checkSlot('08:00');
needsApproval({ seat: 31, role: 'STUDENT' });
needsApproval({ seats: 31, role: 'lecturer' });
function total(list) { return list.length; }
const first: Booking | undefined = [b2][0];
console.log(first.minutes, opening, b1, b3, sendMail, total);
