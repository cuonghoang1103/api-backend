/**
 * _ma (bài 7.1) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "driftForm": `type Lab = { code: string; capacity: number; floor: number };

// A "form" version where every field is a string (text inputs). Hand-written — and already out of date:
// it is missing \`floor\`, and tsc cannot tell, because it is a separate type.
type LabForm = { code: string; capacity: string };

const form: LabForm = { code: 'BE-201', capacity: '40' }; // no error — floor silently dropped
export { form };
void (null as unknown as Lab);`,
  "stringifyForm": `type Lab = { code: string; capacity: number; floor: number };

// A mapped type: for every key K of Lab, make the field a string. One line, always in sync.
type Stringify<T> = { [K in keyof T]: string };
type LabForm = Stringify<Lab>; // { code: string; capacity: string; floor: string }

const form: LabForm = { code: 'BE-201', capacity: '40', floor: '2' };
console.log(form);`,
  "frozen": `type Lab = { code: string; capacity: number };

// Readonly<T>, written out: copy each field and add the readonly modifier.
type Frozen<T> = { readonly [K in keyof T]: T[K] };

const lab: Frozen<Lab> = { code: 'BE-201', capacity: 40 };
console.log(lab.capacity); // reading is fine
lab.capacity = 50;         // writing is not`,
  "recordSeats": `type LabCode = 'BE-201' | 'BE-202' | 'AL-301';

// Record<Keys, Value> is a mapped type over a union of keys — one entry per key (4.4, 5.4).
type SeatMap = { [K in LabCode]: number };     // same as Record<LabCode, number>

const seats: SeatMap = { 'BE-201': 40, 'BE-202': 40, 'AL-301': 30 };
console.log(seats['AL-301']);`,
  "valuemapGetters": `type Lab = { code: string; capacity: number };

// A mapped type can change the VALUE type too: here every field becomes a function returning it.
type Getters<T> = { [K in keyof T]: () => T[K] };

const lab: Getters<Lab> = {
  code: () => 'BE-201',
  capacity: () => 40,
};
console.log(lab.code(), lab.capacity());`,
  "prStart": `type Booking = { id: number; lab: string; seats: number };

// A hand-written "display" type where every field is a string. It has drifted: \`seats\` is missing.
type BookingView = { id: string; lab: string };

const view: BookingView = { id: '1', lab: 'BE-201' };
export { view };
void (null as unknown as Booking);`,
  "prSol": `type Booking = { id: number; lab: string; seats: number };

type Stringify<T> = { [K in keyof T]: string };
type BookingView = Stringify<Booking>;

const view: BookingView = { id: '1', lab: 'BE-201', seats: '40' };
console.log(view);`,
};
export const OUT = {
  '11-drift': `$ npx tsc -p demo7/ts-07-1/drift`,
  '12-stringify': `$ npx tsc -p demo7/ts-07-1/stringify && node demo7/ts-07-1/stringify/form.ts
{ code: 'BE-201', capacity: '40', floor: '2' }`,
  '13-frozen': `$ npx tsc -p demo7/ts-07-1/frozen
demo7/ts-07-1/frozen/frozen.ts(8,5): error TS2540: Cannot assign to 'capacity' because it is a read-only property.`,
  '14-record': `$ npx tsc -p demo7/ts-07-1/record && node demo7/ts-07-1/record/seats.ts
30`,
  '15-valuemap': `$ npx tsc -p demo7/ts-07-1/valuemap && node demo7/ts-07-1/valuemap/getters.ts
BE-201 40`,
  '16-pr-start': `$ npx tsc -p demo7/ts-07-1/practice/start`,
  '17-pr-sol': `$ npx tsc -p demo7/ts-07-1/practice/solution && node demo7/ts-07-1/practice/solution/view.ts
{ id: '1', lab: 'BE-201', seats: '40' }`,
};
