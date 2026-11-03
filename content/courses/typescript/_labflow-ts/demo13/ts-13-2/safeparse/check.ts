import * as z from './zod.ts';
const BookingInput = z.object({ lab: z.string(), seats: z.number() });
const result = BookingInput.safeParse({ lab: 'BE-201', seats: 40 });
// A discriminated union: narrow on success before reading data.
if (result.success) console.log('ok:', result.data.lab);
else console.log('error:', result.error.issues[0]?.message);
