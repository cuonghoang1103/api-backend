// Lab 2 grader — "Strict null on the lab schedule".   node scripts/cham-lab-2.mjs [--from <folder with schedule.ts>]
// Copies YOUR schedule.ts (plus the course's time.ts) into a fresh folder next to the grader-owned tests, then scores 10 points:
//   A  tsc: your file compiles under the course tsconfig (strict) ........................ 2
//   B  tsc: the correct uses in kiem/phai-dung.ts still compile ............................ 1
//   C  honesty: no any, no "as" cast (as const is fine), no "!" assertion, no @ts- directive 1
//   D  node --test: the 13 behaviour tests in test/schedule.test.ts pass ................... 2
//   E  the 8 wrong uses in kiem/sai.ts are each refused with the right code ............... 8 × 0.5
import { execFileSync } from 'node:child_process';
import { cpSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const i = process.argv.indexOf('--from');
const from = path.resolve(i > 0 ? process.argv[i + 1] : path.join(root, 'lab2/src'));
const tmp = path.join(root, '.cham-lab2');
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
const errorsIn = (out, file) => out.split('\n').filter((l) => l.startsWith(file + '(') && / error TS\d+/.test(l));
// Code only: comments and string literals removed, so "as" or "!" inside them does not count.
const codeOnly = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '').replace(/'(?:[^'\n\\]|\\.)*'|"(?:[^"\n\\]|\\.)*"/g, "''");

try {
  mkdirSync(path.join(tmp, 'src'));
  cpSync(path.join(from, 'schedule.ts'), path.join(tmp, 'src/schedule.ts'));
  cpSync(path.join(root, 'src/rules/time.ts'), path.join(tmp, 'src/time.ts'));
  cpSync(path.join(root, 'lab2/test'), path.join(tmp, 'test'), { recursive: true });
  cpSync(path.join(root, 'lab2/kiem'), path.join(tmp, 'kiem'), { recursive: true });
  const base = { extends: path.join(root, 'tsconfig.json') };
  writeFileSync(path.join(tmp, 'a.json'), JSON.stringify({ ...base, include: ['src'] }));
  writeFileSync(path.join(tmp, 'b.json'), JSON.stringify({ ...base, include: ['src', 'kiem/phai-dung.ts'] }));
  writeFileSync(path.join(tmp, 'e.json'), JSON.stringify({ ...base, include: ['src', 'kiem/sai.ts'] }));

  let score = 0;
  const line = (ok, pts, max, label, extra = '') => {
    score += pts;
    console.log(`${ok ? '✓' : '✗'} ${label} — ${pts}/${max}${extra ? '\n    ' + extra.trim().split('\n').slice(0, 4).join('\n    ') : ''}`);
  };

  const a = tsc('a.json');
  line(a.code === 0, a.code === 0 ? 2 : 0, 2, 'A  your schedule.ts compiles (strict)', a.code ? a.out : '');
  const b = tsc('b.json');
  const bErr = errorsIn(b.out, 'kiem/phai-dung.ts');
  line(bErr.length === 0, bErr.length === 0 ? 1 : 0, 1, 'B  correct uses still compile', bErr.join('\n'));

  const src = codeOnly(readFileSync(path.join(tmp, 'src/schedule.ts'), 'utf8'));
  const cheats = [...src.matchAll(/\bany\b|@ts-(?:ignore|nocheck|expect-error)|\bas\s+(?!const\b)\w+|[\w$]+!(?=[.[;,)\s])|[)\]]!(?=[.[;,)\s])/g)].map((m) => m[0].trim());
  line(cheats.length === 0, cheats.length === 0 ? 1 : 0, 1, 'C  no any / as / ! / @ts- directives', cheats.length ? 'found: ' + [...new Set(cheats)].join(', ') : '');

  const d = run(process.execPath, ['--test', '--test-reporter=tap', 'test/schedule.test.ts']);
  const pass = /# pass (\d+)/.exec(d.out);
  const total = /# tests (\d+)/.exec(d.out);
  const fails = d.out.split('\n').filter((l) => /^not ok \d+ - /.test(l)).map((l) => l.replace(/^not ok \d+ - /, 'failed: ')).slice(0, 4).join('\n');
  line(d.code === 0, d.code === 0 ? 2 : 0, 2, `D  behaviour tests pass (${pass ? pass[1] : 0}/${total ? total[1] : '?'})`, d.code ? fails : '');

  const e = tsc('e.json');
  const sai = readFileSync(path.join(tmp, 'kiem/sai.ts'), 'utf8').split('\n');
  const wanted = sai.map((t, n) => [n + 1, /\/\/ (S\d) (TS\d+) (.*)$/.exec(t)]).filter(([, m]) => m);
  let refused = 0;
  for (const [n, [, id, code, why]] of wanted) {
    const got = errorsIn(e.out, 'kiem/sai.ts').filter((l) => l.startsWith(`kiem/sai.ts(${n},`)).map((l) => /error (TS\d+)/.exec(l)[1]);
    const ok = got.includes(code);
    if (ok) refused++;
    console.log(`    ${ok ? '✓' : '✗'} ${id} ${why} — expected ${code}, got ${got.length ? got.join(', ') : 'no error'}`);
  }
  line(refused === wanted.length, refused * 0.5, 4, `E  wrong uses refused (${refused}/${wanted.length})`);

  console.log(`\nScore: ${score}/10 — ${score >= 7 ? 'PASS' : 'NOT YET'} (pass mark 7)`);
  process.exitCode = score >= 7 ? 0 : 1;
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
