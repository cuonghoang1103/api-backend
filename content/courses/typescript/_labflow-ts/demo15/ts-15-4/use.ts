// Booking is only a type, but it is imported as a value.
import { Booking, VERSION } from './model.ts';
export const b: Booking = { id: VERSION, lab: 'BE-201' };
