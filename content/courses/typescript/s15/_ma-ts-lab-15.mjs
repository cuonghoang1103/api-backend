/**
 * _ma (bài Lab 15) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "model": `export type Booking = { id: number; lab: string };
export type Lab = { code: string };
export type Slot = { start: string };
export type User = { name: string };
export type Review = { stars: number };
export const makeBooking = (id: number, lab: string): Booking => ({ id, lab });
export const VERSION = 1;`,
  "starter": `// TODO: a per-file transpiler cannot tell types from values — mark them with import type / export type.
import { Booking, makeBooking, VERSION } from './model.ts';

export { Booking };

export function describe(b: Booking): string { return b.lab + ' v' + VERSION; }
export const demo = makeBooking(1, 'BE-201');`,
  "ref": `import type { Booking } from './model.ts';
import { makeBooking, VERSION } from './model.ts';

export type { Booking };

export function describe(b: Booking): string { return b.lab + ' v' + VERSION; }
export const demo = makeBooking(1, 'BE-201');`,
  "yeu": `import type { Booking } from './model.ts';
import { makeBooking, VERSION } from './model.ts';

// Still a value re-export of a type — not transpile-ready.
export { Booking };

export function describe(b: Booking): string { return b.lab + ' v' + VERSION; }
export const demo = makeBooking(1, 'BE-201');`,
  "vua": `import type { Booking } from './model.ts';
import { makeBooking, VERSION } from './model.ts';

export type { Booking };

export function describe(b: Booking): string { return (b.lab as string) + ' v' + VERSION; }
export const demo = makeBooking(1, 'BE-201');`,
  "sai": `import { Booking } from '../model.ts'; // S1 TS1484 a type imported as a value
import { Lab } from '../model.ts'; // S2 TS1484 a type imported as a value
import { Slot } from '../model.ts'; // S3 TS1484 a type imported as a value
import { User } from '../model.ts'; // S4 TS1484 a type imported as a value
export { Booking } from '../model.ts'; // S5 TS1205 a type re-exported as a value
export { Lab } from '../model.ts'; // S6 TS1205 a type re-exported as a value
export { Slot } from '../model.ts'; // S7 TS1205 a type re-exported as a value
export { Review } from '../model.ts'; // S8 TS1205 a type re-exported as a value`,
  "dung": `import type { Booking } from '../model.ts';
import { describe, demo } from '../boundary.ts';

const b: Booking = { id: 1, lab: 'BE-201' };
export const text: string = describe(b);
export { demo };`,
  "grader": `// Lab 15 grader — "A typed React component + hook (a transpile-ready boundary module)".
// Copies YOUR boundary.ts next to the grader's model.ts, kiem/ and test/, then scores 10 points:
//   A  tsc: your boundary.ts compiles under the course tsconfig (strict) ...................... 2
//   B  tsc: the correct uses in kiem/phai-dung.ts compile ................................ 1
//   C  honesty: no any, no "as" cast (as const is fine), no "!", no @ts- ................. 1
//   D  node --test: the hook collects typed values and submits a CreateBooking ........... 2
//   E  the 8 wrong uses in kiem/sai.ts are each refused with the right code .............. 8 × 0.5
import { execFileSync } from 'node:child_process';
import { cpSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const i = process.argv.indexOf('--from');
const from = path.resolve(i > 0 ? process.argv[i + 1] : path.join(root, 'lab15/src'));
const tmp = path.join(root, '.cham-lab15');
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
  cpSync(path.join(from, 'boundary.ts'), path.join(tmp, 'boundary.ts'));
  cpSync(path.join(root, 'lab15/model.ts'), path.join(tmp, 'model.ts'));
  cpSync(path.join(root, 'lab15/kiem'), path.join(tmp, 'kiem'), { recursive: true });
  cpSync(path.join(root, 'lab15/test'), path.join(tmp, 'test'), { recursive: true });
  const base = { extends: path.join(root, 'tsconfig.json') };
  writeFileSync(path.join(tmp, 'a.json'), JSON.stringify({ ...base, include: ['boundary.ts', 'model.ts'] }));
  writeFileSync(path.join(tmp, 'b.json'), JSON.stringify({ ...base, include: ['boundary.ts', 'model.ts', 'kiem/phai-dung.ts'] }));
  writeFileSync(path.join(tmp, 'e.json'), JSON.stringify({ ...base, include: ['boundary.ts', 'model.ts', 'kiem/sai.ts'] }));

  let score = 0;
  const line = (ok, pts, max, label, extra = '') => {
    score += pts;
    console.log(\`\${ok ? '✓' : '✗'} \${label} — \${pts}/\${max}\${extra ? '\\n    ' + extra.trim().split('\\n').slice(0, 4).join('\\n    ') : ''}\`);
  };

  const a = tsc('a.json');
  const aErr = a.out.split('\\n').filter((l) => / error TS\\d+/.test(l) && !l.startsWith('kiem/'));
  line(aErr.length === 0, aErr.length === 0 ? 2 : 0, 2, 'A  your boundary.ts compiles (strict)', aErr.join('\\n'));
  const b = tsc('b.json');
  const bErr = errorsIn(b.out, 'kiem/phai-dung.ts');
  line(bErr.length === 0, bErr.length === 0 ? 1 : 0, 1, 'B  correct uses compile', bErr.join('\\n'));

  const src = codeOnly(readFileSync(path.join(tmp, 'boundary.ts'), 'utf8'));
  const cheats = [...src.matchAll(/\\bany\\b|@ts-(?:ignore|nocheck|expect-error)|\\bas\\s+(?!const\\b)\\w+|[\\w$)\\]]!(?=[.[;,)\\s])/g)].map((m) => m[0].trim());
  line(cheats.length === 0, cheats.length === 0 ? 1 : 0, 1, 'C  no any / as / ! / @ts-', cheats.length ? 'found: ' + [...new Set(cheats)].join(', ') : '');

  const d = run(process.execPath, ['--test', '--test-reporter=tap', 'test/boundary.test.ts']);
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
  'l3-starter': `$ node scripts/cham-lab-15.mjs --from lab15/src
✗ A  your boundary.ts compiles (strict) — 0/2
    boundary.ts(2,10): error TS1484: 'Booking' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.
    boundary.ts(4,10): error TS1205: Re-exporting a type when 'verbatimModuleSyntax' is enabled requires using 'export type'.
✓ B  correct uses compile — 1/1
✓ C  no any / as / ! / @ts- — 1/1
✗ D  behaviour tests pass (0/1) — 0/2
    failed: test/boundary.test.ts
    ✓ S1 a type imported as a value — expected TS1484, got TS1484
    ✓ S2 a type imported as a value — expected TS1484, got TS1484
    ✓ S3 a type imported as a value — expected TS1484, got TS1484
    ✓ S4 a type imported as a value — expected TS1484, got TS1484
    ✓ S5 a type re-exported as a value — expected TS1205, got TS1205
    ✓ S6 a type re-exported as a value — expected TS1205, got TS1205
    ✓ S7 a type re-exported as a value — expected TS1205, got TS1205
    ✓ S8 a type re-exported as a value — expected TS1205, got TS1205
✓ E  wrong uses refused (8/8) — 4/4

Score: 6/10 — NOT YET (pass mark 7)`,
  'l4-yeu': `$ node scripts/cham-lab-15.mjs --from lab15/yeu
✗ A  your boundary.ts compiles (strict) — 0/2
    boundary.ts(5,10): error TS1205: Re-exporting a type when 'verbatimModuleSyntax' is enabled requires using 'export type'.
✓ B  correct uses compile — 1/1
✓ C  no any / as / ! / @ts- — 1/1
✗ D  behaviour tests pass (0/1) — 0/2
    failed: test/boundary.test.ts
    ✓ S1 a type imported as a value — expected TS1484, got TS1484
    ✓ S2 a type imported as a value — expected TS1484, got TS1484
    ✓ S3 a type imported as a value — expected TS1484, got TS1484
    ✓ S4 a type imported as a value — expected TS1484, got TS1484
    ✓ S5 a type re-exported as a value — expected TS1205, got TS1205
    ✓ S6 a type re-exported as a value — expected TS1205, got TS1205
    ✓ S7 a type re-exported as a value — expected TS1205, got TS1205
    ✓ S8 a type re-exported as a value — expected TS1205, got TS1205
✓ E  wrong uses refused (8/8) — 4/4

Score: 6/10 — NOT YET (pass mark 7)`,
  'l5-vua': `$ node scripts/cham-lab-15.mjs --from lab15/vua
✓ A  your boundary.ts compiles (strict) — 2/2
✓ B  correct uses compile — 1/1
✗ C  no any / as / ! / @ts- — 0/1
    found: as string
✓ D  behaviour tests pass (1/1) — 2/2
    ✓ S1 a type imported as a value — expected TS1484, got TS1484
    ✓ S2 a type imported as a value — expected TS1484, got TS1484
    ✓ S3 a type imported as a value — expected TS1484, got TS1484
    ✓ S4 a type imported as a value — expected TS1484, got TS1484
    ✓ S5 a type re-exported as a value — expected TS1205, got TS1205
    ✓ S6 a type re-exported as a value — expected TS1205, got TS1205
    ✓ S7 a type re-exported as a value — expected TS1205, got TS1205
    ✓ S8 a type re-exported as a value — expected TS1205, got TS1205
✓ E  wrong uses refused (8/8) — 4/4

Score: 9/10 — PASS (pass mark 7)`,
  'l6-ref': `$ node scripts/cham-lab-15.mjs --from lab15/giai
✓ A  your boundary.ts compiles (strict) — 2/2
✓ B  correct uses compile — 1/1
✓ C  no any / as / ! / @ts- — 1/1
✓ D  behaviour tests pass (1/1) — 2/2
    ✓ S1 a type imported as a value — expected TS1484, got TS1484
    ✓ S2 a type imported as a value — expected TS1484, got TS1484
    ✓ S3 a type imported as a value — expected TS1484, got TS1484
    ✓ S4 a type imported as a value — expected TS1484, got TS1484
    ✓ S5 a type re-exported as a value — expected TS1205, got TS1205
    ✓ S6 a type re-exported as a value — expected TS1205, got TS1205
    ✓ S7 a type re-exported as a value — expected TS1205, got TS1205
    ✓ S8 a type re-exported as a value — expected TS1205, got TS1205
✓ E  wrong uses refused (8/8) — 4/4

Score: 10/10 — PASS (pass mark 7)`,
};
