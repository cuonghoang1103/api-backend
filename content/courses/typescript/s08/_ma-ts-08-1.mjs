/**
 * _ma (bài 8.1) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "partialPatch": `type Booking = { id: number; lab: string; seats: number; purpose: string };

// Partial<T> makes every field optional — the shape of a PATCH body.
function applyPatch(b: Booking, patch: Partial<Booking>): Booking {
  return { ...b, ...patch };
}

const base: Booking = { id: 1, lab: 'BE-201', seats: 40, purpose: 'Lab' };
console.log(applyPatch(base, { seats: 30 }));          // only one field changes
console.log(applyPatch(base, { lab: 'AL-301', seats: 24 }));`,
  "requiredComplete": `type Draft = { title: string; body?: string; tags?: string[] };

// Required<T> removes every ?, so a complete draft must have everything.
const done: Required<Draft> = { title: 'Hi', body: 'text', tags: [] }; // ok
const partial: Required<Draft> = { title: 'Hi' };                      // body, tags missing
console.log(done, partial);`,
  "readonlyConfig": `type Config = { host: string; port: number };

// Readonly<T> freezes every field at the type level.
const cfg: Readonly<Config> = { host: 'localhost', port: 5432 };
const port: number = cfg.port; // reading is fine
cfg.port = 5433;               // reassigning is not
console.log(port);`,
  "combineSnapshot": `type Booking = { id: number; lab: string; seats: number };

// Utility types compose: a read-only patch of a booking.
type FrozenPatch = Readonly<Partial<Booking>>;
const change: FrozenPatch = { seats: 30 };
console.log(change.seats);
// change.seats = 24  // would be TS2540 — Readonly wraps the Partial`,
  "prStart": `type User = { id: number; name: string; email: string; role: string };

// patch typed as the full User — the caller must resend every field.
export function edit(u: User, patch: User): User { return { ...u, ...patch }; }

const u: User = { id: 1, name: 'An', email: 'a@x.vn', role: 'user' };
edit(u, { name: 'Ada' }); // only one field — id, email, role missing`,
  "prSol": `type User = { id: number; name: string; email: string; role: string };

// Partial<User> lets the caller send any subset.
export function edit(u: User, patch: Partial<User>): User { return { ...u, ...patch }; }

const u: User = { id: 1, name: 'An', email: 'a@x.vn', role: 'user' };
console.log(edit(u, { name: 'Ada' }));`,
};
export const OUT = {
  '11-partial': `$ node demo8/ts-08-1/partial/patch.ts
{ id: 1, lab: 'BE-201', seats: 30, purpose: 'Lab' }
{ id: 1, lab: 'AL-301', seats: 24, purpose: 'Lab' }`,
  '12-required': `$ node_modules/.bin/tsc -p demo8/ts-08-1/required
demo8/ts-08-1/required/complete.ts(5,7): error TS2739: Type '{ title: string; }' is missing the following properties from type 'Required<Draft>': body, tags`,
  '13-readonly': `$ node_modules/.bin/tsc -p demo8/ts-08-1/readonly
demo8/ts-08-1/readonly/config.ts(6,5): error TS2540: Cannot assign to 'port' because it is a read-only property.`,
  '14-combine': `$ node demo8/ts-08-1/combine/snapshot.ts
30`,
  '15-pr-start': `$ node_modules/.bin/tsc -p demo8/ts-08-1/practice/start
demo8/ts-08-1/practice/start/view.ts(7,9): error TS2739: Type '{ name: string; }' is missing the following properties from type 'User': id, email, role`,
  '16-pr-sol': `$ node demo8/ts-08-1/practice/solution/view.ts
{ id: 1, name: 'Ada', email: 'a@x.vn', role: 'user' }`,
};
