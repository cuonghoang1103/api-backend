/**
 * _ma (bài 2.3) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "assign": `// The top and the bottom of the type system, checked line by line.
declare const u: unknown;
declare const n: never;
declare const a: any;

// unknown is the TOP: every value fits into it…
const t1: unknown = 31;
const t2: unknown = 'BE-201';
const t3: unknown = null;
// …but it fits into nothing else until you check it.
const t4: string = u;

// never is the BOTTOM: it fits into every type…
const b1: string = n;
const b2: number = n;
// …and no value fits into it.
const b3: never = 31;

// any ignores the table in both directions (except into never).
const x1: string = a;
const x2: number = a;
const x3: never = a;

export { t1, t2, t3, t4, b1, b2, b3, x1, x2, x3 };`,
  "log": `// A function that only does something (prints) and gives nothing back.
export function logBooking(id: number): void {
  console.log('booking ' + id + ' saved');
}

const r1 = logBooking(1);              // r1: void
const r2: number = logBooking(2);      // using a void result as a number
const r3: undefined = logBooking(3);   // void is not the same as undefined

// A void function must not return a value…
export function saveNote(note: string): void {
  return note.length;
}

// …but a callback whose type says void MAY return one: the caller ignores it.
const ids = [1, 2, 3];
const seen: number[] = [];
ids.forEach((id) => seen.push(id));    // push returns a number — accepted

console.log(r1, r2, r3, seen);`,
  "fail": `// A helper that never returns: it always throws.
import { checkSlot } from '../../../src/rules/booking.ts';

export function fail(message: string): never {
  throw new Error(message);
}

// The same helper WITHOUT a return type: what does tsc infer?
export function failInferred(message: string) {
  throw new Error(message);
}
export const failArrow = (message: string) => {
  throw new Error(message);
};

const slot = checkSlot('08:00', '10:00');
// fail(...) is never, so the whole expression is just number.
export const minutes = slot.ok ? slot.minutes : fail(slot.code);
// The inferred helper gives number | void instead.
export const minutes2 = slot.ok ? slot.minutes : failInferred(slot.code);`,
  "use": `import { minutes, minutes2 } from './fail.ts';

const a: number = minutes;
const b: number = minutes2;
console.log(a, b);`,
  "dtsJson": `{
  "extends": "../../../tsconfig.json",
  "compilerOptions": { "noEmit": false, "declaration": true, "emitDeclarationOnly": true, "outDir": "../../../.dts-02-3", "rootDir": "../../.." },
  "include": ["fail.ts"]
}`,
  "v1": `// One message per slot code — and tsc proves none is forgotten.
import type { SlotCode } from '../../../../src/rules/booking.ts';

export function slotMessage(code: SlotCode): string {
  switch (code) {
    case 'OFF_GRID': return 'Start and end must be on the 30-minute grid.';
    case 'END_BEFORE_START': return 'The end time must be after the start time.';
    case 'OUTSIDE_HOURS': return 'LabFlow is open from 07:00 to 21:00.';
    case 'TOO_LONG': return 'A booking can last at most 4 hours.';
    default: {
      const unreachable: never = code;   // every case handled ⇒ code is never here
      throw new Error('Unknown slot code: ' + String(unreachable));
    }
  }
}`,
  "v1run": `import { checkSlot } from '../../../../src/rules/booking.ts';
import { slotMessage } from './messages.ts';

const tries: [string, string][] = [['08:15', '10:00'], ['10:00', '08:00'], ['06:00', '08:00'], ['08:00', '13:00'], ['08:00', '10:00']];
for (const [start, end] of tries) {
  const slot = checkSlot(start, end);
  console.log(start + '-' + end, '→', slot.ok ? 'ok, ' + slot.minutes + ' min' : slotMessage(slot.code));
}`,
  "codes": `// A teammate adds a fifth reason: the lab is closed for maintenance.
export type SlotCode = 'OFF_GRID' | 'END_BEFORE_START' | 'OUTSIDE_HOURS' | 'TOO_LONG' | 'LAB_CLOSED';`,
  "def": `// Same function, but the "safe" default branch hides every new code.
import type { SlotCode } from './codes.ts';

export function slotMessage(code: SlotCode): string {
  switch (code) {
    case 'OFF_GRID': return 'Start and end must be on the 30-minute grid.';
    case 'END_BEFORE_START': return 'The end time must be after the start time.';
    case 'OUTSIDE_HOURS': return 'LabFlow is open from 07:00 to 21:00.';
    case 'TOO_LONG': return 'A booking can last at most 4 hours.';
    default: return 'Something is wrong with this slot.';
  }
}`,
  "noret": `// No default at all — only the return type ": string" is left to protect us.
import type { SlotCode } from './codes.ts';

export function slotMessage(code: SlotCode): string {
  switch (code) {
    case 'OFF_GRID': return 'Start and end must be on the 30-minute grid.';
    case 'END_BEFORE_START': return 'The end time must be after the start time.';
    case 'OUTSIDE_HOURS': return 'LabFlow is open from 07:00 to 21:00.';
    case 'TOO_LONG': return 'A booking can last at most 4 hours.';
  }
}`,
  "js": `// The JavaScript version: no types, no default branch.
export function slotMessage(code) {
  switch (code) {
    case 'OFF_GRID': return 'Start and end must be on the 30-minute grid.';
    case 'END_BEFORE_START': return 'The end time must be after the start time.';
    case 'OUTSIDE_HOURS': return 'LabFlow is open from 07:00 to 21:00.';
    case 'TOO_LONG': return 'A booking can last at most 4 hours.';
  }
}

// The new code arrives from the server one day:
console.log('Booking refused: ' + slotMessage('TOO_LONG'));
console.log('Booking refused: ' + slotMessage('LAB_CLOSED'));`,
  "day": `// A day in one lab starts empty; bookings are added during the day.
import type { Booking } from '../../../src/rules/booking.ts';
import { createBooking } from '../../../src/rules/booking.ts';

const day = { lab: 'BE-201', bookings: [] };

const b: Booking = createBooking({ lab: 'BE-201', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' });
day.bookings.push(b);

// A local variable is different: an empty array "evolves" as you push.
const ids = [];
ids.push(b.minutes);
const total: number = ids[0] ?? 0;
console.log(day.bookings.length, total);`,
  "dayFixed": `// Say what the empty list WILL hold, and the trap disappears.
import type { Booking } from '../../../src/rules/booking.ts';
import { createBooking } from '../../../src/rules/booking.ts';

type LabDay = { lab: string; bookings: Booking[] };
const day: LabDay = { lab: 'BE-201', bookings: [] };

const b: Booking = createBooking({ lab: 'BE-201', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' });
day.bookings.push(b);
console.log(day.bookings.length, day.bookings[0]?.minutes);`,
  "objects": `// Three types that look alike: object, {} and Object.
const o1: object = { lab: 'BE-201' };
const o2: object = 'BE-201';          // a string is not an object
const e1: {} = 'BE-201';              // {} means "anything except null/undefined"
const e2: {} = 31;
const e3: {} = null;
const w1: Object = 31;                // the wrapper type: as loose as {}

export { o1, o2, e1, e2, e3, w1 };`,
  "prStart": `// A booking's status, shown to the user in Vietnamese.
export type Status = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export function statusLabel(status: Status): string {
  switch (status) {
    case 'PENDING': return 'Chờ duyệt';
    case 'CONFIRMED': return 'Đã xác nhận';
    default: return '?';
  }
}

const all: Status[] = ['PENDING', 'CONFIRMED', 'CANCELLED'];
for (const s of all) console.log(s, '→', statusLabel(s));`,
  "prStep1": `// Step 1: the default branch now PROVES that nothing is left.
export type Status = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export function statusLabel(status: Status): string {
  switch (status) {
    case 'PENDING': return 'Chờ duyệt';
    case 'CONFIRMED': return 'Đã xác nhận';
    default: {
      const unreachable: never = status;
      throw new Error('Unknown status: ' + String(unreachable));
    }
  }
}

const all: Status[] = ['PENDING', 'CONFIRMED', 'CANCELLED'];
for (const s of all) console.log(s, '→', statusLabel(s));`,
  "prSol": `// Solution: handle the missing case; the never check stays for the next one.
export type Status = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export function statusLabel(status: Status): string {
  switch (status) {
    case 'PENDING': return 'Chờ duyệt';
    case 'CONFIRMED': return 'Đã xác nhận';
    case 'CANCELLED': return 'Đã huỷ';
    default: {
      const unreachable: never = status;
      throw new Error('Unknown status: ' + String(unreachable));
    }
  }
}

const all: Status[] = ['PENDING', 'CONFIRMED', 'CANCELLED'];
for (const s of all) console.log(s, '→', statusLabel(s));`,
};
export const OUT = {
  '11-hierarchy': `$ npx tsc -p demo2/ts-02-3/hierarchy
demo2/ts-02-3/hierarchy/assign.ts(11,7): error TS2322: Type 'unknown' is not assignable to type 'string'.
demo2/ts-02-3/hierarchy/assign.ts(17,7): error TS2322: Type '31' is not assignable to type 'never'.
demo2/ts-02-3/hierarchy/assign.ts(22,7): error TS2322: Type 'any' is not assignable to type 'never'.`,
  '12-void-tsc': `$ npx tsc -p demo2/ts-02-3/void
demo2/ts-02-3/void/log.ts(7,7): error TS2322: Type 'void' is not assignable to type 'number'.
demo2/ts-02-3/void/log.ts(8,7): error TS2322: Type 'void' is not assignable to type 'undefined'.
demo2/ts-02-3/void/log.ts(12,3): error TS2322: Type 'number' is not assignable to type 'void'.`,
  '13-void-run': `$ node demo2/ts-02-3/void/log.ts
booking 1 saved
booking 2 saved
booking 3 saved
undefined undefined undefined [ 1, 2, 3 ]`,
  '14-never-dts': `$ npx tsc -p demo2/ts-02-3/never/dts.json && cat .dts-02-3/demo2/ts-02-3/never/fail.d.ts
export declare function fail(message: string): never;
export declare function failInferred(message: string): void;
export declare const failArrow: (message: string) => never;
export declare const minutes: number;
export declare const minutes2: void | number;`,
  '15-never-use': `$ npx tsc -p demo2/ts-02-3/never
demo2/ts-02-3/never/use.ts(4,7): error TS2322: Type 'void | number' is not assignable to type 'number'.
  Type 'void' is not assignable to type 'number'.`,
  '16-ex-v1': `$ npx tsc -p demo2/ts-02-3/exhaustive/v1 && node demo2/ts-02-3/exhaustive/v1/run.ts
08:15-10:00 → Start and end must be on the 30-minute grid.
10:00-08:00 → The end time must be after the start time.
06:00-08:00 → LabFlow is open from 07:00 to 21:00.
08:00-13:00 → A booking can last at most 4 hours.
08:00-10:00 → ok, 120 min`,
  '17-ex-v2': `$ npx tsc -p demo2/ts-02-3/exhaustive/v2
demo2/ts-02-3/exhaustive/v2/messages.ts(11,13): error TS2322: Type '"LAB_CLOSED"' is not assignable to type 'never'.`,
  '18-ex-default': `$ npx tsc -p demo2/ts-02-3/exhaustive/default`,
  '19-ex-noreturn': `$ npx tsc -p demo2/ts-02-3/exhaustive/noreturn
demo2/ts-02-3/exhaustive/noreturn/messages.ts(4,46): error TS2366: Function lacks ending return statement and return type does not include 'undefined'.`,
  '20-ex-js': `$ node demo2/ts-02-3/exhaustive/messages.js
Booking refused: A booking can last at most 4 hours.
Booking refused: undefined`,
  '21-empty': `$ npx tsc -p demo2/ts-02-3/empty
demo2/ts-02-3/empty/day.ts(8,19): error TS2345: Argument of type 'Booking' is not assignable to parameter of type 'never'.`,
  '22-empty-fixed': `$ npx tsc -p demo2/ts-02-3/empty/tsconfig.fixed.json && node demo2/ts-02-3/empty/day-fixed.ts
1 120`,
  '23-objects': `$ npx tsc -p demo2/ts-02-3/objects
demo2/ts-02-3/objects/objects.ts(3,7): error TS2322: Type 'string' is not assignable to type 'object'.
demo2/ts-02-3/objects/objects.ts(6,7): error TS2322: Type 'null' is not assignable to type '{}'.`,
  '24-pr-start': `$ npx tsc -p demo2/ts-02-3/practice/start && node demo2/ts-02-3/practice/start/status.ts
PENDING → Chờ duyệt
CONFIRMED → Đã xác nhận
CANCELLED → ?`,
  '25-pr-step1': `$ npx tsc -p demo2/ts-02-3/practice/step1
demo2/ts-02-3/practice/step1/status.ts(9,13): error TS2322: Type '"CANCELLED"' is not assignable to type 'never'.`,
  '26-pr-sol': `$ npx tsc -p demo2/ts-02-3/practice/solution && node demo2/ts-02-3/practice/solution/status.ts
PENDING → Chờ duyệt
CONFIRMED → Đã xác nhận
CANCELLED → Đã huỷ`,
};
