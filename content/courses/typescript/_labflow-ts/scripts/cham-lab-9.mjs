// Lab 9 grader — "Tighten a loose project to strict + a CI gate".
// Copies YOUR tsconfig.json + rules.ts + seed.ts (plus the grader's content.ts, kiem/, test/) into a fresh folder, then scores 10 points:
//   A  tsc --noEmit under YOUR tsconfig reports 0 errors (the CI gate passes) ................. 2
//   B  YOUR tsconfig is tight: strict AND noUncheckedIndexedAccess are both on ............... 1
//   C  honesty: no any/as/! and seed.ts imports ContentType (no hand-copied union) ........... 1
//   D  node --test: the behaviour tests pass ................................................. 2
//   E  the 8 strict violations in kiem/sai.ts are each refused under YOUR tsconfig .......... 8 × 0.5
import { execFileSync } from 'node:child_process';
import { cpSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const i = process.argv.indexOf('--from');
const from = path.resolve(i > 0 ? process.argv[i + 1] : path.join(root, 'lab9/src'));
const tmp = path.join(root, '.cham-lab9');
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp);
const win = process.platform === 'win32';

function run(cmd, args) {
  try { return { code: 0, out: execFileSync(cmd, args, { cwd: tmp, encoding: 'utf8', stdio: 'pipe', shell: win }) }; }
  catch (e) { return { code: e.status ?? 1, out: (e.stdout || '') + (e.stderr || '') }; }
}
const tsc = (cfg) => run(path.join(root, 'node_modules/.bin/tsc' + (win ? '.cmd' : '')), ['--noEmit', '-p', cfg]);
const errorsIn = (out, file) => out.split('\n').filter((l) => l.startsWith(file + '(') && / error TS\d+/.test(l));
const codeOnly = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '').replace(/'(?:[^'\n\\]|\\.)*'|"(?:[^"\n\\]|\\.)*"/g, "''");
const parseJson = (s) => JSON.parse(s.replace(/\/\/.*$/gm, '').replace(/,(\s*[}\]])/g, '$1'));

try {
  // student files
  cpSync(path.join(from, 'tsconfig.json'), path.join(tmp, 'tsconfig.json'));
  cpSync(path.join(from, 'rules.ts'), path.join(tmp, 'rules.ts'));
  cpSync(path.join(from, 'seed.ts'), path.join(tmp, 'seed.ts'));
  // grader files
  cpSync(path.join(root, 'lab9/content.ts'), path.join(tmp, 'content.ts'));
  cpSync(path.join(root, 'lab9/kiem'), path.join(tmp, 'kiem'), { recursive: true });
  cpSync(path.join(root, 'lab9/test'), path.join(tmp, 'test'), { recursive: true });
  // configs that extend the student's tsconfig and add the grader's check files
  const stud = path.join(tmp, 'tsconfig.json');
  writeFileSync(path.join(tmp, 'b.json'), JSON.stringify({ extends: './tsconfig.json', include: ['*.ts', 'kiem/phai-dung.ts'] }));
  writeFileSync(path.join(tmp, 'e.json'), JSON.stringify({ extends: './tsconfig.json', include: ['*.ts', 'kiem/sai.ts'] }));

  let score = 0;
  const line = (ok, pts, max, label, extra = '') => {
    score += pts;
    console.log(`${ok ? '✓' : '✗'} ${label} — ${pts}/${max}${extra ? '\n    ' + extra.trim().split('\n').slice(0, 4).join('\n    ') : ''}`);
  };

  // A — the gate passes under the student config (rules.ts + seed.ts + content.ts compile)
  const a = tsc('tsconfig.json');
  const aErr = a.out.split('\n').filter((l) => / error TS\d+/.test(l) && !l.startsWith('kiem/'));
  line(aErr.length === 0, aErr.length === 0 ? 2 : 0, 2, 'A  tsc --noEmit: 0 errors (the CI gate passes)', aErr.join('\n'));

  // B — tight config
  let tight = false;
  try { const c = parseJson(readFileSync(stud, 'utf8')).compilerOptions || {}; tight = c.strict === true && c.noUncheckedIndexedAccess === true; } catch {}
  line(tight, tight ? 1 : 0, 1, 'B  tsconfig is tight (strict + noUncheckedIndexedAccess)', tight ? '' : 'both must be true in compilerOptions');

  // C — honesty: no cheats, and seed.ts imports ContentType (no hand-copied union)
  const rulesSrc = codeOnly(readFileSync(path.join(tmp, 'rules.ts'), 'utf8'));
  const seedRaw = readFileSync(path.join(tmp, 'seed.ts'), 'utf8');
  const seedSrc = codeOnly(seedRaw);
  const cheats = [...(rulesSrc + '\n' + seedSrc).matchAll(/\bany\b|@ts-(?:ignore|nocheck|expect-error)|\bas\s+(?!const\b)\w+|[\w$)\]]!(?=[.[;,)\s])/g)].map((m) => m[0].trim());
  const handCopied = /\btype\s+ContentType\s*=/.test(seedSrc);          // a locally declared union = drift risk
  const imports = /import\s+type\s*\{[^}]*\bContentType\b[^}]*\}\s*from/.test(seedRaw);
  const honest = cheats.length === 0 && !handCopied && imports;
  line(honest, honest ? 1 : 0, 1, 'C  no any/as/! and seed.ts imports ContentType',
    cheats.length ? 'found: ' + [...new Set(cheats)].join(', ') : (handCopied ? 'seed.ts declares its own ContentType — import it from content.ts instead' : (!imports ? 'seed.ts must import ContentType' : '')));

  // D — behaviour
  const d = run(process.execPath, ['--test', '--test-reporter=tap', 'test/rules.test.ts']);
  const pass = /# pass (\d+)/.exec(d.out); const total = /# tests (\d+)/.exec(d.out);
  const fails = d.out.split('\n').filter((l) => /^not ok \d+ - /.test(l)).map((l) => l.replace(/^not ok \d+ - /, 'failed: ')).slice(0, 4).join('\n');
  line(d.code === 0, d.code === 0 ? 2 : 0, 2, `D  behaviour tests pass (${pass ? pass[1] : 0}/${total ? total[1] : '?'})`, d.code ? fails : '');

  // E — the 8 strict violations refused
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
  line(refused === wanted.length, refused * 0.5, 4, `E  strict violations refused (${refused}/${wanted.length})`);

  console.log(`\nScore: ${score}/10 — ${score >= 7 ? 'PASS' : 'NOT YET'} (pass mark 7)`);
  process.exitCode = score >= 7 ? 0 : 1;
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
