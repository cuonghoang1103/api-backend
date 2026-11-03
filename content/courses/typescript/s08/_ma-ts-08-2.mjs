/**
 * _ma (bài 8.2) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "omitCreate": `type Booking = {
  id: number; lab: string; seats: number; purpose: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'; createdAt: string;
};

// A create DTO is the resource minus the fields the server owns.
type CreateBooking = Omit<Booking, 'id' | 'status' | 'createdAt'>;

function createBooking(input: CreateBooking): Booking {
  return { ...input, id: 1, status: 'PENDING', createdAt: '2027-03-03T06:00:00Z' };
}

console.log(createBooking({ lab: 'BE-201', seats: 40, purpose: 'Lab' }));`,
  "omitbadCreate": `type Booking = {
  id: number; lab: string; seats: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
};
type CreateBooking = Omit<Booking, 'id' | 'status'>;

// A client must not send id — Omit removed it, so this is refused.
const bad: CreateBooking = { lab: 'BE-201', seats: 40, id: 99 };
console.log(bad);`,
  "pickPublic": `type User = { id: number; name: string; email: string; passwordHash: string; role: string };

// A public view is a type with only some keys.
type PublicUser = Pick<User, 'id' | 'name'>;

function toPublic(u: User): PublicUser {
  return { id: u.id, name: u.name };
}

console.log(toPublic({ id: 1, name: 'An', email: 'a@x.vn', passwordHash: 'xxx', role: 'user' }));`,
  "leakPublic": `type User = { id: number; name: string; email: string; passwordHash: string };

// Omit the secret: PublicUser has no passwordHash, so reading it is a compile error.
type PublicUser = Omit<User, 'passwordHash'>;

function show(u: PublicUser) {
  console.log(u.passwordHash); // the field is gone
}
show({ id: 1, name: 'An', email: 'a@x.vn' });`,
  "pickkeyK": `type User = { id: number; name: string; email: string };

// Pick only accepts real keys of User — a misspelt key is refused up front.
type Bad = Pick<User, 'id' | 'emial'>;
const x: Bad = { id: 1, emial: 'a@x.vn' };
console.log(x);`,
  "prStart": `type Note = { id: number; title: string; body: string; ownerId: number; createdAt: string };

// CreateNote is the whole Note, so the caller must send server-owned id and createdAt too.
export type CreateNote = Note;

const input: CreateNote = { title: 'Hi', body: 'x', ownerId: 1 }; // id, createdAt missing
console.log(input);`,
  "prSol": `type Note = { id: number; title: string; body: string; ownerId: number; createdAt: string };

// Omit the server-owned fields — the DTO tracks Note.
export type CreateNote = Omit<Note, 'id' | 'createdAt'>;

const input: CreateNote = { title: 'Hi', body: 'x', ownerId: 1 };
console.log(input);`,
};
export const OUT = {
  '11-omit': `$ node demo8/ts-08-2/omit/create.ts
{
  lab: 'BE-201',
  seats: 40,
  purpose: 'Lab',
  id: 1,
  status: 'PENDING',
  createdAt: '2027-03-03T06:00:00Z'
}`,
  '12-omit-bad': `$ node_modules/.bin/tsc -p demo8/ts-08-2/omitbad
demo8/ts-08-2/omitbad/create.ts(8,56): error TS2353: Object literal may only specify known properties, and 'id' does not exist in type 'CreateBooking'.`,
  '13-pick': `$ node demo8/ts-08-2/pick/publicuser.ts
{ id: 1, name: 'An' }`,
  '14-leak': `$ node_modules/.bin/tsc -p demo8/ts-08-2/leak
demo8/ts-08-2/leak/publicuser.ts(7,17): error TS2339: Property 'passwordHash' does not exist on type 'PublicUser'.`,
  '15-pickkey': `$ node_modules/.bin/tsc -p demo8/ts-08-2/pickkey
demo8/ts-08-2/pickkey/k.ts(4,23): error TS2344: Type '"emial" | "id"' does not satisfy the constraint 'keyof User'.
  Type '"emial"' is not assignable to type 'keyof User'. Did you mean '"email"'?`,
  '16-pr-start': `$ node_modules/.bin/tsc -p demo8/ts-08-2/practice/start
demo8/ts-08-2/practice/start/dto.ts(6,7): error TS2739: Type '{ title: string; body: string; ownerId: number; }' is missing the following properties from type 'Note': id, createdAt`,
  '17-pr-sol': `$ node demo8/ts-08-2/practice/solution/dto.ts
{ title: 'Hi', body: 'x', ownerId: 1 }`,
};
