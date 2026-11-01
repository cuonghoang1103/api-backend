/**
 * _ma (bài 3.2) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "rules": `// LabFlow's booking checks as VALUES: each rule is a function, and the list of rules is just an array.
import { parseTime } from '../../../src/rules/time.ts';
import type { BookingInput } from '../../../src/rules/booking.ts';

export type ProblemCode = 'OFF_GRID' | 'END_BEFORE_START' | 'OUTSIDE_HOURS' | 'TOO_LONG' | 'TOO_MANY_SEATS';
export type Problem = { code: ProblemCode; message: string };

// A function TYPE: "takes one booking request, returns a Problem or null".
export type Rule = (input: BookingInput) => Problem | null;

export const endAfterStart: Rule = (input) =>
  parseTime(input.end) <= parseTime(input.start)
    ? { code: 'END_BEFORE_START', message: 'The end must be after the start' }
    : null;

export const notTooLong: Rule = (input) =>
  parseTime(input.end) - parseTime(input.start) > 240
    ? { code: 'TOO_LONG', message: 'At most 4 hours' }
    : null;

// A function that RETURNS a rule. The returned arrow remembers \`limit\` (a closure).
export function maxSeats(limit: number): Rule {
  return (input) =>
    input.seats > limit ? { code: 'TOO_MANY_SEATS', message: 'At most ' + limit + ' seats' } : null;
}

export function validate(input: BookingInput, rules: readonly Rule[]): Problem[] {
  const problems: Problem[] = [];
  for (const rule of rules) {
    const problem = rule(input);
    if (problem !== null) problems.push(problem);
  }
  return problems;
}`,
  "run": `import { validate, endAfterStart, notTooLong, maxSeats } from './rules.ts';
import type { Rule } from './rules.ts';

const RULES: readonly Rule[] = [endAfterStart, notTooLong, maxSeats(40)];

const ok = { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' } as const;
const bad = { lab: 'BE-201', seats: 45, role: 'STUDENT', start: '10:00', end: '08:00' } as const;

console.log('ok  →', validate(ok, RULES));
console.log('bad →', validate(bad, RULES).map((p) => p.code));
console.log('lecture hall rule →', validate(bad, [maxSeats(60)]).length, 'problems');`,
  "js": `// The same rule list in plain JavaScript. Two teammates added a rule each — with the wrong shape.
function validate(input, rules) {
  const problems = [];
  for (const rule of rules) {
    const problem = rule(input);
    if (problem !== null) problems.push(problem);
  }
  return problems;
}

const maxSeats40 = (input) => (input.seats > 40 ? { code: 'TOO_MANY_SEATS', message: 'At most 40 seats' } : null);
const seatsOnly = (seats) => (seats > 40 ? { code: 'TOO_MANY_SEATS', message: 'At most 40 seats' } : null);   // expects a number
const tooLong = (input) => 'TOO_LONG';                                                                 // returns a string

const input = { lab: 'BE-201', seats: 45, role: 'STUDENT', start: '08:00', end: '13:00' };
console.log('right rule      →', validate(input, [maxSeats40]).map((p) => p.code));
console.log('seatsOnly rule  →', validate(input, [seatsOnly]).map((p) => p.code));
console.log('string rule     →', validate(input, [tooLong]).map((p) => p.code));`,
  "wrong": `// Which functions fit the Rule slot? tsc compares parameters and return types.
import type { Rule } from '../rules/rules.ts';
import type { BookingInput } from '../../../src/rules/booking.ts';

const fewer: Rule = () => null;                                    // fine: ignoring the input is allowed
const exact: Rule = (input) => (input.seats > 40 ? null : null);   // fine: the shape matches

const seatsOnly: Rule = (seats: number) => (seats > 40 ? { code: 'TOO_MANY_SEATS', message: 'Too many' } : null);
const needsDay: Rule = (input: BookingInput, day: string) => null;
const text: Rule = (input) => 'TOO_LONG';
const badCode: Rule = (input) => ({ code: 'TOO_LATE', message: 'Booked too late' });

console.log(fewer, exact, seatsOnly, needsDay, text, badCode);`,
  "fnLoose": `// The type Function says "something callable" — and nothing about what goes in or comes out.
import { endAfterStart } from '../rules/rules.ts';

const loose: Function[] = [endAfterStart, (seats: number) => seats * 2];

const input = { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '10:00', end: '08:00' } as const;
for (const rule of loose) {
  const problem = rule(input);           // problem: any
  console.log(problem?.cod);             // typo in "code" — not reported
}`,
  "fnTyped": `// The same list, typed with the Rule function type.
import { endAfterStart } from '../rules/rules.ts';
import type { Rule } from '../rules/rules.ts';

const typed: Rule[] = [endAfterStart, (seats: number) => seats * 2];

const input = { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '10:00', end: '08:00' } as const;
for (const rule of typed) {
  const problem = rule(input);           // problem: Problem | null
  console.log(problem?.cod);
}`,
  "context": `// No annotation inside the callbacks: the Rule[] type flows into them (contextual typing).
import { endAfterStart, notTooLong, maxSeats } from '../rules/rules.ts';
import type { Problem, Rule } from '../rules/rules.ts';

const RULES: readonly Rule[] = [endAfterStart, notTooLong, maxSeats(40)];
const input = { lab: 'BE-201', seats: 45, role: 'STUDENT', start: '08:00', end: '13:00' } as const;

export const results = RULES.map((rule) => rule(input));                 // (Problem | null)[]
export const problems = results.filter((p) => p !== null);               // Problem[] — tsc 5.5+ infers the check
export const codes = problems.map((p) => p.code);                         // ProblemCode[]
export const firstMessage: string | undefined = problems[0]?.message;

const strict: Problem[] = problems;
console.log(codes, firstMessage, strict.length);`,
  "hours": `// A lecturer types the hours she wants to block, as text: "07,08,09,10".
const typed = '07,08,09,10'.split(',');

const hours: number[] = typed.map(parseInt);               // passes parseInt itself as the callback
const fixed: number[] = typed.map((h) => Number.parseInt(h, 10));

console.log('map(parseInt)       →', hours);
console.log('map(h => parseInt…) →', fixed);`,
  "why": `// Why tsc accepts it: write both function types down and compare them.
type MapCallback = (value: string, index: number, array: string[]) => number;
type ParseInt = (string: string, radix?: number) => number;

const parse: ParseInt = parseInt;
const asCallback: MapCallback = parse;   // radix? receives the index: 0, 1, 2, 3
console.log(['07', '08', '09', '10'].map((h, i) => 'parseInt("' + h + '", ' + i + ') = ' + asCallback(h, i, [])).join('\\n'));`,
  "method": `// Advanced: method syntax vs property syntax under strictFunctionTypes.
import type { BookingInput } from '../../../src/rules/booking.ts';

type Admin = { lab: string; seats: number; role: 'ADMIN'; start: string; end: string };
const onlyAdmins = (input: Admin) => input.seats;   // handles a NARROWER input than BookingInput

type AsProperty = { check: (input: BookingInput) => number };
type AsMethod = { check(input: BookingInput): number };

const a: AsProperty = { check: onlyAdmins };   // refused: a student request could reach it
const b: AsMethod = { check: onlyAdmins };     // accepted: methods are checked "bivariantly"
console.log(a, b);`,
  "prStart": `// Practice — a rule factory: notBefore('09:00') makes a rule that refuses bookings starting earlier.
import { parseTime } from '../../../../src/rules/time.ts';

export function notBefore(time) {
  return (input) =>
    parseTime(input.start) < parseTime(time) ? { code: 'OUTSIDE_HOURS', message: 'Not before ' + time } : null;
}`,
  "prSol": `// Practice — solution: type the factory's parameter and its RESULT; the inner arrow then needs no annotation.
import { parseTime } from '../../../../src/rules/time.ts';
import type { Rule } from '../../rules/rules.ts';

export function notBefore(time: string): Rule {
  return (input) =>
    parseTime(input.start) < parseTime(time) ? { code: 'OUTSIDE_HOURS', message: 'Not before ' + time } : null;
}`,
  "prUse": `import { notBefore } from './early.ts';
import { validate, maxSeats } from '../../rules/rules.ts';

const morningExam = { lab: 'AL-301', seats: 35, role: 'LECTURER', start: '08:00', end: '10:00' } as const;
console.log(validate(morningExam, [notBefore('09:00'), maxSeats(40)]));
console.log(validate(morningExam, [notBefore('07:30'), maxSeats(40)]));`,
  "prWrong": `import { notBefore } from './early.ts';
notBefore(540);                 // minutes instead of "HH:MM"`,
};
export const OUT = {
  '01-rules-run': `$ npx tsc -p demo3/ts-03-2/rules && node demo3/ts-03-2/rules/run.ts
ok  → []
bad → [ 'END_BEFORE_START', 'TOO_MANY_SEATS' ]
lecture hall rule → 0 problems`,
  '02-js': `$ node demo3/ts-03-2/js/validate.js
right rule      → [ 'TOO_MANY_SEATS' ]
seatsOnly rule  → []
string rule     → [ undefined ]`,
  '03-wrong': `$ npx tsc -p demo3/ts-03-2/wrong
demo3/ts-03-2/wrong/wrong.ts(8,7): error TS2322: Type '(seats: number) => { code: "TOO_MANY_SEATS"; message: string; } | null' is not assignable to type 'Rule'.
  Types of parameters 'seats' and 'input' are incompatible.
    Type 'BookingInput' is not assignable to type 'number'.
demo3/ts-03-2/wrong/wrong.ts(9,7): error TS2322: Type '(input: BookingInput, day: string) => null' is not assignable to type 'Rule'.
  Target signature provides too few arguments. Expected 2 or more, but got 1.
demo3/ts-03-2/wrong/wrong.ts(10,31): error TS2322: Type 'string' is not assignable to type 'Problem'.
demo3/ts-03-2/wrong/wrong.ts(11,37): error TS2322: Type '"TOO_LATE"' is not assignable to type 'ProblemCode'.`,
  '04-fn-loose': `$ npx tsc -p demo3/ts-03-2/fn && node demo3/ts-03-2/fn/function-type.ts
undefined
undefined`,
  '05-fn-typed': `$ npx tsc -p demo3/ts-03-2/fn/typed.json
demo3/ts-03-2/fn/typed.ts(5,39): error TS2322: Type '(seats: number) => number' is not assignable to type 'Rule'.
  Types of parameters 'seats' and 'input' are incompatible.
    Type 'BookingInput' is not assignable to type 'number'.
demo3/ts-03-2/fn/typed.ts(10,24): error TS2551: Property 'cod' does not exist on type 'Problem'. Did you mean 'code'?`,
  '06-context': `$ npx tsc -p demo3/ts-03-2/context && node demo3/ts-03-2/context/context.ts
[ 'TOO_LONG', 'TOO_MANY_SEATS' ] At most 4 hours 2`,
  '07-context-dts': `$ npx tsc -p demo3/ts-03-2/context/dts.json && cat .dts-03-2/demo3/ts-03-2/context/context.d.ts
import type { Problem } from '../rules/rules.ts';
export declare const results: (Problem | null)[];
export declare const problems: Problem[];
export declare const codes: import("../rules/rules.ts").ProblemCode[];
export declare const firstMessage: string | undefined;`,
  '08-parseint': `$ npx tsc -p demo3/ts-03-2/parseint && node demo3/ts-03-2/parseint/hours.ts
map(parseInt)       → [ 7, NaN, 0, 3 ]
map(h => parseInt…) → [ 7, 8, 9, 10 ]`,
  '09-why': `$ node demo3/ts-03-2/parseint/why.ts
parseInt("07", 0) = 7
parseInt("08", 1) = NaN
parseInt("09", 2) = 0
parseInt("10", 3) = 3`,
  '10-method': `$ npx tsc -p demo3/ts-03-2/method
demo3/ts-03-2/method/method.ts(10,25): error TS2322: Type '(input: Admin) => number' is not assignable to type '(input: BookingInput) => number'.
  Types of parameters 'input' and 'input' are incompatible.
    Type 'BookingInput' is not assignable to type 'Admin'.
      Types of property 'role' are incompatible.
        Type 'Role' is not assignable to type '"ADMIN"'.
          Type '"LECTURER"' is not assignable to type '"ADMIN"'.`,
  '11-pr-start': `$ npx tsc -p demo3/ts-03-2/practice/start
demo3/ts-03-2/practice/start/early.ts(4,27): error TS7006: Parameter 'time' implicitly has an 'any' type.
demo3/ts-03-2/practice/start/early.ts(5,11): error TS7006: Parameter 'input' implicitly has an 'any' type.`,
  '12-pr-sol': `$ npx tsc -p demo3/ts-03-2/practice/solution && node demo3/ts-03-2/practice/solution/use.ts
[ { code: 'OUTSIDE_HOURS', message: 'Not before 09:00' } ]
[]`,
  '13-pr-wrong': `$ npx tsc -p demo3/ts-03-2/practice/solution/wrong.json
demo3/ts-03-2/practice/solution/wrong.ts(2,11): error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.`,
};
