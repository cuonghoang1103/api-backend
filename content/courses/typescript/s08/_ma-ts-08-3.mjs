/**
 * _ma (bài 8.3) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "recordSeats": `type LabCode = 'BE-201' | 'BE-202' | 'AL-301';

// Record<Keys, V> builds a table with one entry per key — and tsc checks it is complete.
const seats: Record<LabCode, number> = { 'BE-201': 40, 'BE-202': 24, 'AL-301': 30 };

console.log(seats['AL-301']);`,
  "recordmissSeats": `type LabCode = 'BE-201' | 'BE-202' | 'AL-301';

// Leave one lab out and it is a compile error — the table must cover every key.
const seats: Record<LabCode, number> = { 'BE-201': 40, 'BE-202': 24 };
console.log(seats);`,
  "openCache": `// An open dictionary: any string key, so a lookup may be missing.
const cache: Record<string, number> = { a: 1, b: 2 };

const hit = cache['a'];        // number | undefined under noUncheckedIndexedAccess
console.log(hit ?? 0, cache['z'] ?? 0);`,
  "openbadCache": `const cache: Record<string, number> = { a: 1 };

// noUncheckedIndexedAccess: a string-keyed lookup might be undefined,
// so using it as a number without a guard is refused.
const n: number = cache['z'];
console.log(n);`,
  "prStart": `type Status = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

// A plain object map: CANCELLED was forgotten, and nothing warns.
const LABELS: { [k: string]: string } = { PENDING: 'Chờ', CONFIRMED: 'Đã nhận' };
function label(s: Status): string { return LABELS[s] ?? s; }
console.log(label('CANCELLED'));`,
  "prSol": `type Status = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

// Record<Status, string> forces a label for every status — CANCELLED can't be forgotten.
const LABELS: Record<Status, string> = { PENDING: 'Chờ', CONFIRMED: 'Đã nhận', CANCELLED: 'Đã huỷ' };
function label(s: Status): string { return LABELS[s]; }
console.log(label('CANCELLED'));`,
};
export const OUT = {
  '11-record': `$ node demo8/ts-08-3/record/seats.ts
30`,
  '12-record-miss': `$ node_modules/.bin/tsc -p demo8/ts-08-3/recordmiss
demo8/ts-08-3/recordmiss/seats.ts(4,7): error TS2741: Property '"AL-301"' is missing in type '{ 'BE-201': number; 'BE-202': number; }' but required in type 'Record<LabCode, number>'.`,
  '13-open': `$ node demo8/ts-08-3/open/cache.ts
1 0`,
  '14-open-bad': `$ node_modules/.bin/tsc -p demo8/ts-08-3/openbad
demo8/ts-08-3/openbad/cache.ts(5,7): error TS2322: Type 'number | undefined' is not assignable to type 'number'.
  Type 'undefined' is not assignable to type 'number'.`,
  '15-pr-start': `$ node demo8/ts-08-3/practice/start/labels.ts
CANCELLED`,
  '16-pr-sol': `$ node demo8/ts-08-3/practice/solution/labels.ts
Đã huỷ`,
};
