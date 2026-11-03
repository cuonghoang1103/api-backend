import type { Booking } from './model.ts';
import { makeBooking, VERSION } from './model.ts';

// Still a value re-export of a type — not transpile-ready.
export { Booking };

export function describe(b: Booking): string { return b.lab + ' v' + VERSION; }
export const demo = makeBooking(1, 'BE-201');
