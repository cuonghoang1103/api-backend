/**
 * _ma (bài 8.4) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "excludeStatus": `type Status = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

// Exclude removes members from a union — the states a booking can still move to.
type Active = Exclude<Status, 'CANCELLED'>;
const next: Active = 'CANCELLED';
console.log(next);`,
  "nonnullFind": `type MaybeName = string | null | undefined;

// NonNullable drops null and undefined from a union.
type Name = NonNullable<MaybeName>;
const n: Name = null;
console.log(n);`,
  "returntypeRet": `type SlotResult = { ok: true; minutes: number } | { ok: false; reason: string };
function checkSlot(start: string, end: string): SlotResult {
  return { ok: true, minutes: 120 };
}

// ReturnType reads the result type out of the function — no second declaration to keep in sync.
type Checked = ReturnType<typeof checkSlot>;
const r: Checked = { ok: true, minutes: 120 };
if (r.ok) console.log(r.minutes);`,
  "parametersArgs": `function createBooking(lab: string, seats: number): string {
  return lab + ':' + seats;
}

// Parameters reads the argument list as a tuple — a wrapper stays in step with the function.
type Args = Parameters<typeof createBooking>;
const call: Args = ['BE-201', 40];
console.log(createBooking(...call));`,
  "awaitedFetch": `type Booking = { id: number; lab: string };
async function fetchBooking(id: number): Promise<Booking> {
  return { id, lab: 'BE-201' };
}

// Awaited unwraps the Promise — the type you actually have after await.
type Loaded = Awaited<ReturnType<typeof fetchBooking>>;
async function main() {
  const b: Loaded = await fetchBooking(1);
  console.log(b.id, b.lab);
}
main();`,
  "prStart": `function checkSlot(start: string, end: string): { ok: boolean; minutes: number } {
  return { ok: true, minutes: 120 };
}

// The return type is re-declared by hand and has drifted — minutes is string here.
export function logged(start: string, end: string): { ok: boolean; minutes: string } {
  return checkSlot(start, end);
}`,
  "prSol": `function checkSlot(start: string, end: string): { ok: boolean; minutes: number } {
  return { ok: true, minutes: 120 };
}

// Derive the return type with ReturnType — the wrapper tracks checkSlot.
export function logged(start: string, end: string): ReturnType<typeof checkSlot> {
  return checkSlot(start, end);
}`,
};
export const OUT = {
  '11-exclude': `$ node_modules/.bin/tsc -p demo8/ts-08-4/exclude
demo8/ts-08-4/exclude/status.ts(5,7): error TS2322: Type '"CANCELLED"' is not assignable to type 'Active'.`,
  '12-nonnull': `$ node_modules/.bin/tsc -p demo8/ts-08-4/nonnull
demo8/ts-08-4/nonnull/find.ts(5,7): error TS2322: Type 'null' is not assignable to type 'string'.`,
  '13-returntype': `$ node demo8/ts-08-4/returntype/ret.ts
120`,
  '14-parameters': `$ node demo8/ts-08-4/parameters/args.ts
BE-201:40`,
  '15-awaited': `$ node demo8/ts-08-4/awaited/fetch.ts
1 BE-201`,
  '16-pr-start': `$ node_modules/.bin/tsc -p demo8/ts-08-4/practice/start
demo8/ts-08-4/practice/start/wrap.ts(7,3): error TS2322: Type '{ ok: boolean; minutes: number; }' is not assignable to type '{ ok: boolean; minutes: string; }'.
  Types of property 'minutes' are incompatible.
    Type 'number' is not assignable to type 'string'.`,
  '17-pr-sol': `$ node_modules/.bin/tsc -p demo8/ts-08-4/practice/solution`,
};
