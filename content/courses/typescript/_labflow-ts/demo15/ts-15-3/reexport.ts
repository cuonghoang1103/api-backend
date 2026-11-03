import type { Booking } from './model.ts';
import { VERSION } from './model.ts';
// A plain re-export of a type: a per-file transpiler cannot tell Booking is a type.
export { Booking };
export { VERSION };
