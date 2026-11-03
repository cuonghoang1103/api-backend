/**
 * _ma (bài 13.1) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "zodModel": `// A tiny typed model of Zod's core (the shapes zod gives you).
export type ZodIssue = { path: string[]; message: string };
export type ZodError = { issues: ZodIssue[] };
export type SafeResult<T> = { success: true; data: T } | { success: false; error: ZodError };
export interface Schema<T> {
  parse(input: unknown): T;
  safeParse(input: unknown): SafeResult<T>;
}
export type Infer<S> = S extends Schema<infer T> ? T : never;

function make<T>(check: (input: unknown) => T): Schema<T> {
  return {
    parse(input) { return check(input); },
    safeParse(input) {
      try { return { success: true, data: check(input) }; }
      catch (e) { return { success: false, error: { issues: [{ path: [], message: (e as Error).message }] } }; }
    },
  };
}
export function string(): Schema<string> {
  return make((i) => { if (typeof i !== 'string') throw new Error('expected string'); return i; });
}
export function number(): Schema<number> {
  return make((i) => { if (typeof i !== 'number') throw new Error('expected number'); return i; });
}
type Shape = Record<string, Schema<unknown>>;
type Output<T extends Shape> = { [K in keyof T]: Infer<T[K]> };
export function object<T extends Shape>(shape: T): Schema<Output<T>> {
  return make((i) => {
    if (typeof i !== 'object' || i === null) throw new Error('expected object');
    const row = i as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [key, schema] of Object.entries(shape)) out[key] = schema.parse(row[key]);
    return out as Output<T>;
  });
}`,
  "parse": `import * as z from './zod.ts';
// A schema validates AND infers the type — one source of truth.
const BookingInput = z.object({ lab: z.string(), seats: z.number() });
type BookingInput = z.Infer<typeof BookingInput>;
// unknown data from outside, validated at the boundary:
const raw: unknown = { lab: 'BE-201', seats: 40 };
const booking: BookingInput = BookingInput.parse(raw);
console.log(booking.lab, booking.seats);`,
  "wrongfield": `import * as z from './zod.ts';
const BookingInput = z.object({ lab: z.string(), seats: z.number() });
type BookingInput = z.Infer<typeof BookingInput>;
const booking: BookingInput = BookingInput.parse({ lab: 'BE-201', seats: 40 });
// 'purpose' is not in the schema — the inferred type does not have it.
export const p = booking.purpose;`,
  "badinput": `import * as z from './zod.ts';
const BookingInput = z.object({ lab: z.string(), seats: z.number() });
// seats is a string at run time — parse throws because the data is invalid.
try {
  BookingInput.parse({ lab: 'BE-201', seats: 'forty' });
} catch (e) {
  console.log('rejected:', (e as Error).message);
}`,
  "prStart": `import * as z from './zod.ts';
const LabInput = z.object({ code: z.string(), seats: z.number() });
type LabInput = z.Infer<typeof LabInput>;
const lab: LabInput = LabInput.parse({ code: 'BE-201', seats: 40 });
// The schema has code, not name.
export const n = lab.name;`,
  "prSol": `import * as z from './zod.ts';
const LabInput = z.object({ code: z.string(), seats: z.number() });
type LabInput = z.Infer<typeof LabInput>;
const lab: LabInput = LabInput.parse({ code: 'BE-201', seats: 40 });
console.log(lab.code);`,
};
export const OUT = {
  '11-parse': `$ node demo13/ts-13-1/parse/input.ts
BE-201 40`,
  '12-wrongfield': `$ node_modules/.bin/tsc -p demo13/ts-13-1/wrongfield
demo13/ts-13-1/wrongfield/input.ts(6,26): error TS2339: Property 'purpose' does not exist on type 'Output<{ lab: Schema<string>; seats: Schema<number>; }>'.`,
  '13-badinput': `$ node demo13/ts-13-1/badinput/input.ts
rejected: expected number`,
  '14-pr-start': `$ node_modules/.bin/tsc -p demo13/ts-13-1/practice/start
demo13/ts-13-1/practice/start/input.ts(6,22): error TS2339: Property 'name' does not exist on type 'Output<{ code: Schema<string>; seats: Schema<number>; }>'.`,
  '15-pr-sol': `$ node demo13/ts-13-1/practice/solution/input.ts
BE-201`,
};
