/**
 * _ma (bài Lab 13) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
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
  "starter": `import { object, string, number } from './zod.ts';

// TODO: build a real schema and derive the type from it.
export type BookingInput = any;
export type Created = { success: true; data: BookingInput } | { success: false; error: string };

export function createBooking(raw: any): Created {
  // No validation — the raw input is trusted as-is.
  return { success: true, data: raw };
}`,
  "ref": `import { object, string, number, type Infer } from './zod.ts';

export const BookingInput = object({ lab: string(), seats: number() });
export type BookingInput = Infer<typeof BookingInput>;
export type Created = { success: true; data: BookingInput } | { success: false; error: string };

export function createBooking(raw: unknown): Created {
  const result = BookingInput.safeParse(raw);
  if (!result.success) return { success: false, error: result.error.issues[0]?.message ?? 'invalid' };
  return { success: true, data: result.data };
}`,
  "yeu": `import { object, string, number, type Infer } from './zod.ts';

export const BookingInput = object({ lab: string(), seats: number() });
export type BookingInput = Infer<typeof BookingInput>;
export type Created = { success: true; data: BookingInput } | { success: false; error: string };

export function createBooking(raw: unknown): Created {
  // Casts instead of validating — invalid data passes straight through.
  return { success: true, data: raw as BookingInput };
}`,
  "vua": `import { object, string, number, type Infer } from './zod.ts';

export const BookingInput = object({ lab: string(), seats: number() });
export type BookingInput = Infer<typeof BookingInput>;
export type Created = { success: true; data: BookingInput } | { success: false; error: string };

export function createBooking(raw: unknown): Created {
  const result = BookingInput.safeParse(raw);
  if (!result.success) return { success: false, error: (result.error.issues[0]?.message ?? 'invalid') as string };
  return { success: true, data: result.data };
}`,
  "sai": `import type { BookingInput, Created } from '../schema.ts';
import { createBooking } from '../schema.ts';

export const s1: BookingInput = { lab: 'BE-201' }; // S1 TS2741 the inferred type requires seats
export const s2: BookingInput = { lab: 'BE-201', seats: 40, purpose: 'x' }; // S2 TS2353 the schema has no purpose
export const s3: BookingInput = { lab: 'BE-201', seats: 'forty' }; // S3 TS2322 seats is a number
export const s4: BookingInput = { lab: 404, seats: 40 }; // S4 TS2322 lab is a string
export const s5: string = createBooking({}).data.lab; // S5 TS2339 narrow on success before reading data
export const s6: string = createBooking({}).error; // S6 TS2339 error is only on the failure branch
export const s7: Created = { success: true }; // S7 TS2322 a success carries data (whole-union mismatch)
export const s8: Created = { success: false, error: 404 }; // S8 TS2322 the error is a string`,
  "dung": `import type { BookingInput, Created } from '../schema.ts';
import { createBooking } from '../schema.ts';

const booking: BookingInput = { lab: 'BE-201', seats: 40 };
const ok: Created = { success: true, data: booking };

const result = createBooking({ lab: 'BE-201', seats: 40 });
const lab: string = result.success ? result.data.lab : 'none';

export { booking, ok, lab };`,
  "grader": `// Lab 13 grader — "A typed React component + hook (Zod schema)".
// Copies YOUR schema.ts next to the grader's zod.ts, kiem/ and test/, then scores 10 points:
//   A  tsc: your schema.ts compiles under the course tsconfig (strict) ...................... 2
//   B  tsc: the correct uses in kiem/phai-dung.ts compile ................................ 1
//   C  honesty: no any, no "as" cast (as const is fine), no "!", no @ts- ................. 1
//   D  node --test: the hook collects typed values and submits a CreateBooking ........... 2
//   E  the 8 wrong uses in kiem/sai.ts are each refused with the right code .............. 8 × 0.5
import { execFileSync } from 'node:child_process';
import { cpSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const i = process.argv.indexOf('--from');
const from = path.resolve(i > 0 ? process.argv[i + 1] : path.join(root, 'lab13/src'));
const tmp = path.join(root, '.cham-lab13');
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp);
const win = process.platform === 'win32';

function run(cmd, args) {
  try { return { code: 0, out: execFileSync(cmd, args, { cwd: tmp, encoding: 'utf8', stdio: 'pipe', shell: win }) }; }
  catch (e) { return { code: e.status ?? 1, out: (e.stdout || '') + (e.stderr || '') }; }
}
const tsc = (cfg) => run(path.join(root, 'node_modules/.bin/tsc' + (win ? '.cmd' : '')), ['-p', cfg]);
const errorsIn = (out, file) => out.split('\\n').filter((l) => l.startsWith(file + '(') && / error TS\\d+/.test(l));
const codeOnly = (s) => s.replace(/\\/\\*[\\s\\S]*?\\*\\//g, '').replace(/\\/\\/.*$/gm, '').replace(/'(?:[^'\\n\\\\]|\\\\.)*'|"(?:[^"\\n\\\\]|\\\\.)*"/g, "''");

try {
  cpSync(path.join(from, 'schema.ts'), path.join(tmp, 'schema.ts'));
  cpSync(path.join(root, 'lab13/zod.ts'), path.join(tmp, 'zod.ts'));
  cpSync(path.join(root, 'lab13/kiem'), path.join(tmp, 'kiem'), { recursive: true });
  cpSync(path.join(root, 'lab13/test'), path.join(tmp, 'test'), { recursive: true });
  const base = { extends: path.join(root, 'tsconfig.json') };
  writeFileSync(path.join(tmp, 'a.json'), JSON.stringify({ ...base, include: ['schema.ts', 'zod.ts'] }));
  writeFileSync(path.join(tmp, 'b.json'), JSON.stringify({ ...base, include: ['schema.ts', 'zod.ts', 'kiem/phai-dung.ts'] }));
  writeFileSync(path.join(tmp, 'e.json'), JSON.stringify({ ...base, include: ['schema.ts', 'zod.ts', 'kiem/sai.ts'] }));

  let score = 0;
  const line = (ok, pts, max, label, extra = '') => {
    score += pts;
    console.log(\`\${ok ? '✓' : '✗'} \${label} — \${pts}/\${max}\${extra ? '\\n    ' + extra.trim().split('\\n').slice(0, 4).join('\\n    ') : ''}\`);
  };

  const a = tsc('a.json');
  const aErr = a.out.split('\\n').filter((l) => / error TS\\d+/.test(l) && !l.startsWith('kiem/'));
  line(aErr.length === 0, aErr.length === 0 ? 2 : 0, 2, 'A  your schema.ts compiles (strict)', aErr.join('\\n'));
  const b = tsc('b.json');
  const bErr = errorsIn(b.out, 'kiem/phai-dung.ts');
  line(bErr.length === 0, bErr.length === 0 ? 1 : 0, 1, 'B  correct uses compile', bErr.join('\\n'));

  const src = codeOnly(readFileSync(path.join(tmp, 'schema.ts'), 'utf8'));
  const cheats = [...src.matchAll(/\\bany\\b|@ts-(?:ignore|nocheck|expect-error)|\\bas\\s+(?!const\\b)\\w+|[\\w$)\\]]!(?=[.[;,)\\s])/g)].map((m) => m[0].trim());
  line(cheats.length === 0, cheats.length === 0 ? 1 : 0, 1, 'C  no any / as / ! / @ts-', cheats.length ? 'found: ' + [...new Set(cheats)].join(', ') : '');

  const d = run(process.execPath, ['--test', '--test-reporter=tap', 'test/schema.test.ts']);
  const pass = /# pass (\\d+)/.exec(d.out); const total = /# tests (\\d+)/.exec(d.out);
  const fails = d.out.split('\\n').filter((l) => /^not ok \\d+ - /.test(l)).map((l) => l.replace(/^not ok \\d+ - /, 'failed: ')).slice(0, 4).join('\\n');
  line(d.code === 0, d.code === 0 ? 2 : 0, 2, \`D  behaviour tests pass (\${pass ? pass[1] : 0}/\${total ? total[1] : '?'})\`, d.code ? fails : '');

  const e = tsc('e.json');
  const sai = readFileSync(path.join(tmp, 'kiem/sai.ts'), 'utf8').split('\\n');
  const wanted = sai.map((t, n) => [n + 1, /\\/\\/ (S\\d) (TS\\d+) (.*)$/.exec(t)]).filter(([, m]) => m);
  let refused = 0;
  for (const [n, [, id, code, why]] of wanted) {
    const got = errorsIn(e.out, 'kiem/sai.ts').filter((l) => l.startsWith(\`kiem/sai.ts(\${n},\`)).map((l) => /error (TS\\d+)/.exec(l)[1]);
    const ok = got.includes(code);
    if (ok) refused++;
    console.log(\`    \${ok ? '✓' : '✗'} \${id} \${why} — expected \${code}, got \${got.length ? got.join(', ') : 'no error'}\`);
  }
  line(refused === wanted.length, refused * 0.5, 4, \`E  wrong uses refused (\${refused}/\${wanted.length})\`);

  console.log(\`\\nScore: \${score}/10 — \${score >= 7 ? 'PASS' : 'NOT YET'} (pass mark 7)\`);
  process.exitCode = score >= 7 ? 0 : 1;
} finally {
  rmSync(tmp, { recursive: true, force: true });
}`,
};
export const OUT = {
  'l3-starter': `$ node scripts/cham-lab-13.mjs --from lab13/src
✓ A  your schema.ts compiles (strict) — 2/2
✓ B  correct uses compile — 1/1
✗ C  no any / as / ! / @ts- — 0/1
    found: any
✗ D  behaviour tests pass (1/2) — 0/2
    failed: an invalid body is rejected, not trusted
    ✗ S1 the inferred type requires seats — expected TS2741, got no error
    ✗ S2 the schema has no purpose — expected TS2353, got no error
    ✗ S3 seats is a number — expected TS2322, got no error
    ✗ S4 lab is a string — expected TS2322, got no error
    ✓ S5 narrow on success before reading data — expected TS2339, got TS2339
    ✓ S6 error is only on the failure branch — expected TS2339, got TS2339
    ✓ S7 a success carries data (whole-union mismatch) — expected TS2322, got TS2322
    ✓ S8 the error is a string — expected TS2322, got TS2322
✗ E  wrong uses refused (4/8) — 2/4

Score: 5/10 — NOT YET (pass mark 7)`,
  'l4-yeu': `$ node scripts/cham-lab-13.mjs --from lab13/yeu
✓ A  your schema.ts compiles (strict) — 2/2
✓ B  correct uses compile — 1/1
✗ C  no any / as / ! / @ts- — 0/1
    found: as BookingInput
✗ D  behaviour tests pass (1/2) — 0/2
    failed: an invalid body is rejected, not trusted
    ✓ S1 the inferred type requires seats — expected TS2741, got TS2741
    ✓ S2 the schema has no purpose — expected TS2353, got TS2353
    ✓ S3 seats is a number — expected TS2322, got TS2322
    ✓ S4 lab is a string — expected TS2322, got TS2322
    ✓ S5 narrow on success before reading data — expected TS2339, got TS2339
    ✓ S6 error is only on the failure branch — expected TS2339, got TS2339
    ✓ S7 a success carries data (whole-union mismatch) — expected TS2322, got TS2322
    ✓ S8 the error is a string — expected TS2322, got TS2322
✓ E  wrong uses refused (8/8) — 4/4

Score: 7/10 — PASS (pass mark 7)`,
  'l5-vua': `$ node scripts/cham-lab-13.mjs --from lab13/vua
✓ A  your schema.ts compiles (strict) — 2/2
✓ B  correct uses compile — 1/1
✗ C  no any / as / ! / @ts- — 0/1
    found: as string
✓ D  behaviour tests pass (2/2) — 2/2
    ✓ S1 the inferred type requires seats — expected TS2741, got TS2741
    ✓ S2 the schema has no purpose — expected TS2353, got TS2353
    ✓ S3 seats is a number — expected TS2322, got TS2322
    ✓ S4 lab is a string — expected TS2322, got TS2322
    ✓ S5 narrow on success before reading data — expected TS2339, got TS2339
    ✓ S6 error is only on the failure branch — expected TS2339, got TS2339
    ✓ S7 a success carries data (whole-union mismatch) — expected TS2322, got TS2322
    ✓ S8 the error is a string — expected TS2322, got TS2322
✓ E  wrong uses refused (8/8) — 4/4

Score: 9/10 — PASS (pass mark 7)`,
  'l6-ref': `$ node scripts/cham-lab-13.mjs --from lab13/giai
✓ A  your schema.ts compiles (strict) — 2/2
✓ B  correct uses compile — 1/1
✓ C  no any / as / ! / @ts- — 1/1
✓ D  behaviour tests pass (2/2) — 2/2
    ✓ S1 the inferred type requires seats — expected TS2741, got TS2741
    ✓ S2 the schema has no purpose — expected TS2353, got TS2353
    ✓ S3 seats is a number — expected TS2322, got TS2322
    ✓ S4 lab is a string — expected TS2322, got TS2322
    ✓ S5 narrow on success before reading data — expected TS2339, got TS2339
    ✓ S6 error is only on the failure branch — expected TS2339, got TS2339
    ✓ S7 a success carries data (whole-union mismatch) — expected TS2322, got TS2322
    ✓ S8 the error is a string — expected TS2322, got TS2322
✓ E  wrong uses refused (8/8) — 4/4

Score: 10/10 — PASS (pass mark 7)`,
};
