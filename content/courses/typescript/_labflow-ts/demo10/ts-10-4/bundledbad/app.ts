import { join } from 'node:path';
// join expects strings — a number is refused.
export const p: string = join('a', 42);
