import * as z from './zod.ts';
export const BookingInput = z.object({ lab: z.string(), seats: z.number() });
// A hand-written copy that has drifted from the schema (purpose was never added to the schema).
type BookingInputManual = { lab: string; seats: number; purpose: string };
const fromSchema: z.Infer<typeof BookingInput> = BookingInput.parse({ lab: 'BE-201', seats: 40 });
// The manual type demands a purpose the schema (and the parsed value) does not have.
export const manual: BookingInputManual = fromSchema;
