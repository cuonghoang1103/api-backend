import { join } from 'node:path';
// Wrong: join takes strings, but a number is passed.
export const p: string = join('content', 9);
