/**
 * _ma (bài 2.1) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "typeofTs": `// The seven primitive types of JavaScript, annotated — and what typeof says about each one at runtime.
const lab: string = 'BE-201';
const seats: number = 31;
const approved: boolean = false;
const bookingId: bigint = 9007199254740993n;
const tag: symbol = Symbol('booking');
const note: null = null;
const cancelledAt: undefined = undefined;

for (const value of [lab, seats, approved, bookingId, tag, note, cancelledAt]) {
  console.log(String(value).padEnd(18), typeof value);
}
console.log('[480, 600]'.padEnd(18), typeof [480, 600]);
console.log('{ seats: 31 }'.padEnd(18), typeof { seats: 31 });`,
  "jsonTs": `// null and undefined do not survive JSON the same way.
const entry = { id: 7, lab: 'BE-201', note: null, cancelledAt: undefined };
const sent = JSON.stringify(entry);
console.log('sent    :', sent);
console.log('received:', JSON.parse(sent));`,
  "wrapper": `// string (lower-case) is the primitive type. String (capital S) is the type of a wrapper OBJECT.
const a: String = 'BE-201';               // accepted: a primitive fits the wrapper type
const b: string = a;                      // refused
const c: string = new String('BE-201');   // refused

console.log(typeof 'BE-201', typeof new String('BE-201'));
console.log(new String('BE-201') === new String('BE-201'));`,
  "facts": `// Three number facts that no type annotation can change. tsc accepts every line.
const total: number = 0.1 + 0.2;
console.log('0.1 + 0.2 =', total, '| equals 0.3?', total === 0.3);

const idAsNumber: number = Number('9007199254740993');   // a bigint id column, read as a number
console.log('id via Number():', idAsNumber, '| safe integer?', Number.isSafeInteger(idAsNumber));

const id: bigint = 9007199254740993n;                     // the same id as a bigint
console.log('id as bigint   :', id.toString());
try {
  console.log(JSON.stringify({ id, lab: 'BE-201' }));
} catch (error) {
  console.log('JSON.stringify threw:', String(error));
}`,
  "mix": `// bigint and number do not mix, and tsc knows it.
const id: bigint = 9007199254740993n;
const next = id + 1;
const asNumber: number = id;
const fixedNext = id + 1n;
const fixedText: string = id.toString();`,
  "schedule": `// One day of LabFlow's schedule — written by a teammate with strictNullChecks OFF.
export type ScheduleEntry = {
  id: number;
  lab: string;
  start: string;
  end: string;
  bookedBy: string;
  note: string | null;      // NULL in the database: "no note"
  cancelledAt?: string;     // absent until the booking is cancelled
};

export const TODAY: ScheduleEntry[] = [
  { id: 1, lab: 'BE-201', start: '08:00', end: '10:00', bookedBy: 'an.nv', note: 'Bring an HDMI cable' },
  { id: 2, lab: 'BE-201', start: '13:00', end: '15:00', bookedBy: 'binh.tt', note: null },
  { id: 3, lab: 'AL-301', start: '09:00', end: '11:00', bookedBy: 'chi.lm', note: null, cancelledAt: '2026-11-01T07:15:00Z' },
];

export function findEntry(schedule: ScheduleEntry[], id: number): ScheduleEntry | undefined {
  return schedule.find((e) => e.id === id);
}

export function noteBanner(e: ScheduleEntry): string {
  return e.note.toUpperCase();
}

export function cancelledOn(e: ScheduleEntry): string {
  return e.cancelledAt.slice(0, 10);
}

export function bookerOf(schedule: ScheduleEntry[], id: number): string {
  return findEntry(schedule, id).bookedBy;
}

export function pickNote(e: ScheduleEntry): string {
  return e.note;
}`,
  "runAll": `// Call each function on real data and print what happens.
import { TODAY, noteBanner, cancelledOn, bookerOf, pickNote } from './schedule.ts';

const [withNote, noNote, cancelled] = TODAY;
const cases: [string, () => string][] = [
  ['noteBanner(entry 1)', () => noteBanner(withNote)],
  ['cancelledOn(entry 3)', () => cancelledOn(cancelled)],
  ['noteBanner(entry 2)', () => noteBanner(noNote)],
  ['cancelledOn(entry 1)', () => cancelledOn(withNote)],
  ['bookerOf(TODAY, 9)', () => bookerOf(TODAY, 9)],
  ['pickNote(entry 2)', () => pickNote(noNote)],
];
for (const [label, run] of cases) {
  try {
    console.log(label.padEnd(21), '→', run());
  } catch (error) {
    console.log(label.padEnd(21), '→ throws', String(error));
  }
}`,
  "loose": `{ "extends": "../../../tsconfig.json", "compilerOptions": { "strictNullChecks": false }, "include": ["schedule.ts", "run-all.ts"] }`,
  "strictCfg": `{ "extends": "../../../tsconfig.json", "include": ["schedule.ts"] }`,
  "fix": `// One day of LabFlow's schedule — written by a teammate with strictNullChecks OFF.
export type ScheduleEntry = {
  id: number;
  lab: string;
  start: string;
  end: string;
  bookedBy: string;
  note: string | null;      // NULL in the database: "no note"
  cancelledAt?: string;     // absent until the booking is cancelled
};

export const TODAY: ScheduleEntry[] = [
  { id: 1, lab: 'BE-201', start: '08:00', end: '10:00', bookedBy: 'an.nv', note: 'Bring an HDMI cable' },
  { id: 2, lab: 'BE-201', start: '13:00', end: '15:00', bookedBy: 'binh.tt', note: null },
  { id: 3, lab: 'AL-301', start: '09:00', end: '11:00', bookedBy: 'chi.lm', note: null, cancelledAt: '2026-11-01T07:15:00Z' },
];

export function findEntry(schedule: ScheduleEntry[], id: number): ScheduleEntry | undefined {
  return schedule.find((e) => e.id === id);
}

// Fix 1 — check first. After the if, tsc knows note is a string.
export function noteBanner(e: ScheduleEntry): string {
  if (e.note === null) return '';
  return e.note.toUpperCase();
}

// Fix 2 — optional chaining: stop and give undefined if the left side is missing. Say so in the return type.
export function cancelledOn(e: ScheduleEntry): string | undefined {
  return e.cancelledAt?.slice(0, 10);
}

// Fix 3 — ?. plus ?? : a default only when the value is null or undefined.
export function bookerOf(schedule: ScheduleEntry[], id: number): string {
  return findEntry(schedule, id)?.bookedBy ?? '(unknown)';
}

export function pickNote(e: ScheduleEntry): string {
  return e.note ?? '(no note)';
}`,
  "optional": `// "May be absent" (?:) is not the same as "present, but maybe undefined" (| undefined).
type Optional = { id: number; cancelledAt?: string };
type MaybeUndefined = { id: number; cancelledAt: string | undefined };

const a: Optional = { id: 1 };                              // fine: the key may be left out
const b: MaybeUndefined = { id: 1 };                        // refused: the key is required
const c: MaybeUndefined = { id: 1, cancelledAt: undefined }; // fine: present, value undefined
const d: Optional = { id: 2, cancelledAt: null };           // refused: null is not undefined

console.log(a, c, 'cancelledAt' in a, 'cancelledAt' in c);`,
  "orLab": `// capacity: null = not recorded yet (use the default), 0 = closed for maintenance.
export type Lab = { code: string; capacity: number | null };
export const DEFAULT_CAPACITY = 40;

export function capacityOf(lab: Lab): number {
  return lab.capacity || DEFAULT_CAPACITY;
}

export function noteOf(note: string | null): string {
  return note || '(no note)';
}`,
  "orFixed": `// capacity: null = not recorded yet (use the default), 0 = closed for maintenance.
export type Lab = { code: string; capacity: number | null };
export const DEFAULT_CAPACITY = 40;

export function capacityOf(lab: Lab): number {
  return lab.capacity ?? DEFAULT_CAPACITY;
}

export function noteOf(note: string | null): string {
  return note ?? '(no note)';
}`,
  "orTest": `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { capacityOf, noteOf } from './lab.ts';

test('a lab with no recorded capacity gets the default 40', () => {
  assert.equal(capacityOf({ code: 'BE-202', capacity: null }), 40);
});
test('a lab closed for maintenance has 0 seats', () => {
  assert.equal(capacityOf({ code: 'AL-301', capacity: 0 }), 0);
});
test('no note shows (no note)', () => assert.equal(noteOf(null), '(no note)'));
test('an empty note stays empty', () => assert.equal(noteOf(''), ''));`,
  "prStart": `// Practice 2.1 — make this compile under strict mode. No "!", no "as", no "any".
type ScheduleEntry = {
  id: number;
  lab: string;
  start: string;
  end: string;
  bookedBy: string;
  note: string | null;
  cancelledAt?: string;
};

export function labelOf(e: ScheduleEntry): string {
  const note = e.note.trim();
  const cancelled = ' · cancelled ' + e.cancelledAt.slice(0, 10);
  return e.lab + ' ' + e.start + '-' + e.end + ' · ' + note + cancelled;
}

console.log(labelOf({ id: 1, lab: 'BE-201', start: '08:00', end: '10:00', bookedBy: 'an.nv', note: ' Bring an HDMI cable ' }));
console.log(labelOf({ id: 3, lab: 'AL-301', start: '09:00', end: '11:00', bookedBy: 'chi.lm', note: null, cancelledAt: '2026-11-01T07:15:00Z' }));`,
  "prSol": `// Practice 2.1 — solution: every "maybe missing" value is checked where it is used.
type ScheduleEntry = {
  id: number;
  lab: string;
  start: string;
  end: string;
  bookedBy: string;
  note: string | null;
  cancelledAt?: string;
};

export function labelOf(e: ScheduleEntry): string {
  const note = e.note === null ? '(no note)' : e.note.trim();
  const cancelled = e.cancelledAt === undefined ? '' : ' · cancelled ' + e.cancelledAt.slice(0, 10);
  return e.lab + ' ' + e.start + '-' + e.end + ' · ' + note + cancelled;
}

console.log(labelOf({ id: 1, lab: 'BE-201', start: '08:00', end: '10:00', bookedBy: 'an.nv', note: ' Bring an HDMI cable ' }));
console.log(labelOf({ id: 3, lab: 'AL-301', start: '09:00', end: '11:00', bookedBy: 'chi.lm', note: null, cancelledAt: '2026-11-01T07:15:00Z' }));`,
};
export const OUT = {
  '11-typeof': `$ node demo2/ts-02-1/prim/typeof.ts
BE-201             string
31                 number
false              boolean
9007199254740993   bigint
Symbol(booking)    symbol
null               object
undefined          undefined
[480, 600]         object
{ seats: 31 }      object`,
  '12-json': `$ node demo2/ts-02-1/prim/json.ts
sent    : {"id":7,"lab":"BE-201","note":null}
received: { id: 7, lab: 'BE-201', note: null }`,
  '13-wrapper-run': `$ node demo2/ts-02-1/wrapper/wrapper.ts
string object
false`,
  '13-wrapper-tsc': `$ npx tsc -p demo2/ts-02-1/wrapper
demo2/ts-02-1/wrapper/wrapper.ts(3,7): error TS2322: Type 'String' is not assignable to type 'string'.
  'string' is a primitive, but 'String' is a wrapper object. Prefer using 'string' when possible.
demo2/ts-02-1/wrapper/wrapper.ts(4,7): error TS2322: Type 'String' is not assignable to type 'string'.
  'string' is a primitive, but 'String' is a wrapper object. Prefer using 'string' when possible.`,
  '14-facts-run': `$ node demo2/ts-02-1/number/facts.ts
0.1 + 0.2 = 0.30000000000000004 | equals 0.3? false
id via Number(): 9007199254740992 | safe integer? false
id as bigint   : 9007199254740993
JSON.stringify threw: TypeError: Do not know how to serialize a BigInt`,
  '14-facts-tsc': `$ npx tsc -p demo2/ts-02-1/number/facts.json`,
  '15-mix': `$ npx tsc -p demo2/ts-02-1/number
demo2/ts-02-1/number/mix.ts(3,14): error TS2365: Operator '+' cannot be applied to types 'bigint' and '1'.
demo2/ts-02-1/number/mix.ts(4,7): error TS2322: Type 'bigint' is not assignable to type 'number'.`,
  '16-loose': `$ npx tsc -p demo2/ts-02-1/nulls/loose.json`,
  '16-strict': `$ npx tsc -p demo2/ts-02-1/nulls
demo2/ts-02-1/nulls/schedule.ts(23,10): error TS18047: 'e.note' is possibly 'null'.
demo2/ts-02-1/nulls/schedule.ts(27,10): error TS18048: 'e.cancelledAt' is possibly 'undefined'.
demo2/ts-02-1/nulls/schedule.ts(31,10): error TS2532: Object is possibly 'undefined'.
demo2/ts-02-1/nulls/schedule.ts(35,3): error TS2322: Type 'string | null' is not assignable to type 'string'.
  Type 'null' is not assignable to type 'string'.`,
  '17-run-all': `$ node demo2/ts-02-1/nulls/run-all.ts
noteBanner(entry 1)   → BRING AN HDMI CABLE
cancelledOn(entry 3)  → 2026-11-01
noteBanner(entry 2)   → throws TypeError: Cannot read properties of null (reading 'toUpperCase')
cancelledOn(entry 1)  → throws TypeError: Cannot read properties of undefined (reading 'slice')
bookerOf(TODAY, 9)    → throws TypeError: Cannot read properties of undefined (reading 'bookedBy')
pickNote(entry 2)     → null`,
  '18-fix-run': `$ node demo2/ts-02-1/fix/run-all.ts
noteBanner(entry 1)   → BRING AN HDMI CABLE
cancelledOn(entry 3)  → 2026-11-01
noteBanner(entry 2)   → 
cancelledOn(entry 1)  → undefined
bookerOf(TODAY, 9)    → (unknown)
pickNote(entry 2)     → (no note)`,
  '18-fix-tsc': `$ npx tsc -p demo2/ts-02-1/fix`,
  '19-optional-run': `$ node demo2/ts-02-1/optional/optional.ts
{ id: 1 } { id: 1, cancelledAt: undefined } false true`,
  '19-optional': `$ npx tsc -p demo2/ts-02-1/optional
demo2/ts-02-1/optional/optional.ts(6,7): error TS2741: Property 'cancelledAt' is missing in type '{ id: number; }' but required in type 'MaybeUndefined'.
demo2/ts-02-1/optional/optional.ts(8,30): error TS2322: Type 'null' is not assignable to type 'string | undefined'.`,
  '20-or-test': `$ node --test --test-reporter=spec demo2/ts-02-1/or-trap/lab.test.ts
✔ a lab with no recorded capacity gets the default 40 (0.5895ms)
✖ a lab closed for maintenance has 0 seats (0.502042ms)
✔ no note shows (no note) (0.064834ms)
✖ an empty note stays empty (0.252625ms)
ℹ tests 4
ℹ suites 0
ℹ pass 2
ℹ fail 2
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 89.488709

✖ failing tests:

test at demo2/ts-02-1/or-trap/lab.test.ts:8:1
✖ a lab closed for maintenance has 0 seats (0.502042ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
  
  40 !== 0
  
      at TestContext.<anonymous> (file://…/labflow-ts/demo2/ts-02-1/or-trap/lab.test.ts:9:10)
      at Test.runInAsyncScope (node:async_hooks:214:14)
      at Test.run (node:internal/test_runner/test:1047:25)
      at Test.processPendingSubtests (node:internal/test_runner/test:744:18)
      at Test.postRun (node:internal/test_runner/test:1173:19)
      at Test.run (node:internal/test_runner/test:1101:12)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:296:3) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: 40,
    expected: 0,
    operator: 'strictEqual',
    diff: 'simple'
  }

test at demo2/ts-02-1/or-trap/lab.test.ts:12:1
✖ an empty note stays empty (0.252625ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
  
  '(no note)' !== ''
  
      at TestContext.<anonymous> (file://…/labflow-ts/demo2/ts-02-1/or-trap/lab.test.ts:12:48)
      at Test.runInAsyncScope (node:async_hooks:214:14)
      at Test.run (node:internal/test_runner/test:1047:25)
      at Test.processPendingSubtests (node:internal/test_runner/test:744:18)
      at Test.postRun (node:internal/test_runner/test:1173:19)
      at Test.run (node:internal/test_runner/test:1101:12)
      at async Test.processPendingSubtests (node:internal/test_runner/test:744:7) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: '(no note)',
    expected: '',
    operator: 'strictEqual',
    diff: 'simple'
  }`,
  '20-or-tsc': `$ npx tsc -p demo2/ts-02-1/or-trap`,
  '21-fixed-test': `$ node --test --test-reporter=spec demo2/ts-02-1/or-trap/fixed/lab.test.ts
✔ a lab with no recorded capacity gets the default 40 (0.483125ms)
✔ a lab closed for maintenance has 0 seats (0.067417ms)
✔ no note shows (no note) (0.056875ms)
✔ an empty note stays empty (0.051084ms)
ℹ tests 4
ℹ suites 0
ℹ pass 4
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 95.513042`,
  '21-fixed-tsc': `$ npx tsc -p demo2/ts-02-1/or-trap/fixed`,
  '22-pr-start-run': `$ node demo2/ts-02-1/practice/start/label.ts
file://…/labflow-ts/demo2/ts-02-1/practice/start/label.ts:14
  const cancelled = ' · cancelled ' + e.cancelledAt.slice(0, 10);
                                                    ^

TypeError: Cannot read properties of undefined (reading 'slice')
    at labelOf (file://…/labflow-ts/demo2/ts-02-1/practice/start/label.ts:14:53)
    at file://…/labflow-ts/demo2/ts-02-1/practice/start/label.ts:18:13
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
  '22-pr-start': `$ npx tsc -p demo2/ts-02-1/practice/start
demo2/ts-02-1/practice/start/label.ts(13,16): error TS18047: 'e.note' is possibly 'null'.
demo2/ts-02-1/practice/start/label.ts(14,39): error TS18048: 'e.cancelledAt' is possibly 'undefined'.`,
  '23-pr-sol': `$ npx tsc -p demo2/ts-02-1/practice/solution && node demo2/ts-02-1/practice/solution/label.ts
BE-201 08:00-10:00 · Bring an HDMI cable
AL-301 09:00-11:00 · (no note) · cancelled 2026-11-01`,
};
