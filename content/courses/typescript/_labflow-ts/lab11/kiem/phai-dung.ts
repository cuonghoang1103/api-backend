import type { CreateBooking, Booking } from '../handler.ts';
const c: CreateBooking = { lab: 'BE-201', seats: 40, purpose: 'Lab' };
const b: Booking = { id: 'bk_1', lab: 'BE-201', seats: 40, purpose: 'Lab', status: 'PENDING' };
export { c, b };
