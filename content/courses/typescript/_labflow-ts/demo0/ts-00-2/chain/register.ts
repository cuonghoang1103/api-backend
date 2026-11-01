import type { Booking } from '../../../src/rules/booking.ts';

type Room = { lab: string; owner: { name: string; email: string } };

// A nested field has the wrong type: email is a number here.
const room: Room = { lab: 'BE-201', owner: { name: 'Lan', email: 2024 } };

// A whole object of the wrong shape: minutes may be missing, status is any string.
function fromForm(minutes: number | undefined, status: string) {
  return { lab: 'BE-201', start: '08:00', end: '10:00', minutes, status };
}
const saved: Booking = fromForm(120, 'PENDING');
console.log(room, saved);
