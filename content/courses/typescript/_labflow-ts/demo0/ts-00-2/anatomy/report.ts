import { createBooking } from '../../../src/rules/booking.ts';

const booking = createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' });
const seatsLeft: number = 40 - booking.seats;
console.log('Seats left:', seatsLeft);
