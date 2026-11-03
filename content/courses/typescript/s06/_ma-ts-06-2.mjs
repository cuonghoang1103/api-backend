/**
 * _ma (bài 6.2) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "whyByid": `// An unconstrained T knows nothing about its shape, so item.id is an error.
export function byId<T>(items: readonly T[], id: number): T | undefined {
  return items.find((item) => item.id === id);
}`,
  "fixedByid": `import type { User } from '../../../src/rules/model.ts';

// \`extends { id: number }\` is a CONSTRAINT: T may be any type that has a numeric id.
export function byId<T extends { id: number }>(items: readonly T[], id: number): T | undefined {
  return items.find((item) => item.id === id);
}

const users: User[] = [
  { id: 1, createdAt: '2026-11-03', email: 'an@fpt.edu.vn', name: 'An', role: 'STUDENT' },
  { id: 2, createdAt: '2026-11-03', email: 'binh@fpt.edu.vn', name: 'Binh', role: 'LECTURER' },
];
console.log(byId(users, 2)?.name);   // still a User | undefined — the type is kept
console.log(byId(users, 9));`,
  "getProp": `import type { User } from '../../../src/rules/model.ts';

// K must be a key of T; the return type T[K] is the type of THAT property (indexed access).
export function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const an: User = { id: 1, createdAt: '2026-11-03', email: 'an@fpt.edu.vn', name: 'An', role: 'STUDENT' };
const role = getProp(an, 'role');   // role: Role ('STUDENT' | 'LECTURER' | 'ADMIN')
const id = getProp(an, 'id');       // id: number
console.log(role, id.toFixed(0));`,
  "getPropBad": `import type { User } from '../../../src/rules/model.ts';

export function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

declare const an: User;
const ghost = getProp(an, 'ghost');   // 'ghost' is not a key of User
void ghost;`,
  "indexedTypes": `import type { User } from '../../../src/rules/model.ts';
import type { Role } from '../../../src/rules/booking.ts';

// Pull a property's type out of a shape — no need to repeat the union by hand.
type UserRole = User['role'];        // = Role
type UserKey = keyof User;           // 'id' | 'createdAt' | 'email' | 'name' | 'role' | 'studentCode'

const r: UserRole = 'ADMIN';
const same: Role = r;                // UserRole IS Role
const k: UserKey = 'email';
console.log(r, same, k);`,
  "rejectCall": `export function byId<T extends { id: number }>(items: readonly T[], id: number): T | undefined {
  return items.find((item) => item.id === id);
}

// A lab has a \`code\`, not an \`id\` — it does not satisfy the constraint.
const labs = [{ code: 'BE-201', name: 'Backend Lab 1' }];
const found = byId(labs, 1);
void found;`,
  "prStart": `import type { User } from '../../../../src/rules/model.ts';

// pick should return the exact type of the chosen property. Right now it returns any — a typo slips.
export function pick<T>(obj: T, key: string): any {
  return (obj as any)[key];
}

const an: User = { id: 1, createdAt: '2026-11-03', email: 'an@fpt.edu.vn', name: 'An', role: 'STUDENT' };
console.log(pick(an, 'eemail'));`,
  "prSol": `import type { User } from '../../../../src/rules/model.ts';

export function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const an: User = { id: 1, createdAt: '2026-11-03', email: 'an@fpt.edu.vn', name: 'An', role: 'STUDENT' };
console.log(pick(an, 'email'));`,
};
export const OUT = {
  '11-why': `$ npx tsc -p demo6/ts-06-2/why
demo6/ts-06-2/why/byid.ts(3,36): error TS2339: Property 'id' does not exist on type 'T'.`,
  '12-fixed': `$ npx tsc -p demo6/ts-06-2/fixed && node demo6/ts-06-2/fixed/byid.ts
Binh
undefined`,
  '13-getprop': `$ npx tsc -p demo6/ts-06-2/getprop && node demo6/ts-06-2/getprop/get.ts
STUDENT 1`,
  '13b-getprop-bad': `$ npx tsc -p demo6/ts-06-2/getprop-bad
demo6/ts-06-2/getprop-bad/bad.ts(8,27): error TS2345: Argument of type '"ghost"' is not assignable to parameter of type 'keyof User'.`,
  '14-indexed': `$ npx tsc -p demo6/ts-06-2/indexed && node demo6/ts-06-2/indexed/types.ts
ADMIN ADMIN email`,
  '15-reject': `$ npx tsc -p demo6/ts-06-2/reject
demo6/ts-06-2/reject/call.ts(7,20): error TS2345: Argument of type '{ code: string; name: string; }[]' is not assignable to parameter of type 'readonly { id: number; }[]'.
  Property 'id' is missing in type '{ code: string; name: string; }' but required in type '{ id: number; }'.`,
  '16-pr-start': `$ npx tsc -p demo6/ts-06-2/practice/start`,
  '17-pr-step1': `$ npx tsc -p demo6/ts-06-2/practice/step1
demo6/ts-06-2/practice/step1/pick.ts(8,22): error TS2345: Argument of type '"eemail"' is not assignable to parameter of type 'keyof User'.`,
  '18-pr-sol': `$ npx tsc -p demo6/ts-06-2/practice/solution && node demo6/ts-06-2/practice/solution/pick.ts
an@fpt.edu.vn`,
};
