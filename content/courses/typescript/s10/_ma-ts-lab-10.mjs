/**
 * _ma (bài Lab 10) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "js": `export const SLUG_MAX = 80;
export function slugify(text) {
  return text.toLowerCase().trim().replace(/\\s+/g, '-').slice(0, SLUG_MAX);
}
export function truncate(text, max) {
  return text.length <= max ? text : text.slice(0, max) + '…';
}
export function isSlug(value) {
  return /^[a-z0-9-]+$/.test(value);
}`,
  "starterDts": `// A teammate stubbed the declaration with any — it compiles, but it checks nothing.
export const SLUG_MAX: any;
export function slugify(text: any): any;
export function truncate(text: any, max: any): any;
export function isSlug(value: any): any;`,
  "refDts": `export const SLUG_MAX: number;
export function slugify(text: string): string;
export function truncate(text: string, max: number): string;
export function isSlug(value: string): boolean;`,
  "yeuDts": `export const SLUG_MAX: number;
export function slugify(text: any): string;
export function truncate(text: string, max?: number): string;
export function isSlug(value: string): boolean;`,
  "vuaDts": `export const SLUG_MAX: number;
export function slugify(text: string): string;
export function truncate(text: string, max?: number): string;
export function isSlug(value: string): boolean;`,
  "sai": `import { slugify, truncate, isSlug, SLUG_MAX, nope } from '../labflow-slug.js'; // S7 TS2305 labflow-slug has no export 'nope'
export const s1 = slugify(42); // S1 TS2345 slugify takes a string, not a number
export const s2 = truncate('x'); // S2 TS2554 truncate needs the max argument
export const s3: number = slugify('x'); // S3 TS2322 slugify returns a string, not a number
export const s4 = isSlug('x').length; // S4 TS2339 isSlug returns boolean, which has no .length
export const s5 = SLUG_MAX.toUpperCase(); // S5 TS2339 SLUG_MAX is a number, which has no toUpperCase
export const s6 = truncate('x', '5'); // S6 TS2345 max is a number, not a string
export const s8: boolean = truncate('x', 5); // S8 TS2322 truncate returns a string, not a boolean
void nope;`,
  "dung": `import { slugify, truncate, isSlug, SLUG_MAX } from '../labflow-slug.js';
const s: string = slugify('Phong Lab');
const t: string = truncate('hello world', 5);
const ok: boolean = isSlug('be-201');
const max: number = SLUG_MAX;
export { s, t, ok, max };`,
  "grader": `// Lab 10 grader — "Write a .d.ts for a JS package".
// Copies YOUR labflow-slug.d.ts next to the grader's labflow-slug.js, kiem/ and test/, then scores 10 points:
//   A  tsc: your declaration file is well-formed (compiles on its own) ....................... 2
//   B  tsc: the correct uses in kiem/phai-dung.ts type-check against your types ............. 1
//   C  honesty: no any and no @ts- in the declaration ...................................... 1
//   D  node --test: the real .js behaves as the tests expect ............................... 2
//   E  the 8 wrong uses in kiem/sai.ts are each refused with the right code ............... 8 × 0.5
import { execFileSync } from 'node:child_process';
import { cpSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const i = process.argv.indexOf('--from');
const from = path.resolve(i > 0 ? process.argv[i + 1] : path.join(root, 'lab10/src'));
const tmp = path.join(root, '.cham-lab10');
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
  cpSync(path.join(from, 'labflow-slug.d.ts'), path.join(tmp, 'labflow-slug.d.ts'));
  cpSync(path.join(root, 'lab10/labflow-slug.js'), path.join(tmp, 'labflow-slug.js'));
  cpSync(path.join(root, 'lab10/kiem'), path.join(tmp, 'kiem'), { recursive: true });
  cpSync(path.join(root, 'lab10/test'), path.join(tmp, 'test'), { recursive: true });
  const base = { extends: path.join(root, 'tsconfig.json') };
  writeFileSync(path.join(tmp, 'a.json'), JSON.stringify({ ...base, include: ['labflow-slug.d.ts'] }));
  writeFileSync(path.join(tmp, 'b.json'), JSON.stringify({ ...base, include: ['kiem/phai-dung.ts'] }));
  writeFileSync(path.join(tmp, 'e.json'), JSON.stringify({ ...base, include: ['kiem/sai.ts'] }));

  let score = 0;
  const line = (ok, pts, max, label, extra = '') => {
    score += pts;
    console.log(\`\${ok ? '✓' : '✗'} \${label} — \${pts}/\${max}\${extra ? '\\n    ' + extra.trim().split('\\n').slice(0, 4).join('\\n    ') : ''}\`);
  };

  const a = tsc('a.json');
  line(a.code === 0, a.code === 0 ? 2 : 0, 2, 'A  your declaration file is well-formed', a.code ? a.out : '');
  const b = tsc('b.json');
  const bErr = errorsIn(b.out, 'kiem/phai-dung.ts');
  line(bErr.length === 0, bErr.length === 0 ? 1 : 0, 1, 'B  correct uses type-check', bErr.join('\\n'));

  const dts = codeOnly(readFileSync(path.join(tmp, 'labflow-slug.d.ts'), 'utf8'));
  const cheats = [...dts.matchAll(/\\bany\\b|@ts-(?:ignore|nocheck|expect-error)/g)].map((m) => m[0].trim());
  line(cheats.length === 0, cheats.length === 0 ? 1 : 0, 1, 'C  no any / @ts- in the declaration', cheats.length ? 'found: ' + [...new Set(cheats)].join(', ') : '');

  const d = run(process.execPath, ['--test', '--test-reporter=tap', 'test/slug.test.ts']);
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
  'l3-starter': `$ node scripts/cham-lab-10.mjs --from lab10/src
✓ A  your declaration file is well-formed — 2/2
✓ B  correct uses type-check — 1/1
✗ C  no any / @ts- in the declaration — 0/1
    found: any
✓ D  behaviour tests pass (3/3) — 2/2
    ✓ S7 labflow-slug has no export 'nope' — expected TS2305, got TS2305
    ✗ S1 slugify takes a string, not a number — expected TS2345, got no error
    ✓ S2 truncate needs the max argument — expected TS2554, got TS2554
    ✗ S3 slugify returns a string, not a number — expected TS2322, got no error
    ✗ S4 isSlug returns boolean, which has no .length — expected TS2339, got no error
    ✗ S5 SLUG_MAX is a number, which has no toUpperCase — expected TS2339, got no error
    ✗ S6 max is a number, not a string — expected TS2345, got no error
    ✗ S8 truncate returns a string, not a boolean — expected TS2322, got no error
✗ E  wrong uses refused (2/8) — 1/4

Score: 6/10 — NOT YET (pass mark 7)`,
  'l4-yeu': `$ node scripts/cham-lab-10.mjs --from lab10/yeu
✓ A  your declaration file is well-formed — 2/2
✓ B  correct uses type-check — 1/1
✗ C  no any / @ts- in the declaration — 0/1
    found: any
✓ D  behaviour tests pass (3/3) — 2/2
    ✓ S7 labflow-slug has no export 'nope' — expected TS2305, got TS2305
    ✗ S1 slugify takes a string, not a number — expected TS2345, got no error
    ✗ S2 truncate needs the max argument — expected TS2554, got no error
    ✓ S3 slugify returns a string, not a number — expected TS2322, got TS2322
    ✓ S4 isSlug returns boolean, which has no .length — expected TS2339, got TS2339
    ✓ S5 SLUG_MAX is a number, which has no toUpperCase — expected TS2339, got TS2339
    ✓ S6 max is a number, not a string — expected TS2345, got TS2345
    ✓ S8 truncate returns a string, not a boolean — expected TS2322, got TS2322
✗ E  wrong uses refused (6/8) — 3/4

Score: 8/10 — PASS (pass mark 7)`,
  'l5-vua': `$ node scripts/cham-lab-10.mjs --from lab10/vua
✓ A  your declaration file is well-formed — 2/2
✓ B  correct uses type-check — 1/1
✓ C  no any / @ts- in the declaration — 1/1
✓ D  behaviour tests pass (3/3) — 2/2
    ✓ S7 labflow-slug has no export 'nope' — expected TS2305, got TS2305
    ✓ S1 slugify takes a string, not a number — expected TS2345, got TS2345
    ✗ S2 truncate needs the max argument — expected TS2554, got no error
    ✓ S3 slugify returns a string, not a number — expected TS2322, got TS2322
    ✓ S4 isSlug returns boolean, which has no .length — expected TS2339, got TS2339
    ✓ S5 SLUG_MAX is a number, which has no toUpperCase — expected TS2339, got TS2339
    ✓ S6 max is a number, not a string — expected TS2345, got TS2345
    ✓ S8 truncate returns a string, not a boolean — expected TS2322, got TS2322
✗ E  wrong uses refused (7/8) — 3.5/4

Score: 9.5/10 — PASS (pass mark 7)`,
  'l6-ref': `$ node scripts/cham-lab-10.mjs --from lab10/giai
✓ A  your declaration file is well-formed — 2/2
✓ B  correct uses type-check — 1/1
✓ C  no any / @ts- in the declaration — 1/1
✓ D  behaviour tests pass (3/3) — 2/2
    ✓ S7 labflow-slug has no export 'nope' — expected TS2305, got TS2305
    ✓ S1 slugify takes a string, not a number — expected TS2345, got TS2345
    ✓ S2 truncate needs the max argument — expected TS2554, got TS2554
    ✓ S3 slugify returns a string, not a number — expected TS2322, got TS2322
    ✓ S4 isSlug returns boolean, which has no .length — expected TS2339, got TS2339
    ✓ S5 SLUG_MAX is a number, which has no toUpperCase — expected TS2339, got TS2339
    ✓ S6 max is a number, not a string — expected TS2345, got TS2345
    ✓ S8 truncate returns a string, not a boolean — expected TS2322, got TS2322
✓ E  wrong uses refused (8/8) — 4/4

Score: 10/10 — PASS (pass mark 7)`,
};
