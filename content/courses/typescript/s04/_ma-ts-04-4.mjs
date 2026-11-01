/**
 * _ma (bài 4.4) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "js": `// Plain JavaScript: an object used as a dictionary. The key comes from the URL: /labs/BE-999/free?booked=10
const LAB_INFO = {
  'BE-201': { name: 'Backend Lab 1', capacity: 40 },
  'BE-202': { name: 'Backend Lab 2', capacity: 40 },
  'AL-301': { name: 'AI Lab', capacity: 30 },
};

function freeSeats(code, booked) {
  return LAB_INFO[code].capacity - booked;
}

console.log('AL-301:', freeSeats('AL-301', 10));
console.log('BE-999:', freeSeats('BE-999', 10));`,
  "open": `// An index signature: ANY string key, each value a Lab.
type Lab = { name: string; capacity: number };

export const LAB_INFO: { [code: string]: Lab } = {
  'BE-201': { name: 'Backend Lab 1', capacity: 40 },
  'BE-202': { name: 'Backend Lab 2', capacity: 40 },
  'AL-301': { name: 'AI Lab', capacity: 30 },
};

export function freeSeats(code: string, booked: number): number {
  return LAB_INFO[code].capacity - booked;
}

console.log('AL-301:', freeSeats('AL-301', 10));
console.log('BE-999:', freeSeats('BE-999', 10));`,
  "looseCfg": `{ "extends": "../../../tsconfig.json", "compilerOptions": { "noUncheckedIndexedAccess": false }, "include": ["*.ts"] }`,
  "record": `import type { LabCode } from '../../../src/rules/schedule.ts';

type Lab = { name: string; capacity: number };

// Record<K, V>: exactly the keys K, each with a V.
const LAB_INFO: Record<LabCode, Lab> = {
  'BE-201': { name: 'Backend Lab 1', capacity: 40 },
  'BE-202': { name: 'Backend Lab 2', capacity: 40 },
  'AL-301': { name: 'AI Lab', capacity: 30 },
};
const twoLabs: Record<LabCode, Lab> = {
  'BE-201': { name: 'Backend Lab 1', capacity: 40 },
  'BE-202': { name: 'Backend Lab 2', capacity: 40 },
};
const fourLabs: Record<LabCode, Lab> = { ...LAB_INFO, 'BE-999': { name: 'Ghost', capacity: 99 } };

export function freeSeats(code: LabCode, booked: number): number {
  return LAB_INFO[code].capacity - booked; // no undefined to check: every LabCode is a key
}
const ghost = LAB_INFO['BE-999'];
export function fromUrl(text: string): number {
  return LAB_INFO[text].capacity;
}
export { twoLabs, fourLabs, ghost };`,
  "keys": `import { LABS } from '../../../src/rules/schedule.ts';
import type { LabCode } from '../../../src/rules/schedule.ts';

const CAPACITY: Record<LabCode, number> = { 'BE-201': 40, 'BE-202': 40, 'AL-301': 30 };

for (const key of Object.keys(CAPACITY)) {
  console.log(key, CAPACITY[key]);           // key is a string, not a LabCode
}
for (const code of LABS) {
  console.log(code, CAPACITY[code]);         // the one list of labs (Chapter 2): code is a LabCode
}
for (const [code, seats] of Object.entries(CAPACITY)) {
  console.log(code, seats);                  // entries: [string, number][]
}`,
  "empty": `import type { LabCode } from '../../../src/rules/schedule.ts';

const total: Record<LabCode, number> = {};
export { total };`,
  "count": `import { LABS } from '../../../src/rules/schedule.ts';
import type { LabCode } from '../../../src/rules/schedule.ts';

type Row = { lab: LabCode; seats: number };
const today: Row[] = [{ lab: 'BE-201', seats: 30 }, { lab: 'AL-301', seats: 25 }, { lab: 'BE-201', seats: 6 }];

// Version 1: an open dictionary that starts empty.
export function seatsByLabOpen(rows: readonly Row[]): { [lab: string]: number } {
  const total: { [lab: string]: number } = {};
  for (const r of rows) total[r.lab] = (total[r.lab] ?? 0) + r.seats;
  return total;
}

// Version 2: the type says "every lab".
export function seatsByLab(rows: readonly Row[]): Record<LabCode, number> {
  const total: Record<LabCode, number> = { 'BE-201': 0, 'BE-202': 0, 'AL-301': 0 };
  for (const r of rows) total[r.lab] += r.seats;
  return total;
}

console.log('open  :', seatsByLabOpen(today));
console.log('record:', seatsByLab(today));
for (const lab of LABS) console.log(lab, 'booked', seatsByLabOpen(today)[lab] ?? 'n/a', '|', seatsByLab(today)[lab]);`,
  "byid": `type User = { readonly id: number; name: string };
const users: User[] = [{ id: 1, name: 'Nguyen Van An' }, { id: 2, name: 'Tran Thi Binh' }];

// Ids arrive at runtime: an open key set. Two ways to index.
const byId: Record<number, User> = {};
for (const u of users) byId[u.id] = u;

const byIdMap = new Map<number, User>();
for (const u of users) byIdMap.set(u.id, u);

console.log(byId[2]?.name, byIdMap.get(2)?.name);
console.log(byId[99], byIdMap.get(99), byIdMap.size, Object.keys(byId));
const name: string = byId[2].name;`,
  "mixed": `// Known properties and an index signature in one type must agree.
export type SeatStats = {
  [lab: string]: number;
  updatedAt: string;
};`,
  "prStart": `// "How full is each lab today?" — a teammate's version. Node runs it; look at BE-202.
const CAPACITY: { [code: string]: number } = { 'BE-201': 40, 'BE-202': 40, 'AL-301': 30 };

export function usageLines(booked: { [code: string]: number }): string[] {
  return Object.keys(CAPACITY).map((code) => code + ' ' + Math.round((booked[code] / CAPACITY[code]) * 100) + '%');
}

console.log(usageLines({ 'BE-201': 36, 'AL-301': 25 }));`,
  "prSol": `import { LABS } from '../../../../src/rules/schedule.ts';
import type { LabCode } from '../../../../src/rules/schedule.ts';

// Closed key sets: every lab has a capacity, and the caller must say how many seats each lab has booked (0 included).
const CAPACITY: Record<LabCode, number> = { 'BE-201': 40, 'BE-202': 40, 'AL-301': 30 };

export function usageLines(booked: Record<LabCode, number>): string[] {
  return LABS.map((code) => code + ' ' + Math.round((booked[code] / CAPACITY[code]) * 100) + '%');
}

console.log(usageLines({ 'BE-201': 36, 'BE-202': 0, 'AL-301': 25 }));`,
};
export const OUT = {
  '11-js': `$ node demo4/ts-04-4/js/lookup.mjs
AL-301: 20
file://…/labflow-ts/demo4/ts-04-4/js/lookup.mjs:9
  return LAB_INFO[code].capacity - booked;
                        ^

TypeError: Cannot read properties of undefined (reading 'capacity')
    at freeSeats (file://…/labflow-ts/demo4/ts-04-4/js/lookup.mjs:9:25)
    at file://…/labflow-ts/demo4/ts-04-4/js/lookup.mjs:13:24
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
  '12-open': `$ npx tsc -p demo4/ts-04-4/open
demo4/ts-04-4/open/info.ts(11,10): error TS2532: Object is possibly 'undefined'.`,
  '13-loose': `$ npx tsc -p demo4/ts-04-4/loose && node demo4/ts-04-4/loose/info.ts
AL-301: 20
file://…/labflow-ts/demo4/ts-04-4/loose/info.ts:11
  return LAB_INFO[code].capacity - booked;
                        ^

TypeError: Cannot read properties of undefined (reading 'capacity')
    at freeSeats (file://…/labflow-ts/demo4/ts-04-4/loose/info.ts:11:25)
    at file://…/labflow-ts/demo4/ts-04-4/loose/info.ts:15:24
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
  '14-record': `$ npx tsc -p demo4/ts-04-4/record
demo4/ts-04-4/record/info.ts(11,7): error TS2741: Property '"AL-301"' is missing in type '{ 'BE-201': { name: string; capacity: number; }; 'BE-202': { name: string; capacity: number; }; }' but required in type 'Record<"AL-301" | "BE-201" | "BE-202", Lab>'.
demo4/ts-04-4/record/info.ts(15,55): error TS2353: Object literal may only specify known properties, and ''BE-999'' does not exist in type 'Record<"AL-301" | "BE-201" | "BE-202", Lab>'.
demo4/ts-04-4/record/info.ts(20,15): error TS7053: Element implicitly has an 'any' type because expression of type '"BE-999"' can't be used to index type 'Record<"AL-301" | "BE-201" | "BE-202", Lab>'.
  Property 'BE-999' does not exist on type 'Record<"AL-301" | "BE-201" | "BE-202", Lab>'.
demo4/ts-04-4/record/info.ts(22,10): error TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'Record<"AL-301" | "BE-201" | "BE-202", Lab>'.
  No index signature with a parameter of type 'string' was found on type 'Record<"AL-301" | "BE-201" | "BE-202", Lab>'.`,
  '15-keys': `$ npx tsc -p demo4/ts-04-4/keys
demo4/ts-04-4/keys/report.ts(7,20): error TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'Record<"AL-301" | "BE-201" | "BE-202", number>'.
  No index signature with a parameter of type 'string' was found on type 'Record<"AL-301" | "BE-201" | "BE-202", number>'.`,
  '16-empty': `$ npx tsc -p demo4/ts-04-4/empty
demo4/ts-04-4/empty/empty.ts(3,7): error TS2739: Type '{}' is missing the following properties from type 'Record<"AL-301" | "BE-201" | "BE-202", number>': "AL-301", "BE-201", "BE-202"`,
  '17-count': `$ npx tsc -p demo4/ts-04-4/count && node demo4/ts-04-4/count/seats.ts
open  : { 'BE-201': 36, 'AL-301': 25 }
record: { 'BE-201': 36, 'BE-202': 0, 'AL-301': 25 }
BE-201 booked 36 | 36
BE-202 booked n/a | 0
AL-301 booked 25 | 25`,
  '18-byid-tsc': `$ npx tsc -p demo4/ts-04-4/byid
demo4/ts-04-4/byid/users.ts(13,22): error TS2532: Object is possibly 'undefined'.`,
  '19-byid-run': `$ node demo4/ts-04-4/byid/users.ts
Tran Thi Binh Tran Thi Binh
undefined undefined 2 [ '1', '2' ]`,
  '20-mixed': `$ npx tsc -p demo4/ts-04-4/mixed
demo4/ts-04-4/mixed/stats.ts(4,3): error TS2411: Property 'updatedAt' of type 'string' is not assignable to 'string' index type 'number'.`,
  '21-pr-start': `$ npx tsc -p demo4/ts-04-4/practice/start
demo4/ts-04-4/practice/start/usage.ts(5,71): error TS2532: Object is possibly 'undefined'.
demo4/ts-04-4/practice/start/usage.ts(5,86): error TS2532: Object is possibly 'undefined'.`,
  '22-pr-start-run': `$ node demo4/ts-04-4/practice/start/usage.ts
[ 'BE-201 90%', 'BE-202 NaN%', 'AL-301 83%' ]`,
  '23-pr-sol': `$ npx tsc -p demo4/ts-04-4/practice/solution && node demo4/ts-04-4/practice/solution/usage.ts
[ 'BE-201 90%', 'BE-202 0%', 'AL-301 83%' ]`,
};
