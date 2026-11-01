/**
 * _ma (bài 0.4) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "label": `// A small LabFlow helper, full of types.
type Role = 'STUDENT' | 'LECTURER' | 'ADMIN';

interface Booking {
  lab: string;
  seats: number;
  role: Role;
  start: string;
}

export function bookingLabel(b: Booking): string {
  const who: string = b.role === 'STUDENT' ? 'student' : 'staff';
  return b.lab + ' at ' + b.start + ' (' + b.seats + ' seats, ' + who + ')';
}

console.log(bookingLabel({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00' }));`,
  "eraseConfig": `{
  // Emits JavaScript on purpose so you can see what type erasure leaves behind.
  "extends": "../../../tsconfig.json",
  "compilerOptions": { "noEmit": false, "allowImportingTsExtensions": false, "outDir": "dist" },
  "include": ["label.ts"]
}`,
  "throwTs": `// Line numbers matter: Node replaces types with spaces, it does not delete lines.
type Role = 'STUDENT' | 'LECTURER' | 'ADMIN';

interface Booking {
  lab: string;
  seats: number;
  role: Role;
}

function checkSeats(b: Booking): number {
  if (b.seats < 1) throw new RangeError('seats must be positive, got ' + b.seats);
  return b.seats;
}

checkSeats({ lab: 'BE-201', seats: 0, role: 'STUDENT' });`,
  "show": `// Print what Node 22 actually runs for throw.ts (the same function Node uses internally).
import { stripTypeScriptTypes } from 'node:module';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('./throw.ts', import.meta.url), 'utf8');
const out = stripTypeScriptTypes(src);
out.split('\\n').forEach((line, i) => console.log(String(i + 1).padStart(2) + ' | ' + line));`,
  "wrong": `// A type error — and the file still runs.
const seats: number = '31';
const next = seats + 1;

console.log('seats + 1 =', next);
console.log('type at runtime:', typeof seats);`,
  "inst": `type Booking = { lab: string; seats: number };

function describe(x: unknown): string {
  if (x instanceof Booking) {
    return 'a booking for ' + x.lab;
  }
  return 'something else';
}

console.log(describe({ lab: 'BE-201', seats: 12 }));`,
  "fixed": `type Booking = { lab: string; seats: number };

// A runtime check written in real JavaScript — this is what survives erasure.
function isBooking(x: unknown): x is Booking {
  return typeof x === 'object' && x !== null &&
    typeof (x as { lab?: unknown }).lab === 'string' &&
    typeof (x as { seats?: unknown }).seats === 'number';
}

function describe(x: unknown): string {
  if (isBooking(x)) return 'a booking for ' + x.lab;
  return 'something else';
}

console.log(describe({ lab: 'BE-201', seats: 12 }));
console.log(describe({ lab: 'BE-201', seats: '12' }));`,
  "lie": `import { createBooking, type BookingInput } from '../../../src/rules/booking.ts';

// Pretend this text arrived in an HTTP request body.
const body = '{"lab":"BE-201","seats":"31","role":"student","start":"08:00","end":"10:00"}';

const input = JSON.parse(body) as BookingInput;   // "trust me, it is a BookingInput"
console.log('role is', input.role, '- seats is a', typeof input.seats);
console.log(createBooking(input));`,
  "anyTs": `const body = '{"lab":"BE-201","seats":31}';

const raw = JSON.parse(body);        // hover it: any
const total: number = raw.seatz * 2; // typo, and tsc says nothing

console.log('total =', total);`,
  "status": `enum Status {
  Pending = 'PENDING',
  Confirmed = 'CONFIRMED',
}

class BookingRepo {
  constructor(private rows: string[]) {}
  count(): number {
    return this.rows.length;
  }
}

console.log(Status.Pending, new BookingRepo(['BE-201']).count());`,
  "union": `// The erasable way: a union of string literals + an ordinary field.
type Status = 'PENDING' | 'CONFIRMED';

class BookingRepo {
  private rows: string[];
  constructor(rows: string[]) {
    this.rows = rows;
  }
  count(): number {
    return this.rows.length;
  }
}

const s: Status = 'PENDING';
console.log(s, new BookingRepo(['BE-201']).count());`,
  "predict": `type Role = 'STUDENT' | 'LECTURER' | 'ADMIN';

const role: Role = 'student';                              // line 3
const seats: number = Number('31');                        // line 4
const minutes: number = JSON.parse('{"m":"90"}').m;        // line 5
console.log('half:', minutes / 2, 'role:', role);          // line 6
const lab = { code: 'BE-201' } as unknown as { name: string };
console.log(lab.name.toUpperCase());                       // line 8`,
};
export const OUT = {
  '01-emit': `$ npx tsc -p demo0/ts-00-4/erase && cat demo0/ts-00-4/erase/dist/label.js
export function bookingLabel(b) {
    const who = b.role === 'STUDENT' ? 'student' : 'staff';
    return b.lab + ' at ' + b.start + ' (' + b.seats + ' seats, ' + who + ')';
}
console.log(bookingLabel({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00' }));`,
  '02-run-ts': `$ node demo0/ts-00-4/erase/label.ts
BE-201 at 08:00 (31 seats, student)`,
  '03-throw': `$ node demo0/ts-00-4/strip/throw.ts
file://…/labflow-ts/demo0/ts-00-4/strip/throw.ts:11
  if (b.seats < 1) throw new RangeError('seats must be positive, got ' + b.seats);
                         ^

RangeError: seats must be positive, got 0
    at checkSeats (file://…/labflow-ts/demo0/ts-00-4/strip/throw.ts:11:26)
    at file://…/labflow-ts/demo0/ts-00-4/strip/throw.ts:15:1
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
  '04-strip': `$ node demo0/ts-00-4/strip/show.mjs
 1 | // Line numbers matter: Node replaces types with spaces, it does not delete lines.
 2 |                                              
 3 | 
 4 |                    
 5 |               
 6 |                 
 7 |              
 8 |  
 9 | 
10 | function checkSeats(b         )         {
11 |   if (b.seats < 1) throw new RangeError('seats must be positive, got ' + b.seats);
12 |   return b.seats;
13 | }
14 | 
15 | checkSeats({ lab: 'BE-201', seats: 0, role: 'STUDENT' });
16 | 
(node:91743) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
(Use \`node --trace-warnings ...\` to show where the warning was created)`,
  '05-runs-tsc': `$ npx tsc -p demo0/ts-00-4/runs
demo0/ts-00-4/runs/wrong.ts(2,7): error TS2322: Type 'string' is not assignable to type 'number'.`,
  '06-runs-node': `$ node demo0/ts-00-4/runs/wrong.ts
seats + 1 = 311
type at runtime: string`,
  '07-typeval-tsc': `$ npx tsc -p demo0/ts-00-4/typeval
demo0/ts-00-4/typeval/instanceof.ts(4,20): error TS2693: 'Booking' only refers to a type, but is being used as a value here.
demo0/ts-00-4/typeval/instanceof.ts(5,31): error TS18046: 'x' is of type 'unknown'.`,
  '08-typeval-node': `$ node demo0/ts-00-4/typeval/instanceof.ts
file://…/labflow-ts/demo0/ts-00-4/typeval/instanceof.ts:4
  if (x instanceof Booking) {
                   ^

ReferenceError: Booking is not defined
    at describe (file://…/labflow-ts/demo0/ts-00-4/typeval/instanceof.ts:4:20)
    at file://…/labflow-ts/demo0/ts-00-4/typeval/instanceof.ts:10:13
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
  '09-typeval-fixed': `$ node demo0/ts-00-4/typeval/fixed.ts
a booking for BE-201
something else`,
  '10-json-tsc': `$ npx tsc -p demo0/ts-00-4/json`,
  '11-json-lie': `$ node demo0/ts-00-4/json/lie.ts
role is student - seats is a string
file://…/labflow-ts/src/rules/booking.ts:39
    throw new RangeError('seats must be a positive integer, got ' + seats);
          ^

RangeError: seats must be a positive integer, got 31
    at needsApproval (file://…/labflow-ts/src/rules/booking.ts:39:11)
    at createBooking (file://…/labflow-ts/src/rules/booking.ts:53:13)
    at file://…/labflow-ts/demo0/ts-00-4/json/lie.ts:8:13
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
  '12-json-any': `$ node demo0/ts-00-4/json/any.ts
total = NaN`,
  '13-enum-tsc': `$ npx tsc -p demo0/ts-00-4/enum
demo0/ts-00-4/enum/status.ts(1,6): error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
demo0/ts-00-4/enum/status.ts(7,15): error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.`,
  '14-enum-node': `$ node demo0/ts-00-4/enum/status.ts
node:internal/modules/run_main:123
    triggerUncaughtException(
    ^

file://…/labflow-ts/demo0/ts-00-4/enum/status.ts:1
  > enum Status {
      Pending = 'PENDING',
      Confirmed = 'CONFIRMED',
  > }

SyntaxError [ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX]: TypeScript enum is not supported in strip-only mode
    at parseTypeScript (node:internal/modules/typescript:63:40)
    at processTypeScriptCode (node:internal/modules/typescript:133:42)
    at stripTypeScriptModuleTypes (node:internal/modules/typescript:163:10)
    at ModuleLoader.<anonymous> (node:internal/modules/esm/translators:660:29)
    at #translate (node:internal/modules/esm/loader:559:20)
    at afterLoad (node:internal/modules/esm/loader:612:29)
    at ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:617:12)
    at #createModuleJob (node:internal/modules/esm/loader:640:36)
    at #getJobFromResolveResult (node:internal/modules/esm/loader:353:34)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:321:41) {
  code: 'ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX'
}

Node.js v22.23.3`,
  '15-union-node': `$ node demo0/ts-00-4/enum/union.ts
PENDING 1`,
  '16-practice-tsc': `$ npx tsc -p demo0/ts-00-4/practice
demo0/ts-00-4/practice/predict.ts(3,7): error TS2820: Type '"student"' is not assignable to type 'Role'. Did you mean '"STUDENT"'?`,
  '17-practice-node': `$ node demo0/ts-00-4/practice/predict.ts
half: 45 role: student
file://…/labflow-ts/demo0/ts-00-4/practice/predict.ts:8
console.log(lab.name.toUpperCase());                       // line 8
                     ^

TypeError: Cannot read properties of undefined (reading 'toUpperCase')
    at file://…/labflow-ts/demo0/ts-00-4/practice/predict.ts:8:22
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
};
