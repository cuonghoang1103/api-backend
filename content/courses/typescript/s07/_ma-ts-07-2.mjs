/**
 * _ma (bài 7.2) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "partialPatch": `type Booking = { id: number; lab: string; seats: number; status: string };

// Add ? to every field: a PATCH body may carry any subset.
type Patch<T> = { [K in keyof T]?: T[K] };

function applyPatch(b: Booking, patch: Patch<Booking>): Booking {
  return { ...b, ...patch };
}

const b: Booking = { id: 1, lab: 'BE-201', seats: 40, status: 'PENDING' };
console.log(applyPatch(b, { seats: 30 }));          // only one field
console.log(applyPatch(b, { status: 'CONFIRMED' }));`,
  "requiredComplete": `type Draft = { title: string; body?: string; tags?: string[] };

// Remove the optional modifier from every field: now all are required.
type Complete<T> = { [K in keyof T]-?: T[K] };

const draft: Draft = { title: 'Hi' };                 // ok — body and tags are optional
const done: Complete<Draft> = { title: 'Hi' };        // not ok — body and tags are now required
export { draft, done };`,
  "mutableThaw": `type Lab = { readonly code: string; readonly capacity: number };

// Remove the readonly modifier from every field.
type Mutable<T> = { -readonly [K in keyof T]: T[K] };

const frozen: Lab = { code: 'BE-201', capacity: 40 };
// frozen.capacity = 50;  // would be TS2540
const draft: Mutable<Lab> = { code: 'BE-201', capacity: 40 };
draft.capacity = 50;      // allowed — readonly was removed
console.log(frozen.capacity, draft.capacity);`,
  "bothSnap": `type Booking = { id: number; lab: string; seats: number };

// Both modifiers at once: every field read-only and optional.
type ReadonlyPatch<T> = { readonly [K in keyof T]?: T[K] };

const rp: ReadonlyPatch<Booking> = { seats: 40 };
console.log(rp.seats);
// rp.seats = 30; // TS2540 — readonly`,
  "prStart": `type User = { id: number; name: string; email: string };

// updateUser should accept ANY subset of User fields, but the type demands all three.
export function updateUser(u: User, changes: User): User {
  return { ...u, ...changes };
}

const an: User = { id: 1, name: 'An', email: 'an@fpt.edu.vn' };
console.log(updateUser(an, { name: 'An 2' }));  // only one field — tsc refuses this`,
  "prSol": `type User = { id: number; name: string; email: string };
type Patch<T> = { [K in keyof T]?: T[K] };

export function updateUser(u: User, changes: Patch<User>): User {
  return { ...u, ...changes };
}

const an: User = { id: 1, name: 'An', email: 'an@fpt.edu.vn' };
console.log(updateUser(an, { name: 'An 2' }));`,
};
export const OUT = {
  '11-partial': `$ npx tsc -p demo7/ts-07-2/partial && node demo7/ts-07-2/partial/patch.ts
{ id: 1, lab: 'BE-201', seats: 30, status: 'PENDING' }
{ id: 1, lab: 'BE-201', seats: 40, status: 'CONFIRMED' }`,
  '12-required': `$ npx tsc -p demo7/ts-07-2/required
demo7/ts-07-2/required/complete.ts(7,7): error TS2739: Type '{ title: string; }' is missing the following properties from type 'Complete<Draft>': body, tags`,
  '13-mutable': `$ npx tsc -p demo7/ts-07-2/mutable && node demo7/ts-07-2/mutable/thaw.ts
40 50`,
  '14-both': `$ npx tsc -p demo7/ts-07-2/both && node demo7/ts-07-2/both/snap.ts
40`,
  '15-pr-start': `$ npx tsc -p demo7/ts-07-2/practice/start
demo7/ts-07-2/practice/start/patch.ts(9,28): error TS2739: Type '{ name: string; }' is missing the following properties from type 'User': id, email`,
  '16-pr-sol': `$ npx tsc -p demo7/ts-07-2/practice/solution && node demo7/ts-07-2/practice/solution/patch.ts
{ id: 1, name: 'An 2', email: 'an@fpt.edu.vn' }`,
};
