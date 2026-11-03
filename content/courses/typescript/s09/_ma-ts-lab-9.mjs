/**
 * _ma (bài Lab 9) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "tsconfigLoose": `{
  "compilerOptions": {
    "target": "es2024",
    "module": "nodenext",
    "types": [
      "node"
    ],
    "strict": false,
    "noEmit": true,
    "allowImportingTsExtensions": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true
  },
  "include": [
    "*.ts"
  ]
}`,
  "tsconfigTight": `{
  "compilerOptions": {
    "target": "es2024",
    "module": "nodenext",
    "types": [
      "node"
    ],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "allowImportingTsExtensions": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true
  },
  "include": [
    "*.ts"
  ]
}`,
  "starterRules": `import type { ContentType } from './content.ts';

// Loose: the parameter has no type, and the array access is not guarded.
export function label(type) {
  const map = { VLOG: 'Vlog', BLOG: 'Blog', CODE_REVIEW: 'Review' };
  return map[type];
}
export function firstTag(tags: string[]): string {
  return tags[0].toUpperCase();
}`,
  "starterSeed": `// A hand-copied union — it still says 'CODE', but content.ts renamed it to 'CODE_REVIEW'.
// It type-checks against its own copy, so the drift is invisible until it breaks at run time.
type ContentType = 'VLOG' | 'BLOG' | 'CODE';
export const rows: { type: ContentType }[] = [{ type: 'CODE' }];`,
  "sai": `import { label } from '../rules.ts';
import type { ContentType } from '../content.ts';
export function s1(x) { return x; } // S1 TS7006 a parameter with no type (noImplicitAny)
export const s2 = (y) => y + 1; // S2 TS7006 an implicit-any arrow parameter
export function s3(xs: number[]) { const a = xs[0]; return a.toFixed(2); } // S3 TS18048 an unchecked array access
export function s4(u: { name?: string }) { return u.name.length; } // S4 TS18048 a possibly-undefined value (strictNullChecks)
export const s5: ContentType = 'CODE'; // S5 TS2322 the drifted literal 'CODE'
export const s6 = label('PODCAST'); // S6 TS2345 a value that is not a ContentType
export const s7 = label('CODE'); // S7 TS2345 the old enum value
export function s8(m: Record<string, number>) { const v = m['k']; return v + 1; } // S8 TS18048 an unchecked record lookup`,
  "dung": `import { label, firstTag } from '../rules.ts';
import { rows } from '../seed.ts';
const a: string = label('VLOG');
const b: string = firstTag(['be-201']);
export { a, b, rows };`,
  "refRules": `import type { ContentType } from './content.ts';

// The parameter is typed, and the lookups are complete / guarded.
const MAP: Record<ContentType, string> = { VLOG: 'Vlog', BLOG: 'Blog', CODE_REVIEW: 'Review' };
export function label(type: ContentType): string {
  return MAP[type];
}
export function firstTag(tags: string[]): string {
  const first = tags[0];
  return (first ?? '').toUpperCase();
}`,
  "refSeed": `import type { ContentType } from './content.ts';
// Import the real type — a renamed value is now a compile error, not a run-time break.
export const rows: { type: ContentType }[] = [{ type: 'CODE_REVIEW' }];`,
  "content": `// The source of truth for content types — the value 'CODE' was renamed to 'CODE_REVIEW'.
export type ContentType = 'VLOG' | 'BLOG' | 'CODE_REVIEW';`,
  "grader": `// Lab 9 grader — "Tighten a loose project to strict + a CI gate".
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
const errorsIn = (out, file) => out.split('\\n').filter((l) => l.startsWith(file + '(') && / error TS\\d+/.test(l));
const codeOnly = (s) => s.replace(/\\/\\*[\\s\\S]*?\\*\\//g, '').replace(/\\/\\/.*$/gm, '').replace(/'(?:[^'\\n\\\\]|\\\\.)*'|"(?:[^"\\n\\\\]|\\\\.)*"/g, "''");
const parseJson = (s) => JSON.parse(s.replace(/\\/\\/.*$/gm, '').replace(/,(\\s*[}\\]])/g, '$1'));

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
    console.log(\`\${ok ? '✓' : '✗'} \${label} — \${pts}/\${max}\${extra ? '\\n    ' + extra.trim().split('\\n').slice(0, 4).join('\\n    ') : ''}\`);
  };

  // A — the gate passes under the student config (rules.ts + seed.ts + content.ts compile)
  const a = tsc('tsconfig.json');
  const aErr = a.out.split('\\n').filter((l) => / error TS\\d+/.test(l) && !l.startsWith('kiem/'));
  line(aErr.length === 0, aErr.length === 0 ? 2 : 0, 2, 'A  tsc --noEmit: 0 errors (the CI gate passes)', aErr.join('\\n'));

  // B — tight config
  let tight = false;
  try { const c = parseJson(readFileSync(stud, 'utf8')).compilerOptions || {}; tight = c.strict === true && c.noUncheckedIndexedAccess === true; } catch {}
  line(tight, tight ? 1 : 0, 1, 'B  tsconfig is tight (strict + noUncheckedIndexedAccess)', tight ? '' : 'both must be true in compilerOptions');

  // C — honesty: no cheats, and seed.ts imports ContentType (no hand-copied union)
  const rulesSrc = codeOnly(readFileSync(path.join(tmp, 'rules.ts'), 'utf8'));
  const seedRaw = readFileSync(path.join(tmp, 'seed.ts'), 'utf8');
  const seedSrc = codeOnly(seedRaw);
  const cheats = [...(rulesSrc + '\\n' + seedSrc).matchAll(/\\bany\\b|@ts-(?:ignore|nocheck|expect-error)|\\bas\\s+(?!const\\b)\\w+|[\\w$)\\]]!(?=[.[;,)\\s])/g)].map((m) => m[0].trim());
  const handCopied = /\\btype\\s+ContentType\\s*=/.test(seedSrc);          // a locally declared union = drift risk
  const imports = /import\\s+type\\s*\\{[^}]*\\bContentType\\b[^}]*\\}\\s*from/.test(seedRaw);
  const honest = cheats.length === 0 && !handCopied && imports;
  line(honest, honest ? 1 : 0, 1, 'C  no any/as/! and seed.ts imports ContentType',
    cheats.length ? 'found: ' + [...new Set(cheats)].join(', ') : (handCopied ? 'seed.ts declares its own ContentType — import it from content.ts instead' : (!imports ? 'seed.ts must import ContentType' : '')));

  // D — behaviour
  const d = run(process.execPath, ['--test', '--test-reporter=tap', 'test/rules.test.ts']);
  const pass = /# pass (\\d+)/.exec(d.out); const total = /# tests (\\d+)/.exec(d.out);
  const fails = d.out.split('\\n').filter((l) => /^not ok \\d+ - /.test(l)).map((l) => l.replace(/^not ok \\d+ - /, 'failed: ')).slice(0, 4).join('\\n');
  line(d.code === 0, d.code === 0 ? 2 : 0, 2, \`D  behaviour tests pass (\${pass ? pass[1] : 0}/\${total ? total[1] : '?'})\`, d.code ? fails : '');

  // E — the 8 strict violations refused
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
  line(refused === wanted.length, refused * 0.5, 4, \`E  strict violations refused (\${refused}/\${wanted.length})\`);

  console.log(\`\\nScore: \${score}/10 — \${score >= 7 ? 'PASS' : 'NOT YET'} (pass mark 7)\`);
  process.exitCode = score >= 7 ? 0 : 1;
} finally {
  rmSync(tmp, { recursive: true, force: true });
}`,
};
export const OUT = {
  'l2-flip': `$ node_modules/.bin/tsc --noEmit -p lab9/_flip
lab9/_flip/rules.ts(4,23): error TS7006: Parameter 'type' implicitly has an 'any' type.
lab9/_flip/rules.ts(6,10): error TS7053: Element implicitly has an 'any' type because expression of type 'any' can't be used to index type '{ VLOG: string; BLOG: string; CODE_REVIEW: string; }'.
lab9/_flip/rules.ts(9,10): error TS2532: Object is possibly 'undefined'.`,
  'l3-starter': `$ node scripts/cham-lab-9.mjs --from lab9/src
✓ A  tsc --noEmit: 0 errors (the CI gate passes) — 2/2
✗ B  tsconfig is tight (strict + noUncheckedIndexedAccess) — 0/1
    both must be true in compilerOptions
✗ C  no any/as/! and seed.ts imports ContentType — 0/1
    seed.ts declares its own ContentType — import it from content.ts instead
✓ D  behaviour tests pass (2/2) — 2/2
    ✗ S1 a parameter with no type (noImplicitAny) — expected TS7006, got no error
    ✗ S2 an implicit-any arrow parameter — expected TS7006, got no error
    ✗ S3 an unchecked array access — expected TS18048, got no error
    ✗ S4 a possibly-undefined value (strictNullChecks) — expected TS18048, got no error
    ✓ S5 the drifted literal 'CODE' — expected TS2322, got TS2322
    ✗ S6 a value that is not a ContentType — expected TS2345, got no error
    ✗ S7 the old enum value — expected TS2345, got no error
    ✗ S8 an unchecked record lookup — expected TS18048, got no error
✗ E  strict violations refused (1/8) — 0.5/4

Score: 4.5/10 — NOT YET (pass mark 7)`,
  'l4-yeu': `$ node scripts/cham-lab-9.mjs --from lab9/yeu
✓ A  tsc --noEmit: 0 errors (the CI gate passes) — 2/2
✗ B  tsconfig is tight (strict + noUncheckedIndexedAccess) — 0/1
    both must be true in compilerOptions
✓ C  no any/as/! and seed.ts imports ContentType — 1/1
✓ D  behaviour tests pass (2/2) — 2/2
    ✓ S1 a parameter with no type (noImplicitAny) — expected TS7006, got TS7006
    ✓ S2 an implicit-any arrow parameter — expected TS7006, got TS7006
    ✗ S3 an unchecked array access — expected TS18048, got no error
    ✓ S4 a possibly-undefined value (strictNullChecks) — expected TS18048, got TS18048
    ✓ S5 the drifted literal 'CODE' — expected TS2322, got TS2322
    ✓ S6 a value that is not a ContentType — expected TS2345, got TS2345
    ✓ S7 the old enum value — expected TS2345, got TS2345
    ✗ S8 an unchecked record lookup — expected TS18048, got no error
✗ E  strict violations refused (6/8) — 3/4

Score: 8/10 — PASS (pass mark 7)`,
  'l5-vua': `$ node scripts/cham-lab-9.mjs --from lab9/vua
✓ A  tsc --noEmit: 0 errors (the CI gate passes) — 2/2
✓ B  tsconfig is tight (strict + noUncheckedIndexedAccess) — 1/1
✗ C  no any/as/! and seed.ts imports ContentType — 0/1
    seed.ts declares its own ContentType — import it from content.ts instead
✓ D  behaviour tests pass (2/2) — 2/2
    ✓ S1 a parameter with no type (noImplicitAny) — expected TS7006, got TS7006
    ✓ S2 an implicit-any arrow parameter — expected TS7006, got TS7006
    ✓ S3 an unchecked array access — expected TS18048, got TS18048
    ✓ S4 a possibly-undefined value (strictNullChecks) — expected TS18048, got TS18048
    ✓ S5 the drifted literal 'CODE' — expected TS2322, got TS2322
    ✓ S6 a value that is not a ContentType — expected TS2345, got TS2345
    ✓ S7 the old enum value — expected TS2345, got TS2345
    ✓ S8 an unchecked record lookup — expected TS18048, got TS18048
✓ E  strict violations refused (8/8) — 4/4

Score: 9/10 — PASS (pass mark 7)`,
  'l6-ref': `$ node scripts/cham-lab-9.mjs --from lab9/giai
✓ A  tsc --noEmit: 0 errors (the CI gate passes) — 2/2
✓ B  tsconfig is tight (strict + noUncheckedIndexedAccess) — 1/1
✓ C  no any/as/! and seed.ts imports ContentType — 1/1
✓ D  behaviour tests pass (2/2) — 2/2
    ✓ S1 a parameter with no type (noImplicitAny) — expected TS7006, got TS7006
    ✓ S2 an implicit-any arrow parameter — expected TS7006, got TS7006
    ✓ S3 an unchecked array access — expected TS18048, got TS18048
    ✓ S4 a possibly-undefined value (strictNullChecks) — expected TS18048, got TS18048
    ✓ S5 the drifted literal 'CODE' — expected TS2322, got TS2322
    ✓ S6 a value that is not a ContentType — expected TS2345, got TS2345
    ✓ S7 the old enum value — expected TS2345, got TS2345
    ✓ S8 an unchecked record lookup — expected TS18048, got TS18048
✓ E  strict violations refused (8/8) — 4/4

Score: 10/10 — PASS (pass mark 7)`,
};
