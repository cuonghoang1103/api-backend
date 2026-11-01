/**
 * _ma (bài 4.2) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "both": `import type { LabCode } from '../../../src/rules/schedule.ts';

// Two ways to name the same shape.
export interface LabI {
  code: LabCode;
  name: string;
  capacity: number;
}

export type LabT = {
  code: LabCode;
  name: string;
  capacity: number;
};

const a: LabI = { code: 'AL-301', name: 'AI Lab' };
const b: LabT = { code: 'AL-301', name: 'AI Lab' };
const c: LabT = a; // same shape: they are interchangeable
export { a, b, c };`,
  "merge": `// models.ts, line 1 — the User every screen uses.
export interface User {
  readonly id: number;
  email: string;
  name: string;
}

export function greet(u: User): string {
  return 'Hello, ' + u.name;
}

// … 200 lines later, someone adds "the user from the SMS module" and reuses the name.
export interface User {
  phone: string;
}

const an: User = { id: 1, email: 'an.nv@fpt.edu.vn', name: 'Nguyen Van An' };
console.log(greet(an));`,
  "dup": `// The same mistake with type aliases.
export type User = {
  readonly id: number;
  email: string;
  name: string;
};

export type User = {
  phone: string;
};`,
  "union": `import type { TimeRange } from '../../../src/rules/schedule.ts';

// Only a type alias can name these: a union, a tuple, a function type.
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';
export type Slot = TimeRange;
export type Rule = (seats: number) => string | null;

// An interface describes an object shape — nothing else.
export interface Status = 'PENDING' | 'CONFIRMED';`,
  "extunion": `type Pending = { status: 'PENDING' };
type Confirmed = { status: 'CONFIRMED'; approvedBy: string };
export type BookingState = Pending | Confirmed;

// A type alias can combine anything with &; an interface can only extend a shape whose members are known.
export type StateWithLab = BookingState & { lab: string };
export interface StateWithLabI extends BookingState {
  lab: string;
}`,
  "excerpt": `// cuongthai.com backend, src/middleware/auth.ts (excerpt, commit 88ec543b0) — adds fields to Express's own Request.
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      userId?: number;
      /** Per-request correlation id (set by the request-id middleware). */
      id?: string;
    }
  }
}`,
  "prStart": `import type { LabCode, TimeRange } from '../../../../src/rules/schedule.ts';

export interface Booking {
  readonly id: number;
  lab: LabCode;
  range: TimeRange;
  seats: number;
}

export function label(b: Booking): string {
  return b.lab + ' · ' + b.seats + ' seats';
}

// Booking as the calendar export sees it (added later by another teammate).
export interface Booking {
  title: string;
  allDay: boolean;
}

const b1: Booking = { id: 1, lab: 'BE-201', range: [480, 600], seats: 30 };
console.log(label(b1));`,
  "prSol": `import type { LabCode, TimeRange } from '../../../../src/rules/schedule.ts';

export interface Booking {
  readonly id: number;
  lab: LabCode;
  range: TimeRange;
  seats: number;
}

export function label(b: Booking): string {
  return b.lab + ' · ' + b.seats + ' seats';
}

// The calendar's view of a booking is a DIFFERENT shape, so it gets its own name.
export interface CalendarEvent {
  title: string;
  allDay: boolean;
  range: TimeRange;
}

export function toEvent(b: Booking): CalendarEvent {
  return { title: label(b), allDay: false, range: b.range };
}

const b1: Booking = { id: 1, lab: 'BE-201', range: [480, 600], seats: 30 };
console.log(label(b1));
console.log(toEvent(b1));`,
};
export const OUT = {
  '11-both': `$ npx tsc -p demo4/ts-04-2/both
demo4/ts-04-2/both/lab.ts(16,7): error TS2741: Property 'capacity' is missing in type '{ code: "AL-301"; name: string; }' but required in type 'LabI'.
demo4/ts-04-2/both/lab.ts(17,7): error TS2741: Property 'capacity' is missing in type '{ code: "AL-301"; name: string; }' but required in type 'LabT'.`,
  '12-merge': `$ npx tsc -p demo4/ts-04-2/merge
demo4/ts-04-2/merge/user.ts(17,7): error TS2741: Property 'phone' is missing in type '{ id: number; email: string; name: string; }' but required in type 'User'.`,
  '13-merge-run': `$ node demo4/ts-04-2/merge/user.ts
Hello, Nguyen Van An`,
  '14-dup': `$ npx tsc -p demo4/ts-04-2/dup
demo4/ts-04-2/dup/user.ts(2,13): error TS2300: Duplicate identifier 'User'.
demo4/ts-04-2/dup/user.ts(8,13): error TS2300: Duplicate identifier 'User'.`,
  '15-union': `$ npx tsc -p demo4/ts-04-2/union
demo4/ts-04-2/union/status.ts(9,25): error TS1005: '{' expected.`,
  '16-extunion': `$ npx tsc -p demo4/ts-04-2/extunion
demo4/ts-04-2/extunion/view.ts(7,40): error TS2312: An interface can only extend an object type or intersection of object types with statically known members.`,
  '17-pr-start': `$ npx tsc -p demo4/ts-04-2/practice/start
demo4/ts-04-2/practice/start/booking.ts(20,7): error TS2739: Type '{ id: number; lab: "BE-201"; range: [number, number]; seats: number; }' is missing the following properties from type 'Booking': title, allDay`,
  '18-pr-sol': `$ npx tsc -p demo4/ts-04-2/practice/solution && node demo4/ts-04-2/practice/solution/booking.ts
BE-201 · 30 seats
{ title: 'BE-201 · 30 seats', allDay: false, range: [ 480, 600 ] }`,
};
