import { formatTime } from '../../../src/rules/time.ts';
import { createBooking, usageRate } from '../../../src/rules/booking.ts';

const label = formatTime('07:30');
const b = createBooking({ lab: 'BE-201', seats: 20, role: 'Student', start: '08:00', end: '10:00' });
console.log(b.statuss);
const rate: string = usageRate([b]);
function percent(x) {
  return Math.round(x * 100) + '%';
}
console.log(label, rate, percent(0.25));
