/**
 * _ma (bài 3.3) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "unionMinutes": `// One helper, two call shapes: the booking form sends ONE time, the CSV import sends a LIST of times.
// First try: a union in, a union out.
import { parseTime } from '../../../src/rules/time.ts';

export function toMinutes(x: string | readonly string[]): number | number[] {
  return typeof x === 'string' ? parseTime(x) : x.map((t) => parseTime(t));
}`,
  "unionUse": `import { toMinutes } from './minutes.ts';

const start: number = toMinutes('08:00');                 // the form: one time
const all: number[] = toMinutes(['08:00', '10:00']);      // the import: a list
console.log(start + 30, all.length);`,
  "ovMinutes": `// The same helper with OVERLOADS: two public signatures, then one implementation.
import { parseTime } from '../../../src/rules/time.ts';

export function toMinutes(text: string): number;                       // overload 1: one time in, one number out
export function toMinutes(texts: readonly string[]): number[];          // overload 2: a list in, a list out
export function toMinutes(x: string | readonly string[]): number | number[] {   // implementation (not callable from outside)
  return typeof x === 'string' ? parseTime(x) : x.map((t) => parseTime(t));
}`,
  "ovUse": `import { toMinutes } from './minutes.ts';

const start: number = toMinutes('08:00');                 // overload 1
const all: number[] = toMinutes(['08:00', '10:00']);      // overload 2
console.log(start + 30, all.length);`,
  "ovWrong": `import { toMinutes } from './minutes.ts';

const one: number = toMinutes(['08:00']);                 // a list in gives a list out
toMinutes(480);                                           // minutes are not "HH:MM"
declare const fromCsv: string | string[];
toMinutes(fromCsv);                                       // a union argument fits neither overload`,
  "dtsJson": `{
  // Ask tsc what callers SEE: write only the declaration file of minutes.ts, into a temporary folder.
  "extends": "../../../tsconfig.json",
  "compilerOptions": { "noEmit": false, "declaration": true, "emitDeclarationOnly": true, "rootDir": "../../..", "outDir": "../../../.dts-03-3" },
  "include": [],
  "files": ["minutes.ts"]
}`,
  "order": `// The same overloads in the WRONG order: the broad signature first.
import { parseTime } from '../../../src/rules/time.ts';

export function toMinutes(x: string | readonly string[]): number | number[];   // broad — tsc tries this one first…
export function toMinutes(text: string): number;                               // …so these two are never reached
export function toMinutes(texts: readonly string[]): number[];
export function toMinutes(x: string | readonly string[]): number | number[] {
  return typeof x === 'string' ? parseTime(x) : x.map((t) => parseTime(t));
}

const start: number = toMinutes('08:00');`,
  "loose": `// An overload can promise more than the implementation keeps.
import { parseTime } from '../../../src/rules/time.ts';

export function toMinutes(text: string): number;
export function toMinutes(texts: readonly string[]): number[];
export function toMinutes(x: string | readonly string[]): number | number[] | undefined {
  if (x === '') return undefined;                // "no time yet" on a half-filled form
  return typeof x === 'string' ? parseTime(x) : x.map((t) => parseTime(t));
}

const start = toMinutes('');                     // overload 1 says: number
console.log('ends at', start + 120, '| label', start.toFixed(0));`,
  "alt": `// The return type does NOT depend on the argument ⇒ a union parameter is enough. No overloads.
import { formatTime } from '../../../src/rules/time.ts';
import type { TimeRange } from '../../../src/rules/schedule.ts';

export function rangeLabel(r: TimeRange | string): string {
  if (typeof r === 'string') return r;                    // already "08:00-10:00"
  return formatTime(r[0]) + '-' + formatTime(r[1]);
}
console.log(rangeLabel([480, 600]), '|', rangeLabel('09:00-11:00'));`,
  "validate": `// A small validate() for this lesson: rules in, problems out, and an optional callback for each problem.
import type { BookingInput } from '../../../src/rules/booking.ts';

export type Problem = { code: string; message: string };
export type Rule = (input: BookingInput) => Problem | null;

export function validate(input: BookingInput, rules: readonly Rule[], onProblem?: (p: Problem) => void): Problem[] {
  const problems: Problem[] = [];
  for (const rule of rules) {
    const p = rule(input);
    if (p === null) continue;
    problems.push(p);
    onProblem?.(p);            // the result of the callback is ignored — that is what void says
  }
  return problems;
}`,
  "voidUse": `import { validate } from './validate.ts';
import type { Problem, Rule } from './validate.ts';

const tooMany: Rule = (b) => (b.seats > 40 ? { code: 'TOO_MANY_SEATS', message: 'At most 40 seats' } : null);
const input = { lab: 'BE-201', seats: 45, role: 'STUDENT', start: '08:00', end: '10:00' } as const;

const log: Problem[] = [];
validate(input, [tooMany], (p) => log.push(p));          // push returns a number — accepted in a void slot

const report2: (p: Problem) => void = (p) => p.code;    // the same body, typed by a function TYPE — accepted

function report(p: Problem): void {
  return p.code;                                         // a function DECLARED void must not return a value
}
const printed = validate(input, [tooMany], report);
validate(input, [tooMany], report2);
console.log(log.length, printed.length);`,
  "asyncSave": `// Saving each problem to the database is async. The callback slot of validate() says "=> void"…
import { validate } from '../void/validate.ts';
import type { Problem, Rule } from '../void/validate.ts';

const tooMany: Rule = (b) => (b.seats > 40 ? { code: 'TOO_MANY_SEATS', message: 'At most 40 seats' } : null);
const input = { lab: 'BE-201', seats: 45, role: 'STUDENT', start: '08:00', end: '10:00' } as const;

async function saveProblem(p: Problem): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 10));
  throw new Error('database is down, could not save ' + p.code);
}

const problems = validate(input, [tooMany], async (p) => {   // …and still accepts an async function
  await saveProblem(p);
});
console.log('validated:', problems.length, 'problem(s) — response sent');`,
  "foreach": `// forEach has a "=> void" callback too: it starts every async callback and waits for none of them.
const saved: string[] = [];
const codes = ['OFF_GRID', 'TOO_LONG'];

codes.forEach(async (code) => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  saved.push(code);
});
console.log('saved after forEach:', saved.length);
setTimeout(() => console.log('saved 50 ms later :', saved.length), 50);`,
  "fixSave": `// The fix: do the async work where someone awaits it — a for…of loop with await, inside try/catch.
import { validate } from '../void/validate.ts';
import type { Problem, Rule } from '../void/validate.ts';

const tooMany: Rule = (b) => (b.seats > 40 ? { code: 'TOO_MANY_SEATS', message: 'At most 40 seats' } : null);
const input = { lab: 'BE-201', seats: 45, role: 'STUDENT', start: '08:00', end: '10:00' } as const;

async function saveProblem(p: Problem): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 10));
  throw new Error('database is down, could not save ' + p.code);
}

const problems = validate(input, [tooMany]);
try {
  for (const p of problems) await saveProblem(p);        // awaited: a failure lands in catch
  console.log('validated and saved');
} catch (e) {
  console.log('could not save:', e instanceof Error ? e.message : String(e), '— answer 503, keep running');
}`,
  "fixForeach": `const saved: string[] = [];
const codes = ['OFF_GRID', 'TOO_LONG'];

for (const code of codes) {
  await new Promise((resolve) => setTimeout(resolve, 10));
  saved.push(code);
}
console.log('saved after the loop:', saved.length);`,
  "prStart": `// How long is a booking? One range in ⇒ minutes; a list of ranges in ⇒ a list of minutes.
import type { TimeRange } from '../../../../src/rules/schedule.ts';

export function durationOf(x: TimeRange | readonly TimeRange[]): number | number[] {
  if (typeof x[0] === 'number') {
    const [start, end] = x as TimeRange;
    return end - start;
  }
  return (x as readonly TimeRange[]).map(([start, end]) => end - start);
}`,
  "prUse": `import { durationOf } from './duration.ts';

const one: number = durationOf([480, 600]);                       // one range: its length in minutes
const many: number[] = durationOf([[480, 600], [600, 690]]);      // a day: one length per range
console.log(one, many);`,
  "prSol": `// How long is a booking? One range in ⇒ minutes; a list of ranges in ⇒ a list of minutes.
import type { TimeRange } from '../../../../src/rules/schedule.ts';

export function durationOf(range: TimeRange): number;
export function durationOf(ranges: readonly TimeRange[]): number[];
export function durationOf(x: TimeRange | readonly TimeRange[]): number | number[] {
  if (isRange(x)) return x[1] - x[0];
  return x.map(([start, end]) => end - start);
}

// A range is two numbers; a list of ranges holds arrays. Checking the first element tells them apart.
function isRange(x: TimeRange | readonly TimeRange[]): x is TimeRange {
  return typeof x[0] === 'number';
}`,
};
export const OUT = {
  '11-union-tsc': `$ npx tsc -p demo3/ts-03-3/union
demo3/ts-03-3/union/use.ts(3,7): error TS2322: Type 'number | number[]' is not assignable to type 'number'.
  Type 'number[]' is not assignable to type 'number'.
demo3/ts-03-3/union/use.ts(4,7): error TS2322: Type 'number | number[]' is not assignable to type 'number[]'.
  Type 'number' is not assignable to type 'number[]'.`,
  '12-overload': `$ npx tsc -p demo3/ts-03-3/overload && echo 'tsc: 0 errors' && node demo3/ts-03-3/overload/use.ts
tsc: 0 errors
510 2`,
  '14-wrong-tsc': `$ npx tsc -p demo3/ts-03-3/overload/wrong.json
demo3/ts-03-3/overload/wrong.ts(3,7): error TS2322: Type 'number[]' is not assignable to type 'number'.
demo3/ts-03-3/overload/wrong.ts(4,11): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type 'number' is not assignable to parameter of type 'readonly string[]'.
demo3/ts-03-3/overload/wrong.ts(6,11): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type 'string | string[]' is not assignable to parameter of type 'readonly string[]'.
      Type 'string' is not assignable to type 'readonly string[]'.`,
  '15-dts': `$ npx tsc -p demo3/ts-03-3/overload/dts.json && cat .dts-03-3/demo3/ts-03-3/overload/minutes.d.ts; rm -rf .dts-03-3
export declare function toMinutes(text: string): number;
export declare function toMinutes(texts: readonly string[]): number[];`,
  '16-order-tsc': `$ npx tsc -p demo3/ts-03-3/order
demo3/ts-03-3/order/minutes.ts(11,7): error TS2322: Type 'number | number[]' is not assignable to type 'number'.
  Type 'number[]' is not assignable to type 'number'.`,
  '17-loose-tsc': `$ npx tsc -p demo3/ts-03-3/loose && echo 'tsc: 0 errors'
tsc: 0 errors`,
  '18-loose-run': `$ node demo3/ts-03-3/loose/minutes.ts; echo exit code: $?
file://…/labflow-ts/demo3/ts-03-3/loose/minutes.ts:12
console.log('ends at', start + 120, '| label', start.toFixed(0));
                                                     ^

TypeError: Cannot read properties of undefined (reading 'toFixed')
    at file://…/labflow-ts/demo3/ts-03-3/loose/minutes.ts:12:54
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3
exit code: 1`,
  '19-alt': `$ npx tsc -p demo3/ts-03-3/alt && echo 'tsc: 0 errors' && node demo3/ts-03-3/alt/label.ts
tsc: 0 errors
08:00-10:00 | 09:00-11:00`,
  '20-void-tsc': `$ npx tsc -p demo3/ts-03-3/void
demo3/ts-03-3/void/use.ts(13,3): error TS2322: Type 'string' is not assignable to type 'void'.`,
  '21-async-tsc': `$ npx tsc -p demo3/ts-03-3/async && echo 'tsc: 0 errors'
tsc: 0 errors`,
  '22-async-run': `$ node demo3/ts-03-3/async/save.ts; echo exit code: $?
validated: 1 problem(s) — response sent
file://…/labflow-ts/demo3/ts-03-3/async/save.ts:10
  throw new Error('database is down, could not save ' + p.code);
        ^

Error: database is down, could not save TOO_MANY_SEATS
    at saveProblem (file://…/labflow-ts/demo3/ts-03-3/async/save.ts:10:9)
    at async file://…/labflow-ts/demo3/ts-03-3/async/save.ts:14:3

Node.js v22.23.3
exit code: 1`,
  '23-foreach-run': `$ node demo3/ts-03-3/async/foreach.ts
saved after forEach: 0
saved 50 ms later : 2`,
  '24-fix': `$ npx tsc -p demo3/ts-03-3/async-fix && echo 'tsc: 0 errors' && node demo3/ts-03-3/async-fix/save.ts && node demo3/ts-03-3/async-fix/foreach.ts
tsc: 0 errors
could not save: database is down, could not save TOO_MANY_SEATS — answer 503, keep running
saved after the loop: 2`,
  '26-pr-start': `$ npx tsc -p demo3/ts-03-3/practice/start
demo3/ts-03-3/practice/start/use.ts(3,7): error TS2322: Type 'number | number[]' is not assignable to type 'number'.
  Type 'number[]' is not assignable to type 'number'.
demo3/ts-03-3/practice/start/use.ts(4,7): error TS2322: Type 'number | number[]' is not assignable to type 'number[]'.
  Type 'number' is not assignable to type 'number[]'.`,
  '27-pr-sol': `$ npx tsc -p demo3/ts-03-3/practice/solution && echo 'tsc: 0 errors' && node demo3/ts-03-3/practice/solution/use.ts
tsc: 0 errors
120 [ 120, 90 ]`,
};
