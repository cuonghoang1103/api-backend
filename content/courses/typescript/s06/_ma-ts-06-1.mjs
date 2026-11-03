/**
 * _ma (bài 6.1) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "anyFirst": `import type { User } from '../../../src/rules/model.ts';

// "Works for any array" — and loses the type on the way out.
function firstOf(arr: any[]): any {
  return arr[0];
}

const users: User[] = [{ id: 1, createdAt: '2026-11-03', email: 'an@fpt.edu.vn', name: 'An', role: 'STUDENT' }];
const u = firstOf(users);
console.log(u.emial);            // typo: no error, prints undefined
console.log(u.name.toFixed(2));  // name is a string — no error, crashes at runtime`,
  "genericFirst": `import type { User } from '../../../src/rules/model.ts';

// A type parameter T links the input to the output: whatever array goes in, that element comes out.
function firstOf<T>(arr: T[]): T | undefined {
  return arr[0];
}

const users: User[] = [{ id: 1, createdAt: '2026-11-03', email: 'an@fpt.edu.vn', name: 'An', role: 'STUDENT' }];
const u = firstOf(users);        // u: User | undefined
console.log(u?.emial);           // typo is now TS2339`,
  "genericRun": `import type { User } from '../../../src/rules/model.ts';

function firstOf<T>(arr: T[]): T | undefined {
  return arr[0];
}

const users: User[] = [{ id: 1, createdAt: '2026-11-03', email: 'an@fpt.edu.vn', name: 'An', role: 'STUDENT' }];
const names: string[] = ['BE-201', 'AL-301'];
console.log(firstOf(users)?.email);   // u is User | undefined
console.log(firstOf(names)?.toUpperCase());
console.log(firstOf([]));             // undefined`,
  "inferCalls": `function identity<T>(value: T): T {
  return value;
}

// You almost never write <T>: tsc infers it from the argument.
const a = identity(42);          // T = number, a: number
const b = identity('BE-201');    // T = string, b: string
const c = identity<boolean>(true); // explicit, when there is no argument to infer from

console.log(a.toFixed(0), b.toUpperCase(), c);`,
  "pair": `// Two type parameters: a tuple that remembers both.
function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}

const slot = pair('BE-201', 40);   // [string, number]
const [code, seats] = slot;
console.log(code.toUpperCase(), seats.toFixed(0));`,
  "explicit": `function firstOf<T>(arr: T[]): T | undefined {
  return arr[0];
}

// An empty literal has nothing to infer T from, so T becomes never and the result is undefined:
// reading a property off it is an error.
const nothing = firstOf([]);        // never | undefined
const wrong = firstOf([]).length;   // TS2532 — the result is possibly undefined

// Give T explicitly when there is no value to infer it from.
const labs = firstOf<string>([]);   // string | undefined
console.log(nothing, labs);`,
  "prStart": `import type { User } from '../../../../src/rules/model.ts';

// lastOf loses the type with any[]. A typo on the result is not caught.
export function lastOf(arr: any[]): any {
  return arr[arr.length - 1];
}

const users: User[] = [{ id: 1, createdAt: '2026-11-03', email: 'an@fpt.edu.vn', name: 'An', role: 'STUDENT' }];
console.log(lastOf(users).naem);`,
  "prSol": `import type { User } from '../../../../src/rules/model.ts';

export function lastOf<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

const users: User[] = [{ id: 1, createdAt: '2026-11-03', email: 'an@fpt.edu.vn', name: 'An', role: 'STUDENT' }];
console.log(lastOf(users)?.name);`,
};
export const OUT = {
  '11-any-tsc': `$ npx tsc -p demo6/ts-06-1/anyv`,
  '12-any-run': `$ node demo6/ts-06-1/anyv/first.ts
undefined
file://…/labflow-ts/demo6/ts-06-1/anyv/first.ts:11
console.log(u.name.toFixed(2));  // name is a string — no error, crashes at runtime
                   ^

TypeError: u.name.toFixed is not a function
    at file://…/labflow-ts/demo6/ts-06-1/anyv/first.ts:11:20
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
  '13-generic': `$ npx tsc -p demo6/ts-06-1/generic
demo6/ts-06-1/generic/first.ts(10,16): error TS2551: Property 'emial' does not exist on type 'User'. Did you mean 'email'?`,
  '14-generic-run': `$ node demo6/ts-06-1/generic/run.ts
an@fpt.edu.vn
BE-201
undefined`,
  '15-infer': `$ npx tsc -p demo6/ts-06-1/infer && node demo6/ts-06-1/infer/calls.ts
42 BE-201 true`,
  '16-pair': `$ npx tsc -p demo6/ts-06-1/pair && node demo6/ts-06-1/pair/pair.ts
BE-201 40`,
  '17-explicit': `$ npx tsc -p demo6/ts-06-1/explicit
demo6/ts-06-1/explicit/empty.ts(8,15): error TS2532: Object is possibly 'undefined'.`,
  '18-pr-start': `$ npx tsc -p demo6/ts-06-1/practice/start`,
  '19-pr-sol': `$ npx tsc -p demo6/ts-06-1/practice/solution && node demo6/ts-06-1/practice/solution/last.ts
An`,
};
