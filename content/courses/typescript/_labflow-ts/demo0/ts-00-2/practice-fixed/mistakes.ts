import { formatTime } from '../../../src/rules/time.ts';
import { createBooking, usageRate } from '../../../src/rules/booking.ts';

const label = formatTime(450);                    // 1. minutes, not "HH:MM"
const b = createBooking({ lab: 'BE-201', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' }); // 2. upper-case role
console.log(b.status);                            // 3. status, not statuss
const rate: number = usageRate([b]);              // 4. usageRate returns a number
function percent(x: number): string {             // 5. say what x is
  return Math.round(x * 100) + '%';
}
console.log(label, rate, percent(0.25));
