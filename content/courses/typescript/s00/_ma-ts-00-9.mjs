/**
 * _ma (bài 0.9) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "types": `// The single source of truth for post types (like the enum in prisma/schema.prisma).
// 8 Aug 2026: the value CODE was renamed to CODE_REVIEW, here and everywhere it was imported.
export type ContentType = 'VLOG' | 'ARTICLE' | 'CODE_REVIEW' | 'QUIZ';`,
  "db": `// A tiny stand-in for the database. Like a PostgreSQL enum column, it refuses values it does not know.
import type { ContentType } from './types.ts';

const ALLOWED: readonly ContentType[] = ['VLOG', 'ARTICLE', 'CODE_REVIEW', 'QUIZ'];

export function insertPost(post: { title: string; type: ContentType }): void {
  if (!ALLOWED.includes(post.type)) {
    throw new Error('invalid input value for enum "ContentType": "' + post.type + '"');
  }
  console.log('inserted', post.type, '-', post.title);
}`,
  "app": `// The application code: it imports the type, so the rename reached it automatically.
import { insertPost } from './db.ts';

insertPost({ title: 'Review my booking API', type: 'CODE_REVIEW' });`,
  "seed": `// The seed script kept its OWN copy of the union — typed by hand months before the rename.
import { insertPost } from './db.ts';

type ContentType = 'VLOG' | 'ARTICLE' | 'CODE' | 'QUIZ';

const posts: { title: string; type: ContentType }[] = [
  { title: 'Welcome to LabFlow', type: 'ARTICLE' },
  { title: 'Review: checkSlot()', type: 'CODE' },
  { title: 'Week 1 quiz', type: 'QUIZ' },
];

for (const p of posts) insertPost(p);
console.log('seeded', posts.length, 'posts');`,
  "cfg": `{
  // Like the website's main tsconfig: the seed script is NOT included, so nobody type-checks it.
  "extends": "../../../tsconfig.json",
  "include": ["types.ts", "db.ts", "app.ts"]
}`,
  "cfgSeed": `{
  // The fix of 8 Aug 2026: a second config that also checks the seed script.
  "extends": "../../../tsconfig.json",
  "include": ["types.ts", "db.ts", "seed.ts"]
}`,
  "seedFixed": `// The fix: import the ONE definition instead of keeping a copy. The rename now reaches the seed too.
import type { ContentType } from './types.ts';
import { insertPost } from './db.ts';

const posts: { title: string; type: ContentType }[] = [
  { title: 'Welcome to LabFlow', type: 'ARTICLE' },
  { title: 'Review: checkSlot()', type: 'CODE' },
  { title: 'Week 1 quiz', type: 'QUIZ' },
];

for (const p of posts) insertPost(p);
console.log('seeded', posts.length, 'posts');`,
  "seedSau": `// The fix: import the ONE definition instead of keeping a copy. The rename now reaches the seed too.
import type { ContentType } from '../types.ts';
import { insertPost } from '../db.ts';

const posts: { title: string; type: ContentType }[] = [
  { title: 'Welcome to LabFlow', type: 'ARTICLE' },
  { title: 'Review: checkSlot()', type: 'CODE_REVIEW' },
  { title: 'Week 1 quiz', type: 'QUIZ' },
];

for (const p of posts) insertPost(p);
console.log('seeded', posts.length, 'posts');`,
  "labsJs": `// LabFlow in plain JavaScript: how many seats does a lab have?
const LABS = [
  { code: 'BE-201', seats: 40 },
  { code: 'BE-202', seats: 30 },
];

function seatsOf(code) {
  return LABS.find((lab) => lab.code === code).seats;
}

console.log('BE-201 has', seatsOf('BE-201'), 'seats');
console.log('BE-209 has', seatsOf('BE-209'), 'seats');   // a lab that does not exist`,
  "labsTs": `// The same code in TypeScript (strict). Nothing else changed except the parameter type.
const LABS = [
  { code: 'BE-201', seats: 40 },
  { code: 'BE-202', seats: 30 },
];

function seatsOf(code: string): number {
  return LABS.find((lab) => lab.code === code).seats;
}

console.log('BE-201 has', seatsOf('BE-201'), 'seats');
console.log('BE-209 has', seatsOf('BE-209'), 'seats');`,
  "labsFixed": `// The fix the compiler asks for: decide what happens when the lab is not found.
const LABS = [
  { code: 'BE-201', seats: 40 },
  { code: 'BE-202', seats: 30 },
];

function seatsOf(code: string): number {
  const lab = LABS.find((l) => l.code === code);
  if (lab === undefined) throw new Error('Unknown lab ' + code);
  return lab.seats;   // here TypeScript knows lab is defined
}

console.log('BE-201 has', seatsOf('BE-201'), 'seats');
console.log('BE-209 has', seatsOf('BE-209'), 'seats');`,
  "impulse": `// PREVIEW of Chapter 16 (branded types) — do not worry about the syntax yet.
// Two numbers that mean different units get different types.
type NewtonSeconds = number & { readonly unit: 'N·s' };
type PoundForceSeconds = number & { readonly unit: 'lbf·s' };

const lbf = (n: number) => n as PoundForceSeconds;
const toNewtonSeconds = (x: PoundForceSeconds) => (x * 4.45) as NewtonSeconds;

// The navigation software expects newton-seconds, as the interface specification said.
function correctTrajectory(impulse: NewtonSeconds): string {
  return 'correction applied: ' + impulse.toFixed(2) + ' N·s';
}

const fromGroundSoftware = lbf(10);            // the other team's program reports pound-force seconds
console.log(correctTrajectory(fromGroundSoftware));   // the 1999 mistake — refused by tsc
console.log(correctTrajectory(toNewtonSeconds(fromGroundSoftware)));`,
  "luyenTypes": `// The single source of truth for post types (like the enum in prisma/schema.prisma).
// Practice: QUIZ renamed to EXAM — one edit, in this file only.
export type ContentType = 'VLOG' | 'ARTICLE' | 'CODE_REVIEW' | 'EXAM';`,
};
export const OUT = {
  '91-tsc-xanh': `$ npx tsc -p demo0/ts-00-9/su-co`,
  '92-seed-chay': `$ node demo0/ts-00-9/su-co/app.ts && node demo0/ts-00-9/su-co/seed.ts
inserted CODE_REVIEW - Review my booking API
inserted ARTICLE - Welcome to LabFlow
file://…/labflow-ts/demo0/ts-00-9/su-co/db.ts:8
    throw new Error('invalid input value for enum "ContentType": "' + post.type + '"');
          ^

Error: invalid input value for enum "ContentType": "CODE"
    at insertPost (file://…/labflow-ts/demo0/ts-00-9/su-co/db.ts:8:11)
    at file://…/labflow-ts/demo0/ts-00-9/su-co/seed.ts:12:24
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
  '93-tsc-seed': `$ npx tsc -p demo0/ts-00-9/su-co/tsconfig.seed.json
demo0/ts-00-9/su-co/seed.ts(12,35): error TS2345: Argument of type '{ title: string; type: ContentType; }' is not assignable to parameter of type '{ title: string; type: import("…/labflow-ts/demo0/ts-00-9/su-co/types").ContentType; }'.
  Types of property 'type' are incompatible.
    Type 'ContentType' is not assignable to type 'import("…/labflow-ts/demo0/ts-00-9/su-co/types").ContentType'.
      Type '"CODE"' is not assignable to type 'ContentType'.`,
  '94-tsc-fixed': `$ npx tsc -p demo0/ts-00-9/su-co/tsconfig.fixed.json
demo0/ts-00-9/su-co/seed-fixed.ts(7,35): error TS2322: Type '"CODE"' is not assignable to type 'ContentType'.`,
  '95-sau': `$ npx tsc -p demo0/ts-00-9/su-co/sau && node demo0/ts-00-9/su-co/sau/seed.ts
inserted ARTICLE - Welcome to LabFlow
inserted CODE_REVIEW - Review: checkSlot()
inserted QUIZ - Week 1 quiz
seeded 3 posts`,
  '96-undef-js': `$ node demo0/ts-00-9/undefined/labs.js
BE-201 has 40 seats
file://…/labflow-ts/demo0/ts-00-9/undefined/labs.js:8
  return LABS.find((lab) => lab.code === code).seats;
                                              ^

TypeError: Cannot read properties of undefined (reading 'seats')
    at seatsOf (file://…/labflow-ts/demo0/ts-00-9/undefined/labs.js:8:47)
    at file://…/labflow-ts/demo0/ts-00-9/undefined/labs.js:12:27
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
  '97-undef-tsc': `$ npx tsc -p demo0/ts-00-9/undefined
demo0/ts-00-9/undefined/labs.ts(8,10): error TS2532: Object is possibly 'undefined'.`,
  '98-undef-fixed': `$ npx tsc -p demo0/ts-00-9/undefined/tsconfig.fixed.json && node demo0/ts-00-9/undefined/labs-fixed.ts
BE-201 has 40 seats
file://…/labflow-ts/demo0/ts-00-9/undefined/labs-fixed.ts:9
  if (lab === undefined) throw new Error('Unknown lab ' + code);
                               ^

Error: Unknown lab BE-209
    at seatsOf (file://…/labflow-ts/demo0/ts-00-9/undefined/labs-fixed.ts:9:32)
    at file://…/labflow-ts/demo0/ts-00-9/undefined/labs-fixed.ts:14:27
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
  '99-undef-ts-chay': `$ node demo0/ts-00-9/undefined/labs.ts
BE-201 has 40 seats
file://…/labflow-ts/demo0/ts-00-9/undefined/labs.ts:8
  return LABS.find((lab) => lab.code === code).seats;
                                              ^

TypeError: Cannot read properties of undefined (reading 'seats')
    at seatsOf (file://…/labflow-ts/demo0/ts-00-9/undefined/labs.ts:8:47)`,
  '9a-units-tsc': `$ npx tsc -p demo0/ts-00-9/units
demo0/ts-00-9/units/impulse.ts(15,31): error TS2345: Argument of type 'PoundForceSeconds' is not assignable to parameter of type 'NewtonSeconds'.
  Type 'PoundForceSeconds' is not assignable to type '{ readonly unit: "N·s"; }'.
    Types of property 'unit' are incompatible.
      Type '"lbf·s"' is not assignable to type '"N·s"'.`,
  '9b-units-chay': `$ node demo0/ts-00-9/units/impulse.ts
correction applied: 10.00 N·s
correction applied: 44.50 N·s`,
  '9c-luyen': `$ npx tsc -p demo0/ts-00-9/luyen
demo0/ts-00-9/luyen/db.ts(4,76): error TS2322: Type '"QUIZ"' is not assignable to type 'ContentType'.
demo0/ts-00-9/luyen/seed.ts(8,27): error TS2322: Type '"QUIZ"' is not assignable to type 'ContentType'.`,
};
