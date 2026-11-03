// TODO: a per-file transpiler cannot tell types from values — mark them with import type / export type.
import { Booking, makeBooking, VERSION } from './model.ts';

export { Booking };

export function describe(b: Booking): string { return b.lab + ' v' + VERSION; }
export const demo = makeBooking(1, 'BE-201');
