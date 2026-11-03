import type { Booking } from '../service.ts';
import { BookingService, BookingRepo } from '../service.ts';
import { MemoryRepo } from '../memory.ts';

export const s1 = new BookingRepo(); // S1 TS2511 BookingRepo is abstract
export class S2 extends BookingRepo {} // S2 TS2654 a subclass must implement find and save
export const s3: Booking = { id: 1 }; // S3 TS2741 a Booking needs lab
export const s4: Booking = { id: 1, lab: 'x', extra: 1 }; // S4 TS2353 no extra field on Booking
export const s5: Booking = { id: '1', lab: 'x' }; // S5 TS2322 id is a number
export const s6 = new BookingService(new MemoryRepo()).book('one', 'x'); // S6 TS2345 id is a number
export const s7 = new BookingService(new MemoryRepo()).#repo; // S7 TS18013 #repo is private to the class
export const s8: BookingService = new MemoryRepo(); // S8 TS2739 a MemoryRepo is not a BookingService
