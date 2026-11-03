import type { CreateBooking, UpdateBooking, PublicUser } from '../src/dto.ts';
const c: CreateBooking = { lab: 'BE-201', seats: 40, purpose: 'Lab' }; // no id/status/createdAt
const u: UpdateBooking = { seats: 24 };                                 // any subset of editable fields
const p: PublicUser = { id: 1, name: 'An', email: 'a@x.vn' };           // no passwordHash
export { c, u, p };
