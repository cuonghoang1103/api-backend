// The type is imported with 'import type' — erased, never in the build's module graph.
import type { Booking } from './model.ts';
import { VERSION } from './model.ts';
export const b: Booking = { id: VERSION, lab: 'BE-201' };
console.log(b.lab);
