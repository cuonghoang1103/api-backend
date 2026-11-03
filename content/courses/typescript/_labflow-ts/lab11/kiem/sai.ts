import type { CreateBooking, Booking } from '../handler.ts';
import type { ApiResult } from '../api.ts';
export const s1: CreateBooking = { lab: 'x', seats: 40 }; // S1 TS2741 a create body is missing purpose
export const s2: CreateBooking = { lab: 'x', seats: 40, purpose: 'y', id: 'z' }; // S2 TS2353 a create body must not carry the server-owned id
export const s3: CreateBooking = { lab: 'x', seats: 'many', purpose: 'y' }; // S3 TS2322 seats must be a number
export const s4: Booking = { id: 'bk', lab: 'x', seats: 40, purpose: 'y', status: 'DONE' }; // S4 TS2322 status is a closed literal
export const s5: Booking = { id: 'bk', lab: 'x', seats: 40, status: 'PENDING' }; // S5 TS2741 a Booking is missing purpose
export function s6(r: ApiResult<Booking>) { return r.data; } // S6 TS2339 data is not on the error branch
export const s7: ApiResult<Booking> = { ok: true }; // S7 TS2322 an ok envelope is missing data
export const s8: ApiResult<Booking> = { ok: false, error: 'oops' }; // S8 TS2322 error must be an object, not a string
