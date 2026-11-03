export type Booking = { id: number; lab: string };
export type Lab = { code: string };
export type Slot = { start: string };
export type User = { name: string };
export type Review = { stars: number };
export const makeBooking = (id: number, lab: string): Booking => ({ id, lab });
export const VERSION = 1;
