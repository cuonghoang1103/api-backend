import { object, string, number, type Infer } from './zod.ts';

export const BookingInput = object({ lab: string(), seats: number() });
export type BookingInput = Infer<typeof BookingInput>;
export type Created = { success: true; data: BookingInput } | { success: false; error: string };

export function createBooking(raw: unknown): Created {
  const result = BookingInput.safeParse(raw);
  if (!result.success) return { success: false, error: result.error.issues[0]?.message ?? 'invalid' };
  return { success: true, data: result.data };
}
