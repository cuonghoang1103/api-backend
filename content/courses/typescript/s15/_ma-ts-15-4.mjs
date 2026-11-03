/**
 * _ma (bài 15.4) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "use": `// Booking is only a type, but it is imported as a value.
import { Booking, VERSION } from './model.ts';
export const b: Booking = { id: VERSION, lab: 'BE-201' };`,
  "okUse": `// The type is imported with 'import type' — erased, never in the build's module graph.
import type { Booking } from './model.ts';
import { VERSION } from './model.ts';
export const b: Booking = { id: VERSION, lab: 'BE-201' };
console.log(b.lab);`,
  "prStart": `import { Lab, MAX } from './model.ts';
export const lab: Lab = { code: 'BE-' + MAX };`,
  "prSol": `import type { Lab } from './model.ts';
import { MAX } from './model.ts';
export const lab: Lab = { code: 'BE-' + MAX };
console.log(lab.code);`,
};
export const OUT = {
  '11-valimport': `$ node_modules/.bin/tsc -p demo15/ts-15-4
demo15/ts-15-4/use.ts(2,10): error TS1484: 'Booking' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.`,
  '12-ok': `$ node demo15/ts-15-4/ok/use.ts
BE-201`,
  '13-pr-start': `$ node_modules/.bin/tsc -p demo15/ts-15-4/practice/start
demo15/ts-15-4/practice/start/app.ts(1,10): error TS1484: 'Lab' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.`,
  '14-pr-sol': `$ node demo15/ts-15-4/practice/solution/app.ts
BE-40`,
};
