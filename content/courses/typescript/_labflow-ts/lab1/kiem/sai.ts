// Lab 1 — eight calls that are WRONG. Your types must make tsc refuse every one of them.
// The grader compiles this file against YOUR src/ and expects one error, with this code, on each marked line.
import { parseTime, formatTime } from '../src/time.ts';
import { checkSlot, needsApproval, createBooking, usageRate } from '../src/booking.ts';

const input = { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' } as const;

parseTime(420);                                              // S1 TS2345 a number is not "HH:MM"
formatTime('07:30');                                         // S2 TS2345 formatTime takes minutes
checkSlot('08:00');                                          // S3 TS2554 the end time is missing
needsApproval({ seat: 31, role: 'STUDENT' });                // S4 TS2561 typo: seat instead of seats
needsApproval({ seats: 31, role: 'lecturer' });              // S5 TS2820 roles are upper-case
createBooking(input).minute;                                 // S6 TS2551 typo: minute instead of minutes
if (createBooking(input).status === 'APPROVED') {}           // S7 TS2367 there is no APPROVED status
usageRate([{ minute: 60 }]);                                 // S8 TS2561 typo inside a list of bookings
