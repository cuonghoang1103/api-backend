/**
 * _ma (bài 2.4) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "step": `// Literal types written by hand: a type that is exactly one value, or a short list of values.
type Step = 15 | 30 | 60;                  // the grid sizes LabFlow supports

let step: Step = 30;
step = 45;                                 // 45 is a number, but not one of these three

type SlotOk = { ok: true; minutes: number };
const good: SlotOk = { ok: true, minutes: 120 };
const bad: SlotOk = { ok: false, minutes: 0 };   // false is not the literal true

export { step, good, bad };`,
  "copyTypes": `// The lab codes LabFlow knows. AL-301 opened this semester.
export type LabCode = 'BE-201' | 'BE-202' | 'AL-301';`,
  "copyCheck": `import type { LabCode } from './types.ts';

// Written last semester and copied by hand from types.ts — before AL-301 existed.
const LABS: readonly string[] = ['BE-201', 'BE-202'];

export function isLab(text: string): text is LabCode {
  return LABS.includes(text);
}`,
  "copyRun": `import { isLab } from './check.ts';

for (const lab of ['BE-201', 'AL-301', 'BE-999']) {
  console.log('?lab=' + lab, '→', isLab(lab) ? 'accepted' : 'refused');
}`,
  "labs": `// ONE source of truth: the list is data (Node can loop over it) AND the type is derived from it.
export const LABS = ['BE-201', 'BE-202', 'AL-301'] as const;
export type LabCode = (typeof LABS)[number];

// The two steps of that last line, named so you can read them in the .d.ts:
export type LabsTuple = typeof LABS;          // "the type of the value LABS"
export type AnyElement = LabsTuple[number];   // "the type at any number index"

// The same list WITHOUT as const, to compare.
export const LABS_LOOSE = ['BE-201', 'BE-202', 'AL-301'];
export type LabCodeLoose = (typeof LABS_LOOSE)[number];`,
  "show": `// Trick: assign a wrong value, and the error message prints what a type really is.
import { LABS, LABS_LOOSE } from './labs.ts';

const strict: (typeof LABS)[number] = 42;
const loose: (typeof LABS_LOOSE)[number] = 42;

export { strict, loose };`,
  "inclRed": `import { LABS } from '../derive/labs.ts';
import type { LabCode } from '../derive/labs.ts';

export function isLab(text: string): text is LabCode {
  return LABS.includes(text);
}

const fromQuery = new URLSearchParams('lab=BE-201').get('lab');
const lab: LabCode = fromQuery;`,
  "incl": `import { LABS } from '../derive/labs.ts';
import type { LabCode } from '../derive/labs.ts';

// A list of LabCode IS a list of strings, so this assignment is safe (no "as" needed).
const KNOWN: readonly string[] = LABS;

export function isLab(text: string): text is LabCode {
  return KNOWN.includes(text);
}`,
  "inclAs": `import { LABS } from '../derive/labs.ts';
import type { LabCode } from '../derive/labs.ts';

// The same widening written with "as". It compiles too — but "as" can also lie (lesson 1.2), so prefer the assignment.
export function isLabAs(text: string): text is LabCode {
  return (LABS as readonly string[]).includes(text);
}`,
  "inclRun": `import { isLab } from './check.ts';
import type { LabCode } from '../derive/labs.ts';

// What a request might send: /schedule?lab=...
for (const query of ['lab=BE-201', 'lab=AL-301', 'lab=be-201', 'lab=BE-999', '']) {
  const text = new URLSearchParams(query).get('lab') ?? '';
  if (isLab(text)) {
    const lab: LabCode = text;                 // allowed: the guard proved it
    console.log('?' + query, '→ schedule of', lab);
  } else {
    console.log('?' + query, '→ 400 unknown lab "' + text + '"');
  }
}`,
  "grow": `// AL-302 opens next week: ONE line changes — the data and the type follow it.
export const LABS = ['BE-201', 'BE-202', 'AL-301', 'AL-302'] as const;
export type LabCode = (typeof LABS)[number];

const KNOWN: readonly string[] = LABS;
export function isLab(text: string): text is LabCode {
  return KNOWN.includes(text);
}

for (const lab of ['AL-301', 'AL-302', 'BE-999']) {
  console.log('?lab=' + lab, '→', isLab(lab) ? 'accepted' : 'refused');
}`,
  "frozen": `// as const exists only for tsc. At runtime LABS is an ordinary array.
import { LABS } from '../derive/labs.ts';

console.log('array?', Array.isArray(LABS), '· frozen?', Object.isFrozen(LABS), '· length', LABS.length);`,
  "messages": `import type { SlotCode } from '../../../src/rules/booking.ts';

// One message per slot code. as const keeps every text as a literal and makes the object read-only;
// satisfies checks that EVERY SlotCode has a message (Record<K, V> = an object with exactly the keys K).
export const SLOT_MESSAGES = {
  OFF_GRID: 'Start and end must be on the 30-minute grid.',
  END_BEFORE_START: 'The end time must be after the start time.',
  OUTSIDE_HOURS: 'Labs are open from 07:00 to 21:00.',
  TOO_LONG: 'A booking can last at most 4 hours.',
} as const satisfies Record<SlotCode, string>;

export type MessageKey = keyof typeof SLOT_MESSAGES;          // the keys, as a union
export type Message = (typeof SLOT_MESSAGES)[MessageKey];     // the texts, as a union`,
  "mapRun": `import { checkSlot } from '../../../src/rules/booking.ts';
import { SLOT_MESSAGES } from './messages.ts';

// as const here too: each pair stays a 2-element tuple of strings.
const CASES = [['08:15', '10:00'], ['10:00', '08:00'], ['06:00', '08:00'], ['08:00', '13:00'], ['08:00', '10:00']] as const;

for (const [start, end] of CASES) {
  const slot = checkSlot(start, end);
  console.log(start + '–' + end, '→', slot.ok ? slot.minutes + ' minutes, OK' : SLOT_MESSAGES[slot.code]);
}`,
  "mapRed": `import type { SlotCode } from '../../../src/rules/booking.ts';

// Someone forgot TOO_LONG.
export const SLOT_MESSAGES = {
  OFF_GRID: 'Start and end must be on the 30-minute grid.',
  END_BEFORE_START: 'The end time must be after the start time.',
  OUTSIDE_HOURS: 'Labs are open from 07:00 to 21:00.',
} as const satisfies Record<SlotCode, string>;

SLOT_MESSAGES.OFF_GRID = 'Use the grid!';      // as const made every property read-only`,
  "enumTs": `// The "classic" way from C# / Java — refused by the course tsconfig (erasableSyntaxOnly, lesson 0.4).
export enum Status {
  Pending = 'PENDING',
  Confirmed = 'CONFIRMED',
}`,
  "status": `// The erasable way: an ordinary object (it exists at runtime) + a type derived from it.
export const STATUS = { Pending: 'PENDING', Confirmed: 'CONFIRMED' } as const;
export type Status = (typeof STATUS)[keyof typeof STATUS];   // 'PENDING' | 'CONFIRMED'

export function label(s: Status): string {
  return s === STATUS.Pending ? 'waiting for approval' : 'confirmed';
}

console.log(STATUS.Pending, '·', label('CONFIRMED'), '·', Object.values(STATUS));`,
  "enumRed": `import { label } from './status.ts';

label('APPROVED');                 // there is no APPROVED status`,
  "print": `import { LABS } from '../derive/labs.ts';

// A helper written long ago: it only reads the list, but its parameter says string[].
function printLabs(labs: string[]): void {
  console.log(labs.join(', '));
}

printLabs(LABS);`,
  "printFixed": `import { LABS } from '../derive/labs.ts';

// Promise what you really do: the helper only reads, so it takes a readonly list.
function printLabs(labs: readonly string[]): void {
  console.log(labs.join(', '));
}

printLabs(LABS);
printLabs(['X-1', 'X-2']);      // ordinary mutable arrays are still accepted`,
  "prStart": `// The booking form sends ?step=… (minutes per grid cell). LabFlow supports 15, 30 and 60.
type Step = 15 | 30 | 60;
const STEPS = [15, 30, 60];                 // copied by hand: a plain number[]

export function parseStep(text: string): Step {
  const n = Number(text);
  if (STEPS.includes(n)) return n;
  throw new RangeError('unsupported step: ' + text);
}`,
  "prSol": `// The booking form sends ?step=… (minutes per grid cell). LabFlow supports 15, 30 and 60.
export const STEPS = [15, 30, 60] as const;   // the ONE list: data and type
export type Step = (typeof STEPS)[number];      // 15 | 30 | 60

const KNOWN: readonly number[] = STEPS;
export function isStep(n: number): n is Step {
  return KNOWN.includes(n);
}

export function parseStep(text: string): Step {
  const n = Number(text);
  if (isStep(n)) return n;
  throw new RangeError('unsupported step: ' + text);
}`,
  "prRun": `import { parseStep } from './step.ts';

for (const query of ['step=30', 'step=45', 'step=abc']) {
  const text = new URLSearchParams(query).get('step') ?? '';
  try {
    console.log('?' + query, '→ grid of', parseStep(text), 'minutes');
  } catch (e) {
    console.log('?' + query, '→', String(e));
  }
}`,
};
export const OUT = {
  '01-literal': `$ npx tsc -p demo2/ts-02-4/literal
demo2/ts-02-4/literal/step.ts(5,1): error TS2322: Type '45' is not assignable to type 'Step'.
demo2/ts-02-4/literal/step.ts(9,23): error TS2322: Type 'false' is not assignable to type 'true'.`,
  '02-copy': `$ npx tsc -p demo2/ts-02-4/copy && node demo2/ts-02-4/copy/run.ts
?lab=BE-201 → accepted
?lab=AL-301 → refused
?lab=BE-999 → refused`,
  '03-derive-dts': `$ npx tsc -p demo2/ts-02-4/derive/dts.json && cat demo2/ts-02-4/derive/out/labs.d.ts
export declare const LABS: readonly ['BE-201', 'BE-202', 'AL-301'];
export type LabCode = (typeof LABS)[number];
export type LabsTuple = typeof LABS;
export type AnyElement = LabsTuple[number];
export declare const LABS_LOOSE: string[];
export type LabCodeLoose = (typeof LABS_LOOSE)[number];`,
  '03b-derive-show': `$ npx tsc -p demo2/ts-02-4/derive
demo2/ts-02-4/derive/show.ts(4,7): error TS2322: Type '42' is not assignable to type '"AL-301" | "BE-201" | "BE-202"'.
demo2/ts-02-4/derive/show.ts(5,7): error TS2322: Type 'number' is not assignable to type 'string'.`,
  '04-includes-red': `$ npx tsc -p demo2/ts-02-4/includes-red
demo2/ts-02-4/includes-red/check.ts(5,24): error TS2345: Argument of type 'string' is not assignable to parameter of type '"AL-301" | "BE-201" | "BE-202"'.
demo2/ts-02-4/includes-red/check.ts(9,7): error TS2322: Type 'string | null' is not assignable to type '"AL-301" | "BE-201" | "BE-202"'.
  Type 'null' is not assignable to type '"AL-301" | "BE-201" | "BE-202"'.`,
  '05-includes': `$ npx tsc -p demo2/ts-02-4/includes && node demo2/ts-02-4/includes/run.ts
?lab=BE-201 → schedule of BE-201
?lab=AL-301 → schedule of AL-301
?lab=be-201 → 400 unknown lab "be-201"
?lab=BE-999 → 400 unknown lab "BE-999"
? → 400 unknown lab ""`,
  '06-map': `$ npx tsc -p demo2/ts-02-4/map && node demo2/ts-02-4/map/run.ts
08:15–10:00 → Start and end must be on the 30-minute grid.
10:00–08:00 → The end time must be after the start time.
06:00–08:00 → Labs are open from 07:00 to 21:00.
08:00–13:00 → A booking can last at most 4 hours.
08:00–10:00 → 120 minutes, OK`,
  '06b-map-dts': `$ npx tsc -p demo2/ts-02-4/map/dts.json && cat demo2/ts-02-4/map/out/demo2/ts-02-4/map/messages.d.ts
export declare const SLOT_MESSAGES: {
    readonly OFF_GRID: 'Start and end must be on the 30-minute grid.';
    readonly END_BEFORE_START: 'The end time must be after the start time.';
    readonly OUTSIDE_HOURS: 'Labs are open from 07:00 to 21:00.';
    readonly TOO_LONG: 'A booking can last at most 4 hours.';
};
export type MessageKey = keyof typeof SLOT_MESSAGES;
export type Message = (typeof SLOT_MESSAGES)[MessageKey];`,
  '07-map-red': `$ npx tsc -p demo2/ts-02-4/map-red
demo2/ts-02-4/map-red/messages.ts(8,12): error TS2741: Property 'TOO_LONG' is missing in type '{ readonly OFF_GRID: 'Start and end must be on the 30-minute grid.'; readonly END_BEFORE_START: 'The end time must be after the start time.'; readonly OUTSIDE_HOURS: 'Labs are open from 07:00 to 21:00.'; }' but required in type 'Record<SlotCode, string>'.
demo2/ts-02-4/map-red/messages.ts(10,15): error TS2540: Cannot assign to 'OFF_GRID' because it is a read-only property.`,
  '08-enum-tsc': `$ npx tsc -p demo2/ts-02-4/enum
demo2/ts-02-4/enum/status-enum.ts(2,13): error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
demo2/ts-02-4/enum/use-red.ts(3,7): error TS2345: Argument of type '"APPROVED"' is not assignable to parameter of type 'Status'.`,
  '09-enum-run': `$ node demo2/ts-02-4/enum/status.ts
PENDING · confirmed · [ 'PENDING', 'CONFIRMED' ]`,
  '10-readonly': `$ npx tsc -p demo2/ts-02-4/readonly
demo2/ts-02-4/readonly/print.ts(8,11): error TS4104: The type 'readonly ["BE-201", "BE-202", "AL-301"]' is 'readonly' and cannot be assigned to the mutable type 'string[]'.`,
  '11-readonly-fixed': `$ npx tsc -p demo2/ts-02-4/readonly/fixed.json && node demo2/ts-02-4/readonly/print-fixed.ts
BE-201, BE-202, AL-301
X-1, X-2`,
  '12-grow': `$ npx tsc -p demo2/ts-02-4/grow && node demo2/ts-02-4/grow/labs.ts
?lab=AL-301 → accepted
?lab=AL-302 → accepted
?lab=BE-999 → refused`,
  '13-pr-start': `$ npx tsc -p demo2/ts-02-4/practice/start
demo2/ts-02-4/practice/start/step.ts(7,26): error TS2322: Type 'number' is not assignable to type 'Step'.`,
  '14-pr-sol': `$ npx tsc -p demo2/ts-02-4/practice/solution && node demo2/ts-02-4/practice/solution/run.ts
?step=30 → grid of 30 minutes
?step=45 → RangeError: unsupported step: 45
?step=abc → RangeError: unsupported step: abc`,
  '15-frozen': `$ node demo2/ts-02-4/runtime/frozen.ts
array? true · frozen? false · length 3`,
};
