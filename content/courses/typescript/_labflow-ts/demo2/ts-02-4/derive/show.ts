// Trick: assign a wrong value, and the error message prints what a type really is.
import { LABS, LABS_LOOSE } from './labs.ts';

const strict: (typeof LABS)[number] = 42;
const loose: (typeof LABS_LOOSE)[number] = 42;

export { strict, loose };
