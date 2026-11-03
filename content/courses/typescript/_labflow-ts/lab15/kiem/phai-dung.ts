import type { Booking } from '../model.ts';
import { describe, demo } from '../boundary.ts';

const b: Booking = { id: 1, lab: 'BE-201' };
export const text: string = describe(b);
export { demo };
