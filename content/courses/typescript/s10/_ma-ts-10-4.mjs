/**
 * _ma (bài 10.4) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "bundledApp": `import { join } from 'node:path';   // types come from @types/node
const p: string = join('content', 'courses', 'typescript');
console.log(p);`,
  "bundledbadApp": `import { join } from 'node:path';
// join expects strings — a number is refused.
export const p: string = join('a', 42);`,
  "localpkgApp": `import { makeId } from 'labflow-ids';  // types found via the package's "types" field
export const id: string = makeId('bk');`,
  "localpkgPkg": `{ "name": "labflow-ids", "version": "1.0.0", "type": "module", "exports": "./index.js", "types": "./index.d.ts" }`,
  "localpkgDts": `export function makeId(prefix: string): string;`,
  "prStart": `import { join } from 'node:path';
// Wrong: join takes strings, but a number is passed.
export const p: string = join('content', 9);`,
  "prSol": `import { join } from 'node:path';
const p: string = join('content', '9');
console.log(p);`,
};
export const OUT = {
  '11-bundled': `$ node demo10/ts-10-4/bundled/app.ts
content/courses/typescript`,
  '12-bundled-bad': `$ node_modules/.bin/tsc -p demo10/ts-10-4/bundledbad
demo10/ts-10-4/bundledbad/app.ts(3,36): error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.`,
  '13-localpkg': `$ node_modules/.bin/tsc -p demo10/ts-10-4/localpkg && echo '✓ tsc: 0 errors — types found via the package types field'
✓ tsc: 0 errors — types found via the package types field`,
  '14-pr-start': `$ node_modules/.bin/tsc -p demo10/ts-10-4/practice/start
demo10/ts-10-4/practice/start/app.ts(3,42): error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.`,
  '15-pr-sol': `$ node demo10/ts-10-4/practice/solution/app.ts
content/9`,
};
