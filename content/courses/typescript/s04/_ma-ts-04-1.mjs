/**
 * _ma (bài 4.1) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "typoJs": `// Plain JavaScript: an object takes any key, so a misspelled key is just one more key.
function freeSeats(lab, booked) {
  return lab.capacity - booked;
}

const fromForm = { code: 'BE-201', name: 'Backend Lab 1', capasity: 40 }; // typo in the admin form
console.log('free seats:', freeSeats(fromForm, 12));
console.log('saved as  :', JSON.stringify(fromForm));`,
  "shapeLab": `import type { LabCode } from '../../../src/rules/schedule.ts';

// A shape: which properties the object has, and the type of each one.
export type Lab = {
  code: LabCode;
  name: string;
  capacity: number;
};

export function freeSeats(lab: Lab, booked: number): number {
  return lab.capacity - booked;
}`,
  "shapeUse": `import { freeSeats } from './lab.ts';
import type { Lab } from './lab.ts';
import type { LabCode } from '../../../src/rules/schedule.ts';

const be201: Lab = { code: 'BE-201', name: 'Backend Lab 1', capacity: 40 };
console.log('free seats:', freeSeats(be201, 12));

// The same shape, written in place instead of named. Fine once; noisy the third time.
const inline: { code: LabCode; name: string; capacity: number } = be201;
console.log('inline    :', inline.name);`,
  "missing": `import type { Lab } from '../shape/lab.ts';

const ai: Lab = { code: 'AL-301', name: 'AI Lab' };                                // forgot the capacity
const empty: Lab = { code: 'BE-202' };                                              // forgot two properties
const fromForm: Lab = { code: 'BE-201', name: 'Backend Lab 1', capacity: '40' };   // a form field is text
export { ai, empty, fromForm };`,
  "excess": `import type { Lab } from '../shape/lab.ts';

const withFloor: Lab = { code: 'BE-201', name: 'Backend Lab 1', capacity: 40, floor: 2 }; // a key Lab does not have
const typo: Lab = { code: 'BE-201', name: 'Backend Lab 1', capasity: 40 };                 // the admin form's typo
export { withFloor, typo };`,
  "freshStrict": `import type { LabCode } from '../../../../src/rules/schedule.ts';

// capacity is required
type Lab = {
  code: LabCode;
  name: string;
  capacity: number;
};

function freeSeats(lab: Lab, booked: number): number {
  return lab.capacity - booked;
}

const code: LabCode = 'BE-201';
const fromForm = { code, name: 'Backend Lab 1', capasity: 40 }; // built first, with the typo
const lab: Lab = fromForm;                                       // not a fresh literal any more
console.log('free seats:', freeSeats(lab, 12));`,
  "freshLoose": `import type { LabCode } from '../../../../src/rules/schedule.ts';

// capacity is optional now
type Lab = {
  code: LabCode;
  name: string;
  capacity?: number; // "made optional: the seed did not compile without it"
};

function freeSeats(lab: Lab, booked: number): number {
  return (lab.capacity ?? 0) - booked;
}

const code: LabCode = 'BE-201';
const fromForm = { code, name: 'Backend Lab 1', capasity: 40 }; // built first, with the typo
const lab: Lab = fromForm;                                       // not a fresh literal any more
console.log('free seats:', freeSeats(lab, 12));`,
  "optional": `import type { LabCode } from '../../../src/rules/schedule.ts';

export type Lab = {
  code: LabCode;
  name: string;
  capacity: number;
  equipment?: string[]; // absent = nobody has recorded it yet
};

export function equipmentLine(lab: Lab): string {
  return lab.name + ': ' + lab.equipment.join(', ');
}`,
  "optionalFixed": `import type { Lab } from './lab.ts';

// Absent and empty are two different answers — say both.
export function equipmentLine(lab: Lab): string {
  if (lab.equipment === undefined) return lab.name + ': (not recorded yet)';
  if (lab.equipment.length === 0) return lab.name + ': (nothing)';
  return lab.name + ': ' + lab.equipment.join(', ');
}

const labs: Lab[] = [
  { code: 'BE-201', name: 'Backend Lab 1', capacity: 40, equipment: ['projector', 'whiteboard'] },
  { code: 'BE-202', name: 'Backend Lab 2', capacity: 40 },
  { code: 'AL-301', name: 'AI Lab', capacity: 30, equipment: [] },
];
for (const lab of labs) console.log(equipmentLine(lab));
console.log('items:', labs.map((lab) => lab.equipment?.length ?? 0));
console.log(JSON.stringify(labs[1]));`,
  "roShallow": `import type { LabCode } from '../../../../src/rules/schedule.ts';

type Lab = {
  readonly code: LabCode;
  name: string;
  capacity: number;
  readonly equipment: string[];
};

const STANDARD: string[] = ['projector', 'whiteboard'];
const be201: Lab = { code: 'BE-201', name: 'Backend Lab 1', capacity: 40, equipment: STANDARD };
const be202: Lab = { code: 'BE-202', name: 'Backend Lab 2', capacity: 40, equipment: STANDARD };

be201.name = 'Backend Lab 1 (renovated)'; // allowed: name is not readonly
be201.code = 'BE-202';                    // the code identifies the room
be201.equipment = ['GPU server'];         // the property is readonly…
be201.equipment.push('GPU server');       // …but the array inside it is not
console.log('BE-202 now has:', be202.equipment);`,
  "roRun": `import type { LabCode } from '../../../../src/rules/schedule.ts';

type Lab = { readonly code: LabCode; name: string; capacity: number; readonly equipment: string[] };

const STANDARD: string[] = ['projector', 'whiteboard'];
const be201: Lab = { code: 'BE-201', name: 'Backend Lab 1', capacity: 40, equipment: STANDARD };
const be202: Lab = { code: 'BE-202', name: 'Backend Lab 2', capacity: 40, equipment: STANDARD };

be201.equipment.push('GPU server'); // meant for BE-201 only — compiles
console.log('BE-201 has:', be201.equipment);
console.log('BE-202 has:', be202.equipment);`,
  "roDeep": `import type { LabCode } from '../../../../src/rules/schedule.ts';

type Lab = {
  readonly code: LabCode;
  name: string;
  capacity: number;
  readonly equipment: readonly string[]; // the property AND the list are read-only
};

const STANDARD: readonly string[] = ['projector', 'whiteboard'];
const be201: Lab = { code: 'BE-201', name: 'Backend Lab 1', capacity: 40, equipment: STANDARD };

be201.equipment.push('GPU server');
const upgraded: Lab = { ...be201, equipment: [...be201.equipment, 'GPU server'] }; // a new lab, a new list
console.log(upgraded.equipment, STANDARD);`,
  "nested": `import type { LabCode } from '../../../src/rules/schedule.ts';

// Name the inner shape: smaller types, and a name in every error message.
export type Place = { building: string; floor: number };

export type Lab = {
  code: LabCode;
  name: string;
  capacity: number;
  place: Place;
};

const be201: Lab = { code: 'BE-201', name: 'Backend Lab 1', capacity: 40, place: { building: 'Beta', floor: '2' } };
const al301: Lab = { code: 'AL-301', name: 'AI Lab', capacity: 30, place: { building: 'Alpha' } };
export { be201, al301 };`,
  "structural": `import type { LabCode } from '../../../src/rules/schedule.ts';

type Lab = { code: LabCode; name: string; capacity: number };
type Classroom = { code: LabCode; name: string; capacity: number; projector: boolean }; // never mentions Lab

function freeSeats(lab: Lab, booked: number): number {
  return lab.capacity - booked;
}

const room: Classroom = { code: 'BE-202', name: 'Backend Lab 2', capacity: 40, projector: true };
console.log('free seats:', freeSeats(room, 15)); // a Classroom has everything a Lab needs

// Destructuring in the parameter list: the type still goes after the whole pattern.
function describe({ name, capacity }: Lab): string {
  return name + ' (' + capacity + ' seats)';
}
console.log(describe(room));`,
  "prStart": `// A teammate's User type. One line is refused; one wrong line is not.
type User = {
  id: number;
  email: string;
  name: string;
  studentCode: string; // students have one; lecturers do not
};

const an: User = { id: 1, email: 'an.nv@fpt.edu.vn', name: 'Nguyen Van An', studentCode: 'he176322' };
const binh: User = { id: 2, email: 'binh.tt@fpt.edu.vn', name: 'Tran Thi Binh' };
an.id = 99; // an id must never change

for (const u of [an, binh]) console.log(u.name, '-', u.studentCode.toUpperCase());`,
  "prSol": `// Solution: the type says what is true, and the code handles the missing student code.
type User = {
  readonly id: number;
  email: string;
  name: string;
  studentCode?: string; // only students have one
};

const an: User = { id: 1, email: 'an.nv@fpt.edu.vn', name: 'Nguyen Van An', studentCode: 'he176322' };
const binh: User = { id: 2, email: 'binh.tt@fpt.edu.vn', name: 'Tran Thi Binh' };

for (const u of [an, binh]) console.log(u.name, '-', u.studentCode?.toUpperCase() ?? '(lecturer)');`,
};
export const OUT = {
  '11-js-typo': `$ node demo4/ts-04-1/js/typo.mjs
free seats: NaN
saved as  : {"code":"BE-201","name":"Backend Lab 1","capasity":40}`,
  '12-shape': `$ npx tsc -p demo4/ts-04-1/shape && node demo4/ts-04-1/shape/use.ts
free seats: 28
inline    : Backend Lab 1`,
  '13-missing': `$ npx tsc -p demo4/ts-04-1/missing
demo4/ts-04-1/missing/lab.ts(3,7): error TS2741: Property 'capacity' is missing in type '{ code: "AL-301"; name: string; }' but required in type 'Lab'.
demo4/ts-04-1/missing/lab.ts(4,7): error TS2739: Type '{ code: "BE-202"; }' is missing the following properties from type 'Lab': name, capacity
demo4/ts-04-1/missing/lab.ts(5,64): error TS2322: Type 'string' is not assignable to type 'number'.`,
  '14-excess': `$ npx tsc -p demo4/ts-04-1/excess
demo4/ts-04-1/excess/lab.ts(3,79): error TS2353: Object literal may only specify known properties, and 'floor' does not exist in type 'Lab'.
demo4/ts-04-1/excess/lab.ts(4,60): error TS2561: Object literal may only specify known properties, but 'capasity' does not exist in type 'Lab'. Did you mean to write 'capacity'?`,
  '15-fresh-strict': `$ npx tsc -p demo4/ts-04-1/fresh/strict
demo4/ts-04-1/fresh/strict/lab.ts(16,7): error TS2741: Property 'capacity' is missing in type '{ code: "BE-201"; name: string; capasity: number; }' but required in type 'Lab'.`,
  '16-fresh-loose': `$ npx tsc -p demo4/ts-04-1/fresh/loose && node demo4/ts-04-1/fresh/loose/lab.ts
free seats: -12`,
  '17-optional': `$ npx tsc -p demo4/ts-04-1/optional
demo4/ts-04-1/optional/lab.ts(11,28): error TS18048: 'lab.equipment' is possibly 'undefined'.`,
  '18-optional-run': `$ node demo4/ts-04-1/optional/fixed.ts
Backend Lab 1: projector, whiteboard
Backend Lab 2: (not recorded yet)
AI Lab: (nothing)
items: [ 2, 0, 0 ]
{"code":"BE-202","name":"Backend Lab 2","capacity":40}`,
  '19-ro-tsc': `$ npx tsc -p demo4/ts-04-1/readonly/shallow
demo4/ts-04-1/readonly/shallow/lab.ts(15,7): error TS2540: Cannot assign to 'code' because it is a read-only property.
demo4/ts-04-1/readonly/shallow/lab.ts(16,7): error TS2540: Cannot assign to 'equipment' because it is a read-only property.`,
  '20-ro-run': `$ node demo4/ts-04-1/readonly/shallow/run.ts
BE-201 has: [ 'projector', 'whiteboard', 'GPU server' ]
BE-202 has: [ 'projector', 'whiteboard', 'GPU server' ]`,
  '21-ro-deep': `$ npx tsc -p demo4/ts-04-1/readonly/deep
demo4/ts-04-1/readonly/deep/lab.ts(13,17): error TS2339: Property 'push' does not exist on type 'readonly string[]'.`,
  '22-nested': `$ npx tsc -p demo4/ts-04-1/nested
demo4/ts-04-1/nested/lab.ts(13,102): error TS2322: Type 'string' is not assignable to type 'number'.
demo4/ts-04-1/nested/lab.ts(14,68): error TS2741: Property 'floor' is missing in type '{ building: string; }' but required in type 'Place'.`,
  '23-structural': `$ npx tsc -p demo4/ts-04-1/structural && node demo4/ts-04-1/structural/use.ts
free seats: 25
Backend Lab 2 (40 seats)`,
  '24-pr-start': `$ npx tsc -p demo4/ts-04-1/practice/start
demo4/ts-04-1/practice/start/user.ts(10,7): error TS2741: Property 'studentCode' is missing in type '{ id: number; email: string; name: string; }' but required in type 'User'.`,
  '25-pr-start-run': `$ node demo4/ts-04-1/practice/start/user.ts
Nguyen Van An - HE176322
file://…/labflow-ts/demo4/ts-04-1/practice/start/user.ts:13
for (const u of [an, binh]) console.log(u.name, '-', u.studentCode.toUpperCase());
                                                                   ^

TypeError: Cannot read properties of undefined (reading 'toUpperCase')
    at file://…/labflow-ts/demo4/ts-04-1/practice/start/user.ts:13:68
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
  '26-pr-step1': `$ npx tsc -p demo4/ts-04-1/practice/step1
demo4/ts-04-1/practice/step1/user.ts(11,4): error TS2540: Cannot assign to 'id' because it is a read-only property.
demo4/ts-04-1/practice/step1/user.ts(13,54): error TS18048: 'u.studentCode' is possibly 'undefined'.`,
  '27-pr-sol': `$ npx tsc -p demo4/ts-04-1/practice/solution && node demo4/ts-04-1/practice/solution/user.ts
Nguyen Van An - HE176322
Tran Thi Binh - (lecturer)`,
};
