import * as z from './zod.ts';
const SeatInput = z.object({ seats: z.number() });
const result = SeatInput.safeParse({ seats: 40 });
// data is only there when success is true.
export const n = result.data.seats;
