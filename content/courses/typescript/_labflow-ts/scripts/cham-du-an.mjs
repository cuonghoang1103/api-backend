// Capstone grader — scores the whole LabFlow TS project out of 100 by running real checks.
//   A  typecheck: tsc --noEmit -p tsconfig.json is clean ............................... 20
//   B  tests: node --test on src/**/*.test.ts all pass ................................ 20
//   C  six representative chapter labs each score 10/10 (reference solutions) ......... 60  (6 × 10)
// Run:  npm run du-an     (or: node scripts/cham-du-an.mjs)
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const win = process.platform === 'win32';
function run(cmd, args) {
  try { return { code: 0, out: execFileSync(cmd, args, { cwd: root, encoding: 'utf8', stdio: 'pipe', shell: win }) }; }
  catch (e) { return { code: e.status ?? 1, out: (e.stdout || '') + (e.stderr || '') }; }
}
const tsc = path.join(root, 'node_modules/.bin/tsc' + (win ? '.cmd' : ''));

let score = 0;
const line = (pts, max, label, extra = '') => { score += pts; console.log(`${pts === max ? '✓' : '✗'} ${label} — ${pts}/${max}${extra ? '  ' + extra : ''}`); };

// A — typecheck
const a = run(tsc, ['--noEmit', '-p', 'tsconfig.json']);
line(a.code === 0 ? 20 : 0, 20, 'A  typecheck (tsc --noEmit)', a.code === 0 ? '' : a.out.trim().split('\n')[0]);

// B — tests
const b = run(process.execPath, ['--test', '--test-reporter=tap', 'src/**/*.test.ts']);
const pass = /# pass (\d+)/.exec(b.out); const total = /# tests (\d+)/.exec(b.out);
line(b.code === 0 ? 20 : 0, 20, `B  tests pass (${pass ? pass[1] : 0}/${total ? total[1] : '?'})`, b.code === 0 ? '' : 'some tests failed');

// C — six representative labs
// Labs 9–15 ship a reference solution (giai/); the earlier chapters (rules, model, unions, generics,
// utility types) are verified by the whole-project typecheck (A) and the 60 tests (B).
const labs = [
  [9, 'strict tsconfig & the CI gate'],
  [11, 'typed Express handler + error envelope'],
  [12, 'typed React component + hook'],
  [13, 'Zod schema as the single source of truth'],
  [14, 'a service over an abstract repo'],
  [15, 'transpile-ready build (import type / export type)'],
];
let labPts = 0;
for (const [n, desc] of labs) {
  const r = run(process.execPath, [`scripts/cham-lab-${n}.mjs`, '--from', `lab${n}/giai`]);
  const m = /Score: (\d+(?:\.\d+)?)\/10/.exec(r.out);
  const got = m ? Number(m[1]) : 0;
  const pts = got >= 10 ? 10 : 0;
  labPts += pts;
  console.log(`    ${pts === 10 ? '✓' : '✗'} Lab ${n} — ${desc}: ${m ? m[1] : '?'}/10 ⇒ ${pts}/10`);
}
line(labPts, 60, `C  six chapter labs (${labPts / 10}/6 at 10/10)`);

const grade = score >= 90 ? 'DISTINCTION' : score >= 70 ? 'PASS' : 'NOT YET';
console.log(`\nProject score: ${score}/100 — ${grade} (pass mark 70, distinction 90)`);
process.exitCode = score >= 70 ? 0 : 1;
