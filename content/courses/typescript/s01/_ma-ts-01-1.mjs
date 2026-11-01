/**
 * _ma (bài 1.1) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "timeJs": `// Convert between "HH:MM" and minutes since 00:00.
export function parseTime(text) {
  const m = /^([0-9]{2}):([0-9]{2})$/.exec(text);
  if (!m) throw new TypeError('Invalid time "' + text + '", expected HH:MM');
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) throw new RangeError('Time out of range: ' + text);
  return h * 60 + min;
}

export function formatTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
}`,
  "bookingJs": `import { parseTime } from './time.js';

export const OPEN = 7 * 60;          // 07:00
export const CLOSE = 21 * 60;        // 21:00
export const STEP = 30;              // BR-04: 30-minute grid
export const MAX_MINUTES = 240;      // Lite-1: at most 4 hours
export const MAX_DAYS_AHEAD = 14;    // BR-05: at most 14 days ahead
export const APPROVAL_SEATS = 30;    // BR-06: more than 30 seats needs approval

export function checkSlot(start, end) {
  const s = parseTime(start);
  const e = parseTime(end);
  if (s % STEP !== 0 || e % STEP !== 0) return { ok: false, code: 'OFF_GRID' };
  if (e <= s) return { ok: false, code: 'END_BEFORE_START' };
  if (s < OPEN || e > CLOSE) return { ok: false, code: 'OUTSIDE_HOURS' };
  if (e - s > MAX_MINUTES) return { ok: false, code: 'TOO_LONG' };
  return { ok: true, minutes: e - s };
}

export function isWithinBookingWindow(daysAhead) {
  return Number.isInteger(daysAhead) && daysAhead >= 0 && daysAhead <= MAX_DAYS_AHEAD;
}

export function needsApproval({ seats, role }) {
  if (!Number.isInteger(seats) || seats < 1) {
    throw new RangeError('seats must be a positive integer, got ' + seats);
  }
  if (role === 'LECTURER' || role === 'ADMIN') return false;
  return seats > APPROVAL_SEATS;
}

export function createBooking({ lab, seats, role, start, end }) {
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
export function usageRate(bookings) {
  let rate = 0;
  for (const b of bookings) rate += b.minutes / (CLOSE - OPEN);
  return rate;
}`,
  "typoJs": `// js/booking.js's usageRate with one typo: b.minute instead of b.minutes.
const OPEN = 7 * 60;
const CLOSE = 21 * 60;

export function usageRate(bookings) {
  let rate = 0;
  for (const b of bookings) rate += b.minute / (CLOSE - OPEN);   // typo
  return rate;
}

console.log('usage today:', usageRate([{ lab: 'BE-201', minutes: 120 }, { lab: 'BE-201', minutes: 90 }]));`,
  "seatJs": `// Bug 2 — the wrong shape: "seat" instead of "seats".
import { needsApproval } from '../../js/booking.js';

console.log('approval needed?', needsApproval({ seat: 31, role: 'STUDENT' }));`,
  "shapeJs": `// Bug 2 — three wrong calls, each wrapped so we can see what JavaScript does with it.
import { checkSlot, needsApproval } from '../../js/booking.js';

function attempt(label, call) {
  try {
    console.log(label, '→ returns', JSON.stringify(call()));
  } catch (e) {
    console.log(label, '→ throws', e.name + ':', e.message);
  }
}

attempt("needsApproval({ seat: 31, role: 'STUDENT' })", () => needsApproval({ seat: 31, role: 'STUDENT' }));
attempt('checkSlot(480, 600)', () => checkSlot(480, 600));
attempt("checkSlot('08:00')", () => checkSlot('08:00'));`,
  "roleJs": `// Bug 3 — the wrong value: a lower-case role.
import { needsApproval } from '../../js/booking.js';

console.log("LECTURER, 31 seats → needs approval?", needsApproval({ seats: 31, role: 'LECTURER' }));
console.log("lecturer, 31 seats → needs approval?", needsApproval({ seats: 31, role: 'lecturer' }));`,
  "typoTs": `// The same typo, but the parameter now has a type.
const OPEN = 7 * 60;
const CLOSE = 21 * 60;

export function usageRate(bookings: readonly { minutes: number }[]): number {
  let rate = 0;
  for (const b of bookings) rate += b.minute / (CLOSE - OPEN);   // typo
  return rate;
}`,
  "callsTs": `// Bugs 2 and 3, calling the TYPED rules in src/rules/booking.ts.
import { checkSlot, needsApproval } from '../../../src/rules/booking.ts';

needsApproval({ seat: 31, role: 'STUDENT' });
checkSlot(480, 600);
checkSlot('08:00');
needsApproval({ seats: 31, role: 'lecturer' });`,
  "bookingTs": `import { parseTime } from './time.ts';

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
  "geTs": `// A one-character slip: >= instead of >. BR-06 says "MORE than 30 seats needs approval".
export const APPROVAL_SEATS = 30;

export function needsApproval({ seats, role }: { seats: number; role: 'STUDENT' | 'LECTURER' | 'ADMIN' }): boolean {
  if (!Number.isInteger(seats) || seats < 1) throw new RangeError('seats must be a positive integer, got ' + seats);
  if (role === 'LECTURER' || role === 'ADMIN') return false;
  return seats >= APPROVAL_SEATS;   // should be >
}`,
  "geTest": `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { needsApproval } from './approval.ts';

test('31 student seats need approval (BR-06)', () => {
  assert.equal(needsApproval({ seats: 31, role: 'STUDENT' }), true);
});

test('exactly 30 student seats do NOT need approval (BR-06)', () => {
  assert.equal(needsApproval({ seats: 30, role: 'STUDENT' }), false);
});`,
  "prStart": `// Practice 1.1 — starting point. The parameter is "any", so the typo below goes unnoticed.
const OPEN = 7 * 60;
const CLOSE = 21 * 60;

export function usageRate(bookings: any): number {
  let rate = 0;
  for (const b of bookings) rate += b.minute / (CLOSE - OPEN);
  return rate;
}

console.log(usageRate([{ minutes: 420 }]));`,
  "prStep1": `// Practice 1.1 — step 1 only: the type is added, the typo is still there.
const OPEN = 7 * 60;
const CLOSE = 21 * 60;

export function usageRate(bookings: readonly { minutes: number }[]): number {
  let rate = 0;
  for (const b of bookings) rate += b.minute / (CLOSE - OPEN);
  return rate;
}`,
  "prSol": `// Practice 1.1 — solution. Step 1: give the parameter a real type. Step 2: tsc points at the typo; fix it.
const OPEN = 7 * 60;
const CLOSE = 21 * 60;

export function usageRate(bookings: readonly { minutes: number }[]): number {
  let rate = 0;
  for (const b of bookings) rate += b.minutes / (CLOSE - OPEN);
  return rate;
}

console.log(usageRate([{ minutes: 420 }]));`,
  "demoTsconfig": `{ "extends": "../../../tsconfig.json", "include": ["."] }`,
};
export const OUT = {
  '11-typo-js': `$ node demo1/ts-01-1/usage-typo.js
usage today: NaN`,
  '12-seat-js': `$ node demo1/ts-01-1/seat.js
file://…/labflow-ts/js/booking.js:26
    throw new RangeError('seats must be a positive integer, got ' + seats);
          ^

RangeError: seats must be a positive integer, got undefined
    at needsApproval (file://…/labflow-ts/js/booking.js:26:11)
    at file://…/labflow-ts/demo1/ts-01-1/seat.js:4:33
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
  '13-shape-js': `$ node demo1/ts-01-1/shape.js
needsApproval({ seat: 31, role: 'STUDENT' }) → throws RangeError: seats must be a positive integer, got undefined
checkSlot(480, 600) → throws TypeError: Invalid time "480", expected HH:MM
checkSlot('08:00') → throws TypeError: Invalid time "undefined", expected HH:MM`,
  '14-role-js': `$ node demo1/ts-01-1/role.js
LECTURER, 31 seats → needs approval? false
lecturer, 31 seats → needs approval? true`,
  '15-tsc': `$ npx tsc -p demo1/ts-01-1/ts
demo1/ts-01-1/ts/calls.ts(4,17): error TS2561: Object literal may only specify known properties, but 'seat' does not exist in type '{ seats: number; role: Role; }'. Did you mean to write 'seats'?
demo1/ts-01-1/ts/calls.ts(5,11): error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.
demo1/ts-01-1/ts/calls.ts(6,1): error TS2554: Expected 2 arguments, but got 1.
demo1/ts-01-1/ts/calls.ts(7,28): error TS2820: Type '"lecturer"' is not assignable to type 'Role'. Did you mean '"LECTURER"'?
demo1/ts-01-1/ts/usage-typo.ts(7,39): error TS2551: Property 'minute' does not exist on type '{ minutes: number; }'. Did you mean 'minutes'?`,
  '16-ge-tsc': `$ npx tsc -p demo1/ts-01-1/ge`,
  '17-ge-test': `$ node --test --test-reporter=spec demo1/ts-01-1/ge/approval.test.ts
✔ 31 student seats need approval (BR-06) (1.3265ms)
✖ exactly 30 student seats do NOT need approval (BR-06) (0.484417ms)
ℹ tests 2
ℹ suites 0
ℹ pass 1
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 82.085209

✖ failing tests:

test at demo1/ts-01-1/ge/approval.test.ts:9:1
✖ exactly 30 student seats do NOT need approval (BR-06) (0.484417ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
  
  true !== false
  
      at TestContext.<anonymous> (file://…/labflow-ts/demo1/ts-01-1/ge/approval.test.ts:10:10)
      at Test.runInAsyncScope (node:async_hooks:214:14)
      at Test.run (node:internal/test_runner/test:1047:25)
      at Test.processPendingSubtests (node:internal/test_runner/test:744:18)
      at Test.postRun (node:internal/test_runner/test:1173:19)
      at Test.run (node:internal/test_runner/test:1101:12)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:296:3) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: true,
    expected: false,
    operator: 'strictEqual',
    diff: 'simple'
  }`,
  '18-pr-start': `$ npx tsc -p demo1/ts-01-1/practice/start && node demo1/ts-01-1/practice/start/usage.ts
NaN`,
  '19-pr-step1': `$ npx tsc -p demo1/ts-01-1/practice/step1
demo1/ts-01-1/practice/step1/usage.ts(7,39): error TS2551: Property 'minute' does not exist on type '{ minutes: number; }'. Did you mean 'minutes'?`,
  '20-pr-sol': `$ npx tsc -p demo1/ts-01-1/practice/solution && node demo1/ts-01-1/practice/solution/usage.ts
0.5`,
  '21-time-a': `$ time npx tsc -p demo1/ts-01-1/ts
demo1/ts-01-1/ts/calls.ts(4,17): error TS2561: Object literal may only specify known properties, but 'seat' does not exist in type '{ seats: number; role: Role; }'. Did you mean to write 'seats'?
demo1/ts-01-1/ts/calls.ts(5,11): error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.
demo1/ts-01-1/ts/calls.ts(6,1): error TS2554: Expected 2 arguments, but got 1.
demo1/ts-01-1/ts/calls.ts(7,28): error TS2820: Type '"lecturer"' is not assignable to type 'Role'. Did you mean '"LECTURER"'?
demo1/ts-01-1/ts/usage-typo.ts(7,39): error TS2551: Property 'minute' does not exist on type '{ minutes: number; }'. Did you mean 'minutes'?

real	0m0.329s
user	0m0.319s
sys	0m0.132s`,
  '21-time-b': `$ time npx tsc -p demo1/ts-01-1/ts
demo1/ts-01-1/ts/calls.ts(4,17): error TS2561: Object literal may only specify known properties, but 'seat' does not exist in type '{ seats: number; role: Role; }'. Did you mean to write 'seats'?
demo1/ts-01-1/ts/calls.ts(5,11): error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.
demo1/ts-01-1/ts/calls.ts(6,1): error TS2554: Expected 2 arguments, but got 1.
demo1/ts-01-1/ts/calls.ts(7,28): error TS2820: Type '"lecturer"' is not assignable to type 'Role'. Did you mean '"LECTURER"'?
demo1/ts-01-1/ts/usage-typo.ts(7,39): error TS2551: Property 'minute' does not exist on type '{ minutes: number; }'. Did you mean 'minutes'?

real	0m0.304s
user	0m0.336s
sys	0m0.106s`,
};
