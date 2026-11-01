// as const exists only for tsc. At runtime LABS is an ordinary array.
import { LABS } from '../derive/labs.ts';

console.log('array?', Array.isArray(LABS), '· frozen?', Object.isFrozen(LABS), '· length', LABS.length);
