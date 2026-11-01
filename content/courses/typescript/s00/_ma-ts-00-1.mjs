/**
 * _ma (bài 0.1) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
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
  "appJs": `// One working day at LabFlow, in plain JavaScript (uses the real rules in js/booking.js).
// Four bugs are hidden below. Run: node demo0/ts-00-1/app.js small   (or: big)
import { needsApproval, createBooking, OPEN, CLOSE } from '../../js/booking.js';

const SMALL = [
  { lab: 'BE-201', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' },
  { lab: 'BE-201', seats: 35, role: 'lecturer', start: '13:00', end: '15:00' },
];
const BIG = [...SMALL, { lab: 'BE-305', seats: 40, role: 'STUDENT', start: '15:00', end: '17:00' }];
const requests = process.argv[2] === 'big' ? BIG : SMALL;

// Bug 1: a typo — the field is called "minutes"
function usage(bookings) {
  let rate = 0;
  for (const b of bookings) rate += b.minute / (CLOSE - OPEN);
  return rate;
}

const bookings = [];
for (const r of requests) {
  // Bug 2: the big-student-class branch spells the property "seat"
  const wait = r.role === 'STUDENT' && r.seats > 30
    ? needsApproval({ seat: r.seats, role: r.role })
    : needsApproval({ seats: r.seats, role: r.role });
  // Bug 3 lives in the data above: role 'lecturer' should be 'LECTURER'
  console.log(r.lab, r.start, r.role, '→ needs approval:', wait);
  bookings.push(createBooking(r));
}

// Bug 4: there is no status called APPROVED (only PENDING and CONFIRMED)
const approved = bookings.filter((b) => b.status === 'APPROVED').length;
console.log('usage today:', usage(bookings));
console.log('approved bookings:', approved);`,
  "appTs": `// The SAME day and the SAME four bugs — but the rules now carry types (src/rules/booking.ts).
// Check: npx tsc -p demo0/ts-00-1    Run anyway: node demo0/ts-00-1/app.ts small
import { needsApproval, createBooking, OPEN, CLOSE } from '../../src/rules/booking.ts';
import type { Booking, BookingInput } from '../../src/rules/booking.ts';

const SMALL: BookingInput[] = [
  { lab: 'BE-201', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' },
  { lab: 'BE-201', seats: 35, role: 'lecturer', start: '13:00', end: '15:00' },
];
const BIG: BookingInput[] = [...SMALL, { lab: 'BE-305', seats: 40, role: 'STUDENT', start: '15:00', end: '17:00' }];
const requests = process.argv[2] === 'big' ? BIG : SMALL;

// Bug 1: a typo — the field is called "minutes"
function usage(bookings: Booking[]): number {
  let rate = 0;
  for (const b of bookings) rate += b.minute / (CLOSE - OPEN);
  return rate;
}

const bookings: Booking[] = [];
for (const r of requests) {
  // Bug 2: the big-student-class branch spells the property "seat"
  const wait = r.role === 'STUDENT' && r.seats > 30
    ? needsApproval({ seat: r.seats, role: r.role })
    : needsApproval({ seats: r.seats, role: r.role });
  // Bug 3 lives in the data above: role 'lecturer' should be 'LECTURER'
  console.log(r.lab, r.start, r.role, '→ needs approval:', wait);
  bookings.push(createBooking(r));
}

// Bug 4: there is no status called APPROVED (only PENDING and CONFIRMED)
const approved = bookings.filter((b) => b.status === 'APPROVED').length;
console.log('usage today:', usage(bookings));
console.log('approved bookings:', approved);`,
  "demoTsconfig": `{
  "extends": "../../tsconfig.json",
  "include": ["app.ts"]
}`,
  "doiTen": `import { parseTime } from './time.ts';

export const OPEN = 7 * 60;          // 07:00
export const CLOSE = 21 * 60;        // 21:00
export const STEP = 30;              // BR-04: 30-minute grid
export const MAX_MINUTES = 240;      // Lite-1: at most 4 hours
export const MAX_DAYS_AHEAD = 14;    // BR-05: at most 14 days ahead
export const APPROVAL_SEATS = 30;    // BR-06: more than 30 seats needs approval

export type Role = 'STUDENT' | 'LECTURER' | 'ADMIN';
export type SlotCode = 'OFF_GRID' | 'END_BEFORE_START' | 'OUTSIDE_HOURS' | 'TOO_LONG';
export type SlotResult = { ok: true; minutes: number } | { ok: false; code: SlotCode };

export type BookingInput = { lab: string; seatCount: number; role: Role; start: string; end: string };
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

export function needsApproval({ seats, role }: { seatCount: number; role: Role }): boolean {
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
  "pkg": `{
  "name": "labflow-ts",
  "version": "1.0.0",
  "private": true,
  "description": "LabFlow TS — the shared project of the CuongThai TypeScript course (LabFlow Lite rules, converted to TypeScript).",
  "type": "module",
  "scripts": {
    "typecheck": "tsc --noEmit -p tsconfig.json",
    "test": "node --test --test-reporter=spec \\"src/**/*.test.ts\\"",
    "check": "npm run typecheck && npm test",
    "lab1": "node scripts/cham-lab-1.mjs"
  },
  "engines": {
    "node": ">=22.18"
  },
  "devDependencies": {
    "@types/node": "22.20.5",
    "typescript": "7.0.2"
  }
}`,
  "tsconfig": `{
  // LabFlow TS — the course's standard config (Section 0.3). Node 22 runs .ts files itself (type stripping),
  // so tsc only CHECKS (noEmit) and imports keep their .ts extension.
  "compilerOptions": {
    "target": "es2024",
    "module": "nodenext",
    "types": ["node"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "allowImportingTsExtensions": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}`,
};
export const OUT = {
  '01-js-small': `$ node demo0/ts-00-1/app.js small
BE-201 08:00 STUDENT → needs approval: false
BE-201 13:00 lecturer → needs approval: true
usage today: NaN
approved bookings: 0`,
  '02-js-big': `$ node demo0/ts-00-1/app.js big
BE-201 08:00 STUDENT → needs approval: false
BE-201 13:00 lecturer → needs approval: true
file://…/labflow-ts/js/booking.js:26
    throw new RangeError('seats must be a positive integer, got ' + seats);
          ^

RangeError: seats must be a positive integer, got undefined
    at needsApproval (file://…/labflow-ts/js/booking.js:26:11)
    at file://…/labflow-ts/demo0/ts-00-1/app.js:23:7
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
  '03-tsc': `$ npx tsc -p demo0/ts-00-1
demo0/ts-00-1/app.ts(8,31): error TS2820: Type '"lecturer"' is not assignable to type 'Role'. Did you mean '"LECTURER"'?
demo0/ts-00-1/app.ts(16,39): error TS2551: Property 'minute' does not exist on type 'Booking'. Did you mean 'minutes'?
demo0/ts-00-1/app.ts(24,23): error TS2561: Object literal may only specify known properties, but 'seat' does not exist in type '{ seats: number; role: Role; }'. Did you mean to write 'seats'?
demo0/ts-00-1/app.ts(32,41): error TS2367: This comparison appears to be unintentional because the types '"CONFIRMED" | "PENDING"' and '"APPROVED"' have no overlap.`,
  '04-ts-run': `$ node demo0/ts-00-1/app.ts small
BE-201 08:00 STUDENT → needs approval: false
BE-201 13:00 lecturer → needs approval: true
usage today: NaN
approved bookings: 0`,
  '05-doi-ten': `$ npx tsc -p demo0/ts-00-1/doi-ten
demo0/ts-00-1/doi-ten/booking.test.ts(14,32): error TS2353: Object literal may only specify known properties, and 'seats' does not exist in type '{ seatCount: number; role: Role; }'.
demo0/ts-00-1/doi-ten/booking.test.ts(18,32): error TS2353: Object literal may only specify known properties, and 'seats' does not exist in type '{ seatCount: number; role: Role; }'.
demo0/ts-00-1/doi-ten/booking.test.ts(22,44): error TS2353: Object literal may only specify known properties, and 'seats' does not exist in type 'BookingInput'.
demo0/ts-00-1/doi-ten/booking.ts(37,33): error TS2339: Property 'seats' does not exist on type '{ seatCount: number; role: Role; }'.
demo0/ts-00-1/doi-ten/booking.ts(45,38): error TS2339: Property 'seats' does not exist on type 'BookingInput'.
demo0/ts-00-1/doi-ten/booking.ts(53,29): error TS2353: Object literal may only specify known properties, and 'seats' does not exist in type '{ seatCount: number; role: Role; }'.`,
  '06-doi-ten-js-load': `$ node -e "import('./demo0/ts-00-1/doi-ten-js/booking.js').then((m) => console.log('module loaded:', Object.keys(m).length, 'exports'))"
module loaded: 11 exports`,
  '07-doi-ten-js-call': `$ node -e "import('./demo0/ts-00-1/doi-ten-js/booking.js').then((m) => console.log(m.createBooking({ lab: 'BE-201', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' })))"
file://…/labflow-ts/demo0/ts-00-1/doi-ten-js/booking.js:27
    throw new RangeError('seats must be a positive integer, got ' + seats);
          ^

RangeError: seats must be a positive integer, got undefined
    at needsApproval (file://…/labflow-ts/demo0/ts-00-1/doi-ten-js/booking.js:27:11)
    at Module.createBooking (file://…/labflow-ts/demo0/ts-00-1/doi-ten-js/booking.js:41:13)
    at [eval]:1:75

Node.js v22.23.3`,
  '08-time-npx': `$ for i in 1 2; do /usr/bin/time -p npx tsc -p demo0/ts-00-1 > /dev/null; done
real 0.31
user 0.32
sys 0.12
real 0.33
user 0.32
sys 0.12`,
  '09-time-bin': `$ for i in 1 2; do /usr/bin/time -p ./node_modules/.bin/tsc -p demo0/ts-00-1 > /dev/null; done
real 0.07
user 0.13
sys 0.03
real 0.08
user 0.15
sys 0.04`,
  '11-npm-ci': `$ npm ci

added 4 packages, and audited 5 packages in 3s

found 0 vulnerabilities
npm notice
npm notice New major version of npm available! 10.9.9 -> 12.2.1
npm notice Changelog: https://github.com/npm/cli/releases/tag/v12.2.1
npm notice To update run: npm install -g npm@12.2.1
npm notice`,
  '12-typecheck': `$ npm run typecheck

> labflow-ts@1.0.0 typecheck
> tsc --noEmit -p tsconfig.json`,
  '13-test': `$ npm test

> labflow-ts@1.0.0 test
> node --test --test-reporter=spec "src/**/*.test.ts"

✔ 08:00–10:00 is a 120-minute slot (1.047042ms)
✔ 08:15 is off the 30-minute grid (0.083334ms)
✔ a student needs approval above 30 seats (BR-06) (0.083125ms)
✔ a lecturer never needs approval (0.049584ms)
✔ createBooking returns a PENDING 31-seat student booking (0.152625ms)
✔ two 7-hour days fill the lab once (0.0685ms)
✔ 07:00 is minute 420 (0.514167ms)
✔ rejects "7:00" (needs two digits) (0.224959ms)
✔ rejects 24:00 (0.063708ms)
✔ formats minute 450 as 07:30 (0.06925ms)
ℹ tests 10
ℹ suites 0
ℹ pass 10
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 80.805125`,
  '14-lab1': `$ npm run lab1

> labflow-ts@1.0.0 lab1
> node scripts/cham-lab-1.mjs

✗ A  your src/ compiles (strict) — 0/2
    src/booking.ts(10,27): error TS7006: Parameter 'start' implicitly has an 'any' type.
    src/booking.ts(10,34): error TS7006: Parameter 'end' implicitly has an 'any' type.
    src/booking.ts(20,39): error TS7006: Parameter 'daysAhead' implicitly has an 'any' type.
    src/booking.ts(24,33): error TS7031: Binding element 'seats' implicitly has an 'any' type.
✗ B  correct calls still compile — 0/1
    kiem/phai-dung.ts(9,9): error TS2322: Type 'number | undefined' is not assignable to type 'number'.
    kiem/phai-dung.ts(14,7): error TS2322: Type 'string' is not assignable to type '"CONFIRMED" | "PENDING"'.
✓ C  no any / no @ts- directives — 1/1
✗ D  behaviour tests pass (0/15) — 0/2
    # Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/labflow-ts/.cham-lab1/src/time.js' imported from …/labflow-ts/.cham-lab1/src/booking.ts
      error: 'test failed'
    ✗ S1 a number is not "HH:MM" — expected TS2345, got no error
    ✗ S2 formatTime takes minutes — expected TS2345, got no error
    ✓ S3 the end time is missing — expected TS2554, got TS2554
    ✓ S4 typo: seat instead of seats — expected TS2561, got TS2561
    ✗ S5 roles are upper-case — expected TS2820, got no error
    ✓ S6 typo: minute instead of minutes — expected TS2551, got TS2551
    ✗ S7 there is no APPROVED status — expected TS2367, got no error
    ✗ S8 typo inside a list of bookings — expected TS2561, got no error
✗ E  wrong calls refused (3/8) — 1.5/4

Score: 2.5/10 — NOT YET (pass mark 7)`,
  '15-cay': `$ find . -path ./node_modules -prune -o -type f -print | sort
./js/booking.js
./js/time.js
./lab1/kiem/phai-dung.ts
./lab1/kiem/sai.ts
./lab1/src/booking.ts
./lab1/src/time.ts
./lab1/test/rules.test.ts
./lab1/tsconfig.json
./lab1/vua/booking.ts
./lab1/vua/time.ts
./lab1/yeu/booking.ts
./lab1/yeu/time.ts
./package-lock.json
./package.json
./scripts/cham-lab-1.mjs
./src/rules/booking.test.ts
./src/rules/booking.ts
./src/rules/time.test.ts
./src/rules/time.ts
./tsconfig.json`,
};
