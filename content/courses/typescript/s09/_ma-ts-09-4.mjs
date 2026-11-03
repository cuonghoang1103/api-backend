/**
 * _ma (bài 9.4) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "liboldFind": `// Array.prototype.findLast needs the es2023 lib; with an older lib it is not known.
const labs: string[] = ['BE-201', 'BE-202', 'AL-301'];
export const found = labs.findLast((c: string) => c.startsWith('AL'));`,
  "liboldTsconfig": `{"extends":"../../../tsconfig.json","compilerOptions":{"lib":["es2022"]},"include":["find.ts"]}`,
  "libnewFind": `const labs: string[] = ['BE-201', 'BE-202', 'AL-301'];
export const found = labs.findLast((c: string) => c.startsWith('AL')); // the course lib (es2024) knows findLast
console.log(found);`,
  "moduleApp": `// nodenext resolution: a relative import must carry its file extension.
import { helper } from './helper';
export const r = helper();`,
  "noemitCheck": `// A clean file: tsc --noEmit type-checks it and writes no .js — the CI gate.
export function add(a: number, b: number): number { return a + b; }
console.log(add(2, 3));`,
  "prStart": `const items: number[] = [10, 20, 30];
export const tail = items.findLast((n: number) => n > 15);`,
  "prSol": `const items: number[] = [10, 20, 30];
export const tail = items.findLast((n: number) => n > 15);
console.log(tail);`,
};
export const OUT = {
  '11-libold': `$ node_modules/.bin/tsc -p demo9/ts-09-4/libold
demo9/ts-09-4/libold/find.ts(3,27): error TS2550: Property 'findLast' does not exist on type 'string[]'. Do you need to change your target library? Try changing the 'lib' compiler option to 'es2023' or later.`,
  '12-libnew': `$ node demo9/ts-09-4/libnew/find.ts
AL-301`,
  '13-module': `$ node_modules/.bin/tsc -p demo9/ts-09-4/module
demo9/ts-09-4/module/app.ts(2,24): error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './helper.js'?`,
  '14-noemit': `$ node_modules/.bin/tsc --noEmit -p demo9/ts-09-4/noemit && echo '✓ type-checked, no .js emitted — this is the CI gate'
✓ type-checked, no .js emitted — this is the CI gate`,
  '15-pr-start': `$ node_modules/.bin/tsc -p demo9/ts-09-4/practice/start
demo9/ts-09-4/practice/start/find.ts(2,27): error TS2550: Property 'findLast' does not exist on type 'number[]'. Do you need to change your target library? Try changing the 'lib' compiler option to 'es2023' or later.`,
  '16-pr-sol': `$ node demo9/ts-09-4/practice/solution/find.ts
30`,
};
