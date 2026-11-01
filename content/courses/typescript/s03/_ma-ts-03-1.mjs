/**
 * _ma (bài 3.1) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "missingJs": `// Plain JavaScript: how many arguments a function receives is never checked.
import { formatTime } from '../../../js/time.js';

function rangeLabel(start, end) {
  return formatTime(start) + '–' + formatTime(end);
}

console.log('two arguments  :', rangeLabel(480, 600));
console.log('one argument   :', rangeLabel(480));               // forgot the end
console.log('three arguments:', rangeLabel(480, 600, 'BE-201')); // the extra one is silently dropped`,
  "count": `import { formatTime } from '../../../src/rules/time.ts';

export function rangeLabel(start: number, end: number): string {
  return formatTime(start) + '–' + formatTime(end);
}

rangeLabel(480, 600);
rangeLabel(480);
rangeLabel(480, 600, 'BE-201');`,
  "optional": `import { formatTime } from '../../../src/rules/time.ts';

// The end may not be known yet (a booking that is still "open").
export function rangeLabel(start: number, end?: number): string {
  return formatTime(start) + '–' + formatTime(end);
}

export function lengthOf(start: number, end?: number): number {
  return end - start;
}

rangeLabel(480, 600);
rangeLabel(480);
rangeLabel(480, 600, 'BE-201');`,
  "optionalFixed": `import { formatTime } from '../../../src/rules/time.ts';

export function rangeLabel(start: number, end?: number): string {
  if (end === undefined) return 'from ' + formatTime(start);   // after this line, end is a number
  return formatTime(start) + '–' + formatTime(end);
}

console.log(rangeLabel(480, 600));
console.log(rangeLabel(480));`,
  "order": `import { formatTime } from '../../../src/rules/time.ts';

// "Optional first, it is the less important one" — tsc does not allow it.
export function timeText(withSeconds?: boolean, minutes: number): string {
  return withSeconds ? formatTime(minutes) + ':00' : formatTime(minutes);
}`,
  "optUndef": `// Two signatures that LOOK the same.
export function a(start: number, end?: number): number { return end ?? start; }
export function b(start: number, end: number | undefined): number { return end ?? start; }

a(480);
b(480);
b(480, undefined);`,
  "defaultTime": `// Defaults: the caller may leave the argument out, and inside the function it is never undefined.
export function formatTime(minutes: number, separator = ':'): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return String(h).padStart(2, '0') + separator + String(m).padStart(2, '0');
}

// A default on a destructured property: seats is 1 when the request does not say.
export function seatsOf({ seats = 1 }: { lab: string; seats?: number }) {
  return seats;
}`,
  "defaultUse": `import { formatTime, seatsOf } from './time.ts';

console.log(formatTime(480), formatTime(480, 'h'), formatTime(480, undefined));
console.log(seatsOf({ lab: 'BE-201' }), seatsOf({ lab: 'BE-201', seats: 12 }));`,
  "nullRequest": `// A booking request arrives as JSON from a form. The seats field was cleared, so the browser sent null.
import { needsApproval } from '../../../src/rules/booking.ts';
import type { Role } from '../../../src/rules/booking.ts';

function approvalFor({ seats = 1, role = 'STUDENT' }: { seats?: number; role?: Role }): boolean {
  return needsApproval({ seats, role });       // seats "is" a number here, says the type
}

const bodies = ['{"role":"LECTURER"}', '{"seats":null,"role":"STUDENT"}'];
for (const text of bodies) {
  const body = JSON.parse(text);               // any — tsc checks nothing below
  try {
    console.log(text, '→ needs approval?', approvalFor(body));
  } catch (e) {
    console.log(text, '→ throws', String(e));
  }
}`,
  "nullTyped": `// The same call with a typed body: tsc refuses null for a parameter that is only "optional".
import type { Role } from '../../../src/rules/booking.ts';

function seatsWanted({ seats = 1 }: { seats?: number; role?: Role }): number {
  return seats;
}

seatsWanted({ role: 'LECTURER' });
seatsWanted({ seats: null, role: 'STUDENT' });`,
  "nullFixed": `// If null really can arrive, say so in the type — and use ?? (null AND undefined) instead of a default (undefined only).
import { needsApproval } from '../../../src/rules/booking.ts';
import type { Role } from '../../../src/rules/booking.ts';

function approvalFor(body: { seats?: number | null; role?: Role }): boolean {
  const seats = body.seats ?? 1;
  const role = body.role ?? 'STUDENT';
  return needsApproval({ seats, role });
}

console.log(approvalFor({ role: 'LECTURER' }), approvalFor({ seats: null, role: 'STUDENT' }));`,
  "restTotal": `import type { TimeRange } from '../../../src/rules/schedule.ts';

// Any number of ranges — zero included. Inside, ranges is an ordinary array: TimeRange[].
export function totalMinutes(...ranges: TimeRange[]): number {
  let total = 0;
  for (const [start, end] of ranges) total += end - start;
  return total;
}`,
  "restUse": `import { totalMinutes } from './total.ts';

console.log(totalMinutes());
console.log(totalMinutes([480, 600]));
console.log(totalMinutes([480, 600], [600, 720], [780, 840]));`,
  "restWrong": `import { totalMinutes } from './total.ts';

totalMinutes([480, 600], 720);
totalMinutes([480, 600, 660]);

// No type on a rest parameter:
export function countAll(...items) {
  return items.length;
}`,
  "spread": `import { formatTime } from '../../../src/rules/time.ts';
import type { ScheduleEntry, TimeRange } from '../../../src/rules/schedule.ts';
import { totalMinutes } from '../rest/total.ts';

function rangeLabel(start: number, end: number): string {
  return formatTime(start) + '–' + formatTime(end);
}

const today: ScheduleEntry[] = [
  { id: 1, lab: 'BE-201', range: [480, 600], bookedBy: 'an.nv', note: null },
  { id: 2, lab: 'BE-201', range: [600, 720], bookedBy: 'binh.tt', note: null },
];

const range: TimeRange = [480, 600];
const loose = [480, 600];                       // inferred number[] — any length

console.log(rangeLabel(...range));              // a tuple spreads into exactly two parameters
console.log(totalMinutes(...today.map((e) => e.range)));   // an array spreads into a REST parameter
rangeLabel(...loose);`,
  "flags": `// What does true, false mean at the call site? Nobody can tell — and swapping them compiles.
function book(lab: string, notifyLecturer: boolean, allowWaitlist: boolean): string {
  return lab + (notifyLecturer ? ' · e-mail the lecturer' : '') + (allowWaitlist ? ' · waitlist if full' : '');
}

console.log(book('BE-201', true, false));   // what the author meant
console.log(book('BE-201', false, true));   // a teammate's call, arguments swapped by mistake`,
  "options": `// One options object: every call names what it switches on, and both keys are optional with defaults.
type BookOptions = { notifyLecturer?: boolean; allowWaitlist?: boolean };

function book(lab: string, { notifyLecturer = false, allowWaitlist = false }: BookOptions = {}): string {
  return lab + (notifyLecturer ? ' · e-mail the lecturer' : '') + (allowWaitlist ? ' · waitlist if full' : '');
}

console.log(book('BE-201', { notifyLecturer: true }));
console.log(book('BE-201'));
book('BE-201', true);
book('BE-201', { notifyLecturr: true });`,
  "retInfer": `import { parseTime } from '../../../../src/rules/time.ts';

// No return type: tsc infers it from every return statement — including the one a teammate added last week.
export function durationOf(start: string, end: string) {
  const s = parseTime(start);
  const e = parseTime(end);
  if (e <= s) return 'invalid';
  return e - s;
}`,
  "retReport": `import { durationOf } from './duration.ts';

// Another file, another person: the error shows up HERE, far from the line that caused it.
const minutes: number = durationOf('08:00', '10:00');
console.log(minutes);`,
  "retAnnotated": `import { parseTime } from '../../../../src/rules/time.ts';

// The return type is part of the contract: the wrong line is refused where it is written.
export function durationOf(start: string, end: string): number {
  const s = parseTime(start);
  const e = parseTime(end);
  if (e <= s) return 'invalid';
  return e - s;
}`,
  "prStart": `// "BE-201 08:00–10:00", or "BE-201 from 08:00" while the end is not decided yet.
import { formatTime } from '../../../../src/rules/time.ts';

export function bookingLabel(lab, start, end) {
  if (end === undefined) return lab + ' from ' + formatTime(start);
  return lab + ' ' + formatTime(start) + '–' + formatTime(end);
}

console.log(bookingLabel('BE-201', 480, 600));
console.log(bookingLabel('BE-201', 480));`,
  "prSol": `// "BE-201 08:00–10:00", or "BE-201 from 08:00" while the end is not decided yet.
import { formatTime } from '../../../../src/rules/time.ts';

export function bookingLabel(lab: string, start: number, end?: number): string {
  if (end === undefined) return lab + ' from ' + formatTime(start);
  return lab + ' ' + formatTime(start) + '–' + formatTime(end);
}

console.log(bookingLabel('BE-201', 480, 600));
console.log(bookingLabel('BE-201', 480));`,
};
export const OUT = {
  '11-js-missing': `$ node demo3/ts-03-1/js/missing.mjs
two arguments  : 08:00–10:00
one argument   : 08:00–NaN:NaN
three arguments: 08:00–10:00`,
  '12-count': `$ npx tsc -p demo3/ts-03-1/count
demo3/ts-03-1/count/label.ts(8,1): error TS2554: Expected 2 arguments, but got 1.
demo3/ts-03-1/count/label.ts(9,22): error TS2554: Expected 2 arguments, but got 3.`,
  '13-optional': `$ npx tsc -p demo3/ts-03-1/optional
demo3/ts-03-1/optional/label.ts(5,47): error TS2345: Argument of type 'number | undefined' is not assignable to parameter of type 'number'.
  Type 'undefined' is not assignable to type 'number'.
demo3/ts-03-1/optional/label.ts(9,10): error TS18048: 'end' is possibly 'undefined'.
demo3/ts-03-1/optional/label.ts(14,22): error TS2554: Expected 1-2 arguments, but got 3.`,
  '14-optional-run': `$ node demo3/ts-03-1/optional/fixed.ts
08:00–10:00
from 08:00`,
  '15-order': `$ npx tsc -p demo3/ts-03-1/order
demo3/ts-03-1/order/label.ts(4,49): error TS1016: A required parameter cannot follow an optional parameter.`,
  '16-opt-undef': `$ npx tsc -p demo3/ts-03-1/opt-undef
demo3/ts-03-1/opt-undef/two.ts(6,1): error TS2554: Expected 2 arguments, but got 1.`,
  '17-default-dts': `$ npx tsc -p demo3/ts-03-1/default/dts.json && cat .dts-03-1/time.d.ts && rm -rf .dts-03-1
export declare function formatTime(minutes: number, separator?: string): string;
export declare function seatsOf({ seats }: {
    lab: string;
    seats?: number;
}): number;`,
  '18-default-run': `$ npx tsc -p demo3/ts-03-1/default && node demo3/ts-03-1/default/use.ts
08:00 08h00 08:00
1 12`,
  '19-null-run': `$ node demo3/ts-03-1/null-default/request.ts
{"role":"LECTURER"} → needs approval? false
{"seats":null,"role":"STUDENT"} → throws RangeError: seats must be a positive integer, got null`,
  '20-null-tsc': `$ npx tsc -p demo3/ts-03-1/null-default
demo3/ts-03-1/null-default/typed.ts(9,15): error TS2322: Type 'null' is not assignable to type 'number | undefined'.`,
  '21-null-fixed': `$ node demo3/ts-03-1/null-default/fixed.ts
false false`,
  '22-rest-tsc': `$ npx tsc -p demo3/ts-03-1/rest
demo3/ts-03-1/rest/wrong.ts(3,26): error TS2345: Argument of type 'number' is not assignable to parameter of type 'TimeRange'.
demo3/ts-03-1/rest/wrong.ts(4,14): error TS2345: Argument of type '[number, number, number]' is not assignable to parameter of type 'TimeRange'.
  Source has 3 element(s) but target allows only 2.
demo3/ts-03-1/rest/wrong.ts(7,26): error TS7019: Rest parameter 'items' implicitly has an 'any[]' type.`,
  '23-rest-run': `$ node demo3/ts-03-1/rest/use.ts
0
120
300`,
  '24-spread-tsc': `$ npx tsc -p demo3/ts-03-1/spread
demo3/ts-03-1/spread/spread.ts(19,12): error TS2556: A spread argument must either have a tuple type or be passed to a rest parameter.`,
  '25-spread-run': `$ node demo3/ts-03-1/spread/spread.ts
08:00–10:00
240`,
  '26-flags-run': `$ node demo3/ts-03-1/flags/flags.ts
BE-201 · e-mail the lecturer
BE-201 · waitlist if full`,
  '27-flags-tsc': `$ npx tsc -p demo3/ts-03-1/flags
demo3/ts-03-1/flags/options.ts(10,16): error TS2559: Type 'true' has no properties in common with type 'BookOptions'.
demo3/ts-03-1/flags/options.ts(11,18): error TS2561: Object literal may only specify known properties, but 'notifyLecturr' does not exist in type 'BookOptions'. Did you mean to write 'notifyLecturer'?`,
  '28-options-run': `$ node demo3/ts-03-1/flags/options.ts
BE-201 · e-mail the lecturer
BE-201`,
  '29-return-infer': `$ npx tsc -p demo3/ts-03-1/return/infer
demo3/ts-03-1/return/infer/report.ts(4,7): error TS2322: Type 'number | "invalid"' is not assignable to type 'number'.
  Type 'string' is not assignable to type 'number'.`,
  '30-return-annotated': `$ npx tsc -p demo3/ts-03-1/return/annotated
demo3/ts-03-1/return/annotated/duration.ts(7,15): error TS2322: Type 'string' is not assignable to type 'number'.`,
  '31-pr-start': `$ npx tsc -p demo3/ts-03-1/practice/start
demo3/ts-03-1/practice/start/label.ts(4,30): error TS7006: Parameter 'lab' implicitly has an 'any' type.
demo3/ts-03-1/practice/start/label.ts(4,35): error TS7006: Parameter 'start' implicitly has an 'any' type.
demo3/ts-03-1/practice/start/label.ts(4,42): error TS7006: Parameter 'end' implicitly has an 'any' type.
demo3/ts-03-1/practice/start/label.ts(10,13): error TS2554: Expected 3 arguments, but got 2.`,
  '32-pr-start-run': `$ node demo3/ts-03-1/practice/start/label.ts
BE-201 08:00–10:00
BE-201 from 08:00`,
  '33-pr-sol': `$ npx tsc -p demo3/ts-03-1/practice/solution && node demo3/ts-03-1/practice/solution/label.ts
BE-201 08:00–10:00
BE-201 from 08:00`,
};
