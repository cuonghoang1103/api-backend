import { Booking } from '../model.ts'; // S1 TS1484 a type imported as a value
import { Lab } from '../model.ts'; // S2 TS1484 a type imported as a value
import { Slot } from '../model.ts'; // S3 TS1484 a type imported as a value
import { User } from '../model.ts'; // S4 TS1484 a type imported as a value
export { Booking } from '../model.ts'; // S5 TS1205 a type re-exported as a value
export { Lab } from '../model.ts'; // S6 TS1205 a type re-exported as a value
export { Slot } from '../model.ts'; // S7 TS1205 a type re-exported as a value
export { Review } from '../model.ts'; // S8 TS1205 a type re-exported as a value
