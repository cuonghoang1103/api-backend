/**
 * _ma (bài 5.3) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "labelState": `import type { BookingRecord } from '../../../src/rules/model.ts';
import type { SlotCode } from '../../../src/rules/booking.ts';

// Every member shares one field — \`step\` — with a DIFFERENT literal. That field is the discriminant.
type BookingState =
  | { step: 'draft' }
  | { step: 'invalid'; code: SlotCode }
  | { step: 'pending'; record: BookingRecord }
  | { step: 'confirmed'; record: BookingRecord }
  | { step: 'cancelled'; record: BookingRecord; reason: string };

// One test on state.step narrows the WHOLE object — code here, record there, reason only in cancelled.
function describe(state: BookingState): string {
  switch (state.step) {
    case 'draft':     return 'Draft';
    case 'invalid':   return 'Invalid: ' + state.code;
    case 'pending':   return 'Pending #' + state.record.id;
    case 'confirmed': return 'Confirmed #' + state.record.id;
    case 'cancelled': return 'Cancelled #' + state.record.id + ' (' + state.reason + ')';
  }
}

const rec: BookingRecord = { id: 7, createdAt: '2026-11-03', lab: 'BE-201', userId: 1, range: [480, 600], seats: 30, status: 'PENDING', note: null };
console.log(describe({ step: 'draft' }));
console.log(describe({ step: 'invalid', code: 'TOO_LONG' }));
console.log(describe({ step: 'cancelled', record: rec, reason: 'exam week' }));`,
  "nonarrowBad": `import type { BookingRecord } from '../../../src/rules/model.ts';
import type { SlotCode } from '../../../src/rules/booking.ts';

type BookingState =
  | { step: 'draft' }
  | { step: 'invalid'; code: SlotCode }
  | { step: 'pending'; record: BookingRecord };

export function idOf(state: BookingState): number {
  return state.record.id; // record is on only one member
}`,
  "predicateActive": `import type { BookingRecord } from '../../../src/rules/model.ts';

type BookingState =
  | { step: 'draft' }
  | { step: 'pending'; record: BookingRecord }
  | { step: 'confirmed'; record: BookingRecord };
type ActiveState = { step: 'pending'; record: BookingRecord } | { step: 'confirmed'; record: BookingRecord };

// \`state is ActiveState\` tells tsc: a true result means the argument is an ActiveState.
function isActive(state: BookingState): state is ActiveState {
  return state.step === 'pending' || state.step === 'confirmed';
}

const rec: BookingRecord = { id: 7, createdAt: '2026-11-03', lab: 'BE-201', userId: 1, range: [480, 600], seats: 30, status: 'PENDING', note: null };
const states: BookingState[] = [{ step: 'draft' }, { step: 'confirmed', record: rec }];
for (const s of states) {
  if (isActive(s)) console.log('active #' + s.record.id); // s narrowed to ActiveState — record is there
  else console.log('not active');
}`,
  "lie": `import type { BookingRecord } from '../../../src/rules/model.ts';

type BookingState = { step: 'pending'; record: BookingRecord } | { step: 'cancelled'; record: BookingRecord; reason: string };

// A predicate is a PROMISE tsc trusts — it never checks the body against the return type. This one lies.
function isCancelled(s: BookingState): s is { step: 'cancelled'; record: BookingRecord; reason: string } {
  return s.step === 'pending'; // the wrong step
}

const rec: BookingRecord = { id: 7, createdAt: '2026-11-03', lab: 'BE-201', userId: 1, range: [480, 600], seats: 30, status: 'PENDING', note: null };
function load(): BookingState {
  return { step: 'pending', record: rec };
}

const s = load(); // s: BookingState — tsc does not know which member
if (isCancelled(s)) {
  // tsc is sure s is the cancelled member, so s.reason is a string. At runtime it is undefined.
  console.log('reason in caps:', s.reason.toUpperCase());
}`,
  "filterLive": `import type { BookingRecord } from '../../../src/rules/model.ts';

type BookingState =
  | { step: 'draft' }
  | { step: 'pending'; record: BookingRecord }
  | { step: 'confirmed'; record: BookingRecord };
type ActiveState = { step: 'pending'; record: BookingRecord } | { step: 'confirmed'; record: BookingRecord };

function isActive(s: BookingState): s is ActiveState {
  return s.step === 'pending' || s.step === 'confirmed';
}

const rec: BookingRecord = { id: 7, createdAt: '2026-11-03', lab: 'BE-201', userId: 1, range: [480, 600], seats: 30, status: 'PENDING', note: null };
const states: BookingState[] = [{ step: 'draft' }, { step: 'pending', record: rec }];

const live: ActiveState[] = states.filter(isActive);         // narrowed array — ok
const ids: number[] = live.map((s) => s.record.id);
console.log(ids);`,
  "filterNamed": `import type { BookingRecord } from '../../../src/rules/model.ts';

type BookingState = { step: 'draft' } | { step: 'confirmed'; record: BookingRecord };
type Active = { step: 'confirmed'; record: BookingRecord };

const states: BookingState[] = [{ step: 'draft' }];

// A NAMED helper that returns plain \`boolean\` does NOT narrow — filter still gives BookingState[].
function liveFlag(s: BookingState): boolean {
  return s.step === 'confirmed';
}
const named: Active[] = states.filter(liveFlag);

// The SAME condition written inline is inferred as a predicate (TypeScript 5.5+), so this one narrows.
const inline: Active[] = states.filter((s) => s.step === 'confirmed');
console.log(named, inline);`,
  "prStart": `import type { BookingRecord } from '../../../../src/rules/model.ts';
import type { SlotCode } from '../../../../src/rules/booking.ts';

type BookingState =
  | { step: 'draft' }
  | { step: 'invalid'; code: SlotCode }
  | { step: 'confirmed'; record: BookingRecord };

// Return the record when there is one. tsc refuses this — draft and invalid have no record.
export function recordOf(state: BookingState): BookingRecord | null {
  return state.record;
}`,
  "prSol": `import type { BookingRecord } from '../../../../src/rules/model.ts';
import type { SlotCode } from '../../../../src/rules/booking.ts';

type BookingState =
  | { step: 'draft' }
  | { step: 'invalid'; code: SlotCode }
  | { step: 'confirmed'; record: BookingRecord };

export function recordOf(state: BookingState): BookingRecord | null {
  if ('record' in state) return state.record;
  return null;
}`,
};
export const OUT = {
  '11-label': `$ npx tsc -p demo5/ts-05-3/label && node demo5/ts-05-3/label/state.ts
Draft
Invalid: TOO_LONG
Cancelled #7 (exam week)`,
  '12-nonarrow': `$ npx tsc -p demo5/ts-05-3/nonarrow
demo5/ts-05-3/nonarrow/bad.ts(10,16): error TS2339: Property 'record' does not exist on type 'BookingState'.
  Property 'record' does not exist on type '{ step: "draft"; }'.`,
  '13-predicate': `$ npx tsc -p demo5/ts-05-3/predicate && node demo5/ts-05-3/predicate/active.ts
not active
active #7`,
  '14-lie-tsc': `$ npx tsc -p demo5/ts-05-3/lie`,
  '15-lie-run': `$ node demo5/ts-05-3/lie/lie.ts
file://…/labflow-ts/demo5/ts-05-3/lie/lie.ts:18
  console.log('reason in caps:', s.reason.toUpperCase());
                                          ^

TypeError: Cannot read properties of undefined (reading 'toUpperCase')
    at file://…/labflow-ts/demo5/ts-05-3/lie/lie.ts:18:43
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
  '16-filter': `$ npx tsc -p demo5/ts-05-3/filter && node demo5/ts-05-3/filter/live.ts
[ 7 ]`,
  '17-filter-named': `$ npx tsc -p demo5/ts-05-3/filter-named
demo5/ts-05-3/filter-named/arrow.ts(12,7): error TS2322: Type 'BookingState[]' is not assignable to type 'Active[]'.
  Type 'BookingState' is not assignable to type 'Active'.
    Property 'record' is missing in type '{ step: "draft"; }' but required in type 'Active'.`,
  '18-pr-start': `$ npx tsc -p demo5/ts-05-3/practice/start
demo5/ts-05-3/practice/start/record.ts(11,16): error TS2339: Property 'record' does not exist on type 'BookingState'.
  Property 'record' does not exist on type '{ step: "draft"; }'.`,
  '19-pr-sol': `$ npx tsc -p demo5/ts-05-3/practice/solution && node demo5/ts-05-3/practice/solution/record.ts`,
};
