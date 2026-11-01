/**
 * _ma (bài 3.4) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "lostValidator": `// A LabFlow validator as an object: run() reads its rules through this.
import { checkSlot } from '../../../src/rules/booking.ts';
import type { BookingInput } from '../../../src/rules/booking.ts';

export type Problem = { code: string; message: string };
export type Rule = (input: BookingInput) => Problem | null;

const slotRule: Rule = ({ start, end }) => {
  const slot = checkSlot(start, end);
  return slot.ok ? null : { code: slot.code, message: start + '–' + end + ' is not a valid slot' };
};
const seatRule: Rule = ({ seats }) => (seats > 40 ? { code: 'TOO_MANY_SEATS', message: 'At most 40 seats' } : null);

export const validator = {
  name: 'booking-form',
  rules: [slotRule, seatRule],
  run(input: BookingInput): Problem[] {
    const found: Problem[] = [];
    for (const rule of this.rules) {
      const p = rule(input);
      if (p !== null) found.push(p);
    }
    return found;
  },
};`,
  "lostRun": `import { validator } from './validator.ts';
import type { BookingInput } from '../../../src/rules/booking.ts';

const bad: BookingInput = { lab: 'BE-201', seats: 45, role: 'STUDENT', start: '08:15', end: '10:00' };

console.log('validator.run(bad) →', validator.run(bad).map((p) => p.code));

const run = validator.run;            // the same function, taken off its object
console.log('run(bad)           →', run(bad));`,
  "plain": `// The same loop as a plain function. Who is "this" here? It depends on the caller — tsc cannot know.
import type { BookingInput } from '../../../src/rules/booking.ts';
import type { Problem, Rule } from '../lost/validator.ts';

export function runRules(input: BookingInput): Problem[] {
  const found: Problem[] = [];
  for (const rule of this.rules) {
    const p: Problem | null = rule(input);
    if (p !== null) found.push(p);
  }
  return found;
}

export const checks: { rules: Rule[]; run: typeof runRules } = { rules: [], run: runRules };`,
  "loose": `{ "extends": "../../../tsconfig.json", "compilerOptions": { "noImplicitThis": false }, "include": ["plain.ts"] }`,
  "paramValidator": `// Same validator, now with a this parameter: run must be called ON a Validator.
import { checkSlot } from '../../../src/rules/booking.ts';
import type { BookingInput } from '../../../src/rules/booking.ts';
import type { Problem, Rule } from '../lost/validator.ts';

export type Validator = {
  name: string;
  rules: readonly Rule[];
  run(this: Validator, input: BookingInput): Problem[];
};

const slotRule: Rule = ({ start, end }) => {
  const slot = checkSlot(start, end);
  return slot.ok ? null : { code: slot.code, message: start + '–' + end + ' is not a valid slot' };
};

export const validator: Validator = {
  name: 'booking-form',
  rules: [slotRule],
  run(input) {
    const found: Problem[] = [];
    for (const rule of this.rules) {
      const p = rule(input);
      if (p !== null) found.push(p);
    }
    return found;
  },
};`,
  "paramUse": `import { validator } from './validator.ts';
import type { BookingInput } from '../../../src/rules/booking.ts';

const bad: BookingInput = { lab: 'BE-201', seats: 45, role: 'STUDENT', start: '08:15', end: '10:00' };

validator.run(bad);                         // fine: called on the object
const run = validator.run;
run(bad);                                   // no object in front of the call
validator.run.call(validator, bad);         // fine: this given explicitly
const bound = validator.run.bind(validator);
bound(bad);                                 // fine: bind fixed this
[bad, bad].map(validator.run);              // passed as a callback
setTimeout(validator.run, 0, bad);          // passed to a timer`,
  "paramRun": `// Run each way of calling run() for real. Node strips the this parameter and checks nothing.
import { validator } from './validator.ts';
import type { BookingInput } from '../../../src/rules/booking.ts';

const bad: BookingInput = { lab: 'BE-201', seats: 45, role: 'STUDENT', start: '08:15', end: '10:00' };

function attempt(label: string, call: () => unknown): void {
  try {
    console.log(label.padEnd(40), '→', JSON.stringify(call()));
  } catch (e) {
    console.log(label.padEnd(40), '→ throws', String(e));
  }
}

attempt('validator.run(bad)', () => validator.run(bad));
attempt('validator.run.call(validator, bad)', () => validator.run.call(validator, bad));
attempt('validator.run.bind(validator)(bad)', () => validator.run.bind(validator)(bad));
attempt('[bad].map(validator.run)', () => [bad].map(validator.run));
attempt('[bad].map(validator.run, validator)', () => [bad].map(validator.run, validator));
attempt('[bad].map((b) => validator.run(b))', () => [bad].map((b) => validator.run(b)));
console.log('validator.run.length =', validator.run.length, '(the this parameter is not a real parameter)');`,
  "form": `// An Express-style registration API that SAYS it will call handlers without an object: this: void.
import { validator } from './validator.ts';
import type { BookingInput } from '../../../src/rules/booking.ts';
import type { Problem } from '../lost/validator.ts';

type Handler = (this: void, input: BookingInput) => Problem[];

const handlers: Handler[] = [];
export function onSubmit(handler: Handler): void {
  handlers.push(handler);
}

onSubmit(validator.run);                          // a method that needs its object
onSubmit((input) => validator.run(input));        // a wrapper that calls it ON the object`,
  "timer": `// A method handed to a timer: Node calls it later, with its own Timeout object as this.
import { validator } from './validator.ts';
import type { BookingInput } from '../../../src/rules/booking.ts';

const bad: BookingInput = { lab: 'BE-201', seats: 45, role: 'STUDENT', start: '08:15', end: '10:00' };

setTimeout(validator.run, 0, bad);
console.log('timer scheduled');`,
  "arrow": `// "Arrow functions keep this" — so make run an arrow? An arrow keeps the this of where it is WRITTEN: here, the module.
import type { BookingInput } from '../../../src/rules/booking.ts';
import type { Problem, Rule } from '../lost/validator.ts';

const seatRule: Rule = ({ seats }) => (seats > 40 ? { code: 'TOO_MANY_SEATS', message: 'At most 40 seats' } : null);

export const validator = {
  rules: [seatRule],
  run: (input: BookingInput): Problem[] => {
    const found: Problem[] = [];
    for (const rule of this.rules) {
      const p = rule(input);
      if (p !== null) found.push(p);
    }
    return found;
  },
};`,
  "fixValidator": `// The sturdiest fix: no this at all. The rules live in a closure.
import { checkSlot } from '../../../src/rules/booking.ts';
import type { BookingInput } from '../../../src/rules/booking.ts';
import type { Problem, Rule } from '../lost/validator.ts';

export type Validator = { name: string; run: (input: BookingInput) => Problem[] };

export function createValidator(name: string, rules: readonly Rule[]): Validator {
  return {
    name,
    run: (input) => {                     // an arrow: nothing to lose, it never reads this
      const found: Problem[] = [];
      for (const rule of rules) {         // "rules" comes from the closure, not from this
        const p = rule(input);
        if (p !== null) found.push(p);
      }
      return found;
    },
  };
}

const slotRule: Rule = ({ start, end }) => {
  const slot = checkSlot(start, end);
  return slot.ok ? null : { code: slot.code, message: start + '–' + end + ' is not a valid slot' };
};
export const validator = createValidator('booking-form', [slotRule]);`,
  "fixRun": `import { validator } from './validator.ts';
import type { BookingInput } from '../../../src/rules/booking.ts';

const bad: BookingInput = { lab: 'BE-201', seats: 45, role: 'STUDENT', start: '08:15', end: '10:00' };

const run = validator.run;
console.log('run(bad)                 →', run(bad).map((p) => p.code));
console.log('[bad].map(validator.run) →', [bad].map(validator.run).map((ps) => ps.length));
setTimeout(() => console.log('inside setTimeout         →', validator.run(bad).length), 0);`,
  "prStart": `// Collect the problems of one booking into a small report, then print it.
import type { Problem } from '../../lost/validator.ts';

type Report = { title: string; lines: string[]; add(line: string): void; print(): void };

const report: Report = {
  title: 'Booking BE-201 08:15–10:00',
  lines: [],
  add(line) {
    this.lines.push(line);
  },
  print() {
    console.log(this.title);
    for (const line of this.lines) console.log('  - ' + line);
  },
};

const problems: Problem[] = [
  { code: 'OFF_GRID', message: '08:15 is not on the 30-minute grid' },
  { code: 'TOO_MANY_SEATS', message: 'At most 40 seats' },
];
problems.map((p) => p.message).forEach(report.add);
report.print();`,
  "prStep1": `// Step 1: the type now says add() and print() need a Report as this.
import type { Problem } from '../../lost/validator.ts';

type Report = { title: string; lines: string[]; add(this: Report, line: string): void; print(this: Report): void };

const report: Report = {
  title: 'Booking BE-201 08:15–10:00',
  lines: [],
  add(line) {
    this.lines.push(line);
  },
  print() {
    console.log(this.title);
    for (const line of this.lines) console.log('  - ' + line);
  },
};

const problems: Problem[] = [
  { code: 'OFF_GRID', message: '08:15 is not on the 30-minute grid' },
  { code: 'TOO_MANY_SEATS', message: 'At most 40 seats' },
];
problems.map((p) => p.message).forEach(report.add);
report.print();`,
  "prSol": `// Step 1: the type now says add() and print() need a Report as this.
import type { Problem } from '../../lost/validator.ts';

type Report = { title: string; lines: string[]; add(this: Report, line: string): void; print(this: Report): void };

const report: Report = {
  title: 'Booking BE-201 08:15–10:00',
  lines: [],
  add(line) {
    this.lines.push(line);
  },
  print() {
    console.log(this.title);
    for (const line of this.lines) console.log('  - ' + line);
  },
};

const problems: Problem[] = [
  { code: 'OFF_GRID', message: '08:15 is not on the 30-minute grid' },
  { code: 'TOO_MANY_SEATS', message: 'At most 40 seats' },
];
problems.map((p) => p.message).forEach((line) => report.add(line));   // called ON report
report.print();`,
};
export const OUT = {
  '11-lost-tsc': `$ npx tsc -p demo3/ts-03-4/lost && echo 'tsc: 0 errors'
tsc: 0 errors`,
  '12-lost-run': `$ node demo3/ts-03-4/lost/run.ts
validator.run(bad) → [ 'OFF_GRID', 'TOO_MANY_SEATS' ]
file://…/labflow-ts/demo3/ts-03-4/lost/validator.ts:19
    for (const rule of this.rules) {
                            ^

TypeError: Cannot read properties of undefined (reading 'rules')
    at run (file://…/labflow-ts/demo3/ts-03-4/lost/validator.ts:19:29)
    at file://…/labflow-ts/demo3/ts-03-4/lost/run.ts:9:37
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
  '13-implicit': `$ npx tsc -p demo3/ts-03-4/implicit
demo3/ts-03-4/implicit/plain.ts(7,22): error TS2683: 'this' implicitly has type 'any' because it does not have a type annotation.`,
  '14-implicit-loose': `$ npx tsc -p demo3/ts-03-4/implicit/loose.json && echo 'tsc: 0 errors'
tsc: 0 errors`,
  '15-param-tsc': `$ npx tsc -p demo3/ts-03-4/param
demo3/ts-03-4/param/form.ts(13,10): error TS2345: Argument of type '(this: Validator, input: BookingInput) => Problem[]' is not assignable to parameter of type 'Handler'.
  The 'this' types of each signature are incompatible.
    Type 'void' is not assignable to type 'Validator'.
demo3/ts-03-4/param/use.ts(8,1): error TS2684: The 'this' context of type 'void' is not assignable to method's 'this' of type 'Validator'.`,
  '16-param-run': `$ node demo3/ts-03-4/param/run.ts
validator.run(bad)                       → [{"code":"OFF_GRID","message":"08:15–10:00 is not a valid slot"}]
validator.run.call(validator, bad)       → [{"code":"OFF_GRID","message":"08:15–10:00 is not a valid slot"}]
validator.run.bind(validator)(bad)       → [{"code":"OFF_GRID","message":"08:15–10:00 is not a valid slot"}]
[bad].map(validator.run)                 → throws TypeError: Cannot read properties of undefined (reading 'rules')
[bad].map(validator.run, validator)      → [[{"code":"OFF_GRID","message":"08:15–10:00 is not a valid slot"}]]
[bad].map((b) => validator.run(b))       → [[{"code":"OFF_GRID","message":"08:15–10:00 is not a valid slot"}]]
validator.run.length = 1 (the this parameter is not a real parameter)`,
  '17-timer': `$ node demo3/ts-03-4/param/timer.ts
timer scheduled
file://…/labflow-ts/demo3/ts-03-4/param/validator.ts:22
    for (const rule of this.rules) {
                            ^

TypeError: this.rules is not iterable
    at Timeout.run [as _onTimeout] (file://…/labflow-ts/demo3/ts-03-4/param/validator.ts:22:29)
    at listOnTimeout (node:internal/timers:587:11)
    at process.processTimers (node:internal/timers:521:7)

Node.js v22.23.3`,
  '18-arrow-tsc': `$ npx tsc -p demo3/ts-03-4/arrow
demo3/ts-03-4/arrow/validator.ts(11,24): error TS2532: Object is possibly 'undefined'.`,
  '19-arrow-run': `$ node demo3/ts-03-4/arrow/run.ts
file://…/labflow-ts/demo3/ts-03-4/arrow/validator.ts:11
    for (const rule of this.rules) {
                            ^

TypeError: Cannot read properties of undefined (reading 'rules')
    at Object.run (file://…/labflow-ts/demo3/ts-03-4/arrow/validator.ts:11:29)
    at file://…/labflow-ts/demo3/ts-03-4/arrow/run.ts:2:23
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
  '20-fix-tsc': `$ npx tsc -p demo3/ts-03-4/fix && echo 'tsc: 0 errors'
tsc: 0 errors`,
  '21-fix-run': `$ node demo3/ts-03-4/fix/run.ts
run(bad)                 → [ 'OFF_GRID' ]
[bad].map(validator.run) → [ 1 ]
inside setTimeout         → 1`,
  '22-pr-start': `$ npx tsc -p demo3/ts-03-4/practice/start && echo 'tsc: 0 errors' && node demo3/ts-03-4/practice/start/report.ts
tsc: 0 errors
file://…/labflow-ts/demo3/ts-03-4/practice/start/report.ts:10
    this.lines.push(line);
         ^

TypeError: Cannot read properties of undefined (reading 'lines')
    at add (file://…/labflow-ts/demo3/ts-03-4/practice/start/report.ts:10:10)
    at Array.forEach (<anonymous>)
    at file://…/labflow-ts/demo3/ts-03-4/practice/start/report.ts:22:32
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
  '23-pr-step1': `$ npx tsc -p demo3/ts-03-4/practice/step1 && echo 'tsc: 0 errors' && node demo3/ts-03-4/practice/step1/report.ts
tsc: 0 errors
file://…/labflow-ts/demo3/ts-03-4/practice/step1/report.ts:10
    this.lines.push(line);
         ^

TypeError: Cannot read properties of undefined (reading 'lines')
    at add (file://…/labflow-ts/demo3/ts-03-4/practice/step1/report.ts:10:10)
    at Array.forEach (<anonymous>)
    at file://…/labflow-ts/demo3/ts-03-4/practice/step1/report.ts:22:32
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
  '24-pr-sol': `$ npx tsc -p demo3/ts-03-4/practice/solution && echo 'tsc: 0 errors' && node demo3/ts-03-4/practice/solution/report.ts
tsc: 0 errors
Booking BE-201 08:15–10:00
  - 08:15 is not on the 30-minute grid
  - At most 40 seats`,
};
