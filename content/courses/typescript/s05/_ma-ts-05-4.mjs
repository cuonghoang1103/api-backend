/**
 * _ma (bài 5.4) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "v1Status": `type Status = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

function assertNever(x: never): never {
  throw new Error('Unhandled status: ' + String(x));
}

// Every case returns; the default hands an impossible value to assertNever.
export function colour(s: Status): string {
  switch (s) {
    case 'PENDING':   return 'amber';
    case 'CONFIRMED': return 'green';
    case 'CANCELLED': return 'grey';
    default:          return assertNever(s); // s has type never here
  }
}

console.log(colour('PENDING'), colour('CANCELLED'));`,
  "v2Status": `type Status = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED'; // a product manager added EXPIRED

function assertNever(x: never): never {
  throw new Error('Unhandled status: ' + String(x));
}

export function colour(s: Status): string {
  switch (s) {
    case 'PENDING':   return 'amber';
    case 'CONFIRMED': return 'green';
    case 'CANCELLED': return 'grey';
    default:          return assertNever(s); // s is now 'EXPIRED', not never
  }
}`,
  "catchallStatus": `type Status = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED'; // EXPIRED added

// No assertNever: a friendly catch-all. tsc is happy; EXPIRED silently becomes 'grey'.
export function colour(s: Status): string {
  switch (s) {
    case 'PENDING':   return 'amber';
    case 'CONFIRMED': return 'green';
    case 'CANCELLED': return 'grey';
    default:          return 'grey';
  }
}

console.log('EXPIRED shows as:', colour('EXPIRED'));`,
  "neverBasics": `// never is the empty type: no value has it. It is assignable TO every type…
const toStr: string = fail();
const toNum: number = fail();

// …but only never is assignable to never — a leftover value is a compile error.
const leftover: 'PENDING' | 'CONFIRMED' = 'PENDING';
const bad: never = leftover;

function fail(): never {
  throw new Error('stops here');
}
void toStr; void toNum; void bad;`,
  "assertFn": `import type { BookingRecord } from '../../../src/rules/model.ts';

type BookingState = { step: 'draft' } | { step: 'pending'; record: BookingRecord } | { step: 'confirmed'; record: BookingRecord };
type ActiveState = { step: 'pending'; record: BookingRecord } | { step: 'confirmed'; record: BookingRecord };

// \`asserts cond\`: if this returns, cond was true — tsc narrows from here on.
function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// \`asserts s is ActiveState\`: if this returns, s is an ActiveState.
function assertActive(s: BookingState): asserts s is ActiveState {
  if (s.step !== 'pending' && s.step !== 'confirmed') throw new Error('not active: ' + s.step);
}

export function idOf(s: BookingState): number {
  assertActive(s);        // after this line, s is ActiveState — no narrowing block needed
  return s.record.id;
}

const note: string | null = 'hi';
assert(note !== null, 'note missing');
console.log(note.toUpperCase()); // note: string here`,
  "recordLabel": `type Status = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED'; // EXPIRED added

// A closed table keyed by the union: a new status with no entry is a compile error.
const LABEL: Record<Status, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
};
export { LABEL };`,
  "prStart": `export type Plan = 'FREE' | 'PRO' | 'TEAM';

// Return the monthly price. A catch-all hides a new plan — replace it so tsc guards the switch.
export function price(plan: Plan): number {
  switch (plan) {
    case 'FREE': return 0;
    case 'PRO': return 9;
    case 'TEAM': return 29;
    default: return 0;
  }
}

console.log(price('PRO'));`,
  "prSol": `export type Plan = 'FREE' | 'PRO' | 'TEAM' | 'ENTERPRISE';

function assertNever(x: never): never {
  throw new Error('Unhandled plan: ' + String(x));
}

export function price(plan: Plan): number {
  switch (plan) {
    case 'FREE': return 0;
    case 'PRO': return 9;
    case 'TEAM': return 29;
    case 'ENTERPRISE': return 99;
    default: return assertNever(plan);
  }
}

console.log(price('ENTERPRISE'));`,
};
export const OUT = {
  '11-v1': `$ npx tsc -p demo5/ts-05-4/v1 && node demo5/ts-05-4/v1/status.ts
amber grey`,
  '12-v2': `$ npx tsc -p demo5/ts-05-4/v2
demo5/ts-05-4/v2/status.ts(12,42): error TS2345: Argument of type '"EXPIRED"' is not assignable to parameter of type 'never'.`,
  '13-catchall': `$ npx tsc -p demo5/ts-05-4/catchall-v2 && node demo5/ts-05-4/catchall-v2/status.ts
EXPIRED shows as: grey`,
  '14-never': `$ npx tsc -p demo5/ts-05-4/nevertype
demo5/ts-05-4/nevertype/basics.ts(7,7): error TS2322: Type '"PENDING"' is not assignable to type 'never'.`,
  '15-assert': `$ npx tsc -p demo5/ts-05-4/assertionfn && node demo5/ts-05-4/assertionfn/assert.ts
HI`,
  '16-record': `$ npx tsc -p demo5/ts-05-4/record-exhaust
demo5/ts-05-4/record-exhaust/label.ts(4,7): error TS2741: Property 'EXPIRED' is missing in type '{ PENDING: string; CONFIRMED: string; CANCELLED: string; }' but required in type 'Record<Status, string>'.`,
  '17-pr-start': `$ npx tsc -p demo5/ts-05-4/practice/start && node demo5/ts-05-4/practice/start/plan.ts
9`,
  '18-pr-step1': `$ npx tsc -p demo5/ts-05-4/practice/step1
demo5/ts-05-4/practice/step1/plan.ts(12,33): error TS2345: Argument of type '"ENTERPRISE"' is not assignable to parameter of type 'never'.`,
  '19-pr-sol': `$ npx tsc -p demo5/ts-05-4/practice/solution && node demo5/ts-05-4/practice/solution/plan.ts
99`,
};
