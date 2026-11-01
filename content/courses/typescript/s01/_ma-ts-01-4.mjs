/**
 * _ma (bài 1.4) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "anyOff": `// Every line below is a bug. With "any", tsc reports none of them.
import { createBooking } from '../../../src/rules/booking.ts';

const x: any = 'hello';
x.foo.bar.baz();                 // calling methods that do not exist
const n: number = x;             // a string stored in a number
const b = createBooking(x);      // a string passed where a booking input belongs
console.log(n + 1, b.status);`,
  "contagion": `// A request body arrives as text. JSON.parse returns any — and any spreads.
import { createBooking, usageRate } from '../../../src/rules/booking.ts';

const body = '{"lab":"BE-201","seats":31,"role":"lecturer","start":"08:00","end":"10:00"}';
const input = JSON.parse(body);          // input: any

const booking = createBooking(input);   // no error: any fits every parameter
const seatsText: string = input.seats;   // no error: any fits every variable
console.log(booking.status, typeof seatsText);

const rate = usageRate(input.history);   // no error: there is no "history" field
console.log(rate);`,
  "load": `// Two loaders. Hover them — or ask tsc to print their declarations.
export function loadBookings(text: string) {
  return JSON.parse(text);               // returns any, so the function does too
}

export function loadBookingsSafe(text: string): unknown {
  return JSON.parse(text);               // callers must check before use
}

const rows = loadBookings('[{"minutes":60}]');
export const total = rows.reduce((sum: number, r: { minutes: number }) => sum + r.minutes, 0);
export const first = rows[0].minute;     // typo, not caught: rows is any`,
  "unknown1": `// The same body, but we admit we do not know its type yet.
const body = '{"lab":"BE-201","seats":31,"role":"STUDENT","start":"08:00","end":"10:00"}';
const data: unknown = JSON.parse(body);

console.log(data.seats);          // not allowed: data is unknown
const seats: number = data;       // not allowed either`,
  "unknown2": `// unknown + narrowing: every access is proven first.
const body = '{"lab":"BE-201","seats":31,"role":"STUDENT","start":"08:00","end":"10:00"}';
const data: unknown = JSON.parse(body);

if (typeof data === 'object' && data !== null && 'seats' in data) {
  const seats = data.seats;              // seats: unknown — still not a number
  if (typeof seats === 'number') {
    console.log('seats + 1 =', seats + 1); // seats: number here
  }
}
if (Array.isArray(data)) {
  console.log('a list of', data.length);  // data: any[] here
} else {
  console.log('not a list');
}`,
  "unknown3": `// A leak to know about: Array.isArray turns unknown into any[].
const data: unknown = JSON.parse('[{"minute":60}]');

if (Array.isArray(data)) {
  const total: string = data[0].minutes;   // no error — the elements are any
  console.log(total);
}`,
  "implicit": `// Implicit any: tsc refuses to guess (strict ⇒ noImplicitAny).
export function minutesLabel(minutes) {
  return minutes + ' min';
}`,
  "explicit": `// Explicit any: you told tsc to stop checking — it obeys.
export function minutesLabel2(minutes: any) {
  return minutes + ' min';
}
minutesLabel2({ start: '08:00' });   // nonsense, and no error`,
  "use": `// Plain JavaScript that calls LabFlow's rules — three wrong calls.
import { checkSlot, needsApproval, usageRate } from './booking.js';

console.log(checkSlot(480, 600));                       // numbers, not "HH:MM"
console.log(needsApproval({ seat: 31, role: 'STUDENT' })); // typo: seat
console.log(usageRate([{ minute: 60 }]));                // typo: minute`,
  "checkjsConfig": `{
  "extends": "../../../tsconfig.json",
  "compilerOptions": { "allowJs": true, "checkJs": true },
  "include": ["."]
}`,
  "jsdocBooking": `import { parseTime } from './time.js';

/** @typedef {'STUDENT' | 'LECTURER' | 'ADMIN'} Role */

export const OPEN = 7 * 60;          // 07:00
export const CLOSE = 21 * 60;        // 21:00
export const STEP = 30;              // BR-04: 30-minute grid
export const MAX_MINUTES = 240;      // Lite-1: at most 4 hours
export const MAX_DAYS_AHEAD = 14;    // BR-05: at most 14 days ahead
export const APPROVAL_SEATS = 30;    // BR-06: more than 30 seats needs approval

