/**
 * _ma (bài Lab 6) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "labTsconfig": `{
  "extends": "../tsconfig.json",
  "include": ["src", "test", "kiem/phai-dung.ts"]
}`,
  "starter": `// LabFlow — a repository and a Result (a teammate's first version). It compiles. Is it right?
// The teammate reached for \`any\` to "make it work for every type".

export type Result = { ok: boolean; value?: any; error?: string };

export function ok(value: any): Result {
  return { ok: true, value };
}
export function err(error: string): Result {
  return { ok: false, error };
}
export function mapResult(r: Result, f: (value: any) => any): Result {
  return r.ok ? { ok: true, value: f(r.value) } : r;
}
export function unwrapOr(r: Result, fallback: any): any {
  return r.ok ? r.value : fallback;
}

export class Repo {
  private items = new Map<number, any>();

  add(item: any): Result {
    if (this.items.has(item.id)) return err('duplicate id ' + item.id);
    this.items.set(item.id, item);
    return ok(item);
  }
  get(id: number): Result {
    const found = this.items.get(id);
    return found === undefined ? err('not found: ' + id) : ok(found);
  }
  all(): any[] {
    return [...this.items.values()];
  }
  remove(id: number): Result {
    return this.items.delete(id) ? ok(id) : err('not found: ' + id);
  }
  get size(): number {
    return this.items.size;
  }
}

export function pluck(items: any[], key: string): any[] {
  return items.map((item) => item[key]);
}

export function groupBy(items: any[], keyFn: (item: any) => any): Map<any, any[]> {
  const groups = new Map<any, any[]>();
  for (const item of items) {
    const key = keyFn(item);
    const list = groups.get(key);
    if (list === undefined) groups.set(key, [item]);
    else list.push(item);
  }
  return groups;
}`,
  "sai": `// Lab 6 — eight uses that are WRONG. Your generics must make tsc refuse every one of them.
// The grader compiles this file against YOUR src/ and expects one error, with this code, on each marked line.
import { Repo, groupBy, pluck, ok, mapResult, unwrapOr } from '../src/repo.ts';
import type { User } from '../src/model.ts';

declare const users: User[];
declare const repo: Repo<User>;

repo.add({ email: 'x@fpt.edu.vn', name: 'X', role: 'STUDENT', createdAt: '' });   // S1 TS2741 a User needs an id
const r2 = new Repo<{ name: string }>();                                          // S2 TS2741 the constraint needs { id: number }
const g = pluck(users, 'ghost');                                                  // S3 TS2345 'ghost' is not a key of User
const v = repo.get(1).value;                                                      // S4 TS2339 a Result must be narrowed first
const m = mapResult(ok(10), (s: string) => s.length);                             // S5 TS2345 the value is a number, not a string
const u = unwrapOr(ok('open'), 0);                                                // S6 TS2345 the fallback must match the value type
const first = groupBy(users, (x) => x.role).get('STUDENT').length;                // S7 TS2532 Map.get may be undefined
const caps = pluck(users, 'id').map((id) => id.toUpperCase());                     // S8 TS2339 pluck('id') is number[], not string[]
export { r2, g, v, m, u, first, caps };`,
  "dung": `// Lab 6 — CORRECT uses. They must keep compiling with your generics (part B).
import { Repo, groupBy, pluck, ok, err, mapResult, unwrapOr } from '../src/repo.ts';
import type { Result } from '../src/repo.ts';
import type { User, BookingRecord } from '../src/model.ts';

declare const an: User;
declare const rec: BookingRecord;

// The same Repo works for any type with an id — and keeps that exact type.
const users = new Repo<User>();
const bookings = new Repo<BookingRecord>();
const added: Result<User> = users.add(an);
const got = users.get(1);
const name: string = got.ok ? got.value.name : '(none)';       // got.value is a User, narrowed
const list: BookingRecord[] = bookings.all();

// pluck keeps the value type; groupBy keeps the item type.
const emails: string[] = pluck([an], 'email');
const byRole = groupBy([an], (u) => u.role);
const studentIds: number[] = (byRole.get('STUDENT') ?? []).map((u) => u.id);

// ok / err / map / unwrap, all generic.
const r: Result<number> = ok(10);
const doubled: Result<number> = mapResult(r, (n) => n * 2);
const value: number = unwrapOr(r, 0);
const failed: Result<User> = err('boom');

console.log(added.ok, name, list.length, emails, studentIds, doubled, value, failed.ok, bookings.size, rec.id);`,
  "grader": `// Lab 6 grader — "A generic repository".   node scripts/cham-lab-6.mjs [--from <folder with repo.ts>]
// Copies YOUR repo.ts (plus the course's model.ts, booking.ts, schedule.ts, time.ts) into a fresh folder next to the grader-owned tests, then scores 10 points:
//   A  tsc: your repo.ts compiles under the course tsconfig (strict) ........................ 2
//   B  tsc: the correct uses in kiem/phai-dung.ts still compile ............................ 1
//   C  honesty: no any, no "as" cast (as const is fine), no "!", no @ts- ................... 1
//   D  node --test: the behaviour tests in test/repo.test.ts pass ........................ 2
//   E  the 8 wrong uses in kiem/sai.ts are each refused with the right code ............... 8 × 0.5
import { execFileSync } from 'node:child_process';
import { cpSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const i = process.argv.indexOf('--from');
const from = path.resolve(i > 0 ? process.argv[i + 1] : path.join(root, 'lab6/src'));
const tmp = path.join(root, '.cham-lab6');
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp);
const win = process.platform === 'win32';

function run(cmd, args) {
  try {
    return { code: 0, out: execFileSync(cmd, args, { cwd: tmp, encoding: 'utf8', stdio: 'pipe', shell: win }) };
  } catch (e) {
    return { code: e.status ?? 1, out: (e.stdout || '') + (e.stderr || '') };
  }
}
const tsc = (cfg) => run(path.join(root, 'node_modules/.bin/tsc' + (win ? '.cmd' : '')), ['-p', cfg]);
const errorsIn = (out, file) => out.split('\\n').filter((l) => l.startsWith(file + '(') && / error TS\\d+/.test(l));
const codeOnly = (s) => s.replace(/\\/\\*[\\s\\S]*?\\*\\//g, '').replace(/\\/\\/.*$/gm, '').replace(/'(?:[^'\\n\\\\]|\\\\.)*'|"(?:[^"\\n\\\\]|\\\\.)*"/g, "''");

try {
  mkdirSync(path.join(tmp, 'src'));
  cpSync(path.join(from, 'repo.ts'), path.join(tmp, 'src/repo.ts'));
  for (const f of ['model.ts', 'booking.ts', 'schedule.ts', 'time.ts']) cpSync(path.join(root, 'src/rules', f), path.join(tmp, 'src', f));
  cpSync(path.join(root, 'lab6/test'), path.join(tmp, 'test'), { recursive: true });
  cpSync(path.join(root, 'lab6/kiem'), path.join(tmp, 'kiem'), { recursive: true });
  const base = { extends: path.join(root, 'tsconfig.json') };
  writeFileSync(path.join(tmp, 'a.json'), JSON.stringify({ ...base, include: ['src'] }));
  writeFileSync(path.join(tmp, 'b.json'), JSON.stringify({ ...base, include: ['src', 'kiem/phai-dung.ts'] }));
  writeFileSync(path.join(tmp, 'e.json'), JSON.stringify({ ...base, include: ['src', 'kiem/sai.ts'] }));

  let score = 0;
  const line = (ok, pts, max, label, extra = '') => {
    score += pts;
    console.log(\`\${ok ? '✓' : '✗'} \${label} — \${pts}/\${max}\${extra ? '\\n    ' + extra.trim().split('\\n').slice(0, 4).join('\\n    ') : ''}\`);
  };

  const a = tsc('a.json');
  line(a.code === 0, a.code === 0 ? 2 : 0, 2, 'A  your repo.ts compiles (strict)', a.code ? a.out : '');
  const b = tsc('b.json');
  const bErr = errorsIn(b.out, 'kiem/phai-dung.ts');
  line(bErr.length === 0, bErr.length === 0 ? 1 : 0, 1, 'B  correct uses still compile', bErr.join('\\n'));

  const src = codeOnly(readFileSync(path.join(tmp, 'src/repo.ts'), 'utf8'));
  const cheats = [...src.matchAll(/\\bany\\b|@ts-(?:ignore|nocheck|expect-error)|\\bas\\s+(?!const\\b)\\w+|[\\w$]+!(?=[.[;,)\\s])|[)\\]]!(?=[.[;,)\\s])/g)].map((m) => m[0].trim());
  line(cheats.length === 0, cheats.length === 0 ? 1 : 0, 1, 'C  no any / as / ! / @ts-', cheats.length ? 'found: ' + [...new Set(cheats)].join(', ') : '');

  const d = run(process.execPath, ['--test', '--test-reporter=tap', 'test/repo.test.ts']);
  const pass = /# pass (\\d+)/.exec(d.out);
  const total = /# tests (\\d+)/.exec(d.out);
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
  "yeu": `// Attempt A — generic at last, but no constraint (so id needs a cast) and get returns T | undefined.
export type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E };
export function ok<T>(value: T): Result<T, never> { return { ok: true, value }; }
export function err<E>(error: E): Result<never, E> { return { ok: false, error }; }
export function mapResult<T, U, E>(r: Result<T, E>, f: (value: T) => U): Result<U, E> {
  return r.ok ? { ok: true, value: f(r.value) } : r;
}
export function unwrapOr<T, E>(r: Result<T, E>, fallback: T): T {
  return r.ok ? r.value : fallback;
}

// No constraint on T, so item.id is not known — reached for a cast to read it.
export class Repo<T> {
  private items = new Map<number, T>();
  add(item: T): Result<T> {
    const id = (item as { id: number }).id;
    if (this.items.has(id)) return err('duplicate id ' + id);
    this.items.set(id, item);
    return ok(item);
  }
  get(id: number): T | undefined {       // returns the item, not a Result
    return this.items.get(id);
  }
  all(): T[] { return [...this.items.values()]; }
  remove(id: number): boolean { return this.items.delete(id); }
  get size(): number { return this.items.size; }
}

export function pluck<T, K extends keyof T>(items: readonly T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}
export function groupBy<T, K>(items: readonly T[], keyFn: (item: T) => K): Map<K, T[]> {
  const groups = new Map<K, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const list = groups.get(key);
    if (list === undefined) groups.set(key, [item]); else list.push(item);
  }
  return groups;
}`,
  "vua": `// Attempt B — generic and constrained, but pluck's key is a loose string and groupBy keys by string.
export type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E };
export function ok<T>(value: T): Result<T, never> { return { ok: true, value }; }
export function err<E>(error: E): Result<never, E> { return { ok: false, error }; }
export function mapResult<T, U, E>(r: Result<T, E>, f: (value: T) => U): Result<U, E> {
  return r.ok ? { ok: true, value: f(r.value) } : r;
}
export function unwrapOr<T, E>(r: Result<T, E>, fallback: T): T {
  return r.ok ? r.value : fallback;
}

export class Repo<T extends { id: number }> {
  private items = new Map<number, T>();
  add(item: T): Result<T> {
    if (this.items.has(item.id)) return err('duplicate id ' + item.id);
    this.items.set(item.id, item);
    return ok(item);
  }
  get(id: number): Result<T> {
    const found = this.items.get(id);
    return found === undefined ? err('not found: ' + id) : ok(found);
  }
  all(): T[] { return [...this.items.values()]; }
  remove(id: number): Result<number> { return this.items.delete(id) ? ok(id) : err('not found: ' + id); }
  get size(): number { return this.items.size; }
}

// Loose: key is a string, so a typo is not caught and the return type is unknown.
export function pluck<T>(items: readonly T[], key: string): unknown[] {
  return items.map((item) => (item as Record<string, unknown>)[key]);
}
export function groupBy<T>(items: readonly T[], keyFn: (item: T) => string): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const list = groups.get(key);
    if (list === undefined) groups.set(key, [item]); else list.push(item);
  }
  return groups;
}`,
  "ref": `// LabFlow — a generic Result and an in-memory repository (Chapter 6, = Lab 6 reference solution).

// A Result is "a value OR an error", generic over both — the generic form of SlotResult (Chapter 5).
// E defaults to string, so Result<number> is Result<number, string>.
export type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// ok/err build a Result while keeping the exact type. \`never\` on the other side means "this case never happens here".
export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}
export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

// map transforms the value and keeps the error; the result type follows the function's return type U.
export function mapResult<T, U, E>(r: Result<T, E>, f: (value: T) => U): Result<U, E> {
  return r.ok ? { ok: true, value: f(r.value) } : r;
}

// unwrapOr returns the value, or the fallback of the SAME type when the result is an error.
export function unwrapOr<T, E>(r: Result<T, E>, fallback: T): T {
  return r.ok ? r.value : fallback;
}

// An in-memory repository over anything with a numeric id. The constraint T extends { id: number }
// is what lets add/get use item.id without tsc complaining.
export class Repo<T extends { id: number }> {
  private items = new Map<number, T>();

  add(item: T): Result<T> {
    if (this.items.has(item.id)) return err('duplicate id ' + item.id);
    this.items.set(item.id, item);
    return ok(item);
  }

  get(id: number): Result<T> {
    const found = this.items.get(id);
    return found === undefined ? err('not found: ' + id) : ok(found);
  }

  all(): T[] {
    return [...this.items.values()];
  }

  remove(id: number): Result<number> {
    return this.items.delete(id) ? ok(id) : err('not found: ' + id);
  }

  get size(): number {
    return this.items.size;
  }
}

// pluck keeps the value type: for a key K of T, the result is an array of T[K] (indexed access).
export function pluck<T, K extends keyof T>(items: readonly T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}

// groupBy keeps the item type and keys by a function. K is whatever the key function returns.
export function groupBy<T, K>(items: readonly T[], keyFn: (item: T) => K): Map<K, T[]> {
  const groups = new Map<K, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const list = groups.get(key);
    if (list === undefined) groups.set(key, [item]);
    else list.push(item);
  }
  return groups;
}`,
  "test": `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Repo, groupBy, pluck, ok, err, mapResult, unwrapOr } from '../src/repo.ts';
import type { Result } from '../src/repo.ts';
import type { User } from '../src/model.ts';

const an: User = { id: 1, createdAt: '2026-11-03', email: 'an@fpt.edu.vn', name: 'An', role: 'STUDENT' };
const binh: User = { id: 2, createdAt: '2026-11-03', email: 'binh@fpt.edu.vn', name: 'Binh', role: 'LECTURER' };

test('Repo add / get / remove / size', () => {
  const repo = new Repo<User>();
  assert.equal(repo.add(an).ok, true);
  assert.equal(repo.add(an).ok, false); // duplicate
  assert.equal(repo.size, 1);
  const got = repo.get(1);
  assert.equal(got.ok && got.value.name, 'An');
  assert.equal(repo.get(99).ok, false);
  assert.equal(repo.remove(1).ok, true);
  assert.equal(repo.size, 0);
});

test('Repo.all', () => {
  const repo = new Repo<User>();
  repo.add(an);
  repo.add(binh);
  assert.deepEqual(repo.all().map((u) => u.id), [1, 2]);
});

test('ok / err / mapResult / unwrapOr', () => {
  const r: Result<number> = ok(10);
  assert.equal(mapResult(r, (n) => n + 1).ok, true);
  assert.equal(unwrapOr(r, 0), 10);
  assert.equal(unwrapOr(err('x'), -1), -1);
});

test('pluck', () => {
  assert.deepEqual(pluck([an, binh], 'name'), ['An', 'Binh']);
  assert.deepEqual(pluck([an, binh], 'id'), [1, 2]);
});

test('groupBy', () => {
  const byRole = groupBy([an, binh], (u) => u.role);
  assert.deepEqual(byRole.get('STUDENT')?.map((u) => u.id), [1]);
  assert.equal(byRole.get('ADMIN'), undefined);
});`,
};
export const OUT = {
  'l1-npm-ci': `$ npm ci

added 4 packages, and audited 5 packages in 1s

found 0 vulnerabilities`,
  'l2-starter-tsc': `$ npx tsc -p lab6/tsconfig.src.json`,
  'l3-starter': `$ node scripts/cham-lab-6.mjs --from lab6/src
✓ A  your repo.ts compiles (strict) — 2/2
✗ B  correct uses still compile — 0/1
    kiem/phai-dung.ts(10,24): error TS2558: Expected 0 type arguments, but got 1.
    kiem/phai-dung.ts(11,27): error TS2558: Expected 0 type arguments, but got 1.
    kiem/phai-dung.ts(12,14): error TS2315: Type 'Result' is not generic.
    kiem/phai-dung.ts(23,10): error TS2315: Type 'Result' is not generic.
✗ C  no any / as / ! / @ts- — 0/1
    found: any
✓ D  behaviour tests pass (5/5) — 2/2
    ✗ S1 a User needs an id — expected TS2741, got no error
    ✗ S2 the constraint needs { id: number } — expected TS2741, got TS2558
    ✗ S3 'ghost' is not a key of User — expected TS2345, got no error
    ✗ S4 a Result must be narrowed first — expected TS2339, got no error
    ✗ S5 the value is a number, not a string — expected TS2345, got no error
    ✗ S6 the fallback must match the value type — expected TS2345, got no error
    ✓ S7 Map.get may be undefined — expected TS2532, got TS2532
    ✗ S8 pluck('id') is number[], not string[] — expected TS2339, got no error
✗ E  wrong uses refused (1/8) — 0.5/4

Score: 4.5/10 — NOT YET (pass mark 7)`,
  'l4-yeu': `$ node scripts/cham-lab-6.mjs --from lab6/yeu
✓ A  your repo.ts compiles (strict) — 2/2
✗ B  correct uses still compile — 0/1
    kiem/phai-dung.ts(14,22): error TS18048: 'got' is possibly 'undefined'.
    kiem/phai-dung.ts(14,26): error TS2339: Property 'ok' does not exist on type 'User'.
    kiem/phai-dung.ts(14,31): error TS18048: 'got' is possibly 'undefined'.
    kiem/phai-dung.ts(14,35): error TS2339: Property 'value' does not exist on type 'User'.
✓ C  no any / as / ! / @ts- — 1/1
✗ D  behaviour tests pass (4/5) — 0/2
    failed: Repo add / get / remove / size
    ✓ S1 a User needs an id — expected TS2741, got TS2741
    ✗ S2 the constraint needs { id: number } — expected TS2741, got no error
    ✓ S3 'ghost' is not a key of User — expected TS2345, got TS2345
    ✓ S4 a Result must be narrowed first — expected TS2339, got TS2532, TS2339
    ✓ S5 the value is a number, not a string — expected TS2345, got TS2345
    ✓ S6 the fallback must match the value type — expected TS2345, got TS2345
    ✓ S7 Map.get may be undefined — expected TS2532, got TS2532
    ✓ S8 pluck('id') is number[], not string[] — expected TS2339, got TS2339
✗ E  wrong uses refused (7/8) — 3.5/4

Score: 6.5/10 — NOT YET (pass mark 7)`,
  'l5-vua': `$ node scripts/cham-lab-6.mjs --from lab6/vua
✓ A  your repo.ts compiles (strict) — 2/2
✗ B  correct uses still compile — 0/1
    kiem/phai-dung.ts(18,7): error TS2322: Type 'unknown[]' is not assignable to type 'string[]'.
✗ C  no any / as / ! / @ts- — 0/1
    found: as Record
✓ D  behaviour tests pass (5/5) — 2/2
    ✓ S1 a User needs an id — expected TS2741, got TS2741
    ✓ S2 the constraint needs { id: number } — expected TS2741, got TS2741
    ✗ S3 'ghost' is not a key of User — expected TS2345, got no error
    ✓ S4 a Result must be narrowed first — expected TS2339, got TS2339
    ✓ S5 the value is a number, not a string — expected TS2345, got TS2345
    ✓ S6 the fallback must match the value type — expected TS2345, got TS2345
    ✓ S7 Map.get may be undefined — expected TS2532, got TS2532
    ✗ S8 pluck('id') is number[], not string[] — expected TS2339, got TS18046
✗ E  wrong uses refused (6/8) — 3/4

Score: 7/10 — PASS (pass mark 7)`,
  'l6-ref': `$ node scripts/cham-lab-6.mjs --from src/rules
✓ A  your repo.ts compiles (strict) — 2/2
✓ B  correct uses still compile — 1/1
✓ C  no any / as / ! / @ts- — 1/1
✓ D  behaviour tests pass (5/5) — 2/2
    ✓ S1 a User needs an id — expected TS2741, got TS2741
    ✓ S2 the constraint needs { id: number } — expected TS2741, got TS2741
    ✓ S3 'ghost' is not a key of User — expected TS2345, got TS2345
    ✓ S4 a Result must be narrowed first — expected TS2339, got TS2339
    ✓ S5 the value is a number, not a string — expected TS2345, got TS2345
    ✓ S6 the fallback must match the value type — expected TS2345, got TS2345
    ✓ S7 Map.get may be undefined — expected TS2532, got TS2532
    ✓ S8 pluck('id') is number[], not string[] — expected TS2339, got TS2339
✓ E  wrong uses refused (8/8) — 4/4

Score: 10/10 — PASS (pass mark 7)`,
};
