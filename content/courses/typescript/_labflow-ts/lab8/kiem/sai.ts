import type { CreateBooking, UpdateBooking, PublicUser, MyPick, MyOmit, User, Booking } from '../src/dto.ts';
import { toPublic } from '../src/dto.ts';
export const s1: CreateBooking = { lab: 'BE-201', seats: 40, purpose: 'Lab', id: 9 }; // S1 TS2353 CreateBooking must not carry id
export const s2 = toPublic({ id: 1, name: 'An', email: 'a@x.vn', passwordHash: 'x' }).passwordHash; // S2 TS2339 PublicUser has no passwordHash
export const s3: CreateBooking = { lab: 'BE-201', purpose: 'Lab' }; // S3 TS2741 missing seats
export type S4 = MyPick<User, 'emial'>; // S4 TS2344 'emial' is not a key of User
export const s5: UpdateBooking = { createdAt: 'now' }; // S5 TS2353 UpdateBooking cannot set server-owned createdAt
export const s6: UpdateBooking = { seets: 24 }; // S6 TS2561 typo'd field in a patch
export const s7: User = toPublic({ id: 1, name: 'An', email: 'a@x.vn', passwordHash: 'x' }); // S7 TS2741 PublicUser is missing passwordHash
export type S8 = MyOmit<Booking, 'xyz'>; // S8 TS2344 'xyz' is not a key of Booking
