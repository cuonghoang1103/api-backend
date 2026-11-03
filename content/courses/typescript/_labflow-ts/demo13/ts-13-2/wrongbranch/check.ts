import * as z from './zod.ts';
const BookingInput = z.object({ lab: z.string(), seats: z.number() });
const result = BookingInput.safeParse({ lab: 'BE-201', seats: 40 });
// Reading data without checking success — it is not on the failure branch.
export const lab = result.data.lab;
