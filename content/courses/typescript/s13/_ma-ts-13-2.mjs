/**
 * _ma (bài 13.2) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "safeparse": `import * as z from './zod.ts';
const BookingInput = z.object({ lab: z.string(), seats: z.number() });
const result = BookingInput.safeParse({ lab: 'BE-201', seats: 40 });
// A discriminated union: narrow on success before reading data.
if (result.success) console.log('ok:', result.data.lab);
else console.log('error:', result.error.issues[0]?.message);`,
  "wrongbranch": `import * as z from './zod.ts';
const BookingInput = z.object({ lab: z.string(), seats: z.number() });
const result = BookingInput.safeParse({ lab: 'BE-201', seats: 40 });
// Reading data without checking success — it is not on the failure branch.
export const lab = result.data.lab;`,
  "prStart": `import * as z from './zod.ts';
const SeatInput = z.object({ seats: z.number() });
const result = SeatInput.safeParse({ seats: 40 });
// data is only there when success is true.
export const n = result.data.seats;`,
  "prSol": `import * as z from './zod.ts';
const SeatInput = z.object({ seats: z.number() });
const result = SeatInput.safeParse({ seats: 40 });
export const n = result.success ? result.data.seats : 0;
console.log(n);`,
};
export const OUT = {
  '11-safeparse': `$ node demo13/ts-13-2/safeparse/check.ts
ok: BE-201`,
  '12-wrongbranch': `$ node_modules/.bin/tsc -p demo13/ts-13-2/wrongbranch
demo13/ts-13-2/wrongbranch/check.ts(5,27): error TS2339: Property 'data' does not exist on type 'SafeResult<Output<{ lab: Schema<string>; seats: Schema<number>; }>>'.
  Property 'data' does not exist on type '{ success: false; error: ZodError; }'.`,
  '13-pr-start': `$ node_modules/.bin/tsc -p demo13/ts-13-2/practice/start
demo13/ts-13-2/practice/start/check.ts(5,25): error TS2339: Property 'data' does not exist on type 'SafeResult<Output<{ seats: Schema<number>; }>>'.
  Property 'data' does not exist on type '{ success: false; error: ZodError; }'.`,
  '14-pr-sol': `$ node demo13/ts-13-2/practice/solution/check.ts
40`,
};
