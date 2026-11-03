import type { BookingInput, Created } from '../schema.ts';
import { createBooking } from '../schema.ts';

export const s1: BookingInput = { lab: 'BE-201' }; // S1 TS2741 the inferred type requires seats
export const s2: BookingInput = { lab: 'BE-201', seats: 40, purpose: 'x' }; // S2 TS2353 the schema has no purpose
export const s3: BookingInput = { lab: 'BE-201', seats: 'forty' }; // S3 TS2322 seats is a number
export const s4: BookingInput = { lab: 404, seats: 40 }; // S4 TS2322 lab is a string
export const s5: string = createBooking({}).data.lab; // S5 TS2339 narrow on success before reading data
export const s6: string = createBooking({}).error; // S6 TS2339 error is only on the failure branch
export const s7: Created = { success: true }; // S7 TS2322 a success carries data (whole-union mismatch)
export const s8: Created = { success: false, error: 404 }; // S8 TS2322 the error is a string
