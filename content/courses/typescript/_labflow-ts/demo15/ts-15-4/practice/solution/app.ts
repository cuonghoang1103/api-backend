import type { Lab } from './model.ts';
import { MAX } from './model.ts';
export const lab: Lab = { code: 'BE-' + MAX };
console.log(lab.code);
