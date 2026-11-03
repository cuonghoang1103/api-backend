/**
 * _ma (bài 10.1) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "exportsMoney": `// Named exports, a default export, and a type export — all from one module.
export type Money = { amount: number; currency: string };
export function add(a: Money, b: Money): Money {
  return { amount: a.amount + b.amount, currency: a.currency };
}
export default function format(m: Money): string {
  return m.amount + ' ' + m.currency;
}`,
  "exportsApp": `import format, { add } from './money.ts';     // default + named
import type { Money } from './money.ts';       // a type, erased at run time
const a: Money = { amount: 10, currency: 'USD' };
const b: Money = { amount: 5, currency: 'USD' };
console.log(format(add(a, b)));`,
  "importtypeBad": `// Money is a type. Under verbatimModuleSyntax, importing it as a value is refused.
import { Money } from './money.ts';
export const a: Money = { amount: 1, currency: 'USD' };`,
  "prStart": `// Role is a type, imported as a value — refused under verbatimModuleSyntax.
import { Role } from './roles.ts';
export const lead: Role = 'OWNER';`,
  "prSol": `import type { Role } from './roles.ts';
export const lead: Role = 'OWNER';
console.log(lead);`,
};
export const OUT = {
  '11-exports': `$ node demo10/ts-10-1/exports/app.ts
15 USD`,
  '12-importtype-bad': `$ node_modules/.bin/tsc -p demo10/ts-10-1/importtypebad
demo10/ts-10-1/importtypebad/app.ts(2,10): error TS1484: 'Money' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.`,
  '13-pr-start': `$ node_modules/.bin/tsc -p demo10/ts-10-1/practice/start
demo10/ts-10-1/practice/start/app.ts(2,10): error TS1484: 'Role' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.`,
  '14-pr-sol': `$ node demo10/ts-10-1/practice/solution/app.ts
OWNER`,
};
