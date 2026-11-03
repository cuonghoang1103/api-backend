import * as z from './zod.ts';
// A schema validates AND infers the type — one source of truth.
const BookingInput = z.object({ lab: z.string(), seats: z.number() });
type BookingInput = z.Infer<typeof BookingInput>;
// unknown data from outside, validated at the boundary:
const raw: unknown = { lab: 'BE-201', seats: 40 };
const booking: BookingInput = BookingInput.parse(raw);
console.log(booking.lab, booking.seats);
