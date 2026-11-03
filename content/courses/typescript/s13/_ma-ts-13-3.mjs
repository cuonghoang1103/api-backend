/**
 * _ma (bài 13.3) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "infer": `import * as z from './zod.ts';
// Define the schema once; the type is derived from it — no hand-written copy to drift.
export const BookingInput = z.object({ lab: z.string(), seats: z.number() });
export type BookingInput = z.Infer<typeof BookingInput>;

export function describe(b: BookingInput): string {
  return b.lab + ' x' + b.seats;
}
console.log(describe(BookingInput.parse({ lab: 'BE-201', seats: 40 })));`,
  "drift": `import * as z from './zod.ts';
export const BookingInput = z.object({ lab: z.string(), seats: z.number() });
// A hand-written copy that has drifted from the schema (purpose was never added to the schema).
type BookingInputManual = { lab: string; seats: number; purpose: string };
const fromSchema: z.Infer<typeof BookingInput> = BookingInput.parse({ lab: 'BE-201', seats: 40 });
// The manual type demands a purpose the schema (and the parsed value) does not have.
export const manual: BookingInputManual = fromSchema;`,
  "prStart": `import * as z from './zod.ts';
export const UserInput = z.object({ email: z.string() });
// A hand-written type that drifted: it claims a 'name' the schema never had.
type UserManual = { email: string; name: string };
const parsed: z.Infer<typeof UserInput> = UserInput.parse({ email: 'a@b.com' });
export const u: UserManual = parsed;`,
  "prSol": `import * as z from './zod.ts';
export const UserInput = z.object({ email: z.string() });
// Derive the type from the schema instead of hand-writing it.
type UserManual = z.Infer<typeof UserInput>;
const parsed: z.Infer<typeof UserInput> = UserInput.parse({ email: 'a@b.com' });
export const u: UserManual = parsed;
console.log(u.email);`,
};
export const OUT = {
  '11-infer': `$ node demo13/ts-13-3/infer/model.ts
BE-201 x40`,
  '12-drift': `$ node_modules/.bin/tsc -p demo13/ts-13-3/drift
demo13/ts-13-3/drift/model.ts(7,14): error TS2741: Property 'purpose' is missing in type 'Output<{ lab: Schema<string>; seats: Schema<number>; }>' but required in type 'BookingInputManual'.`,
  '13-pr-start': `$ node_modules/.bin/tsc -p demo13/ts-13-3/practice/start
demo13/ts-13-3/practice/start/model.ts(6,14): error TS2741: Property 'name' is missing in type 'Output<{ email: Schema<string>; }>' but required in type 'UserManual'.`,
  '14-pr-sol': `$ node demo13/ts-13-3/practice/solution/model.ts
a@b.com`,
};
