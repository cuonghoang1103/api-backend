/**
 * _ma (bài Lab 8) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "labTsconfig": `{ "extends": "../tsconfig.json", "include": ["src", "test", "kiem/phai-dung.ts"] }`,
  "starter": `// A teammate wrote the DTO layer by hand, with any where the types got hard. It compiles and runs,
// but it refuses nothing — a create body with an id, a leaked password, a typo'd patch all slip through.
export type MyPartial<T> = any;
export type MyPick<T, K> = any;
export type MyOmit<T, K> = any;

export type Booking = {
  id: number; lab: string; seats: number; purpose: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'; createdAt: string;
};
export type User = { id: number; name: string; email: string; passwordHash: string };

export type CreateBooking = any;
export type UpdateBooking = any;
export type PublicUser = any;

export function createBooking(input: CreateBooking): Booking {
  return { ...input, id: 1, status: 'PENDING', createdAt: '2027-03-03T06:00:00Z' };
}
export function applyUpdate(b: Booking, patch: UpdateBooking): Booking {
  return { ...b, ...patch };
}
export function toPublic(u: User): PublicUser {
  return { id: u.id, name: u.name, email: u.email };
}`,
  "sai": `import type { CreateBooking, UpdateBooking, PublicUser, MyPick, MyOmit, User, Booking } from '../src/dto.ts';
import { toPublic } from '../src/dto.ts';
export const s1: CreateBooking = { lab: 'BE-201', seats: 40, purpose: 'Lab', id: 9 }; // S1 TS2353 CreateBooking must not carry id
export const s2 = toPublic({ id: 1, name: 'An', email: 'a@x.vn', passwordHash: 'x' }).passwordHash; // S2 TS2339 PublicUser has no passwordHash
export const s3: CreateBooking = { lab: 'BE-201', purpose: 'Lab' }; // S3 TS2741 missing seats
export type S4 = MyPick<User, 'emial'>; // S4 TS2344 'emial' is not a key of User
export const s5: UpdateBooking = { createdAt: 'now' }; // S5 TS2353 UpdateBooking cannot set server-owned createdAt
export const s6: UpdateBooking = { seets: 24 }; // S6 TS2561 typo'd field in a patch
export const s7: User = toPublic({ id: 1, name: 'An', email: 'a@x.vn', passwordHash: 'x' }); // S7 TS2741 PublicUser is missing passwordHash
export type S8 = MyOmit<Booking, 'xyz'>; // S8 TS2344 'xyz' is not a key of Booking`,
  "dung": `import type { CreateBooking, UpdateBooking, PublicUser } from '../src/dto.ts';
const c: CreateBooking = { lab: 'BE-201', seats: 40, purpose: 'Lab' }; // no id/status/createdAt
const u: UpdateBooking = { seats: 24 };                                 // any subset of editable fields
const p: PublicUser = { id: 1, name: 'An', email: 'a@x.vn' };           // no passwordHash
export { c, u, p };`,
  "grader": `// Lab 8 grader — "Utility types & the API DTO layer".   node scripts/cham-lab-7.mjs [--from <folder with repo.ts>]
// Copies YOUR repo.ts (plus the course's model.ts, booking.ts, schedule.ts, time.ts) into a fresh folder next to the grader-owned tests, then scores 10 points:
//   A  tsc: your dto.ts compiles under the course tsconfig (strict) ........................ 2
//   B  tsc: the correct uses in kiem/phai-dung.ts still compile ............................ 1
//   C  honesty: no any, no "as" cast (as const is fine), no "!", no @ts- ................... 1
//   D  node --test: the behaviour tests in test/dto.test.ts pass ........................ 2
//   E  the 8 wrong uses in kiem/sai.ts are each refused with the right code ............... 8 × 0.5
import { execFileSync } from 'node:child_process';
import { cpSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const i = process.argv.indexOf('--from');
const from = path.resolve(i > 0 ? process.argv[i + 1] : path.join(root, 'lab8/src'));
const tmp = path.join(root, '.cham-lab8');
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
  cpSync(path.join(from, 'dto.ts'), path.join(tmp, 'src/dto.ts'));
  for (const f of ['model.ts', 'booking.ts', 'schedule.ts', 'time.ts']) cpSync(path.join(root, 'src/rules', f), path.join(tmp, 'src', f));
  cpSync(path.join(root, 'lab8/test'), path.join(tmp, 'test'), { recursive: true });
  cpSync(path.join(root, 'lab8/kiem'), path.join(tmp, 'kiem'), { recursive: true });
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
  line(a.code === 0, a.code === 0 ? 2 : 0, 2, 'A  your dto.ts compiles (strict)', a.code ? a.out : '');
  const b = tsc('b.json');
  const bErr = errorsIn(b.out, 'kiem/phai-dung.ts');
  line(bErr.length === 0, bErr.length === 0 ? 1 : 0, 1, 'B  correct uses still compile', bErr.join('\\n'));

  const src = codeOnly(readFileSync(path.join(tmp, 'src/dto.ts'), 'utf8'));
  const cheats = [...src.matchAll(/\\bany\\b|@ts-(?:ignore|nocheck|expect-error)|\\bas\\s+(?!const\\b)\\w+|[\\w$]+!(?=[.[;,)\\s])|[)\\]]!(?=[.[;,)\\s])/g)].map((m) => m[0].trim());
  line(cheats.length === 0, cheats.length === 0 ? 1 : 0, 1, 'C  no any / as / ! / @ts-', cheats.length ? 'found: ' + [...new Set(cheats)].join(', ') : '');

  const d = run(process.execPath, ['--test', '--test-reporter=tap', 'test/dto.test.ts']);
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
  "yeu": `export type MyPartial<T> = { [K in keyof T]?: T[K] };
// K is not constrained to keyof T, so MyPick accepts a key that does not exist.
export type MyPick<T, K extends PropertyKey> = { [P in K]: P extends keyof T ? T[P] : never };
export type MyOmit<T, K extends keyof T> = MyPick<T, Exclude<keyof T, K>>;

export type Booking = {
  id: number; lab: string; seats: number; purpose: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'; createdAt: string;
};
export type User = { id: number; name: string; email: string; passwordHash: string };

// The create and update bodies were both made "a partial of the whole Booking" — too loose:
// a create may omit seats or carry id, an update may set createdAt.
export type CreateBooking = MyPartial<Booking>;
export type UpdateBooking = MyPartial<Booking>;
export type PublicUser = MyOmit<User, 'passwordHash'>;

export function createBooking(input: CreateBooking): Booking {
  return { ...input, id: 1, lab: input.lab ?? '', seats: input.seats ?? 0, purpose: input.purpose ?? '', status: 'PENDING', createdAt: '2027-03-03T06:00:00Z' };
}
export function applyUpdate(b: Booking, patch: UpdateBooking): Booking { return { ...b, ...patch }; }
export function toPublic(u: User): PublicUser { return { id: u.id, name: u.name, email: u.email }; }`,
  "vua": `export type MyPartial<T> = { [K in keyof T]?: T[K] };
// K is not constrained to keyof T, so MyPick accepts a key that does not exist.
export type MyPick<T, K extends PropertyKey> = { [P in K]: P extends keyof T ? T[P] : never };
export type MyOmit<T, K extends keyof T> = MyPick<T, Exclude<keyof T, K>>;

export type Booking = {
  id: number; lab: string; seats: number; purpose: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'; createdAt: string;
};
export type User = { id: number; name: string; email: string; passwordHash: string };

export type CreateBooking = MyOmit<Booking, 'id' | 'status' | 'createdAt'>;
export type UpdateBooking = MyPartial<MyOmit<Booking, 'id' | 'createdAt'>>;
export type PublicUser = MyOmit<User, 'passwordHash'>;

export function createBooking(input: CreateBooking): Booking {
  return { ...input, id: 1, status: 'PENDING', createdAt: '2027-03-03T06:00:00Z' };
}
export function applyUpdate(b: Booking, patch: UpdateBooking): Booking { return { ...b, ...patch }; }
export function toPublic(u: User): PublicUser { return { id: u.id, name: u.name, email: u.email }; }`,
  "ref": `// Lab 8 — rebuild the three everyday utility types from scratch, then use them to build the API DTO layer.
export type MyPartial<T> = { [K in keyof T]?: T[K] };
export type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
export type MyOmit<T, K extends keyof T> = MyPick<T, Exclude<keyof T, K>>;

export type Booking = {
  id: number; lab: string; seats: number; purpose: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'; createdAt: string;
};
export type User = { id: number; name: string; email: string; passwordHash: string };

// DTOs derived from the models — they track the models and cannot drift.
export type CreateBooking = MyOmit<Booking, 'id' | 'status' | 'createdAt'>;
export type UpdateBooking = MyPartial<MyOmit<Booking, 'id' | 'createdAt'>>;
export type PublicUser = MyOmit<User, 'passwordHash'>;

export function createBooking(input: CreateBooking): Booking {
  return { ...input, id: 1, status: 'PENDING', createdAt: '2027-03-03T06:00:00Z' };
}
export function applyUpdate(b: Booking, patch: UpdateBooking): Booking {
  return { ...b, ...patch };
}
export function toPublic(u: User): PublicUser {
  return { id: u.id, name: u.name, email: u.email };
}`,
  "test": `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createBooking, applyUpdate, toPublic } from '../src/dto.ts';
test('createBooking', () => {
  const b = createBooking({ lab: 'BE-201', seats: 40, purpose: 'Lab' });
  assert.equal(b.id, 1); assert.equal(b.status, 'PENDING');
});
test('toPublic strips the hash', () => {
  const p = toPublic({ id: 1, name: 'An', email: 'a@x.vn', passwordHash: 'secret' });
  assert.ok(!('passwordHash' in p)); assert.equal(p.name, 'An');
});
test('applyUpdate merges', () => {
  const b = createBooking({ lab: 'BE-201', seats: 40, purpose: 'Lab' });
  assert.equal(applyUpdate(b, { seats: 24 }).seats, 24);
});`,
};
export const OUT = {
  'l2-starter-tsc': `$ node_modules/.bin/tsc -p lab8/tsconfig.src.json`,
  'l3-starter': `$ node scripts/cham-lab-8.mjs --from lab8/src
✓ A  your dto.ts compiles (strict) — 2/2
✓ B  correct uses still compile — 1/1
✗ C  no any / as / ! / @ts- — 0/1
    found: any
✓ D  behaviour tests pass (3/3) — 2/2
    ✗ S1 CreateBooking must not carry id — expected TS2353, got no error
    ✗ S2 PublicUser has no passwordHash — expected TS2339, got no error
    ✗ S3 missing seats — expected TS2741, got no error
    ✗ S4 'emial' is not a key of User — expected TS2344, got no error
    ✗ S5 UpdateBooking cannot set server-owned createdAt — expected TS2353, got no error
    ✗ S6 typo'd field in a patch — expected TS2561, got no error
    ✗ S7 PublicUser is missing passwordHash — expected TS2741, got no error
    ✗ S8 'xyz' is not a key of Booking — expected TS2344, got no error
✗ E  wrong uses refused (0/8) — 0/4

Score: 5/10 — NOT YET (pass mark 7)`,
  'l4-yeu': `$ node scripts/cham-lab-8.mjs --from lab8/yeu
✓ A  your dto.ts compiles (strict) — 2/2
✓ B  correct uses still compile — 1/1
✓ C  no any / as / ! / @ts- — 1/1
✓ D  behaviour tests pass (3/3) — 2/2
    ✗ S1 CreateBooking must not carry id — expected TS2353, got no error
    ✓ S2 PublicUser has no passwordHash — expected TS2339, got TS2339
    ✗ S3 missing seats — expected TS2741, got no error
    ✗ S4 'emial' is not a key of User — expected TS2344, got no error
    ✗ S5 UpdateBooking cannot set server-owned createdAt — expected TS2353, got no error
    ✓ S6 typo'd field in a patch — expected TS2561, got TS2561
    ✓ S7 PublicUser is missing passwordHash — expected TS2741, got TS2741
    ✓ S8 'xyz' is not a key of Booking — expected TS2344, got TS2344
✗ E  wrong uses refused (4/8) — 2/4

Score: 8/10 — PASS (pass mark 7)`,
  'l5-vua': `$ node scripts/cham-lab-8.mjs --from lab8/vua
✓ A  your dto.ts compiles (strict) — 2/2
✓ B  correct uses still compile — 1/1
✓ C  no any / as / ! / @ts- — 1/1
✓ D  behaviour tests pass (3/3) — 2/2
    ✓ S1 CreateBooking must not carry id — expected TS2353, got TS2353
    ✓ S2 PublicUser has no passwordHash — expected TS2339, got TS2339
    ✓ S3 missing seats — expected TS2741, got TS2741
    ✗ S4 'emial' is not a key of User — expected TS2344, got no error
    ✓ S5 UpdateBooking cannot set server-owned createdAt — expected TS2353, got TS2353
    ✓ S6 typo'd field in a patch — expected TS2561, got TS2561
    ✓ S7 PublicUser is missing passwordHash — expected TS2741, got TS2741
    ✓ S8 'xyz' is not a key of Booking — expected TS2344, got TS2344
✗ E  wrong uses refused (7/8) — 3.5/4

Score: 9.5/10 — PASS (pass mark 7)`,
  'l6-ref': `$ node scripts/cham-lab-8.mjs --from src/rules
✓ A  your dto.ts compiles (strict) — 2/2
✓ B  correct uses still compile — 1/1
✓ C  no any / as / ! / @ts- — 1/1
✓ D  behaviour tests pass (3/3) — 2/2
    ✓ S1 CreateBooking must not carry id — expected TS2353, got TS2353
    ✓ S2 PublicUser has no passwordHash — expected TS2339, got TS2339
    ✓ S3 missing seats — expected TS2741, got TS2741
    ✓ S4 'emial' is not a key of User — expected TS2344, got TS2344
    ✓ S5 UpdateBooking cannot set server-owned createdAt — expected TS2353, got TS2353
    ✓ S6 typo'd field in a patch — expected TS2561, got TS2561
    ✓ S7 PublicUser is missing passwordHash — expected TS2741, got TS2741
    ✓ S8 'xyz' is not a key of Booking — expected TS2344, got TS2344
✓ E  wrong uses refused (8/8) — 4/4

Score: 10/10 — PASS (pass mark 7)`,
};
