/**
 * _ma (bài 10.2) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "sidecarJs": `export function slugify(text) {
  return text.toLowerCase().trim().replace(/\\s+/g, '-');
}`,
  "sidecarDts": `export function slugify(text: string): string;`,
  "sidecarApp": `import { slugify } from './slug.js';  // typed by the sidecar slug.d.ts
const s: string = slugify('Phong Lab BE 201');
console.log(s);`,
  "nodtsApp": `// No slug.d.ts, so tsc has no types for this import.
import { slugify } from './slug.js';
export const s: string = slugify('Hello');`,
  "declaremoduleTypes": `// Type an untyped package by its import name.
declare module 'labflow-legacy' {
  export function parseId(raw: string): number;
}`,
  "declaremoduleApp": `import { parseId } from 'labflow-legacy';  // resolved by the ambient declaration
export const id: number = parseId('bk_42');`,
  "prStart": `// No legacy.d.ts yet, so this import has no types.
import { toCents } from './legacy.js';
export const c: number = toCents(19.99);`,
  "prSol": `import { toCents } from './legacy.js';  // now typed by legacy.d.ts
const c: number = toCents(19.99);
console.log(c);`,
};
export const OUT = {
  '11-sidecar': `$ node demo10/ts-10-2/sidecar/app.ts
phong-lab-be-201`,
  '11b-sidecar-tsc': `$ node_modules/.bin/tsc -p demo10/ts-10-2/sidecar && echo '✓ tsc: 0 errors — typed by the sidecar slug.d.ts'
✓ tsc: 0 errors — typed by the sidecar slug.d.ts`,
  '12-nodts': `$ node_modules/.bin/tsc -p demo10/ts-10-2/nodts
demo10/ts-10-2/nodts/app.ts(2,25): error TS7016: Could not find a declaration file for module './slug.js'. '…/labflow-ts/demo10/ts-10-2/nodts/slug.js' implicitly has an 'any' type.`,
  '13-declaremodule': `$ node_modules/.bin/tsc -p demo10/ts-10-2/declaremodule && echo '✓ tsc: 0 errors — resolved by the ambient declare module'
✓ tsc: 0 errors — resolved by the ambient declare module`,
  '14-pr-start': `$ node_modules/.bin/tsc -p demo10/ts-10-2/practice/start
demo10/ts-10-2/practice/start/app.ts(2,25): error TS7016: Could not find a declaration file for module './legacy.js'. '…/labflow-ts/demo10/ts-10-2/practice/start/legacy.js' implicitly has an 'any' type.`,
  '15-pr-sol': `$ node demo10/ts-10-2/practice/solution/app.ts
1999`,
};
