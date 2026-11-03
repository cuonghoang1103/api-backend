import type { Booking } from './model.ts';
import { makeBooking, VERSION } from './model.ts';

export type { Booking };

export function describe(b: Booking): string { return (b.lab as string) + ' v' + VERSION; }
export const demo = makeBooking(1, 'BE-201');
