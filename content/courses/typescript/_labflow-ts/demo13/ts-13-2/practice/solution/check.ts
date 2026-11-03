import * as z from './zod.ts';
const SeatInput = z.object({ seats: z.number() });
const result = SeatInput.safeParse({ seats: 40 });
export const n = result.success ? result.data.seats : 0;
console.log(n);
