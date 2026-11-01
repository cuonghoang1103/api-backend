/**
 * _ma (bài 1.2) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "booking": `import { parseTime } from './time.ts';

export const OPEN = 7 * 60;          // 07:00
export const CLOSE = 21 * 60;        // 21:00
export const STEP = 30;              // BR-04: 30-minute grid
export const MAX_MINUTES = 240;      // Lite-1: at most 4 hours
export const MAX_DAYS_AHEAD = 14;    // BR-05: at most 14 days ahead
export const APPROVAL_SEATS = 30;    // BR-06: more than 30 seats needs approval

export type Role = 'STUDENT' | 'LECTURER' | 'ADMIN';
export type SlotCode = 'OFF_GRID' | 'END_BEFORE_START' | 'OUTSIDE_HOURS' | 'TOO_LONG';
export type SlotResult = { ok: true; minutes: number } | { ok: false; code: SlotCode };

export type BookingInput = { lab: string; seats: number; role: Role; start: string; end: string };
export type Booking = {
  lab: string;
  start: string;
  end: string;
  minutes: number;
  status: 'PENDING' | 'CONFIRMED';
};

export function checkSlot(start: string, end: string): SlotResult {
  const s = parseTime(start);
  const e = parseTime(end);
  if (s % STEP !== 0 || e % STEP !== 0) return { ok: false, code: 'OFF_GRID' };
  if (e <= s) return { ok: false, code: 'END_BEFORE_START' };
  if (s < OPEN || e > CLOSE) return { ok: false, code: 'OUTSIDE_HOURS' };
  if (e - s > MAX_MINUTES) return { ok: false, code: 'TOO_LONG' };
  return { ok: true, minutes: e - s };
}

export function isWithinBookingWindow(daysAhead: number): boolean {
  return Number.isInteger(daysAhead) && daysAhead >= 0 && daysAhead <= MAX_DAYS_AHEAD;
}

export function needsApproval({ seats, role }: { seats: number; role: Role }): boolean {
  if (!Number.isInteger(seats) || seats < 1) {
    throw new RangeError('seats must be a positive integer, got ' + seats);
  }
  if (role === 'LECTURER' || role === 'ADMIN') return false;
  return seats > APPROVAL_SEATS;
}

export function createBooking({ lab, seats, role, start, end }: BookingInput): Booking {
  const slot = checkSlot(start, end);
  if (!slot.ok) throw new Error(slot.code);
  return {
    lab,
    start,
    end,
    minutes: slot.minutes,
    status: needsApproval({ seats, role }) ? 'PENDING' : 'CONFIRMED',
  };
}

// Share of opening hours already booked, added booking by booking (0..1).
export function usageRate(bookings: readonly { minutes: number }[]): number {
  let rate = 0;
  for (const b of bookings) rate += b.minutes / (CLOSE - OPEN);
  return rate;
}`,
  "approval": `import type { Role } from '../../../src/rules/booking.ts';

// The team changed this signature: it used to be needsApproval(seats, role).
export function needsApproval(input: { seats: number; role: Role }): boolean {
  if (input.role === 'LECTURER' || input.role === 'ADMIN') return false;
  return input.seats > 30;
}`,
  "form": `import { needsApproval } from './approval.ts';

// Booking form: still written for the OLD signature.
export const formNeedsApproval = needsApproval(31, 'STUDENT');`,
  "report": `import { needsApproval } from './approval.ts';

// Monthly report: also written for the OLD signature.
export function countPending(seatsList: number[]): number {
  return seatsList.filter((seats) => needsApproval(seats, 'STUDENT')).length;
}`,
  "handler": `import { createBooking, type BookingInput } from '../../../src/rules/booking.ts';

// A request body arrives as TEXT. JSON.parse returns "any", so this line compiles.
export function handleCreate(body: string) {
  const input: BookingInput = JSON.parse(body);
  return createBooking(input);
}`,
  "bodies": `// Three request bodies, as a browser or Postman would send them.
export const BODIES: [string, string][] = [
  ['correct ', '{"lab":"BE-201","seats":31,"role":"LECTURER","start":"08:00","end":"10:00"}'],
  ['seats="31"', '{"lab":"BE-201","seats":"31","role":"LECTURER","start":"08:00","end":"10:00"}'],
  ['lecturer', '{"lab":"BE-201","seats":31,"role":"lecturer","start":"08:00","end":"10:00"}'],
];`,
  "run": `import { BODIES } from './bodies.ts';
import { handleCreate } from './handler.ts';

for (const [label, body] of BODIES) {
  try {
    console.log(label, '→', JSON.stringify(handleCreate(body)));
  } catch (e) {
    console.log(label, '→', e instanceof Error ? e.name + ': ' + e.message : e);
  }
}`,
  "handlerAs": `import { createBooking, type BookingInput } from '../../../src/rules/booking.ts';

// Same thing with "as": still no check — "as" only tells the compiler what to believe.
export function handleCreate(body: string) {
  const input = JSON.parse(body) as BookingInput;
  return createBooking(input);
}`,
  "guard": `import type { BookingInput } from '../../../src/rules/booking.ts';

const ROLES: readonly string[] = ['STUDENT', 'LECTURER', 'ADMIN'];

// A type guard: real JavaScript checks that run at RUNTIME.
// If it returns true, TypeScript treats x as a BookingInput afterwards.
export function isBookingInput(x: unknown): x is BookingInput {
  return (
    typeof x === 'object' && x !== null &&
    'lab' in x && typeof x.lab === 'string' &&
    'seats' in x && typeof x.seats === 'number' && Number.isInteger(x.seats) && x.seats >= 1 &&
    'role' in x && typeof x.role === 'string' && ROLES.includes(x.role) &&
    'start' in x && typeof x.start === 'string' &&
    'end' in x && typeof x.end === 'string'
  );
}`,
  "handlerSafe": `import { createBooking } from '../../../src/rules/booking.ts';
import { isBookingInput } from './guard.ts';

export function handleCreate(body: string) {
  const data: unknown = JSON.parse(body);      // unknown: "prove it before you use it"
  if (!isBookingInput(data)) return { error: 'INVALID_BODY' };
  return createBooking(data);                  // here data is a BookingInput
}`,
  "runSafe": `import { BODIES } from './bodies.ts';
import { handleCreate } from './handler-safe.ts';

for (const [label, body] of BODIES) {
  console.log(label, '→', JSON.stringify(handleCreate(body)));
}`,
  "guardThieu": `import type { BookingInput } from '../../../src/rules/booking.ts';

// A guard that FORGETS to check role. tsc cannot tell — it trusts "x is BookingInput".
export function isBookingInput(x: unknown): x is BookingInput {
  return (
    typeof x === 'object' && x !== null &&
    'lab' in x && typeof x.lab === 'string' &&
    'seats' in x && typeof x.seats === 'number' && Number.isInteger(x.seats) && x.seats >= 1 &&
    'start' in x && typeof x.start === 'string' &&
    'end' in x && typeof x.end === 'string'
  );
}`,
  "bienSai": `import { createBooking } from '../../../src/rules/booking.ts';

export function handleCreate(body: string) {
  const data: unknown = JSON.parse(body);
  return createBooking(data);                  // no check yet
}`,
  "labs": `const labs = ['BE-201', 'BE-202', 'AL-305'];

const pick = labs[5];    // there is no 6th lab
console.log(pick.toUpperCase());`,
  "tatCo": `{ "extends": "../../../tsconfig.json", "compilerOptions": { "noUncheckedIndexedAccess": false }, "include": ["."] }`,
  "nonNull": `const labs = ['BE-201', 'BE-202', 'AL-305'];

const pick = labs[5]!;   // "!": trust me, not undefined
console.log(pick.toUpperCase());`,
  "anyTs": `const raw: any = JSON.parse('{"seats":"31"}');

const seats: number = raw.seats;   // any: no check
console.log('seats + 1 =', seats + 1);`,
  "slot": `import { parseTime } from '../../../src/rules/time.ts';
import { STEP, OPEN, CLOSE, MAX_MINUTES, type SlotResult } from '../../../src/rules/booking.ts';

// A copy of checkSlot with ONE character changed: "<" instead of "<=".
export function checkSlot(start: string, end: string): SlotResult {
  const s = parseTime(start);
  const e = parseTime(end);
  if (s % STEP !== 0 || e % STEP !== 0) return { ok: false, code: 'OFF_GRID' };
  if (e < s) return { ok: false, code: 'END_BEFORE_START' };
  if (s < OPEN || e > CLOSE) return { ok: false, code: 'OUTSIDE_HOURS' };
  if (e - s > MAX_MINUTES) return { ok: false, code: 'TOO_LONG' };
  return { ok: true, minutes: e - s };
}`,
  "slotTest": `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkSlot } from './slot.ts';

test('08:00–10:00 is a 120-minute slot', () => {
  assert.deepEqual(checkSlot('08:00', '10:00'), { ok: true, minutes: 120 });
});

test('09:00–09:00 is not a slot (end must be after start)', () => {
  assert.deepEqual(checkSlot('09:00', '09:00'), { ok: false, code: 'END_BEFORE_START' });
});`,
  "thGuard": `import { usageRate } from '../../../src/rules/booking.ts';

// Practice solution: prove that unknown data is a list of { minutes: number }.
export function isMinutesList(x: unknown): x is { minutes: number }[] {
  return (
    Array.isArray(x) &&
    x.every((b: unknown) =>
      typeof b === 'object' && b !== null &&
      'minutes' in b && typeof b.minutes === 'number' && b.minutes > 0)
  );
}

export function rateFromBody(body: string): number | 'INVALID_BODY' {
  const data: unknown = JSON.parse(body);
  if (!isMinutesList(data)) return 'INVALID_BODY';
  return usageRate(data);
}`,
  "thRun": `import { rateFromBody } from './minutes-guard.ts';

console.log(rateFromBody('[{"minutes":120},{"minutes":60}]'));
console.log(rateFromBody('[{"minutes":120},{"minutes":"60"}]'));
console.log(rateFromBody('[{"minute":120}]'));
console.log(rateFromBody('{"minutes":120}'));`,
  "noGuard": `import { usageRate } from '../../../src/rules/booking.ts';

// Before the practice: JSON.parse returns any, so this compiles.
const body = '[{"minutes":120},{"minutes":"1h"}]';
console.log(usageRate(JSON.parse(body)));`,
};
export const OUT = {
  '11-hop-dong': `$ npx tsc -p demo1/ts-01-2/hop-dong
demo1/ts-01-2/hop-dong/form.ts(4,52): error TS2554: Expected 1 arguments, but got 2.
demo1/ts-01-2/hop-dong/report.ts(5,59): error TS2554: Expected 1 arguments, but got 2.`,
  '21-bien-tsc': `$ npx tsc -p demo1/ts-01-2/bien`,
  '22-bien-run': `$ node demo1/ts-01-2/bien/run.ts
correct  → {"lab":"BE-201","start":"08:00","end":"10:00","minutes":120,"status":"CONFIRMED"}
seats="31" → RangeError: seats must be a positive integer, got 31
lecturer → {"lab":"BE-201","start":"08:00","end":"10:00","minutes":120,"status":"PENDING"}`,
  '23-bien-as-run': `$ node demo1/ts-01-2/bien/run-as.ts
correct  → {"lab":"BE-201","start":"08:00","end":"10:00","minutes":120,"status":"CONFIRMED"}
seats="31" → RangeError: seats must be a positive integer, got 31
lecturer → {"lab":"BE-201","start":"08:00","end":"10:00","minutes":120,"status":"PENDING"}`,
  '24-bien-sai': `$ npx tsc -p demo1/ts-01-2/bien-sai
demo1/ts-01-2/bien-sai/handler.ts(5,24): error TS2345: Argument of type 'unknown' is not assignable to parameter of type 'BookingInput'.`,
  '31-chi-so-on': `$ npx tsc -p demo1/ts-01-2/chi-so
demo1/ts-01-2/chi-so/labs.ts(4,13): error TS18048: 'pick' is possibly 'undefined'.`,
  '32-chi-so-off': `$ npx tsc -p demo1/ts-01-2/chi-so/tsconfig.tat.json`,
  '33-chi-so-run': `$ node demo1/ts-01-2/chi-so/labs.ts
file://…/labflow-ts/demo1/ts-01-2/chi-so/labs.ts:4
console.log(pick.toUpperCase());
                 ^

TypeError: Cannot read properties of undefined (reading 'toUpperCase')
    at file://…/labflow-ts/demo1/ts-01-2/chi-so/labs.ts:4:18
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
  '34-lo-hong-tsc': `$ npx tsc -p demo1/ts-01-2/lo-hong`,
  '35-non-null-run': `$ node demo1/ts-01-2/lo-hong/non-null.ts
file://…/labflow-ts/demo1/ts-01-2/lo-hong/non-null.ts:4
console.log(pick.toUpperCase());
                 ^

TypeError: Cannot read properties of undefined (reading 'toUpperCase')
    at file://…/labflow-ts/demo1/ts-01-2/lo-hong/non-null.ts:4:18
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
  '36-any-run': `$ node demo1/ts-01-2/lo-hong/any.ts
seats + 1 = 311`,
  '41-logic-tsc': `$ npx tsc -p demo1/ts-01-2/logic`,
  '42-logic-test': `$ node --test --test-reporter=spec demo1/ts-01-2/logic/slot.test.ts
✔ 08:00–10:00 is a 120-minute slot (0.853583ms)
✖ 09:00–09:00 is not a slot (end must be after start) (0.711042ms)
ℹ tests 2
ℹ suites 0
ℹ pass 1
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 76.718625

✖ failing tests:

test at demo1/ts-01-2/logic/slot.test.ts:9:1
✖ 09:00–09:00 is not a slot (end must be after start) (0.711042ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:
  + actual - expected
  
    {
  +   minutes: 0,
  +   ok: true
  -   code: 'END_BEFORE_START',
  -   ok: false
    }
  
      at TestContext.<anonymous> (file://…/labflow-ts/demo1/ts-01-2/logic/slot.test.ts:10:10)
      at Test.runInAsyncScope (node:async_hooks:214:14)
      at Test.run (node:internal/test_runner/test:1047:25)
      at Test.processPendingSubtests (node:internal/test_runner/test:744:18)
      at Test.postRun (node:internal/test_runner/test:1173:19)
      at Test.run (node:internal/test_runner/test:1101:12)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:296:3) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: { ok: true, minutes: 0 },
    expected: { ok: false, code: 'END_BEFORE_START' },
    operator: 'deepStrictEqual',
    diff: 'simple'
  }`,
  '51-safe-run': `$ node demo1/ts-01-2/bien/run-safe.ts
correct  → {"lab":"BE-201","start":"08:00","end":"10:00","minutes":120,"status":"CONFIRMED"}
seats="31" → {"error":"INVALID_BODY"}
lecturer → {"error":"INVALID_BODY"}`,
  '53-thieu-run': `$ node demo1/ts-01-2/bien/run-thieu.ts
correct  → {"lab":"BE-201","start":"08:00","end":"10:00","minutes":120,"status":"CONFIRMED"}
seats="31" → INVALID_BODY
lecturer → {"lab":"BE-201","start":"08:00","end":"10:00","minutes":120,"status":"PENDING"}`,
  '61-th-no-guard': `$ node demo1/ts-01-2/thuc-hanh/no-guard.ts
NaN`,
  '62-th-tsc': `$ npx tsc -p demo1/ts-01-2/thuc-hanh`,
  '63-th-run': `$ node demo1/ts-01-2/thuc-hanh/run.ts
0.21428571428571427
INVALID_BODY
INVALID_BODY
INVALID_BODY`,
};
