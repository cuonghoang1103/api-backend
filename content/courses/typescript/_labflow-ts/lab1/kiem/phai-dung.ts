// Lab 1 — correct calls that must KEEP compiling. Types that are too strict break these.
import { parseTime, formatTime } from '../src/time.ts';
import { checkSlot, needsApproval, createBooking, usageRate, OPEN } from '../src/booking.ts';

const start: number = parseTime('08:00');
const label: string = formatTime(start + 90);
const slot = checkSlot('08:00', '10:00');
if (slot.ok) {
  const minutes: number = slot.minutes;
  console.log(label, minutes);
}
const wait: boolean = needsApproval({ seats: 31, role: 'STUDENT' });
const booking = createBooking({ lab: 'BE-201', seats: 12, role: 'ADMIN', start: '18:00', end: '21:00' });
const status: 'PENDING' | 'CONFIRMED' = booking.status;
const rate: number = usageRate([booking, { minutes: 30 }]);
const opensAt: number = OPEN;
console.log(wait, status, rate, opensAt);
