import * as z from './zod.ts';
const BookingInput = z.object({ lab: z.string(), seats: z.number() });
// seats is a string at run time — parse throws because the data is invalid.
try {
  BookingInput.parse({ lab: 'BE-201', seats: 'forty' });
} catch (e) {
  console.log('rejected:', (e as Error).message);
}