/** @param {string} start  @param {string} end */
export function checkSlot(start, end) {
  const s = parseTime(start);
  const e = parseTime(end);
  if (s % STEP !== 0 || e % STEP !== 0) return { ok: false, code: 'OFF_GRID' };
  if (e <= s) return { ok: false, code: 'END_BEFORE_START' };
  if (s < OPEN || e > CLOSE) return { ok: false, code: 'OUTSIDE_HOURS' };
  if (e - s > MAX_MINUTES) return { ok: false, code: 'TOO_LONG' };
  return { ok: true, minutes: e - s };
}

/** @param {number} daysAhead */
export function isWithinBookingWindow(daysAhead) {
  return Number.isInteger(daysAhead) && daysAhead >= 0 && daysAhead <= MAX_DAYS_AHEAD;
}

/** @param {{ seats: number, role: Role }} input */
export function needsApproval({ seats, role }) {
  if (!Number.isInteger(seats) || seats < 1) {
    throw new RangeError('seats must be a positive integer, got ' + seats);
  }
  if (role === 'LECTURER' || role === 'ADMIN') return false;
  return seats > APPROVAL_SEATS;
}

/** @param {{ lab: string, seats: number, role: Role, start: string, end: string }} input */
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
/** @param {{ minutes: number }[]} bookings */
export function usageRate(bookings) {
  let rate = 0;
  for (const b of bookings) rate += b.minutes / (CLOSE - OPEN);
  return rate;
}`,
  "jsdocTime": `// Convert between "HH:MM" and minutes since 00:00.
/** @param {string} text  @returns {number} */
export function parseTime(text) {
  const m = /^([0-9]{2}):([0-9]{2})$/.exec(text);
  if (!m) throw new TypeError('Invalid time "' + text + '", expected HH:MM');
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) throw new RangeError('Time out of range: ' + text);
  return h * 60 + min;
}

/** @param {number} minutes  @returns {string} */
export function formatTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
}`,
  "looseConfig": `{
  "extends": "../../../tsconfig.json",
  "compilerOptions": { "strict": false },
  "include": ["."]
}`,
  "doubleCast": `// "as any as X" — two casts that switch the checker off for one value.
import { usageRate, type Booking } from '../../../src/rules/booking.ts';

const row = { lab: 'BE-201', minute: 120 };          // typo: minute
const b1 = row as Booking;                           // one cast: tsc still objects
const b2 = row as any as Booking;                    // two casts: tsc is silent
console.log(usageRate([b2]));                        // NaN at runtime
console.log(b1.lab);`,
  "thTruoc": `// Load a lab's booking history from JSON text — the "any" version.
import { usageRate } from '../../../src/rules/booking.ts';

export function loadHistory(text: string) {
  return JSON.parse(text);               // any leaks out to every caller
}

const history = loadHistory('[{"minutes":420},{"minute":210}]');
console.log('usage:', usageRate(history));`,
  "thSau": `// Load a lab's booking history from JSON text — the "unknown" version.
import { usageRate } from '../../../src/rules/booking.ts';

export function loadHistory(text: string): { minutes: number }[] {
  const data: unknown = JSON.parse(text);
  if (!Array.isArray(data)) throw new TypeError('history must be a list');
  return data.map((row: unknown, i: number) => {
    if (typeof row === 'object' && row !== null && 'minutes' in row && typeof row.minutes === 'number') {
      return { minutes: row.minutes };
    }
    throw new TypeError('row ' + i + ': minutes must be a number');
  });
}

for (const text of ['[{"minutes":420},{"minutes":210}]', '[{"minutes":420},{"minute":210}]', '{"minutes":420}']) {
  try {
    console.log('usage:', usageRate(loadHistory(text)));
  } catch (e) {
    console.log('rejected:', e instanceof Error ? e.message : e);
  }
}`,
};
export const OUT = {
  '41-any-node': `$ node demo1/ts-01-4/1-any/any-off.ts
file://…/labflow-ts/demo1/ts-01-4/1-any/any-off.ts:5
x.foo.bar.baz();                 // calling methods that do not exist
      ^

