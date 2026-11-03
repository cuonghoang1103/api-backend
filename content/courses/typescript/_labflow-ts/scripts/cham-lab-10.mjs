// Lab 10 grader — "Write a .d.ts for a JS package".
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
const errorsIn = (out, file) => out.split('\n').filter((l) => l.startsWith(file + '(') && / error TS\d+/.test(l));
const codeOnly = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '').replace(/'(?:[^'\n\\]|\\.)*'|"(?:[^"\n\\]|\\.)*"/g, "''");

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
    console.log(`${ok ? '✓' : '✗'} ${label} — ${pts}/${max}${extra ? '\n    ' + extra.trim().split('\n').slice(0, 4).join('\n    ') : ''}`);
  };

  const a = tsc('a.json');
  line(a.code === 0, a.code === 0 ? 2 : 0, 2, 'A  your declaration file is well-formed', a.code ? a.out : '');
  const b = tsc('b.json');
  const bErr = errorsIn(b.out, 'kiem/phai-dung.ts');
  line(bErr.length === 0, bErr.length === 0 ? 1 : 0, 1, 'B  correct uses type-check', bErr.join('\n'));

  const dts = codeOnly(readFileSync(path.join(tmp, 'labflow-slug.d.ts'), 'utf8'));
  const cheats = [...dts.matchAll(/\bany\b|@ts-(?:ignore|nocheck|expect-error)/g)].map((m) => m[0].trim());
  line(cheats.length === 0, cheats.length === 0 ? 1 : 0, 1, 'C  no any / @ts- in the declaration', cheats.length ? 'found: ' + [...new Set(cheats)].join(', ') : '');

  const d = run(process.execPath, ['--test', '--test-reporter=tap', 'test/slug.test.ts']);
  const pass = /# pass (\d+)/.exec(d.out); const total = /# tests (\d+)/.exec(d.out);
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
