/**
 * _ma (bài Lab 11) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "httpModel": `export type Req<P = {}, Q = {}, B = unknown> = { params: P; query: Q; body: B };
export type Res<T> = { status(code: number): Res<T>; json(body: T): void };
export type Handler<P = {}, Q = {}, B = unknown, T = unknown> = (req: Req<P, Q, B>, res: Res<T>) => void;`,
  "apiEnv": `export type ApiOk<T> = { ok: true; data: T };
export type ApiErr = { ok: false; error: { code: string; message: string } };
export type ApiResult<T> = ApiOk<T> | ApiErr;`,
  "starter": `import type { Handler } from './http.ts';
import type { ApiResult } from './api.ts';

// A teammate stubbed the types with any — it compiles and does not validate.
export type CreateBooking = any;
export type Booking = any;

export const createBooking: Handler<{}, {}, CreateBooking, ApiResult<Booking>> = (req, res) => {
  res.status(201).json({ ok: true, data: req.body });
};`,
  "ref": `import type { Handler } from './http.ts';
import type { ApiResult } from './api.ts';

export type CreateBooking = { lab: string; seats: number; purpose: string };
export type Booking = { id: string; lab: string; seats: number; purpose: string; status: 'PENDING' };

export const createBooking: Handler<{}, {}, CreateBooking, ApiResult<Booking>> = (req, res) => {
  const { lab, seats, purpose } = req.body;
  if (seats <= 0) {
    res.status(400).json({ ok: false, error: { code: 'INVALID_SEATS', message: 'seats must be positive' } });
    return;
  }
  res.status(201).json({ ok: true, data: { id: 'bk_1', lab, seats, purpose, status: 'PENDING' } });
};`,
  "yeu": `import type { Handler } from './http.ts';
import type { ApiResult } from './api.ts';

export type CreateBooking = { lab: string; seats: number; purpose: string };
export type Booking = any;

export const createBooking: Handler<{}, {}, CreateBooking, ApiResult<Booking>> = (req, res) => {
  const { lab, seats, purpose } = req.body;
  if (seats <= 0) {
    res.status(400).json({ ok: false, error: { code: 'INVALID_SEATS', message: 'seats must be positive' } });
    return;
  }
  res.status(201).json({ ok: true, data: { id: 'bk_1', lab, seats, purpose, status: 'PENDING' } });
};`,
  "vua": `import type { Handler } from './http.ts';
import type { ApiResult } from './api.ts';

export type CreateBooking = { lab: string; seats: number; purpose?: string };
export type Booking = { id: string; lab: string; seats: number; purpose: string; status: 'PENDING' };

export const createBooking: Handler<{}, {}, CreateBooking, ApiResult<Booking>> = (req, res) => {
  const { lab, seats, purpose } = req.body;
  if (seats <= 0) {
    res.status(400).json({ ok: false, error: { code: 'INVALID_SEATS', message: 'seats must be positive' } });
    return;
  }
  res.status(201).json({ ok: true, data: { id: 'bk_1', lab, seats, purpose: purpose ?? '', status: 'PENDING' } });
};`,
  "sai": `import type { CreateBooking, Booking } from '../handler.ts';
import type { ApiResult } from '../api.ts';
export const s1: CreateBooking = { lab: 'x', seats: 40 }; // S1 TS2741 a create body is missing purpose
export const s2: CreateBooking = { lab: 'x', seats: 40, purpose: 'y', id: 'z' }; // S2 TS2353 a create body must not carry the server-owned id
export const s3: CreateBooking = { lab: 'x', seats: 'many', purpose: 'y' }; // S3 TS2322 seats must be a number
export const s4: Booking = { id: 'bk', lab: 'x', seats: 40, purpose: 'y', status: 'DONE' }; // S4 TS2322 status is a closed literal
export const s5: Booking = { id: 'bk', lab: 'x', seats: 40, status: 'PENDING' }; // S5 TS2741 a Booking is missing purpose
export function s6(r: ApiResult<Booking>) { return r.data; } // S6 TS2339 data is not on the error branch
export const s7: ApiResult<Booking> = { ok: true }; // S7 TS2322 an ok envelope is missing data
export const s8: ApiResult<Booking> = { ok: false, error: 'oops' }; // S8 TS2322 error must be an object, not a string`,
  "dung": `import type { CreateBooking, Booking } from '../handler.ts';
const c: CreateBooking = { lab: 'BE-201', seats: 40, purpose: 'Lab' };
const b: Booking = { id: 'bk_1', lab: 'BE-201', seats: 40, purpose: 'Lab', status: 'PENDING' };
export { c, b };`,
  "grader": `// Lab 11 grader — "A typed Express handler with an error envelope".
// Copies YOUR handler.ts next to the grader's http.ts, api.ts, run.ts, kiem/ and test/, then scores 10 points:
//   A  tsc: your handler.ts compiles under the course tsconfig (strict) ..................... 2
//   B  tsc: the correct uses in kiem/phai-dung.ts compile ................................. 1
//   C  honesty: no any, no "as" cast (as const is fine), no "!", no @ts- .................. 1
//   D  node --test: the handler returns the right envelope for a valid and an invalid body  2
//   E  the 8 wrong uses in kiem/sai.ts are each refused with the right code ............... 8 × 0.5
import { execFileSync } from 'node:child_process';
import { cpSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const i = process.argv.indexOf('--from');
const from = path.resolve(i > 0 ? process.argv[i + 1] : path.join(root, 'lab11/src'));
const tmp = path.join(root, '.cham-lab11');
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
  cpSync(path.join(from, 'handler.ts'), path.join(tmp, 'handler.ts'));
  for (const f of ['http.ts', 'api.ts', 'run.ts']) cpSync(path.join(root, 'lab11', f), path.join(tmp, f));
  cpSync(path.join(root, 'lab11/kiem'), path.join(tmp, 'kiem'), { recursive: true });
  cpSync(path.join(root, 'lab11/test'), path.join(tmp, 'test'), { recursive: true });
  const base = { extends: path.join(root, 'tsconfig.json') };
  writeFileSync(path.join(tmp, 'a.json'), JSON.stringify({ ...base, include: ['handler.ts', 'http.ts', 'api.ts'] }));
  writeFileSync(path.join(tmp, 'b.json'), JSON.stringify({ ...base, include: ['handler.ts', 'http.ts', 'api.ts', 'kiem/phai-dung.ts'] }));
  writeFileSync(path.join(tmp, 'e.json'), JSON.stringify({ ...base, include: ['handler.ts', 'http.ts', 'api.ts', 'kiem/sai.ts'] }));

  let score = 0;
  const line = (ok, pts, max, label, extra = '') => {
    score += pts;
    console.log(\`\${ok ? '✓' : '✗'} \${label} — \${pts}/\${max}\${extra ? '\\n    ' + extra.trim().split('\\n').slice(0, 4).join('\\n    ') : ''}\`);
  };

  const a = tsc('a.json');
  const aErr = a.out.split('\\n').filter((l) => / error TS\\d+/.test(l) && !l.startsWith('kiem/'));
  line(aErr.length === 0, aErr.length === 0 ? 2 : 0, 2, 'A  your handler.ts compiles (strict)', aErr.join('\\n'));
  const b = tsc('b.json');
  const bErr = errorsIn(b.out, 'kiem/phai-dung.ts');
  line(bErr.length === 0, bErr.length === 0 ? 1 : 0, 1, 'B  correct uses compile', bErr.join('\\n'));

  const src = codeOnly(readFileSync(path.join(tmp, 'handler.ts'), 'utf8'));
  const cheats = [...src.matchAll(/\\bany\\b|@ts-(?:ignore|nocheck|expect-error)|\\bas\\s+(?!const\\b)\\w+|[\\w$)\\]]!(?=[.[;,)\\s])/g)].map((m) => m[0].trim());
  line(cheats.length === 0, cheats.length === 0 ? 1 : 0, 1, 'C  no any / as / ! / @ts-', cheats.length ? 'found: ' + [...new Set(cheats)].join(', ') : '');

  const d = run(process.execPath, ['--test', '--test-reporter=tap', 'test/handler.test.ts']);
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
  'l3-starter': `$ node scripts/cham-lab-11.mjs --from lab11/src
✓ A  your handler.ts compiles (strict) — 2/2
✓ B  correct uses compile — 1/1
✗ C  no any / as / ! / @ts- — 0/1
    found: any
✗ D  behaviour tests pass (0/2) — 0/2
    failed: valid body -> 201 ok with data
    failed: seats <= 0 -> 400 error
    ✗ S1 a create body is missing purpose — expected TS2741, got no error
    ✗ S2 a create body must not carry the server-owned id — expected TS2353, got no error
    ✗ S3 seats must be a number — expected TS2322, got no error
    ✗ S4 status is a closed literal — expected TS2322, got no error
    ✗ S5 a Booking is missing purpose — expected TS2741, got no error
    ✓ S6 data is not on the error branch — expected TS2339, got TS2339
    ✓ S7 an ok envelope is missing data — expected TS2322, got TS2322
    ✓ S8 error must be an object, not a string — expected TS2322, got TS2322
✗ E  wrong uses refused (3/8) — 1.5/4

Score: 4.5/10 — NOT YET (pass mark 7)`,
  'l4-yeu': `$ node scripts/cham-lab-11.mjs --from lab11/yeu
✓ A  your handler.ts compiles (strict) — 2/2
✓ B  correct uses compile — 1/1
✗ C  no any / as / ! / @ts- — 0/1
    found: any
✓ D  behaviour tests pass (2/2) — 2/2
    ✓ S1 a create body is missing purpose — expected TS2741, got TS2741
    ✓ S2 a create body must not carry the server-owned id — expected TS2353, got TS2353
    ✓ S3 seats must be a number — expected TS2322, got TS2322
    ✗ S4 status is a closed literal — expected TS2322, got no error
    ✗ S5 a Booking is missing purpose — expected TS2741, got no error
    ✓ S6 data is not on the error branch — expected TS2339, got TS2339
    ✓ S7 an ok envelope is missing data — expected TS2322, got TS2322
    ✓ S8 error must be an object, not a string — expected TS2322, got TS2322
✗ E  wrong uses refused (6/8) — 3/4

Score: 8/10 — PASS (pass mark 7)`,
  'l5-vua': `$ node scripts/cham-lab-11.mjs --from lab11/vua
✓ A  your handler.ts compiles (strict) — 2/2
✓ B  correct uses compile — 1/1
✓ C  no any / as / ! / @ts- — 1/1
✓ D  behaviour tests pass (2/2) — 2/2
    ✗ S1 a create body is missing purpose — expected TS2741, got no error
    ✓ S2 a create body must not carry the server-owned id — expected TS2353, got TS2353
    ✓ S3 seats must be a number — expected TS2322, got TS2322
    ✓ S4 status is a closed literal — expected TS2322, got TS2322
    ✓ S5 a Booking is missing purpose — expected TS2741, got TS2741
    ✓ S6 data is not on the error branch — expected TS2339, got TS2339
    ✓ S7 an ok envelope is missing data — expected TS2322, got TS2322
    ✓ S8 error must be an object, not a string — expected TS2322, got TS2322
✗ E  wrong uses refused (7/8) — 3.5/4

Score: 9.5/10 — PASS (pass mark 7)`,
  'l6-ref': `$ node scripts/cham-lab-11.mjs --from lab11/giai
✓ A  your handler.ts compiles (strict) — 2/2
✓ B  correct uses compile — 1/1
✓ C  no any / as / ! / @ts- — 1/1
✓ D  behaviour tests pass (2/2) — 2/2
    ✓ S1 a create body is missing purpose — expected TS2741, got TS2741
    ✓ S2 a create body must not carry the server-owned id — expected TS2353, got TS2353
    ✓ S3 seats must be a number — expected TS2322, got TS2322
    ✓ S4 status is a closed literal — expected TS2322, got TS2322
    ✓ S5 a Booking is missing purpose — expected TS2741, got TS2741
    ✓ S6 data is not on the error branch — expected TS2339, got TS2339
    ✓ S7 an ok envelope is missing data — expected TS2322, got TS2322
    ✓ S8 error must be an object, not a string — expected TS2322, got TS2322
✓ E  wrong uses refused (8/8) — 4/4

Score: 10/10 — PASS (pass mark 7)`,
};