TypeError: Cannot read properties of undefined (reading 'bar')
    at file://…/labflow-ts/demo1/ts-01-4/1-any/any-off.ts:5:7
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
  '41-any-tsc': `$ npx tsc -p demo1/ts-01-4/1-any`,
  '42-dts': `$ npx tsc -p demo1/ts-01-4/2-lan-dts --noEmit false --declaration --emitDeclarationOnly --outDir .dts-14 && cat .dts-14/load.d.ts; rm -rf .dts-14
export declare function loadBookings(text: string): any;
export declare function loadBookingsSafe(text: string): unknown;
export declare const total: any;
export declare const first: any;`,
  '42-lan-node': `$ node demo1/ts-01-4/2-lan/contagion.ts
PENDING number
file://…/labflow-ts/src/rules/booking.ts:60
  for (const b of bookings) rate += b.minutes / (CLOSE - OPEN);
                  ^

TypeError: bookings is not iterable
    at usageRate (file://…/labflow-ts/src/rules/booking.ts:60:19)
    at file://…/labflow-ts/demo1/ts-01-4/2-lan/contagion.ts:11:14
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
  '42-lan-tsc': `$ npx tsc -p demo1/ts-01-4/2-lan`,
  '43-cham-khoi-dau': `$ node scripts/cham-lab-1.mjs
    ✗ S1 a number is not "HH:MM" — expected TS2345, got no error
    ✗ S2 formatTime takes minutes — expected TS2345, got no error
    ✓ S3 the end time is missing — expected TS2554, got TS2554
    ✓ S4 typo: seat instead of seats — expected TS2561, got TS2561
    ✗ S5 roles are upper-case — expected TS2820, got no error
    ✓ S6 typo: minute instead of minutes — expected TS2551, got TS2551
    ✗ S7 there is no APPROVED status — expected TS2367, got no error
    ✗ S8 typo inside a list of bookings — expected TS2561, got no error
✗ E  wrong calls refused (3/8) — 1.5/4`,
  '43-cham-yeu': `$ node scripts/cham-lab-1.mjs --from lab1/yeu
    ✗ S1 a number is not "HH:MM" — expected TS2345, got no error
    ✗ S2 formatTime takes minutes — expected TS2345, got no error
    ✓ S3 the end time is missing — expected TS2554, got TS2554
    ✗ S4 typo: seat instead of seats — expected TS2561, got no error
    ✗ S5 roles are upper-case — expected TS2820, got no error
    ✗ S6 typo: minute instead of minutes — expected TS2551, got no error
    ✗ S7 there is no APPROVED status — expected TS2367, got no error
    ✗ S8 typo inside a list of bookings — expected TS2561, got no error
✗ E  wrong calls refused (1/8) — 0.5/4`,
  '44-leak-node': `$ node demo1/ts-01-4/3-unknown/unknown-3.ts
undefined`,
  '44-unknown-node': `$ node demo1/ts-01-4/3-unknown/unknown-2.ts
seats + 1 = 32
not a list`,
  '44-unknown-tsc': `$ npx tsc -p demo1/ts-01-4/3-unknown
demo1/ts-01-4/3-unknown/unknown-1.ts(5,13): error TS18046: 'data' is of type 'unknown'.
demo1/ts-01-4/3-unknown/unknown-1.ts(6,7): error TS2322: Type 'unknown' is not assignable to type 'number'.`,
  '45-ngam-tsc': `$ npx tsc -p demo1/ts-01-4/4-ngam
demo1/ts-01-4/4-ngam/implicit.ts(2,30): error TS7006: Parameter 'minutes' implicitly has an 'any' type.`,
  '46-checkjs-node': `$ node demo1/ts-01-4/5-checkjs/use.js
file://…/labflow-ts/demo1/ts-01-4/5-checkjs/time.js:4
  if (!m) throw new TypeError('Invalid time "' + text + '", expected HH:MM');
                ^

