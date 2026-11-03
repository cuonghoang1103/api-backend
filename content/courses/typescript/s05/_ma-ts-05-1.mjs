/**
 * _ma (bài 5.1) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "idJs": `// A lab id comes from two places: the URL (a string) and an old table (a number).
function badge(id) {
  return 'LAB-' + id.padStart(4, '0');
}
console.log(badge('42'));   // from the URL
console.log(badge(42));     // from the old table`,
  "unionShow": `// A union: "one of these types". A value of type Id is a string OR a number — nothing else.
export type Id = string | number;

export function badge(id: Id): string {
  // Only what BOTH members allow is available without narrowing.
  return 'LAB-' + id.padStart(4, '0');
}`,
  "typeofShow": `export type Id = string | number;

// Inside each branch, tsc KNOWS the narrower type: string here, number there.
export function badge(id: Id): string {
  if (typeof id === 'string') return 'LAB-' + id.padStart(4, '0'); // id: string
  return 'LAB-' + String(id).padStart(4, '0');                      // id: number
}

console.log(badge('42'));
console.log(badge(42));`,
  "truthyNote": `// A note is text that may be absent (NULL in the database, 2.1).
export function preview(note: string | null): string {
  if (note) return note.slice(0, 20); // narrowed to string — null removed
  return '(no note)';
}

// A trap: truthiness also removes 0 and '' — not just null/undefined.
export function seatsLabel(seats: number | undefined): string {
  if (seats) return seats + ' seats';  // 0 falls through here!
  return 'seats unknown';
}

console.log(preview('Weekly backend sync'));
console.log(preview(null));
console.log(seatsLabel(30));
console.log(seatsLabel(0));   // a real 0-seat room, mislabelled
console.log(seatsLabel(undefined));`,
  "cfaReassign": `export type Id = string | number;

let id: Id = loadFromUrl(); // id: string | number
console.log(typeof id);

id = 42;                    // from here tsc knows id is number
console.log(id.toFixed(0)); // .toFixed is a number method — allowed, no narrowing needed

function loadFromUrl(): Id {
  return '42';
}`,
  "exhaustNever": `export type Id = string | number;

export function kind(id: Id): string {
  if (typeof id === 'string') return 'text';
  if (typeof id === 'number') return 'number';
  // Both members removed: here id has type never. Hover shows it; nothing reaches this line.
  return impossible(id);
}

function impossible(x: never): never {
  throw new Error('unreachable: ' + String(x));
}`,
  "prStart": `// A sensor reading from the lab: either a number (°C) or the string 'offline'.
export type Reading = number | string;

// Bug: tsc refuses this, and even if it compiled the 'offline' case would be wrong.
export function tempLabel(r: Reading): string {
  return r.toFixed(1) + '°C';
}

console.log(tempLabel(21.5));
console.log(tempLabel('offline'));`,
  "prSol": `export type Reading = number | string;

// Narrow by type, keep the two answers apart.
export function tempLabel(r: Reading): string {
  if (typeof r === 'number') return r.toFixed(1) + '°C';
  return 'sensor ' + r; // r is string
}

console.log(tempLabel(21.5));
console.log(tempLabel('offline'));`,
};
export const OUT = {
  '11-js': `$ node demo5/ts-05-1/js/id.mjs
LAB-0042
file://…/labflow-ts/demo5/ts-05-1/js/id.mjs:3
  return 'LAB-' + id.padStart(4, '0');
                     ^

TypeError: id.padStart is not a function
    at badge (file://…/labflow-ts/demo5/ts-05-1/js/id.mjs:3:22)
    at file://…/labflow-ts/demo5/ts-05-1/js/id.mjs:6:13
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
  '12-union': `$ npx tsc -p demo5/ts-05-1/union
demo5/ts-05-1/union/show.ts(6,22): error TS2339: Property 'padStart' does not exist on type 'Id'.
  Property 'padStart' does not exist on type 'number'.`,
  '13-typeof': `$ npx tsc -p demo5/ts-05-1/typeofg && node demo5/ts-05-1/typeofg/show.ts
LAB-0042
LAB-0042`,
  '14-truthy': `$ node demo5/ts-05-1/truthy/note.ts
Weekly backend sync
(no note)
30 seats
seats unknown
seats unknown`,
  '15-cfa': `$ npx tsc -p demo5/ts-05-1/cfa && node demo5/ts-05-1/cfa/reassign.ts
string
42`,
  '16-exhaust': `$ npx tsc -p demo5/ts-05-1/exhaust`,
  '17-pr-start': `$ npx tsc -p demo5/ts-05-1/practice/start
demo5/ts-05-1/practice/start/level.ts(6,12): error TS2339: Property 'toFixed' does not exist on type 'Reading'.
  Property 'toFixed' does not exist on type 'string'.`,
  '18-pr-step1': `$ npx tsc -p demo5/ts-05-1/practice/step1 && node demo5/ts-05-1/practice/step1/level.ts
21.5°C
offline`,
  '19-pr-sol': `$ npx tsc -p demo5/ts-05-1/practice/solution && node demo5/ts-05-1/practice/solution/level.ts
21.5°C
sensor offline`,
};
