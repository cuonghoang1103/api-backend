// One working day at LabFlow, in plain JavaScript (uses the real rules in js/booking.js).
// Four bugs are hidden below. Run: node demo0/ts-00-1/app.js small   (or: big)
import { needsApproval, createBooking, OPEN, CLOSE } from '../../js/booking.js';

const SMALL = [
  { lab: 'BE-201', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' },
  { lab: 'BE-201', seats: 35, role: 'lecturer', start: '13:00', end: '15:00' },
];
const BIG = [...SMALL, { lab: 'BE-305', seats: 40, role: 'STUDENT', start: '15:00', end: '17:00' }];
const requests = process.argv[2] === 'big' ? BIG : SMALL;

// Bug 1: a typo — the field is called "minutes"
function usage(bookings) {
  let rate = 0;
  for (const b of bookings) rate += b.minute / (CLOSE - OPEN);
  return rate;
}

const bookings = [];
for (const r of requests) {
  // Bug 2: the big-student-class branch spells the property "seat"
  const wait = r.role === 'STUDENT' && r.seats > 30
    ? needsApproval({ seat: r.seats, role: r.role })
    : needsApproval({ seats: r.seats, role: r.role });
  // Bug 3 lives in the data above: role 'lecturer' should be 'LECTURER'
  console.log(r.lab, r.start, r.role, '→ needs approval:', wait);
  bookings.push(createBooking(r));
}

// Bug 4: there is no status called APPROVED (only PENDING and CONFIRMED)
const approved = bookings.filter((b) => b.status === 'APPROVED').length;
console.log('usage today:', usage(bookings));
console.log('approved bookings:', approved);
