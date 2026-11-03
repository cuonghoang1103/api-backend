import { object, string, number, type Infer } from './zod.ts';

export const BookingInput = object({ lab: string(), seats: number() });
export type BookingInput = Infer<typeof BookingInput>;
export type Created = { success: true; data: BookingInput } | { success: false; error: string };

export function createBooking(raw: unknown): Created {
  // Casts instead of validating — invalid data passes straight through.
  return { success: true, data: raw as BookingInput };
}
