/**
 * _ma (bài 1.3) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "infer": `// LabFlow rules with ONLY the parameters typed. Every return type is left to inference.
import { parseTime } from './time.ts';

export const OPEN = 7 * 60;          // 07:00
export const CLOSE = 21 * 60;        // 21:00
export const STEP = 30;              // BR-04: 30-minute grid
export const MAX_MINUTES = 240;      // Lite-1: at most 4 hours
export const APPROVAL_SEATS = 30;    // BR-06: more than 30 seats needs approval

export type Role = 'STUDENT' | 'LECTURER' | 'ADMIN';
export type BookingInput = { lab: string; seats: number; role: Role; start: string; end: string };

export function checkSlot(start: string, end: string) {
  const s = parseTime(start);
  const e = parseTime(end);
  if (s % STEP !== 0 || e % STEP !== 0) return { ok: false, code: 'OFF_GRID' };
  if (e <= s) return { ok: false, code: 'END_BEFORE_START' };
  if (s < OPEN || e > CLOSE) return { ok: false, code: 'OUTSIDE_HOURS' };
  if (e - s > MAX_MINUTES) return { ok: false, code: 'TOO_LONG' };
  return { ok: true, minutes: e - s };
}

export function needsApproval({ seats, role }: { seats: number; role: Role }) {
  if (!Number.isInteger(seats) || seats < 1) {
    throw new RangeError('seats must be a positive integer, got ' + seats);
  }
  if (role === 'LECTURER' || role === 'ADMIN') return false;
  return seats > APPROVAL_SEATS;
}

export function createBooking({ lab, seats, role, start, end }: BookingInput) {
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

export function usageRate(bookings: readonly { minutes: number }[]) {
  let rate = 0;
  for (const b of bookings) rate += b.minutes / (CLOSE - OPEN);
  return rate;
}`,
  "use": `// Using the rules whose return types were inferred (infer/booking.ts).
import { checkSlot, createBooking } from './infer/booking.ts';

const slot = checkSlot('08:00', '10:00');
if (!slot.ok) throw new Error(slot.code);
const minutes: number = slot.minutes;           // after the throw, surely a number?

const booking = createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' });
const status: 'PENDING' | 'CONFIRMED' = booking.status;
console.log(minutes, status);`,
  "widen": `// let vs const, literal types, and what happens to the properties of an object.
export let a = 'CuongThai';
export const b = 'CuongThai';
export const arr = [1, 2, 3];
export const mixed = [1, 'two', true];
export const seats = 31;
export let lab = 'BE-201';
export const opensAt = 7 * 60;

export const input = { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' };`,
  "widenCall": `import { createBooking } from '../../src/rules/booking.ts';

// The object is built first, passed later — a very common shape in real code.
const input = { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' };
console.log(createBooking(input));`,
  "fixes": `import { createBooking } from '../../src/rules/booking.ts';
import type { BookingInput } from '../../src/rules/booking.ts';

// Fix 1 — annotate the variable: the object must BE a BookingInput.
export const input1: BookingInput =
  { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' };

// Fix 2 — as const: every property becomes readonly and keeps its literal type.
export const input2 =
  { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' } as const;

// Fix 3 — satisfies: checked against BookingInput, keeps its own narrower type.
export const input3 =
  { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' } satisfies BookingInput;

console.log(createBooking(input1).status, createBooking(input2).status, createBooking(input3).status);`,
  "context": `import { createBooking } from '../../src/rules/booking.ts';

const bookings = [
  createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' }),
  createBooking({ lab: 'BE-305', seats: 12, role: 'LECTURER', start: '13:00', end: '15:30' }),
];

// No annotation on b, m or total — the context tells TypeScript what they are.
export const minutes = bookings.map((b) => b.minutes);
export const total = minutes.reduce((sum, m) => sum + m, 0);
export const labs = bookings.filter((b) => b.status === 'PENDING').map((b) => b.lab);
console.log(minutes, total, labs);`,
  "noContext": `// The same arrow function, once inside .map() and once on its own.
import { createBooking } from '../../src/rules/booking.ts';

const bookings = [createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' })];
export const inMap = bookings.map((b) => b.minutes);   // context: map gives b its type
export const alone = (b) => b.minutes;                  // no context: where would the type come from?`,
  "returnType": `import type { SlotResult } from '../../src/rules/booking.ts';

// Same typo ('OFF_GRIDD') in two functions. Only one of them says what it returns.
export function checkA(start: number, end: number) {
  if (start % 30 !== 0 || end % 30 !== 0) return { ok: false, code: 'OFF_GRIDD' };
  return { ok: true, minutes: end - start };
}

export function checkB(start: number, end: number): SlotResult {
  if (start % 30 !== 0 || end % 30 !== 0) return { ok: false, code: 'OFF_GRIDD' };
  return { ok: true, minutes: end - start };
}`,
  "thStart": `// Practice 1.3 — too many annotations. Remove the ones inference already gives; keep the ones that carry information.
import { createBooking, usageRate } from '../../../src/rules/booking.ts';
import type { Booking, BookingInput } from '../../../src/rules/booking.ts';

export function totalMinutes(bookings: readonly { minutes: number }[]): number {
  let total: number = 0;
  for (const b of bookings) total += b.minutes;
  return total;
}

const label: string = 'Monday';
const day: BookingInput[] = [
  { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' },
  { lab: 'BE-305', seats: 12, role: 'LECTURER', start: '13:00', end: '15:30' },
];
const bookings: Booking[] = day.map((input: BookingInput): Booking => createBooking(input));
const minutes: number[] = bookings.map((b: Booking): number => b.minutes);
const rate: number = usageRate(bookings);
const pending: Booking[] = bookings.filter((b: Booking): boolean => b.status === 'PENDING');
console.log(label, totalMinutes(bookings), minutes, rate.toFixed(3), pending.length);

// This call is wrong and must stay refused after your edits:
// @ts-expect-error — "minute" is not "minutes"
totalMinutes([{ minute: 60 }]);`,
  "thSolution": `// Practice 1.3 — solution: 3 annotations kept, 12 removed.
import { createBooking, usageRate } from '../../../src/rules/booking.ts';
import type { BookingInput } from '../../../src/rules/booking.ts';

// KEEP: an exported function's parameter (nothing to infer from) and its return type (the contract).
export function totalMinutes(bookings: readonly { minutes: number }[]): number {
  let total = 0;
  for (const b of bookings) total += b.minutes;
  return total;
}

const label = 'Monday';
// KEEP: without it, role is inferred as string and createBooking refuses the array.
const day: BookingInput[] = [
  { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' },
  { lab: 'BE-305', seats: 12, role: 'LECTURER', start: '13:00', end: '15:30' },
];
const bookings = day.map((input) => createBooking(input));
const minutes = bookings.map((b) => b.minutes);
const rate = usageRate(bookings);
const pending = bookings.filter((b) => b.status === 'PENDING');
console.log(label, totalMinutes(bookings), minutes, rate.toFixed(3), pending.length);

// This call is wrong and must stay refused after your edits:
// @ts-expect-error — "minute" is not "minutes"
totalMinutes([{ minute: 60 }]);`,
  "ref": `import { parseTime } from './time.ts';

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
  "dtsJson": `{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "noEmit": false,
    "declaration": true,
    "emitDeclarationOnly": true,
    "rootDir": "../..",
    "outDir": "out"
  },
  "include": ["widen.ts", "fixes.ts", "context.ts"]
}`,
};
export const OUT = {
  '13-context': `$ cat demo1/ts-01-3/out/demo1/ts-01-3/context.d.ts && node demo1/ts-01-3/context.ts
export declare const minutes: number[];
export declare const total: number;
export declare const labs: string[];
[ 120, 150 ] 270 [ 'BE-201' ]`,
  '13-fixes-dts': `$ cat demo1/ts-01-3/out/demo1/ts-01-3/fixes.d.ts
import type { BookingInput } from '../../src/rules/booking.ts';
export declare const input1: BookingInput;
export declare const input2: {
    readonly lab: 'BE-201';
    readonly seats: 31;
    readonly role: 'STUDENT';
    readonly start: '08:00';
    readonly end: '10:00';
};
export declare const input3: {
    lab: string;
    seats: number;
    role: "STUDENT";
    start: string;
    end: string;
};`,
  '13-fixes': `$ npx tsc -p demo1/ts-01-3/fixes.json && node demo1/ts-01-3/fixes.ts
PENDING PENDING PENDING`,
  '13-infer': `$ npx tsc -p demo1/ts-01-3/infer && cat demo1/ts-01-3/infer/out/booking.d.ts
export declare const OPEN: number;
export declare const CLOSE: number;
export declare const STEP = 30;
export declare const MAX_MINUTES = 240;
export declare const APPROVAL_SEATS = 30;
export type Role = 'STUDENT' | 'LECTURER' | 'ADMIN';
export type BookingInput = {
    lab: string;
    seats: number;
    role: Role;
    start: string;
    end: string;
};
export declare function checkSlot(start: string, end: string): {
    ok: boolean;
    code: string;
    minutes?: undefined;
} | {
    code?: undefined;
    ok: boolean;
    minutes: number;
};
export declare function needsApproval({ seats, role }: {
    seats: number;
    role: Role;
}): boolean;
export declare function createBooking({ lab, seats, role, start, end }: BookingInput): {
    lab: string;
    start: string;
    end: string;
    minutes: number | undefined;
    status: string;
};
export declare function usageRate(bookings: readonly {
    minutes: number;
}[]): number;`,
  '13-no-context': `$ npx tsc -p demo1/ts-01-3/no-context.json
demo1/ts-01-3/no-context.ts(6,23): error TS7006: Parameter 'b' implicitly has an 'any' type.`,
  '13-return': `$ npx tsc -p demo1/ts-01-3/return-type.json
demo1/ts-01-3/return-type.ts(10,63): error TS2820: Type '"OFF_GRIDD"' is not assignable to type 'SlotCode'. Did you mean '"OFF_GRID"'?`,
  '13-starter-count': `$ npx tsc -p lab1 | grep '^lab1/src' | grep -o 'TS[0-9]*' | sort | uniq -c
   6 TS7006
   7 TS7031`,
  '13-starter': `$ npx tsc -p lab1 | grep '^lab1/src' | head -5
lab1/src/booking.ts(10,27): error TS7006: Parameter 'start' implicitly has an 'any' type.
lab1/src/booking.ts(10,34): error TS7006: Parameter 'end' implicitly has an 'any' type.
lab1/src/booking.ts(20,39): error TS7006: Parameter 'daysAhead' implicitly has an 'any' type.
lab1/src/booking.ts(24,33): error TS7031: Binding element 'seats' implicitly has an 'any' type.
lab1/src/booking.ts(24,40): error TS7031: Binding element 'role' implicitly has an 'any' type.`,
  '13-th-solution': `$ npx tsc -p demo1/ts-01-3/practice/solution.json && node demo1/ts-01-3/practice/solution.ts
Monday 270 [ 120, 150 ] 0.321 1`,
  '13-th-start': `$ npx tsc -p demo1/ts-01-3/practice/start.json && node demo1/ts-01-3/practice/start.ts
Monday 270 [ 120, 150 ] 0.321 1`,
  '13-th-too-far': `$ npx tsc -p demo1/ts-01-3/practice/too-far.json
demo1/ts-01-3/practice/too-far.ts(18,51): error TS2345: Argument of type '{ lab: string; seats: number; role: string; start: string; end: string; }' is not assignable to parameter of type 'BookingInput'.
  Types of property 'role' are incompatible.
    Type 'string' is not assignable to type 'Role'.`,
  '13-use-fixed': `$ npx tsc -p demo1/ts-01-3/use-fixed.json`,
  '13-use': `$ npx tsc -p demo1/ts-01-3/use.json
demo1/ts-01-3/use.ts(6,7): error TS2322: Type 'number | undefined' is not assignable to type 'number'.
  Type 'undefined' is not assignable to type 'number'.
demo1/ts-01-3/use.ts(9,7): error TS2322: Type 'string' is not assignable to type '"CONFIRMED" | "PENDING"'.`,
  '13-vua': `$ node scripts/cham-lab-1.mjs --from lab1/vua
✓ A  your src/ compiles (strict) — 2/2
✗ B  correct calls still compile — 0/1
    kiem/phai-dung.ts(9,9): error TS2322: Type 'number | undefined' is not assignable to type 'number'.
    kiem/phai-dung.ts(14,7): error TS2322: Type 'string' is not assignable to type '"CONFIRMED" | "PENDING"'.
    kiem/phai-dung.ts(15,33): error TS2322: Type '{ lab: string; start: string; end: string; minutes: number | undefined; status: string; }' is not assignable to type '{ minutes: number; }'.
✓ C  no any / no @ts- directives — 1/1
✓ D  behaviour tests pass (15/15) — 2/2
    ✓ S1 a number is not "HH:MM" — expected TS2345, got TS2345
    ✓ S2 formatTime takes minutes — expected TS2345, got TS2345
    ✓ S3 the end time is missing — expected TS2554, got TS2554
    ✓ S4 typo: seat instead of seats — expected TS2561, got TS2561
    ✗ S5 roles are upper-case — expected TS2820, got no error
    ✓ S6 typo: minute instead of minutes — expected TS2551, got TS2551
    ✗ S7 there is no APPROVED status — expected TS2367, got no error
    ✓ S8 typo inside a list of bookings — expected TS2561, got TS2561
✗ E  wrong calls refused (6/8) — 3/4

Score: 8/10 — PASS (pass mark 7)`,
  '13-widen-call': `$ npx tsc -p demo1/ts-01-3/widen-call.json
demo1/ts-01-3/widen-call.ts(5,27): error TS2345: Argument of type '{ lab: string; seats: number; role: string; start: string; end: string; }' is not assignable to parameter of type 'BookingInput'.
  Types of property 'role' are incompatible.
    Type 'string' is not assignable to type 'Role'.`,
  '13-widen': `$ npx tsc -p demo1/ts-01-3/dts.json && cat demo1/ts-01-3/out/demo1/ts-01-3/widen.d.ts
export declare let a: string;
export declare const b = "CuongThai";
export declare const arr: number[];
export declare const mixed: (string | number | boolean)[];
export declare const seats = 31;
export declare let lab: string;
export declare const opensAt: number;
export declare const input: {
    lab: string;
    seats: number;
    role: string;
    start: string;
    end: string;
};`,
};
