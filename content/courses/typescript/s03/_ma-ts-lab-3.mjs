/**
 * _ma (bài Lab 3) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "starter": `// LabFlow — check a booking request with a list of rules.
// A teammate's first version: it runs, but the function types are guesses. Lab 3: type it properly.
import { parseTime } from './time.ts';
import { OPEN, CLOSE, STEP, MAX_MINUTES } from './booking.ts';
import type { BookingInput } from './booking.ts';

export type Problem = { code: string; message: string };
export type Rule = Function;

// One "HH:MM" -> minutes, or a list of them -> a list of minutes.
export function toMinutes(value: string | string[]): number | number[] {
  return typeof value === 'string' ? parseTime(value) : value.map((t) => parseTime(t));
}

export const onGrid = ({ start, end }: BookingInput) =>
  parseTime(start) % STEP !== 0 || parseTime(end) % STEP !== 0
    ? { code: 'OFF_GRID', message: 'Start and end must be on the 30-minute grid' }
    : null;

export const endAfterStart = ({ start, end }: BookingInput) =>
  parseTime(end) <= parseTime(start) ? { code: 'END_BEFORE_START', message: 'End must be after start' } : null;

export const withinHours = ({ start, end }: BookingInput) =>
  parseTime(start) < OPEN || parseTime(end) > CLOSE
    ? { code: 'OUTSIDE_HOURS', message: 'Labs are open 07:00–21:00' }
    : null;

export const notTooLong = ({ start, end }: BookingInput) =>
  parseTime(end) - parseTime(start) > MAX_MINUTES ? { code: 'TOO_LONG', message: 'At most 4 hours' } : null;

export function maxSeats(limit) {
  return ({ seats }: BookingInput) => (seats >= limit ? { code: 'TOO_MANY_SEATS', message: 'At most ' + limit + ' seats' } : null);
}

export const RULES: Rule[] = [onGrid, endAfterStart, withinHours, notTooLong, maxSeats(40)];

export function validate(input: BookingInput, rules: Rule[], onProblem?: Function): Problem[] {
  for (const rule of rules) {
    const problem = rule(input);
    if (problem !== null) {
      if (onProblem) onProblem(problem);
      return [problem];
    }
  }
  return [];
}

export function totalMinutes(...ranges) {
  let total = 0;
  for (const [start, end] of ranges) total += end - start;
  return total;
}

export function createValidator(rules: Rule[]) {
  return {
    rules,
    run(input: BookingInput) {
      return validate(input, this.rules);
    },
  };
}`,
  "test": `// Lab 3 — behaviour of the rule list. Run: node --test --test-reporter=spec lab3/test/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toMinutes, validate, maxSeats, onGrid, endAfterStart, withinHours, notTooLong, totalMinutes, createValidator, RULES } from '../src/validate.ts';
import type { BookingInput } from '../src/booking.ts';

const ok: BookingInput = { lab: 'BE-201', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };
const codes = (input: BookingInput) => validate(input, RULES).map((p) => p.code);

test('toMinutes: one time', () => assert.equal(toMinutes('08:30'), 510));
test('toMinutes: a list of times', () => assert.deepEqual(toMinutes(['07:00', '21:00']), [420, 1260]));
test('a good request has no problems', () => assert.deepEqual(validate(ok, RULES), []));
test('each rule alone', () => {
  assert.equal(onGrid({ ...ok, start: '08:15' })?.code, 'OFF_GRID');
  assert.equal(endAfterStart({ ...ok, end: '07:30' })?.code, 'END_BEFORE_START');
  assert.equal(withinHours({ ...ok, start: '06:00' })?.code, 'OUTSIDE_HOURS');
  assert.equal(notTooLong({ ...ok, end: '12:30' })?.code, 'TOO_LONG');
});
test('validate collects EVERY problem, in rule order', () =>
  assert.deepEqual(codes({ ...ok, start: '06:15', end: '06:00' }), ['OFF_GRID', 'END_BEFORE_START', 'OUTSIDE_HOURS']));
test('maxSeats(40): exactly 40 seats is allowed', () => assert.equal(maxSeats(40)({ ...ok, seats: 40 }), null));
test('maxSeats(40): 41 seats is a problem', () => assert.equal(maxSeats(40)({ ...ok, seats: 41 })?.code, 'TOO_MANY_SEATS'));
test('onProblem hears each problem once', () => {
  const heard: string[] = [];
  validate({ ...ok, start: '08:15', seats: 99 }, RULES, (p) => heard.push(p.code));
  assert.deepEqual(heard, ['OFF_GRID', 'TOO_MANY_SEATS']);
});
test('totalMinutes: none, one, two ranges', () => {
  assert.equal(totalMinutes(), 0);
  assert.equal(totalMinutes([480, 600]), 120);
  assert.equal(totalMinutes([480, 600], [660, 720]), 180);
});
test('createValidator: run uses the validator’s own rules', () => {
  const v = createValidator([maxSeats(10)]);
  assert.deepEqual(v.run(ok).map((p) => p.code), ['TOO_MANY_SEATS']);
});`,
  "dung": `// Lab 3 — CORRECT uses. They must keep compiling with your types (part B).
import { toMinutes, validate, maxSeats, onGrid, totalMinutes, createValidator, RULES } from '../src/validate.ts';
import type { Problem, Rule } from '../src/validate.ts';
import type { BookingInput } from '../src/booking.ts';

const input: BookingInput = { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' };

const start: number = toMinutes('08:00');                    // one time in, one number out
const all: number[] = toMinutes(['08:00', '10:00']);          // a list in, a list out
const problems: Problem[] = validate(input, RULES);

const log: Problem[] = [];
validate(input, [onGrid, maxSeats(30)], (p) => log.push(p)); // the callback's result (push returns a number) is ignored

const studentLimit: Rule = (b) =>
  b.role === 'STUDENT' && b.seats > 35 ? { code: 'TOO_MANY_SEATS', message: 'Students: at most 35 seats' } : null;
validate(input, [...RULES, studentLimit]);

const none: number = totalMinutes();                          // no range at all is fine: 0
const two: number = totalMinutes([480, 600], [600, 720]);

const v = createValidator(RULES);
const fromValidator: Problem[] = v.run(input);                // called ON the validator
console.log(start, all, problems, log, none, two, fromValidator);`,
  "sai": `// Lab 3 — eight uses that are WRONG. Your types must make tsc refuse every one of them.
// The grader compiles this file against YOUR src/ and expects one error, with this code, on each marked line.
import { toMinutes, validate, maxSeats, totalMinutes, createValidator, RULES } from '../src/validate.ts';
import type { BookingInput } from '../src/booking.ts';

declare const input: BookingInput;

validate(input, [(seats: number) => null]);                  // S1 TS2322 a rule receives the whole request
validate(input, [() => 'TOO_LONG']);                         // S2 TS2322 a rule returns a Problem or null
const one: number = toMinutes(['08:00']);                    // S3 TS2322 a list in, a list out
toMinutes(480);                                              // S4 TS2769 minutes are not "HH:MM"
maxSeats('30');                                              // S5 TS2345 the limit is a number
totalMinutes([480, 600], 720);                               // S6 TS2345 every argument is a [start, end] range
validate(input);                                             // S7 TS2554 which rules?
const run = createValidator(RULES).run; run(input);          // S8 TS2684 run must be called on its validator`,
  "saiChay": `// The eight wrong uses of Lab 3, RUN by Node against the teammate's starter (lab3/src/validate.ts).
// Node strips the types and runs the JavaScript — nothing is checked. What does each one do?
import { toMinutes, validate, maxSeats, totalMinutes, createValidator, RULES } from '../../lab3/src/validate.ts';

const input = { lab: 'BE-201', seats: 45, role: 'STUDENT', start: '08:00', end: '10:00' };

function show(label: string, run: () => unknown): void {
  try {
    console.log(label.padEnd(40), '→', JSON.stringify(run()));
  } catch (e) {
    console.log(label.padEnd(40), '→ throws', String(e));
  }
}

show('S1 a rule that takes (seats: number)', () => validate(input, [(seats: number) => (seats > 40 ? 'too many' : null)]));
show("S2 a rule that returns 'TOO_LONG'", () => validate(input, [() => 'TOO_LONG']));
show("S3 toMinutes(['08:00']) + 30", () => toMinutes(['08:00']) + 30);
show('S4 toMinutes(480)', () => toMinutes(480));
show("S5 maxSeats('30') on 45 seats", () => maxSeats('30')(input));
show('S6 totalMinutes([480, 600], 720)', () => totalMinutes([480, 600], 720));
show('S7 validate(input)', () => validate(input));
show('S8 const run = v.run; run(input)', () => { const run = createValidator(RULES).run; return run(input); });`,
  "yeu": `// LabFlow — check a booking request with a list of rules.
// Lab 3 — attempt A ("yếu" = weak): the two logic bugs are fixed, and every function type became "anything in, anything out".
import { parseTime } from './time.ts';
import { OPEN, CLOSE, STEP, MAX_MINUTES } from './booking.ts';
import type { BookingInput } from './booking.ts';

export type Problem = { code: string; message: string };
export type Rule = (...args: any[]) => any;

// One "HH:MM" -> minutes, or a list of them -> a list of minutes.
export function toMinutes(value: string | string[]): number | number[] {
  return typeof value === 'string' ? parseTime(value) : value.map((t) => parseTime(t));
}

export const onGrid = ({ start, end }: BookingInput) =>
  parseTime(start) % STEP !== 0 || parseTime(end) % STEP !== 0
    ? { code: 'OFF_GRID', message: 'Start and end must be on the 30-minute grid' }
    : null;

export const endAfterStart = ({ start, end }: BookingInput) =>
  parseTime(end) <= parseTime(start) ? { code: 'END_BEFORE_START', message: 'End must be after start' } : null;

export const withinHours = ({ start, end }: BookingInput) =>
  parseTime(start) < OPEN || parseTime(end) > CLOSE
    ? { code: 'OUTSIDE_HOURS', message: 'Labs are open 07:00–21:00' }
    : null;

export const notTooLong = ({ start, end }: BookingInput) =>
  parseTime(end) - parseTime(start) > MAX_MINUTES ? { code: 'TOO_LONG', message: 'At most 4 hours' } : null;

export function maxSeats(limit: number) {
  return ({ seats }: BookingInput) => (seats > limit ? { code: 'TOO_MANY_SEATS', message: 'At most ' + limit + ' seats' } : null);
}

export const RULES: Rule[] = [onGrid, endAfterStart, withinHours, notTooLong, maxSeats(40)];

export function validate(input: BookingInput, rules: Rule[], onProblem?: (problem: Problem) => void): Problem[] {
  const problems: Problem[] = [];
  for (const rule of rules) {
    const problem = rule(input);
    if (problem !== null) {
      problems.push(problem);
      onProblem?.(problem);
    }
  }
  return problems;
}

export function totalMinutes(...ranges: number[][]): number {
  let total = 0;
  for (const [start = 0, end = 0] of ranges) total += end - start;
  return total;
}

export function createValidator(rules: Rule[]) {
  return {
    rules,
    run(input: BookingInput) {
      return validate(input, this.rules);
    },
  };
}`,
  "vua": `// LabFlow — check a booking request with a list of rules.
// Lab 3 — attempt B ("vừa" = so-so): honest function types for the rules, but toMinutes still returns a union
// and run() can still be torn off its validator.
import { parseTime } from './time.ts';
import { OPEN, CLOSE, STEP, MAX_MINUTES } from './booking.ts';
import type { BookingInput } from './booking.ts';
import type { TimeRange } from './schedule.ts';

export type Problem = { code: string; message: string };
export type Rule = (input: BookingInput) => Problem | null;

// One "HH:MM" -> minutes, or a list of them -> a list of minutes.
export function toMinutes(value: string | string[]): number | number[] {
  return typeof value === 'string' ? parseTime(value) : value.map((t) => parseTime(t));
}

export const onGrid: Rule = ({ start, end }: BookingInput) =>
  parseTime(start) % STEP !== 0 || parseTime(end) % STEP !== 0
    ? { code: 'OFF_GRID', message: 'Start and end must be on the 30-minute grid' }
    : null;

export const endAfterStart: Rule = ({ start, end }: BookingInput) =>
  parseTime(end) <= parseTime(start) ? { code: 'END_BEFORE_START', message: 'End must be after start' } : null;

export const withinHours: Rule = ({ start, end }: BookingInput) =>
  parseTime(start) < OPEN || parseTime(end) > CLOSE
    ? { code: 'OUTSIDE_HOURS', message: 'Labs are open 07:00–21:00' }
    : null;

export const notTooLong: Rule = ({ start, end }: BookingInput) =>
  parseTime(end) - parseTime(start) > MAX_MINUTES ? { code: 'TOO_LONG', message: 'At most 4 hours' } : null;

export function maxSeats(limit: number): Rule {
  return ({ seats }) => (seats > limit ? { code: 'TOO_MANY_SEATS', message: 'At most ' + limit + ' seats' } : null);
}

export const RULES: Rule[] = [onGrid, endAfterStart, withinHours, notTooLong, maxSeats(40)];

export function validate(input: BookingInput, rules: Rule[], onProblem?: (problem: Problem) => void): Problem[] {
  const problems: Problem[] = [];
  for (const rule of rules) {
    const problem = rule(input);
    if (problem !== null) {
      problems.push(problem);
      onProblem?.(problem);
    }
  }
  return problems;
}

export function totalMinutes(...ranges: TimeRange[]): number {
  let total = 0;
  for (const [start, end] of ranges) total += end - start;
  return total;
}

export function createValidator(rules: Rule[]) {
  return {
    rules,
    run(input: BookingInput) {
      return validate(input, this.rules);
    },
  };
}`,
  "ref": `// LabFlow — check a booking request with a LIST OF RULES (Chapter 3, = Lab 3 reference solution).
import { parseTime } from './time.ts';
import { OPEN, CLOSE, STEP, MAX_MINUTES } from './booking.ts';
import type { BookingInput } from './booking.ts';
import type { TimeRange } from './schedule.ts';

export type ProblemCode = 'OFF_GRID' | 'END_BEFORE_START' | 'OUTSIDE_HOURS' | 'TOO_LONG' | 'TOO_MANY_SEATS';
export type Problem = { code: ProblemCode; message: string };

// A rule looks at one request and returns a problem, or null when the request is fine.
export type Rule = (input: BookingInput) => Problem | null;

// Overloads: one time in, one number out — a list in, a list out.
export function toMinutes(text: string): number;
export function toMinutes(texts: readonly string[]): number[];
export function toMinutes(value: string | readonly string[]): number | number[] {
  return typeof value === 'string' ? parseTime(value) : value.map((t) => parseTime(t));
}

export const onGrid: Rule = ({ start, end }) =>
  toMinutes(start) % STEP !== 0 || toMinutes(end) % STEP !== 0
    ? { code: 'OFF_GRID', message: 'Start and end must be on the 30-minute grid' }
    : null;

export const endAfterStart: Rule = ({ start, end }) =>
  toMinutes(end) <= toMinutes(start) ? { code: 'END_BEFORE_START', message: 'End must be after start' } : null;

export const withinHours: Rule = ({ start, end }) =>
  toMinutes(start) < OPEN || toMinutes(end) > CLOSE
    ? { code: 'OUTSIDE_HOURS', message: 'Labs are open 07:00–21:00' }
    : null;

export const notTooLong: Rule = ({ start, end }) =>
  toMinutes(end) - toMinutes(start) > MAX_MINUTES ? { code: 'TOO_LONG', message: 'At most 4 hours' } : null;

// A function that RETURNS a rule: the limit is remembered by the closure.
export function maxSeats(limit: number): Rule {
  return ({ seats }) => (seats > limit ? { code: 'TOO_MANY_SEATS', message: 'At most ' + limit + ' seats' } : null);
}

export const RULES: readonly Rule[] = [onGrid, endAfterStart, withinHours, notTooLong, maxSeats(40)];

// Runs EVERY rule and collects every problem. onProblem (optional) hears about each one; its result is ignored.
export function validate(input: BookingInput, rules: readonly Rule[], onProblem?: (problem: Problem) => void): Problem[] {
  const problems: Problem[] = [];
  for (const rule of rules) {
    const problem = rule(input);
    if (problem !== null) {
      problems.push(problem);
      onProblem?.(problem);
    }
  }
  return problems;
}

// Any number of ranges, each [start, end]: total booked minutes.
export function totalMinutes(...ranges: TimeRange[]): number {
  let total = 0;
  for (const [start, end] of ranges) total += end - start;
  return total;
}

// A validator remembers its rules; run must be called ON the validator (this).
export type Validator = { rules: readonly Rule[]; run(this: Validator, input: BookingInput): Problem[] };

export function createValidator(rules: readonly Rule[]): Validator {
  return {
    rules,
    run(input) {
      return validate(input, this.rules);
    },
  };
}`,
  "grader": `// Lab 3 grader — "Booking rules as an array of functions".   node scripts/cham-lab-3.mjs [--from <folder with validate.ts>]
// Copies YOUR validate.ts (plus the course's time.ts, booking.ts, schedule.ts) into a fresh folder next to the grader-owned tests, then scores 10 points:
//   A  tsc: your file compiles under the course tsconfig (strict) ........................ 2
//   B  tsc: the correct uses in kiem/phai-dung.ts still compile ............................ 1
//   C  honesty: no any, no Function type, no "as" cast (as const is fine), no "!", no @ts- . 1
//   D  node --test: the 10 behaviour tests in test/validate.test.ts pass ................... 2
//   E  the 8 wrong uses in kiem/sai.ts are each refused with the right code ............... 8 × 0.5
import { execFileSync } from 'node:child_process';
import { cpSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const i = process.argv.indexOf('--from');
const from = path.resolve(i > 0 ? process.argv[i + 1] : path.join(root, 'lab3/src'));
const tmp = path.join(root, '.cham-lab3');
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
// Code only: comments and string literals removed, so "as" or "!" inside them does not count.
const codeOnly = (s) => s.replace(/\\/\\*[\\s\\S]*?\\*\\//g, '').replace(/\\/\\/.*$/gm, '').replace(/'(?:[^'\\n\\\\]|\\\\.)*'|"(?:[^"\\n\\\\]|\\\\.)*"/g, "''");

try {
  mkdirSync(path.join(tmp, 'src'));
  cpSync(path.join(from, 'validate.ts'), path.join(tmp, 'src/validate.ts'));
  for (const f of ['time.ts', 'booking.ts', 'schedule.ts']) cpSync(path.join(root, 'src/rules', f), path.join(tmp, 'src', f));
  cpSync(path.join(root, 'lab3/test'), path.join(tmp, 'test'), { recursive: true });
  cpSync(path.join(root, 'lab3/kiem'), path.join(tmp, 'kiem'), { recursive: true });
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
  line(a.code === 0, a.code === 0 ? 2 : 0, 2, 'A  your validate.ts compiles (strict)', a.code ? a.out : '');
  const b = tsc('b.json');
  const bErr = errorsIn(b.out, 'kiem/phai-dung.ts');
  line(bErr.length === 0, bErr.length === 0 ? 1 : 0, 1, 'B  correct uses still compile', bErr.join('\\n'));

  const src = codeOnly(readFileSync(path.join(tmp, 'src/validate.ts'), 'utf8'));
  const cheats = [...src.matchAll(/\\bany\\b|\\bFunction\\b|@ts-(?:ignore|nocheck|expect-error)|\\bas\\s+(?!const\\b)\\w+|[\\w$]+!(?=[.[;,)\\s])|[)\\]]!(?=[.[;,)\\s])/g)].map((m) => m[0].trim());
  line(cheats.length === 0, cheats.length === 0 ? 1 : 0, 1, 'C  no any / Function / as / ! / @ts-', cheats.length ? 'found: ' + [...new Set(cheats)].join(', ') : '');

  const d = run(process.execPath, ['--test', '--test-reporter=tap', 'test/validate.test.ts']);
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
  "labTsconfig": `{
  "extends": "../tsconfig.json",
  "include": ["src", "test", "kiem/phai-dung.ts"]
}`,
};
export const OUT = {
  'l1-npm-ci': `$ npm ci

added 4 packages, and audited 5 packages in 23s

found 0 vulnerabilities
npm notice
npm notice New major version of npm available! 10.9.9 -> 12.2.1
npm notice Changelog: https://github.com/npm/cli/releases/tag/v12.2.1
npm notice To update run: npm install -g npm@12.2.1
npm notice`,
  'l2-ref-check': `$ npm run typecheck && npm test 2>&1 | grep -E '^ℹ (tests|pass|fail)'

> labflow-ts@1.0.0 typecheck
> tsc --noEmit -p tsconfig.json

ℹ tests 33
ℹ pass 33
ℹ fail 0`,
  'l4-strict': `$ npx tsc -p lab3/tsconfig.json | grep '^lab3/src'
lab3/src/validate.ts(31,26): error TS7006: Parameter 'limit' implicitly has an 'any' type.
lab3/src/validate.ts(48,30): error TS7019: Rest parameter 'ranges' implicitly has an 'any[]' type.`,
  'l5-starter': `$ npm run lab3

> labflow-ts@1.0.0 lab3
> node scripts/cham-lab-3.mjs

✗ A  your validate.ts compiles (strict) — 0/2
    src/validate.ts(31,26): error TS7006: Parameter 'limit' implicitly has an 'any' type.
    src/validate.ts(48,30): error TS7019: Rest parameter 'ranges' implicitly has an 'any[]' type.
✗ B  correct uses still compile — 0/1
    kiem/phai-dung.ts(8,7): error TS2322: Type 'number | number[]' is not assignable to type 'number'.
    kiem/phai-dung.ts(9,7): error TS2322: Type 'number | number[]' is not assignable to type 'number[]'.
    kiem/phai-dung.ts(13,42): error TS7006: Parameter 'p' implicitly has an 'any' type.
    kiem/phai-dung.ts(15,29): error TS7006: Parameter 'b' implicitly has an 'any' type.
✗ C  no any / Function / as / ! / @ts- — 0/1
    found: Function
✗ D  behaviour tests pass (7/10) — 0/2
    failed: validate collects EVERY problem, in rule order
    failed: maxSeats(40): exactly 40 seats is allowed
    failed: onProblem hears each problem once
    ✗ S1 a rule receives the whole request — expected TS2322, got no error
    ✗ S2 a rule returns a Problem or null — expected TS2322, got no error
    ✓ S3 a list in, a list out — expected TS2322, got TS2322
    ✗ S4 minutes are not "HH:MM" — expected TS2769, got TS2345
    ✗ S5 the limit is a number — expected TS2345, got no error
    ✗ S6 every argument is a [start, end] range — expected TS2345, got no error
    ✓ S7 which rules? — expected TS2554, got TS2554
    ✗ S8 run must be called on its validator — expected TS2684, got no error
✗ E  wrong uses refused (2/8) — 1/4

Score: 1/10 — NOT YET (pass mark 7)`,
  'l6-sai-chay': `$ node demo3/ts-lab-3/sai-chay.ts
S1 a rule that takes (seats: number)     → []
S2 a rule that returns 'TOO_LONG'        → ["TOO_LONG"]
S3 toMinutes(['08:00']) + 30             → "48030"
S4 toMinutes(480)                        → throws TypeError: value.map is not a function
S5 maxSeats('30') on 45 seats            → {"code":"TOO_MANY_SEATS","message":"At most 30 seats"}
S6 totalMinutes([480, 600], 720)         → throws TypeError: .for is not iterable
S7 validate(input)                       → throws TypeError: rules is not iterable
S8 const run = v.run; run(input)         → throws TypeError: Cannot read properties of undefined (reading 'rules')`,
  'l7-yeu': `$ node scripts/cham-lab-3.mjs --from lab3/yeu
✓ A  your validate.ts compiles (strict) — 2/2
✗ B  correct uses still compile — 0/1
    kiem/phai-dung.ts(8,7): error TS2322: Type 'number | number[]' is not assignable to type 'number'.
    kiem/phai-dung.ts(9,7): error TS2322: Type 'number | number[]' is not assignable to type 'number[]'.
✗ C  no any / Function / as / ! / @ts- — 0/1
    found: any
✓ D  behaviour tests pass (10/10) — 2/2
    ✗ S1 a rule receives the whole request — expected TS2322, got no error
    ✗ S2 a rule returns a Problem or null — expected TS2322, got no error
    ✓ S3 a list in, a list out — expected TS2322, got TS2322
    ✗ S4 minutes are not "HH:MM" — expected TS2769, got TS2345
    ✓ S5 the limit is a number — expected TS2345, got TS2345
    ✓ S6 every argument is a [start, end] range — expected TS2345, got TS2345
    ✓ S7 which rules? — expected TS2554, got TS2554
    ✗ S8 run must be called on its validator — expected TS2684, got no error
✗ E  wrong uses refused (4/8) — 2/4

Score: 6/10 — NOT YET (pass mark 7)`,
  'l8-vua': `$ node scripts/cham-lab-3.mjs --from lab3/vua
✓ A  your validate.ts compiles (strict) — 2/2
✗ B  correct uses still compile — 0/1
    kiem/phai-dung.ts(8,7): error TS2322: Type 'number | number[]' is not assignable to type 'number'.
    kiem/phai-dung.ts(9,7): error TS2322: Type 'number | number[]' is not assignable to type 'number[]'.
✓ C  no any / Function / as / ! / @ts- — 1/1
✓ D  behaviour tests pass (10/10) — 2/2
    ✓ S1 a rule receives the whole request — expected TS2322, got TS2322
    ✓ S2 a rule returns a Problem or null — expected TS2322, got TS2322
    ✓ S3 a list in, a list out — expected TS2322, got TS2322
    ✗ S4 minutes are not "HH:MM" — expected TS2769, got TS2345
    ✓ S5 the limit is a number — expected TS2345, got TS2345
    ✓ S6 every argument is a [start, end] range — expected TS2345, got TS2345
    ✓ S7 which rules? — expected TS2554, got TS2554
    ✗ S8 run must be called on its validator — expected TS2684, got no error
✗ E  wrong uses refused (6/8) — 3/4

Score: 8/10 — PASS (pass mark 7)`,
  'l9-ref': `$ node scripts/cham-lab-3.mjs --from src/rules
✓ A  your validate.ts compiles (strict) — 2/2
✓ B  correct uses still compile — 1/1
✓ C  no any / Function / as / ! / @ts- — 1/1
✓ D  behaviour tests pass (10/10) — 2/2
    ✓ S1 a rule receives the whole request — expected TS2322, got TS2322
    ✓ S2 a rule returns a Problem or null — expected TS2322, got TS2322
    ✓ S3 a list in, a list out — expected TS2322, got TS2322
    ✓ S4 minutes are not "HH:MM" — expected TS2769, got TS2769
    ✓ S5 the limit is a number — expected TS2345, got TS2345
    ✓ S6 every argument is a [start, end] range — expected TS2345, got TS2345
    ✓ S7 which rules? — expected TS2554, got TS2554
    ✓ S8 run must be called on its validator — expected TS2684, got TS2684
✓ E  wrong uses refused (8/8) — 4/4

Score: 10/10 — PASS (pass mark 7)`,
};