TypeError: Invalid time "480", expected HH:MM
    at parseTime (file://…/labflow-ts/demo1/ts-01-4/5-checkjs/time.js:4:17)
    at checkSlot (file://…/labflow-ts/demo1/ts-01-4/5-checkjs/booking.js:11:13)
    at file://…/labflow-ts/demo1/ts-01-4/5-checkjs/use.js:4:13
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
  '46-checkjs-tsc': `$ npx tsc -p demo1/ts-01-4/5-checkjs
demo1/ts-01-4/5-checkjs/booking.js(10,27): error TS7006: Parameter 'start' implicitly has an 'any' type.
demo1/ts-01-4/5-checkjs/booking.js(10,34): error TS7006: Parameter 'end' implicitly has an 'any' type.
demo1/ts-01-4/5-checkjs/booking.js(20,39): error TS7006: Parameter 'daysAhead' implicitly has an 'any' type.
demo1/ts-01-4/5-checkjs/booking.js(24,33): error TS7031: Binding element 'seats' implicitly has an 'any' type.
demo1/ts-01-4/5-checkjs/booking.js(24,40): error TS7031: Binding element 'role' implicitly has an 'any' type.
demo1/ts-01-4/5-checkjs/booking.js(32,33): error TS7031: Binding element 'lab' implicitly has an 'any' type.
demo1/ts-01-4/5-checkjs/booking.js(32,38): error TS7031: Binding element 'seats' implicitly has an 'any' type.
demo1/ts-01-4/5-checkjs/booking.js(32,45): error TS7031: Binding element 'role' implicitly has an 'any' type.
demo1/ts-01-4/5-checkjs/booking.js(32,51): error TS7031: Binding element 'start' implicitly has an 'any' type.
demo1/ts-01-4/5-checkjs/booking.js(32,58): error TS7031: Binding element 'end' implicitly has an 'any' type.
demo1/ts-01-4/5-checkjs/booking.js(45,27): error TS7006: Parameter 'bookings' implicitly has an 'any' type.
demo1/ts-01-4/5-checkjs/time.js(2,27): error TS7006: Parameter 'text' implicitly has an 'any' type.
demo1/ts-01-4/5-checkjs/time.js(11,28): error TS7006: Parameter 'minutes' implicitly has an 'any' type.
demo1/ts-01-4/5-checkjs/use.js(5,29): error TS2561: Object literal may only specify known properties, but 'seat' does not exist in type '{ role: any; seats: any; }'. Did you mean to write 'seats'?`,
  '46-jsdoc-tsc': `$ npx tsc -p demo1/ts-01-4/6-jsdoc
demo1/ts-01-4/6-jsdoc/use.js(4,23): error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.
demo1/ts-01-4/6-jsdoc/use.js(5,29): error TS2561: Object literal may only specify known properties, but 'seat' does not exist in type '{ seats: number; role: Role; }'. Did you mean to write 'seats'?
demo1/ts-01-4/6-jsdoc/use.js(6,26): error TS2561: Object literal may only specify known properties, but 'minute' does not exist in type '{ minutes: number; }'. Did you mean to write 'minutes'?`,
  '46-long-tsc': `$ npx tsc -p demo1/ts-01-4/7-doi-ten-long
demo1/ts-01-4/7-doi-ten-long/use.ts(5,29): error TS2561: Object literal may only specify known properties, but 'seat' does not exist in type '{ role: any; seats: any; }'. Did you mean to write 'seats'?`,
  '46-strict-dem': `$ npx tsc -p demo1/ts-01-4/7-doi-ten-strict | grep -c 'error TS'
14`,
  '46-strict-loai': `$ npx tsc -p demo1/ts-01-4/7-doi-ten-strict | grep -o 'error TS[0-9]*' | sort | uniq -c
   1 error TS2561
   6 error TS7006
   7 error TS7031`,
  '47-ep-kieu-node': `$ node demo1/ts-01-4/8-ep-kieu/double-cast.ts
NaN
BE-201`,
  '47-ep-kieu-tsc': `$ npx tsc -p demo1/ts-01-4/8-ep-kieu
demo1/ts-01-4/8-ep-kieu/double-cast.ts(5,12): error TS2352: Conversion of type '{ lab: string; minute: number; }' to type 'Booking' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type '{ lab: string; minute: number; }' is missing the following properties from type 'Booking': start, end, minutes, status`,
  '48-th-sau-node': `$ node demo1/ts-01-4/th-sau/history.ts
usage: 0.75
rejected: row 1: minutes must be a number
rejected: history must be a list`,
  '48-th-sau-tsc': `$ npx tsc -p demo1/ts-01-4/th-sau`,
  '48-th-truoc-node': `$ node demo1/ts-01-4/th-truoc/history.ts
usage: NaN`,
  '48-th-truoc-tsc': `$ npx tsc -p demo1/ts-01-4/th-truoc`,
};
