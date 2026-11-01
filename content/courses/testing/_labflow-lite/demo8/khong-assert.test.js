// RED ON PURPOSE: runs the booking rules, checks nothing (requireAssertions catches it).
import { it } from 'vitest';
import { checkSlot, needsApproval, createBooking, usageRate } from '../src/rules/booking.js';

it('runs the booking rules', () => {
  checkSlot('08:00', '10:00');
  createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' });
  usageRate([{ minutes: 60 }]);
  needsApproval({ seats: 5, role: 'ADMIN' });
});
