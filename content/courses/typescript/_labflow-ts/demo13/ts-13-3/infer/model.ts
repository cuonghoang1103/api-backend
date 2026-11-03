import * as z from './zod.ts';
// Define the schema once; the type is derived from it — no hand-written copy to drift.
export const BookingInput = z.object({ lab: z.string(), seats: z.number() });
export type BookingInput = z.Infer<typeof BookingInput>;

export function describe(b: BookingInput): string {
  return b.lab + ' x' + b.seats;
}
console.log(describe(BookingInput.parse({ lab: 'BE-201', seats: 40 })));
