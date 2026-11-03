/**
 * _ma (bài 16.3) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "typeredecl": `// A type alias cannot be declared twice.
type User = { id: number };
type User = { name: string };
export const u: User = { id: 1 };`,
  "interfacemerge": `// Two interfaces of the same name MERGE — useful for augmenting a library type.
interface User { id: number; }
interface User { name: string; }
const u: User = { id: 1, name: 'Mai' };
console.log(u.id, u.name);`,
  "prStart": `type Lab = { code: string };
type Lab = { seats: number };
export const l: Lab = { code: 'BE-201' };`,
  "prSol": `type Lab = { code: string; seats: number };
export const l: Lab = { code: 'BE-201', seats: 40 };
console.log(l.code, l.seats);`,
};
export const OUT = {
  '11-typeredecl': `$ node_modules/.bin/tsc -p demo16/ts-16-3/typeredecl
demo16/ts-16-3/typeredecl/model.ts(2,6): error TS2300: Duplicate identifier 'User'.
demo16/ts-16-3/typeredecl/model.ts(3,6): error TS2300: Duplicate identifier 'User'.`,
  '12-interfacemerge': `$ node demo16/ts-16-3/interfacemerge/model.ts
1 Mai`,
  '13-pr-start': `$ node_modules/.bin/tsc -p demo16/ts-16-3/practice/start
demo16/ts-16-3/practice/start/model.ts(1,6): error TS2300: Duplicate identifier 'Lab'.
demo16/ts-16-3/practice/start/model.ts(2,6): error TS2300: Duplicate identifier 'Lab'.`,
  '14-pr-sol': `$ node demo16/ts-16-3/practice/solution/model.ts
BE-201 40`,
};
