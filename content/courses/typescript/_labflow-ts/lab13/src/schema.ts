import { object, string, number } from './zod.ts';

// TODO: build a real schema and derive the type from it.
export type BookingInput = any;
export type Created = { success: true; data: BookingInput } | { success: false; error: string };

export function createBooking(raw: any): Created {
  // No validation — the raw input is trusted as-is.
  return { success: true, data: raw };
}
