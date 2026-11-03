import * as z from './zod.ts';
const BookingInput = z.object({ lab: z.string(), seats: z.number() });
type BookingInput = z.Infer<typeof BookingInput>;
const booking: BookingInput = BookingInput.parse({ lab: 'BE-201', seats: 40 });
// 'purpose' is not in the schema — the inferred type does not have it.
export const p = booking.purpose;
