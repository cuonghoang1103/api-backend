/**
 * _ma (bài 15.3) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "reexport": `import type { Booking } from './model.ts';
import { VERSION } from './model.ts';
// A plain re-export of a type: a per-file transpiler cannot tell Booking is a type.
export { Booking };
export { VERSION };`,
  "okReexport": `import type { Booking } from './model.ts';
import { VERSION } from './model.ts';
export type { Booking };
export { VERSION };`,
  "prStart": `import type { Lab } from './model.ts';
export { Lab };`,
  "prSol": `import type { Lab } from './model.ts';
export type { Lab };`,
};
export const OUT = {
  '11-reexport': `$ node_modules/.bin/tsc -p demo15/ts-15-3
demo15/ts-15-3/reexport.ts(4,10): error TS1205: Re-exporting a type when 'verbatimModuleSyntax' is enabled requires using 'export type'.`,
  '12-ok': `$ node_modules/.bin/tsc -p demo15/ts-15-3/ok`,
  '13-pr-start': `$ node_modules/.bin/tsc -p demo15/ts-15-3/practice/start
demo15/ts-15-3/practice/start/api.ts(2,10): error TS1205: Re-exporting a type when 'verbatimModuleSyntax' is enabled requires using 'export type'.`,
  '14-pr-sol': `$ node_modules/.bin/tsc -p demo15/ts-15-3/practice/solution`,
};
