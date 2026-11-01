/**
 * _ma (bài 4.3) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "base": `import type { Role } from '../../../src/rules/booking.ts';
import type { LabCode, TimeRange } from '../../../src/rules/schedule.ts';

// What every stored record has — written once.
export interface Entity {
  readonly id: number;
  readonly createdAt: string;
}

export interface User extends Entity {
  email: string;
  name: string;
  role: Role;
}

export interface BookingRecord extends Entity {
  readonly lab: LabCode;
  readonly userId: number;
  readonly range: TimeRange;
  readonly seats: number;
}`,
  "extendsUse": `import type { User } from '../base/entity.ts';

const an: User = { id: 1, createdAt: '2026-11-01T08:00:00Z', email: 'an.nv@fpt.edu.vn', name: 'Nguyen Van An', role: 'STUDENT' };
const fromForm: User = { email: 'binh.tt@fpt.edu.vn', name: 'Tran Thi Binh', role: 'LECTURER' }; // the database sets id + createdAt
an.id = 2;
export { fromForm };`,
  "override": `import type { User } from '../base/entity.ts';

// Narrowing an inherited property is allowed: every Student is still a User.
export interface Student extends User {
  role: 'STUDENT';
  studentCode: string;
}

// Changing its type is not: a "User" whose id is text would break every function that takes a User.
export interface ImportedUser extends User {
  id: string;
}`,
  "inter": `import type { BookingRecord } from '../base/entity.ts';

// & — "a BookingRecord AND these two fields".
export type BookingView = BookingRecord & { labName: string; userName: string };

declare const rec: BookingRecord;
const ok: BookingView = { ...rec, labName: 'AI Lab', userName: 'Tran Thi Binh' };
const half: BookingView = { ...rec, labName: 'AI Lab' };
export { ok, half };`,
  "conflict": `import type { User } from '../base/entity.ts';

// The same mistake as ImportedUser, written with & instead of extends.
export type ImportedUser = User & { id: string };   // no error here

const u: ImportedUser = {
  id: 'U-0007',
  createdAt: '2026-11-01T08:00:00Z',
  email: 'chi.lt@fpt.edu.vn',
  name: 'Le Thi Chi',
  role: 'STUDENT',
};
export { u };`,
  "andor": `type HasLab = { lab: string };
type HasSeats = { seats: number };

// & : must have BOTH  → more properties, fewer values
// | : must have ONE   → fewer guarantees, more values (Chapter 5)
const both: HasLab & HasSeats = { lab: 'BE-201' };
const either: HasLab | HasSeats = { lab: 'BE-201' };
export { both, either };`,
  "view": `import type { BookingRecord, User } from '../base/entity.ts';

type BookingView = BookingRecord & { labName: string; userName: string };

const binh: User = { id: 2, createdAt: '2026-11-01T08:05:00Z', email: 'binh.tt@fpt.edu.vn', name: 'Tran Thi Binh', role: 'LECTURER' };
const rec: BookingRecord = { id: 11, createdAt: '2026-11-01T09:00:00Z', lab: 'AL-301', userId: 2, range: [600, 720], seats: 25 };

// Spread the record, add the two names: the result has every field of both.
function toView(b: BookingRecord, user: User): BookingView {
  return { ...b, labName: 'AI Lab', userName: user.name };
}
console.log(toView(rec, binh));`,
  "prStart": `// A teammate composed the model with &. It compiles. Then the seed fails — on a line that looks correct.
type Entity = { readonly id: number; readonly createdAt: string };
type Lab = Entity & { code: string; capacity: number };
type Equipment = Entity & { id: string; labCode: string; name: string }; // ids from the supplier: "EQ-0042"

const lab: Lab = { id: 1, createdAt: '2026-11-01', code: 'AL-301', capacity: 30 };
const gpu: Equipment = { id: 'EQ-0042', createdAt: '2026-11-01', labCode: 'AL-301', name: 'GPU server' };
export { lab, gpu };`,
  "prStep1": `// Step 1: the same model with interfaces. Now tsc points at the cause.
interface Entity { readonly id: number; readonly createdAt: string }
interface Lab extends Entity { code: string; capacity: number }
interface Equipment extends Entity { id: string; labCode: string; name: string } // ids from the supplier: "EQ-0042"

const lab: Lab = { id: 1, createdAt: '2026-11-01', code: 'AL-301', capacity: 30 };
const gpu: Equipment = { id: 'EQ-0042', createdAt: '2026-11-01', labCode: 'AL-301', name: 'GPU server' };
export { lab, gpu };`,
  "prSol": `// Solution: the supplier's code is a different fact, so it gets a different name. Equipment keeps a numeric id.
interface Entity { readonly id: number; readonly createdAt: string }
interface Lab extends Entity { code: string; capacity: number }
interface Equipment extends Entity { supplierCode: string; labCode: string; name: string }

const lab: Lab = { id: 1, createdAt: '2026-11-01', code: 'AL-301', capacity: 30 };
const gpu: Equipment = { id: 42, supplierCode: 'EQ-0042', createdAt: '2026-11-01', labCode: 'AL-301', name: 'GPU server' };
console.log(lab.code, gpu.supplierCode, gpu.id);`,
};
export const OUT = {
  '11-extends': `$ npx tsc -p demo4/ts-04-3/extends
demo4/ts-04-3/extends/use.ts(4,7): error TS2739: Type '{ email: string; name: string; role: "LECTURER"; }' is missing the following properties from type 'User': id, createdAt
demo4/ts-04-3/extends/use.ts(5,4): error TS2540: Cannot assign to 'id' because it is a read-only property.`,
  '12-override': `$ npx tsc -p demo4/ts-04-3/override
demo4/ts-04-3/override/roles.ts(10,18): error TS2430: Interface 'ImportedUser' incorrectly extends interface 'User'.
  Types of property 'id' are incompatible.
    Type 'string' is not assignable to type 'number'.`,
  '13-inter': `$ npx tsc -p demo4/ts-04-3/inter
demo4/ts-04-3/inter/view.ts(8,7): error TS2322: Type '{ id: number; createdAt: string; lab: LabCode; userId: number; range: TimeRange; seats: number; labName: string; }' is not assignable to type 'BookingView'.
  Property 'userName' is missing in type '{ id: number; createdAt: string; lab: LabCode; userId: number; range: TimeRange; seats: number; labName: string; }' but required in type '{ labName: string; userName: string; }'.`,
  '14-conflict': `$ npx tsc -p demo4/ts-04-3/conflict
demo4/ts-04-3/conflict/imported.ts(7,3): error TS2322: Type 'string' is not assignable to type 'never'.`,
  '15-andor': `$ npx tsc -p demo4/ts-04-3/andor
demo4/ts-04-3/andor/andor.ts(6,7): error TS2322: Type '{ lab: string; }' is not assignable to type 'HasLab & HasSeats'.
  Property 'seats' is missing in type '{ lab: string; }' but required in type 'HasSeats'.`,
  '16-view': `$ npx tsc -p demo4/ts-04-3/view && node demo4/ts-04-3/view/run.ts
{
  id: 11,
  createdAt: '2026-11-01T09:00:00Z',
  lab: 'AL-301',
  userId: 2,
  range: [ 600, 720 ],
  seats: 25,
  labName: 'AI Lab',
  userName: 'Tran Thi Binh'
}`,
  '17-pr-start': `$ npx tsc -p demo4/ts-04-3/practice/start
demo4/ts-04-3/practice/start/model.ts(7,26): error TS2322: Type 'string' is not assignable to type 'never'.`,
  '18-pr-step1': `$ npx tsc -p demo4/ts-04-3/practice/step1
demo4/ts-04-3/practice/step1/model.ts(4,11): error TS2430: Interface 'Equipment' incorrectly extends interface 'Entity'.
  Types of property 'id' are incompatible.
    Type 'string' is not assignable to type 'number'.`,
  '19-pr-sol': `$ npx tsc -p demo4/ts-04-3/practice/solution && node demo4/ts-04-3/practice/solution/model.ts
AL-301 EQ-0042 42`,
};
