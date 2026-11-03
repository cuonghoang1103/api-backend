/**
 * _ma (bài Lab 5) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "labTsconfig": `{
  "extends": "../tsconfig.json",
  "include": ["src", "test", "kiem/phai-dung.ts"]
}`,
  "starter": `// LabFlow — the booking lifecycle (a teammate's first version). It compiles under strict. Is it right?
import type { BookingRecord } from './model.ts';

// One wide object for every step. The optional fields say "sometimes there, sometimes not".
export type BookingState = {
  step: string; // 'draft' | 'invalid' | 'pending' | 'confirmed' | 'cancelled'
  code?: string; // only when invalid
  record?: BookingRecord; // absent for draft / invalid
  reason?: string; // only when cancelled
}; // +F keep this marker: the Lab 5 grader adds a state here

export type Step = string;
export type ActiveState = BookingState;

export function describe(state: BookingState): string {
  switch (state.step) {
    case 'draft':
      return 'Draft — nothing chosen yet';
    case 'invalid':
      return 'Invalid slot: ' + state.code;
    case 'pending':
      return 'Pending approval (#' + state.record?.id + ')';
    case 'confirmed':
      return 'Confirmed (#' + state.record?.id + ')';
    case 'cancelled':
      return 'Cancelled (#' + state.record?.id + '): ' + state.reason;
    default:
      return 'Unknown'; // a catch-all: a new step shows "Unknown" and nobody notices
  }
}

export function isActive(state: BookingState): boolean {
  return state.step === 'pending' || state.step === 'confirmed';
}

export function recordOf(state: BookingState): BookingRecord | null {
  return state.record ?? null;
}

export function canCancel(state: BookingState): boolean {
  return isActive(state);
}

export function cancel(state: BookingState, reason: string): BookingState {
  state.step = 'cancelled'; // changes the object it was given
  state.reason = reason;
  return state;
}

export const STEP_LABEL: { [step: string]: string } = {
  draft: 'Draft',
  invalid: 'Invalid',
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
};`,
  "sai": `// Lab 5 — eight uses that are WRONG. Your labelled union must make tsc refuse every one of them.
// The grader compiles this file against YOUR src/ and expects one error, with this code, on each marked line.
import { describe } from '../src/state.ts';
import type { BookingState, ActiveState } from '../src/state.ts';
import type { BookingRecord } from '../src/model.ts';

declare const rec: BookingRecord;
declare const s: BookingState;

describe({ step: 'pending' });                                            // S1 TS2345 pending must carry its record
describe({ step: 'cancelled', record: rec });                             // S2 TS2345 cancelled must carry a reason
describe({ step: 'draft', record: rec });                                 // S3 TS2353 a draft has no record
if (s.step === 'draft') { const id = s.record.id; void id; }              // S4 TS2339 a draft has no record to read
if (s.step === 'xpired') { void 0; }                                      // S5 TS2367 'xpired' is not one of the steps
function make(): BookingState { return { step: 'invalid' }; }             // S6 TS2322 an invalid state needs its code
const active: ActiveState = { step: 'cancelled', record: rec, reason: 'x' }; // S7 TS2322 cancelled is not an active state
describe({ step: 'confimed', record: rec });                              // S8 TS2820 a misspelled step
export { make, active };`,
  "dung": `// Lab 5 — CORRECT uses. They must keep compiling with your types (part B).
import { describe, recordOf, isActive, canCancel, cancel, STEP_LABEL } from '../src/state.ts';
import type { BookingState, ActiveState } from '../src/state.ts';
import type { BookingRecord } from '../src/model.ts';

declare const rec: BookingRecord;

// Every variant is valid, each with exactly the data its step carries.
const states: BookingState[] = [
  { step: 'draft' },
  { step: 'invalid', code: 'OFF_GRID' },
  { step: 'pending', record: rec },
  { step: 'confirmed', record: rec },
  { step: 'cancelled', record: rec, reason: 'room closed' },
];
for (const st of states) console.log(describe(st), STEP_LABEL[st.step]);

// Narrowing by the discriminant gives the record with no check — and no \`.record?.\`:
function idOf(st: BookingState): number | null {
  if (st.step === 'pending' || st.step === 'confirmed') return st.record.id;
  return null;
}

// The type predicate narrows the caller's variable to ActiveState.
declare const some: BookingState;
if (isActive(some)) {
  const active: ActiveState = some; // narrowed, no cast
  console.log(active.record.id);
}

const maybe: BookingRecord | null = recordOf({ step: 'draft' });
const ok: boolean = canCancel({ step: 'confirmed', record: rec });
const next: BookingState = cancel({ step: 'pending', record: rec }, 'exam week');
console.log(idOf(states[2] ?? { step: 'draft' }), maybe, ok, next.step);`,
  "grader": `// Lab 5 grader — "The booking state machine".   node scripts/cham-lab-5.mjs [--from <folder with state.ts>]
// Copies YOUR state.ts (plus the course's model.ts, booking.ts, schedule.ts, time.ts) into a fresh folder next to the grader-owned tests, then scores 10 points:
//   A  tsc: your state.ts compiles under the course tsconfig (strict) ........................ 2
//   B  tsc: the correct uses in kiem/phai-dung.ts still compile ............................ 1
//   C  honesty: no any, no "as" cast (as const is fine), no "!", no @ts- ................... 1
//   D  node --test: the behaviour tests in test/state.test.ts pass ........................ 2
//   E  the 8 wrong uses in kiem/sai.ts are each refused with the right code ............... 8 × 0.25
//   F  exhaustiveness: the grader ADDS a new step at the "// +F" marker, then recompiles —
//        F1 (1) a new error appears in state.ts (describe must end in assertNever, not a catch-all)
//        F2 (1) STEP_LABEL stops compiling too (it must be a closed Record keyed by the steps)
import { execFileSync } from 'node:child_process';
import { cpSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const i = process.argv.indexOf('--from');
const from = path.resolve(i > 0 ? process.argv[i + 1] : path.join(root, 'lab5/src'));
const tmp = path.join(root, '.cham-lab5');
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
  cpSync(path.join(from, 'state.ts'), path.join(tmp, 'src/state.ts'));
  for (const f of ['model.ts', 'booking.ts', 'schedule.ts', 'time.ts']) cpSync(path.join(root, 'src/rules', f), path.join(tmp, 'src', f));
  cpSync(path.join(root, 'lab5/test'), path.join(tmp, 'test'), { recursive: true });
  cpSync(path.join(root, 'lab5/kiem'), path.join(tmp, 'kiem'), { recursive: true });
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
  line(a.code === 0, a.code === 0 ? 2 : 0, 2, 'A  your state.ts compiles (strict)', a.code ? a.out : '');
  const b = tsc('b.json');
  const bErr = errorsIn(b.out, 'kiem/phai-dung.ts');
  line(bErr.length === 0, bErr.length === 0 ? 1 : 0, 1, 'B  correct uses still compile', bErr.join('\\n'));

  const src = codeOnly(readFileSync(path.join(tmp, 'src/state.ts'), 'utf8'));
  const cheats = [...src.matchAll(/\\bany\\b|@ts-(?:ignore|nocheck|expect-error)|\\bas\\s+(?!const\\b)\\w+|[\\w$]+!(?=[.[;,)\\s])|[)\\]]!(?=[.[;,)\\s])/g)].map((m) => m[0].trim());
  line(cheats.length === 0, cheats.length === 0 ? 1 : 0, 1, 'C  no any / as / ! / @ts-', cheats.length ? 'found: ' + [...new Set(cheats)].join(', ') : '');

  const d = run(process.execPath, ['--test', '--test-reporter=tap', 'test/state.test.ts']);
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
  line(refused === wanted.length, refused * 0.25, 2, \`E  wrong uses refused (\${refused}/\${wanted.length})\`);

  // Part F — add a brand-new step and see what refuses to compile.
  const stateSrc = readFileSync(path.join(tmp, 'src/state.ts'), 'utf8');
  if (!/;\\s*\\/\\/ \\+F/.test(stateSrc)) {
    line(false, 0, 2, 'F  exhaustiveness (add a new step)', 'the "// +F" marker is gone — keep it at the end of your BookingState union');
  } else {
    mkdirSync(path.join(tmp, 'srcF'));
    const patched = stateSrc.replace(/;(\\s*\\/\\/ \\+F[^\\n]*)/, " | { step: 'expired'; record: BookingRecord };$1");
    writeFileSync(path.join(tmp, 'srcF/state.ts'), patched);
    for (const f of ['model.ts', 'booking.ts', 'schedule.ts', 'time.ts']) cpSync(path.join(tmp, 'src', f), path.join(tmp, 'srcF', f));
    writeFileSync(path.join(tmp, 'f.json'), JSON.stringify({ ...base, include: ['srcF'] }));
    const f = tsc('f.json');
    const fErr = errorsIn(f.out, 'srcF/state.ts');
    const describeRed = fErr.length > 0;                                   // F1: any error at all (describe's assertNever fires)
    // F2: a SECOND place breaks too — the closed Record STEP_LABEL (open index signatures swallow the new key).
    const twoPlaces = new Set(fErr.map((l) => /\\((\\d+),/.exec(l)?.[1])).size >= 2;
    console.log(\`    \${describeRed ? '✓' : '✗'} F1 adding 'expired' makes state.ts fail to compile (exhaustive describe) — \${fErr.length} error(s)\`);
    console.log(\`    \${twoPlaces ? '✓' : '✗'} F2 both describe() and STEP_LABEL break (closed Record) — \${new Set(fErr.map((l) => /\\((\\d+),/.exec(l)?.[1])).size} place(s)\`);
    if (fErr.length) console.log('      ' + fErr.slice(0, 3).join('\\n      '));
    line(describeRed && twoPlaces, (describeRed ? 1 : 0) + (twoPlaces ? 1 : 0), 2, 'F  exhaustiveness (add a new step)');
  }

  console.log(\`\\nScore: \${score}/10 — \${score >= 7 ? 'PASS' : 'NOT YET'} (pass mark 7)\`);
  process.exitCode = score >= 7 ? 0 : 1;
} finally {
  rmSync(tmp, { recursive: true, force: true });
}`,
  "yeu": `// Attempt A — a real labelled union, but a catch-all default and an in-place cancel.
import type { BookingRecord } from '../src/model.ts';
import type { SlotCode } from '../src/booking.ts';

export type BookingState =
  | { step: 'draft' }
  | { step: 'invalid'; code: SlotCode }
  | { step: 'pending'; record: BookingRecord }
  | { step: 'confirmed'; record: BookingRecord }
  | { step: 'cancelled'; record: BookingRecord; reason: string }; // +F keep this marker

export type Step = BookingState['step'];
export type ActiveState =
  | { step: 'pending'; record: BookingRecord }
  | { step: 'confirmed'; record: BookingRecord };

export function describe(state: BookingState): string {
  switch (state.step) {
    case 'draft':
      return 'Draft — nothing chosen yet';
    case 'invalid':
      return 'Invalid slot: ' + state.code;
    case 'pending':
      return 'Pending approval (#' + state.record.id + ')';
    case 'confirmed':
      return 'Confirmed (#' + state.record.id + ')';
    case 'cancelled':
      return 'Cancelled (#' + state.record.id + '): ' + state.reason;
    default:
      return 'Unknown'; // a catch-all — a new step quietly shows "Unknown"
  }
}

export function isActive(state: BookingState): state is ActiveState {
  return state.step === 'pending' || state.step === 'confirmed';
}

export function recordOf(state: BookingState): BookingRecord | null {
  return 'record' in state ? state.record : null;
}

export function canCancel(state: BookingState): boolean {
  return isActive(state);
}

export function cancel(state: BookingState, reason: string): BookingState {
  if (!isActive(state)) return state;
  return { step: 'cancelled', record: state.record, reason };
}

// An open table — a new step is just another allowed key.
export const STEP_LABEL: { [step: string]: string } = {
  draft: 'Draft',
  invalid: 'Invalid',
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
};`,
  "vua": `// Attempt B — an exhaustive union with assertNever, but an open label table.
import type { BookingRecord } from '../src/model.ts';
import type { SlotCode } from '../src/booking.ts';

export type BookingState =
  | { step: 'draft' }
  | { step: 'invalid'; code: SlotCode }
  | { step: 'pending'; record: BookingRecord }
  | { step: 'confirmed'; record: BookingRecord }
  | { step: 'cancelled'; record: BookingRecord; reason: string }; // +F keep this marker

export type Step = BookingState['step'];
export type ActiveState =
  | { step: 'pending'; record: BookingRecord }
  | { step: 'confirmed'; record: BookingRecord };

export function describe(state: BookingState): string {
  switch (state.step) {
    case 'draft':
      return 'Draft — nothing chosen yet';
    case 'invalid':
      return 'Invalid slot: ' + state.code;
    case 'pending':
      return 'Pending approval (#' + state.record.id + ')';
    case 'confirmed':
      return 'Confirmed (#' + state.record.id + ')';
    case 'cancelled':
      return 'Cancelled (#' + state.record.id + '): ' + state.reason;
    default:
      return assertNever(state);
  }
}

export function assertNever(x: never): never {
  throw new Error('Unhandled booking state: ' + JSON.stringify(x));
}

export function isActive(state: BookingState): state is ActiveState {
  return state.step === 'pending' || state.step === 'confirmed';
}

export function recordOf(state: BookingState): BookingRecord | null {
  return 'record' in state ? state.record : null;
}

export function canCancel(state: BookingState): boolean {
  return isActive(state);
}

export function cancel(state: BookingState, reason: string): BookingState {
  if (!isActive(state)) return state;
  return { step: 'cancelled', record: state.record, reason };
}

// An open table — nothing forces an entry for a new step, so one can ship unlabelled.
export const STEP_LABEL: { [step: string]: string } = {
  draft: 'Draft',
  invalid: 'Invalid',
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
};`,
  "ref": `// LabFlow — the booking lifecycle as a labelled (discriminated) union (Chapter 5, = Lab 5 reference solution).
import type { BookingRecord } from './model.ts';
import type { SlotCode } from './booking.ts';

// One booking request moves through a few steps, and each step carries ONLY the data it has:
// a draft has nothing yet; an invalid request keeps the reason the slot failed; the three stored
// steps carry the BookingRecord; a cancelled one also carries a reason. \`step\` is the DISCRIMINANT
// (nhãn) — the one field every member shares with a different literal, so a single test on it
// narrows the whole object.
export type BookingState =
  | { step: 'draft' }
  | { step: 'invalid'; code: SlotCode }
  | { step: 'pending'; record: BookingRecord }
  | { step: 'confirmed'; record: BookingRecord }
  | { step: 'cancelled'; record: BookingRecord; reason: string }; // +F keep this marker: Lab 5 grader adds a state here

// The set of labels, derived from the union — never copied by hand.
export type Step = BookingState['step'];

// The two "live" steps a booking can still be acted on. Named so a type predicate can point at it.
export type ActiveState =
  | { step: 'pending'; record: BookingRecord }
  | { step: 'confirmed'; record: BookingRecord };

// A one-line description. The switch is EXHAUSTIVE: every known step returns, and the default hands
// an impossible value to assertNever — so adding a step to the union turns this line into a compile error.
export function describe(state: BookingState): string {
  switch (state.step) {
    case 'draft':
      return 'Draft — nothing chosen yet';
    case 'invalid':
      return 'Invalid slot: ' + state.code;
    case 'pending':
      return 'Pending approval (#' + state.record.id + ')';
    case 'confirmed':
      return 'Confirmed (#' + state.record.id + ')';
    case 'cancelled':
      return 'Cancelled (#' + state.record.id + '): ' + state.reason;
    default:
      return assertNever(state);
  }
}

// An assertion function: giving it anything other than \`never\` is a compile error, and at runtime it throws.
export function assertNever(x: never): never {
  throw new Error('Unhandled booking state: ' + JSON.stringify(x));
}

// A type predicate (vị từ kiểu): the \`state is ActiveState\` return tells tsc to narrow the caller's variable.
export function isActive(state: BookingState): state is ActiveState {
  return state.step === 'pending' || state.step === 'confirmed';
}

// Not every state has a record (draft and invalid do not). \`'record' in state\` narrows to the ones that do.
export function recordOf(state: BookingState): BookingRecord | null {
  return 'record' in state ? state.record : null;
}

export function canCancel(state: BookingState): boolean {
  return isActive(state);
}

// A transition: cancel a live booking. The return is a NEW state; the input is never changed in place.
export function cancel(state: BookingState, reason: string): BookingState {
  if (!isActive(state)) return state;
  return { step: 'cancelled', record: state.record, reason };
}

// A closed label table keyed by the union's own steps — add a step and this breaks too (a missing key).
export const STEP_LABEL: Record<Step, string> = {
  draft: 'Draft',
  invalid: 'Invalid',
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
};`,
  "test": `import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { BookingRecord } from '../src/model.ts';
import { describe, recordOf, isActive, canCancel, cancel, STEP_LABEL } from '../src/state.ts';
import type { BookingState } from '../src/state.ts';

const rec: BookingRecord = {
  id: 10,
  createdAt: '2026-11-03T09:00:00Z',
  lab: 'BE-201',
  userId: 1,
  range: [480, 600],
  seats: 30,
  status: 'PENDING',
  note: null,
};

test('describe covers every step', () => {
  assert.equal(describe({ step: 'draft' }), 'Draft — nothing chosen yet');
  assert.equal(describe({ step: 'invalid', code: 'OFF_GRID' }), 'Invalid slot: OFF_GRID');
  assert.equal(describe({ step: 'pending', record: rec }), 'Pending approval (#10)');
  assert.equal(describe({ step: 'confirmed', record: rec }), 'Confirmed (#10)');
  assert.equal(describe({ step: 'cancelled', record: rec, reason: 'room closed' }), 'Cancelled (#10): room closed');
});

test('recordOf returns the record only where there is one', () => {
  assert.equal(recordOf({ step: 'draft' }), null);
  assert.equal(recordOf({ step: 'invalid', code: 'TOO_LONG' }), null);
  assert.equal(recordOf({ step: 'pending', record: rec }), rec);
  assert.equal(recordOf({ step: 'cancelled', record: rec, reason: 'x' }), rec);
});

test('isActive is true only for pending and confirmed', () => {
  assert.equal(isActive({ step: 'draft' }), false);
  assert.equal(isActive({ step: 'invalid', code: 'OFF_GRID' }), false);
  assert.equal(isActive({ step: 'pending', record: rec }), true);
  assert.equal(isActive({ step: 'confirmed', record: rec }), true);
  assert.equal(isActive({ step: 'cancelled', record: rec, reason: 'x' }), false);
});

test('canCancel matches isActive', () => {
  assert.equal(canCancel({ step: 'confirmed', record: rec }), true);
  assert.equal(canCancel({ step: 'draft' }), false);
});

test('cancel returns a NEW cancelled state and leaves the input alone', () => {
  const before: BookingState = { step: 'confirmed', record: rec };
  const after = cancel(before, 'exam week');
  assert.deepEqual(after, { step: 'cancelled', record: rec, reason: 'exam week' });
  assert.equal(before.step, 'confirmed'); // input must not be mutated
  assert.notEqual(after, before);
});

test('cancel is a no-op for states that cannot be cancelled', () => {
  const draft: BookingState = { step: 'draft' };
  assert.equal(cancel(draft, 'why'), draft);
});

test('STEP_LABEL has one entry per step', () => {
  assert.deepEqual(Object.keys(STEP_LABEL).sort(), ['cancelled', 'confirmed', 'draft', 'invalid', 'pending']);
  assert.equal(STEP_LABEL.pending, 'Pending');
});`,
};
export const OUT = {
  'l1-npm-ci': `$ npm ci

added 4 packages, and audited 5 packages in 651ms

found 0 vulnerabilities`,
  'l2-starter-tsc': `$ npx tsc -p lab5/tsconfig.src.json`,
  'l3-starter': `$ node scripts/cham-lab-5.mjs --from lab5/src
✓ A  your state.ts compiles (strict) — 2/2
✗ B  correct uses still compile — 0/1
    kiem/phai-dung.ts(20,64): error TS18048: 'st.record' is possibly 'undefined'.
    kiem/phai-dung.ts(28,15): error TS18048: 'active.record' is possibly 'undefined'.
✓ C  no any / as / ! / @ts- — 1/1
✗ D  behaviour tests pass (6/7) — 0/2
    failed: cancel returns a NEW cancelled state and leaves the input alone
    ✗ S1 pending must carry its record — expected TS2345, got no error
    ✗ S2 cancelled must carry a reason — expected TS2345, got no error
    ✗ S3 a draft has no record — expected TS2353, got no error
    ✗ S4 a draft has no record to read — expected TS2339, got TS18048
    ✗ S5 'xpired' is not one of the steps — expected TS2367, got no error
    ✗ S6 an invalid state needs its code — expected TS2322, got no error
    ✗ S7 cancelled is not an active state — expected TS2322, got no error
    ✗ S8 a misspelled step — expected TS2820, got no error
✗ E  wrong uses refused (0/8) — 0/2
    ✓ F1 adding 'expired' makes state.ts fail to compile (exhaustive describe) — 1 error(s)
    ✗ F2 both describe() and STEP_LABEL break (closed Record) — 1 place(s)
      srcF/state.ts(46,9): error TS2339: Property 'reason' does not exist on type 'BookingState'.
✗ F  exhaustiveness (add a new step) — 1/2

Score: 4/10 — NOT YET (pass mark 7)`,
  'l4-yeu': `$ node scripts/cham-lab-5.mjs --from lab5/yeu
✓ A  your state.ts compiles (strict) — 2/2
✓ B  correct uses still compile — 1/1
✓ C  no any / as / ! / @ts- — 1/1
✓ D  behaviour tests pass (7/7) — 2/2
    ✓ S1 pending must carry its record — expected TS2345, got TS2345
    ✓ S2 cancelled must carry a reason — expected TS2345, got TS2345
    ✓ S3 a draft has no record — expected TS2353, got TS2353
    ✓ S4 a draft has no record to read — expected TS2339, got TS2339
    ✓ S5 'xpired' is not one of the steps — expected TS2367, got TS2367
    ✓ S6 an invalid state needs its code — expected TS2322, got TS2322
    ✓ S7 cancelled is not an active state — expected TS2322, got TS2322
    ✓ S8 a misspelled step — expected TS2820, got TS2820
✓ E  wrong uses refused (8/8) — 2/2
    ✗ F1 adding 'expired' makes state.ts fail to compile (exhaustive describe) — 0 error(s)
    ✗ F2 both describe() and STEP_LABEL break (closed Record) — 0 place(s)
✗ F  exhaustiveness (add a new step) — 0/2

Score: 8/10 — PASS (pass mark 7)`,
  'l5-vua': `$ node scripts/cham-lab-5.mjs --from lab5/vua
✓ A  your state.ts compiles (strict) — 2/2
✓ B  correct uses still compile — 1/1
✓ C  no any / as / ! / @ts- — 1/1
✓ D  behaviour tests pass (7/7) — 2/2
    ✓ S1 pending must carry its record — expected TS2345, got TS2345
    ✓ S2 cancelled must carry a reason — expected TS2345, got TS2345
    ✓ S3 a draft has no record — expected TS2353, got TS2353
    ✓ S4 a draft has no record to read — expected TS2339, got TS2339
    ✓ S5 'xpired' is not one of the steps — expected TS2367, got TS2367
    ✓ S6 an invalid state needs its code — expected TS2322, got TS2322
    ✓ S7 cancelled is not an active state — expected TS2322, got TS2322
    ✓ S8 a misspelled step — expected TS2820, got TS2820
✓ E  wrong uses refused (8/8) — 2/2
    ✓ F1 adding 'expired' makes state.ts fail to compile (exhaustive describe) — 1 error(s)
    ✗ F2 both describe() and STEP_LABEL break (closed Record) — 1 place(s)
      srcF/state.ts(30,26): error TS2345: Argument of type '{ step: "expired"; record: BookingRecord; }' is not assignable to parameter of type 'never'.
✗ F  exhaustiveness (add a new step) — 1/2

Score: 9/10 — PASS (pass mark 7)`,
  'l6-ref': `$ node scripts/cham-lab-5.mjs --from src/rules
✓ A  your state.ts compiles (strict) — 2/2
✓ B  correct uses still compile — 1/1
✓ C  no any / as / ! / @ts- — 1/1
✓ D  behaviour tests pass (7/7) — 2/2
    ✓ S1 pending must carry its record — expected TS2345, got TS2345
    ✓ S2 cancelled must carry a reason — expected TS2345, got TS2345
    ✓ S3 a draft has no record — expected TS2353, got TS2353
    ✓ S4 a draft has no record to read — expected TS2339, got TS2339
    ✓ S5 'xpired' is not one of the steps — expected TS2367, got TS2367
    ✓ S6 an invalid state needs its code — expected TS2322, got TS2322
    ✓ S7 cancelled is not an active state — expected TS2322, got TS2322
    ✓ S8 a misspelled step — expected TS2820, got TS2820
✓ E  wrong uses refused (8/8) — 2/2
    ✓ F1 adding 'expired' makes state.ts fail to compile (exhaustive describe) — 2 error(s)
    ✓ F2 both describe() and STEP_LABEL break (closed Record) — 2 place(s)
      srcF/state.ts(40,26): error TS2345: Argument of type '{ step: "expired"; record: BookingRecord; }' is not assignable to parameter of type 'never'.
      srcF/state.ts(70,14): error TS2741: Property 'expired' is missing in type '{ draft: string; invalid: string; pending: string; confirmed: string; cancelled: string; }' but required in type 'Record<"cancelled" | "confirmed" | "draft" | "expired" | "invalid" | "pending", string>'.
✓ F  exhaustiveness (add a new step) — 2/2

Score: 10/10 — PASS (pass mark 7)`,
};
