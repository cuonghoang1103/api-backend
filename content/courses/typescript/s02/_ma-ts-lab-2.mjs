/**
 * _ma (bài Lab 2) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "starter": `// LabFlow — one lab's schedule for a day.
// A teammate wrote this file while the project still had "strict": false (lab2/tsconfig.loose.json).
// Lab 2: make it honest under the course's strict tsconfig.
import { parseTime, formatTime } from './time.ts';

export const LABS = ['BE-201', 'BE-202', 'AL-301'];
export type LabCode = string;
export type TimeRange = number[];   // [start, end] in minutes since 00:00

export type ScheduleEntry = {
  id: number;
  lab: LabCode;
  range: TimeRange;
  bookedBy: string;
  note: string;          // the database column is NULL when the booker wrote no note
  cancelledAt: string;   // only cancelled bookings have it
};

export function isLab(text: string): boolean {
  return LABS.includes(text);
}

// "08:00-10:00" -> [480, 600]
export function toRange(text: string): TimeRange {
  const [from, to] = text.split('-');
  return [parseTime(from), parseTime(to)];
}

export function findEntry(schedule: ScheduleEntry[], id: number): ScheduleEntry {
  return schedule.find((e) => e.id === id);
}

export function noteOf(entry: ScheduleEntry): string {
  return entry.note || '(no note)';
}

// Earliest start of a lab today, ignoring cancelled bookings.
export function firstStart(schedule: ScheduleEntry[], lab: LabCode): number {
  let best: number = null;
  for (const e of schedule) {
    if (e.lab !== lab || e.cancelledAt) continue;
    if (best === null || e.range[0] < best) best = e.range[0];
  }
  return best;
}

export function sortByStart(schedule: ScheduleEntry[]): ScheduleEntry[] {
  return schedule.sort((a, b) => a.range[0] - b.range[0]);
}

// "BE-201 08:00–10:00 an.nv (cancelled 2026-11-02)"
export function labelOf(entry: ScheduleEntry): string {
  const [start, end] = entry.range;
  const state = entry.cancelledAt ? ' (cancelled ' + entry.cancelledAt.slice(0, 10) + ')' : '';
  return entry.lab + ' ' + formatTime(start) + '–' + formatTime(end) + ' ' + entry.bookedBy + state;
}`,
  "test": `// Lab 2 — behaviour of the schedule module. Run: node --test --test-reporter=spec lab2/test/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LABS, isLab, toRange, findEntry, noteOf, firstStart, sortByStart, labelOf } from '../src/schedule.ts';
import type { ScheduleEntry } from '../src/schedule.ts';

// Three bookings of 2 Nov 2026, in the order the database returned them.
const e1: ScheduleEntry = { id: 1, lab: 'BE-201', range: [600, 720], bookedBy: 'an.nv', note: null };
const e2: ScheduleEntry = { id: 2, lab: 'BE-201', range: [480, 600], bookedBy: 'binh.tt', note: '', cancelledAt: '2026-11-01T09:15:00Z' };
const e3: ScheduleEntry = { id: 3, lab: 'BE-202', range: [540, 660], bookedBy: 'chi.lm', note: 'Bring HDMI adapters' };
const today = (): ScheduleEntry[] => [e1, e2, e3];

test('LABS lists the three LabFlow labs', () => assert.deepEqual([...LABS], ['BE-201', 'BE-202', 'AL-301']));
test('isLab: BE-201 yes, BE-999 and be-201 no', () => {
  assert.equal(isLab('BE-201'), true);
  assert.equal(isLab('BE-999'), false);
  assert.equal(isLab('be-201'), false);
});
test('toRange: 08:00-10:00 is [480, 600]', () => assert.deepEqual([...toRange('08:00-10:00')], [480, 600]));
test('toRange: a single time is a TypeError', () => assert.throws(() => toRange('08:00'), TypeError));
test('toRange: three times is a TypeError', () => assert.throws(() => toRange('08:00-10:00-12:00'), TypeError));
test('findEntry: id 3 is the BE-202 booking', () => assert.equal(findEntry(today(), 3)?.bookedBy, 'chi.lm'));
test('findEntry: an unknown id gives undefined', () => assert.equal(findEntry(today(), 99), undefined));
test('noteOf: a NULL note reads "(no note)"', () => assert.equal(noteOf(e1), '(no note)'));
test('noteOf: an empty note stays empty', () => assert.equal(noteOf(e2), ''));
test('firstStart: BE-201 starts at 600 (the 480 booking is cancelled)', () => assert.equal(firstStart(today(), 'BE-201'), 600));
test('firstStart: AL-301 has no booking today, so null', () => assert.equal(firstStart(today(), 'AL-301'), null));
test('sortByStart: sorted copy, the input keeps its order', () => {
  const input = today();
  assert.deepEqual(sortByStart(input).map((e) => e.id), [2, 3, 1]);
  assert.deepEqual(input.map((e) => e.id), [1, 2, 3]);
});
test('labelOf: shows times, booker and cancellation date', () => {
  assert.equal(labelOf(e2), 'BE-201 08:00–10:00 binh.tt (cancelled 2026-11-01)');
  assert.equal(labelOf(e3), 'BE-202 09:00–11:00 chi.lm');
});`,
  "dung": `// Lab 2 — CORRECT uses. They must keep compiling with your types (part B).
import { LABS, isLab, toRange, findEntry, noteOf, firstStart, sortByStart, labelOf } from '../src/schedule.ts';
import type { LabCode, ScheduleEntry } from '../src/schedule.ts';

// Rows as they come from the database: a NULL note, and no cancelledAt until a booking is cancelled.
const today: readonly ScheduleEntry[] = [
  { id: 1, lab: 'BE-201', range: [600, 720], bookedBy: 'an.nv', note: null },
  { id: 2, lab: 'BE-201', range: toRange('08:00-10:00'), bookedBy: 'binh.tt', note: '', cancelledAt: '2026-11-01T09:15:00Z' },
];

const sorted: ScheduleEntry[] = sortByStart(today);    // a read-only list is accepted, a new list comes back
const start: number = toRange('08:00-10:00')[0];        // position 0 of a range is always there
const firstLab: LabCode = LABS[0];                      // so is position 0 of the fixed list of labs

const found = findEntry(today, 1);
if (found !== undefined) console.log(noteOf(found), labelOf(found));

const first = firstStart(today, 'BE-201');
if (first !== null) console.log(first + 30);

const fromQuery: string = 'AL-301';
if (isLab(fromQuery)) {
  const lab: LabCode = fromQuery;                       // after the check, the text IS a LabCode
  console.log(lab, sorted.length, start, firstLab);
}`,
  "sai": `// Lab 2 — eight uses that are WRONG. Your types must make tsc refuse every one of them.
// The grader compiles this file against YOUR src/ and expects one error, with this code, on each marked line.
import { LABS, findEntry, firstStart } from '../src/schedule.ts';
import type { LabCode, ScheduleEntry, TimeRange } from '../src/schedule.ts';

declare const today: readonly ScheduleEntry[];
declare const entry: ScheduleEntry;

findEntry(today, 7).bookedBy;                    // S1 TS2532 booking 7 may not exist
entry.note.toUpperCase();                        // S2 TS18047 a note may be NULL
entry.cancelledAt.slice(0, 10);                  // S3 TS18048 only cancelled bookings have a date
firstStart(today, 'BE-201') + 30;                // S4 TS2531 a lab may have no booking today
const three: TimeRange = [480, 600, 660];        // S5 TS2322 a range is exactly [start, end]
entry.range[0] = 0;                              // S6 TS2540 a range is never changed in place
const lab: LabCode = 'BE-999';                   // S7 TS2322 only the three LabFlow labs exist
LABS.push('BE-999');                             // S8 TS2339 the list of labs is fixed`,
  "saiChay": `// The eight wrong uses of Lab 2, RUN by Node against the teammate's starter (lab2/src/schedule.ts).
// Node strips the types and runs the JavaScript — nothing is checked. What does each one do?
import { LABS, findEntry, firstStart, toRange } from '../../lab2/src/schedule.ts';

const today = [
  { id: 1, lab: 'BE-201', range: [600, 720], bookedBy: 'an.nv', note: null },
  { id: 3, lab: 'BE-202', range: [540, 660], bookedBy: 'chi.lm', note: 'Bring HDMI adapters' },
];
const entry = today[0];

function show(label: string, run: () => unknown): void {
  try {
    console.log(label.padEnd(36), '→', JSON.stringify(run()));
  } catch (e) {
    console.log(label.padEnd(36), '→ throws', String(e));
  }
}

show('S1 findEntry(today, 7).bookedBy', () => findEntry(today, 7).bookedBy);
show('S2 entry.note.toUpperCase()', () => entry.note.toUpperCase());
show('S3 entry.cancelledAt.slice(0, 10)', () => entry.cancelledAt.slice(0, 10));
show("S4 firstStart(today, 'AL-301') + 30", () => firstStart(today, 'AL-301') + 30);
show('S5 a range of three numbers', () => toRange('08:00-10:00-12:00'));
show('S6 entry.range[0] = 0', () => { entry.range[0] = 0; return entry.range; });
show("S7 lab 'BE-999'", () => ({ lab: 'BE-999' }));
show("S8 LABS.push('BE-999')", () => { LABS.push('BE-999'); return LABS; });`,
  "yeu": `// Lab 2 — attempt A ("yếu" = weak): the runtime bugs the tests found are fixed (?? and a copy before sort),
// but every compiler error was made to go away with "!" and "as". The types still say what they said under strict: false.
import { parseTime, formatTime } from './time.ts';

export const LABS = ['BE-201', 'BE-202', 'AL-301'];
export type LabCode = string;
export type TimeRange = number[];   // [start, end] in minutes since 00:00

export type ScheduleEntry = {
  id: number;
  lab: LabCode;
  range: TimeRange;
  bookedBy: string;
  note: string;
  cancelledAt: string;
};

export function isLab(text: string): boolean {
  return LABS.includes(text);
}

export function toRange(text: string): TimeRange {
  const [from, to, extra] = text.split('-');
  if (extra !== undefined) throw new TypeError('Invalid range "' + text + '", expected HH:MM-HH:MM');
  return [parseTime(from!), parseTime(to!)];
}

export function findEntry(schedule: ScheduleEntry[], id: number): ScheduleEntry {
  return schedule.find((e) => e.id === id) as ScheduleEntry;
}

export function noteOf(entry: ScheduleEntry): string {
  return entry.note ?? '(no note)';
}

export function firstStart(schedule: ScheduleEntry[], lab: LabCode): number {
  let best = null as unknown as number;
  for (const e of schedule) {
    if (e.lab !== lab || e.cancelledAt) continue;
    if (best === null || e.range[0]! < best) best = e.range[0]!;
  }
  return best;
}

export function sortByStart(schedule: ScheduleEntry[]): ScheduleEntry[] {
  return [...schedule].sort((a, b) => a.range[0]! - b.range[0]!);
}

export function labelOf(entry: ScheduleEntry): string {
  const [start, end] = entry.range;
  const state = entry.cancelledAt ? ' (cancelled ' + entry.cancelledAt.slice(0, 10) + ')' : '';
  return entry.lab + ' ' + formatTime(start!) + '–' + formatTime(end!) + ' ' + entry.bookedBy + state;
}`,
  "vua": `// Lab 2 — attempt B ("vừa" = so-so): null and undefined are honest now (no "!", no "as"),
// but a range is still number[] and the labs are still a string[] — the shapes are not written down.
import { parseTime, formatTime } from './time.ts';

export const LABS = ['BE-201', 'BE-202', 'AL-301'];
export type LabCode = string;
export type TimeRange = number[];   // [start, end] in minutes since 00:00

export type ScheduleEntry = {
  id: number;
  lab: LabCode;
  range: TimeRange;
  bookedBy: string;
  note: string | null;
  cancelledAt?: string;
};

export function isLab(text: string): boolean {
  return LABS.includes(text);
}

export function toRange(text: string): TimeRange {
  const [from, to, extra] = text.split('-');
  if (from === undefined || to === undefined || extra !== undefined) {
    throw new TypeError('Invalid range "' + text + '", expected HH:MM-HH:MM');
  }
  return [parseTime(from), parseTime(to)];
}

export function findEntry(schedule: readonly ScheduleEntry[], id: number): ScheduleEntry | undefined {
  return schedule.find((e) => e.id === id);
}

export function noteOf(entry: ScheduleEntry): string {
  return entry.note ?? '(no note)';
}

export function firstStart(schedule: readonly ScheduleEntry[], lab: LabCode): number | null {
  let best: number | null = null;
  for (const e of schedule) {
    const start = e.range[0];
    if (e.lab !== lab || e.cancelledAt !== undefined || start === undefined) continue;
    if (best === null || start < best) best = start;
  }
  return best;
}

export function sortByStart(schedule: readonly ScheduleEntry[]): ScheduleEntry[] {
  return schedule.toSorted((a, b) => (a.range[0] ?? 0) - (b.range[0] ?? 0));
}

export function labelOf(entry: ScheduleEntry): string {
  const [start = 0, end = 0] = entry.range;
  const state = entry.cancelledAt === undefined ? '' : ' (cancelled ' + entry.cancelledAt.slice(0, 10) + ')';
  return entry.lab + ' ' + formatTime(start) + '–' + formatTime(end) + ' ' + entry.bookedBy + state;
}`,
  "ref": `// LabFlow — one lab's schedule for a day (Chapter 2, = Lab 2 reference solution).
import { parseTime, formatTime } from './time.ts';

// The one list of labs. \`as const\` keeps the exact strings, so the type below is derived from it, never copied.
export const LABS = ['BE-201', 'BE-202', 'AL-301'] as const;
export type LabCode = (typeof LABS)[number];

// [start, end] in minutes since 00:00 — exactly two numbers, never changed in place.
export type TimeRange = readonly [start: number, end: number];

export type ScheduleEntry = {
  id: number;
  lab: LabCode;
  range: TimeRange;
  bookedBy: string;
  note: string | null;      // NULL in the database: the booker wrote no note ('' is a real, empty note)
  cancelledAt?: string;     // absent until the booking is cancelled
};

// A text from outside (a query string, a form) is checked at runtime before it is trusted to be a LabCode.
export function isLab(text: string): text is LabCode {
  return LABS.some((lab) => lab === text);
}

// "08:00-10:00" -> [480, 600]
export function toRange(text: string): TimeRange {
  const [from, to, extra] = text.split('-');
  if (from === undefined || to === undefined || extra !== undefined) {
    throw new TypeError('Invalid range "' + text + '", expected HH:MM-HH:MM');
  }
  return [parseTime(from), parseTime(to)];
}

export function findEntry(schedule: readonly ScheduleEntry[], id: number): ScheduleEntry | undefined {
  return schedule.find((e) => e.id === id);
}

export function noteOf(entry: ScheduleEntry): string {
  return entry.note ?? '(no note)';
}

// Earliest start of a lab today, ignoring cancelled bookings; null when the lab is free all day.
export function firstStart(schedule: readonly ScheduleEntry[], lab: LabCode): number | null {
  let best: number | null = null;
  for (const e of schedule) {
    if (e.lab !== lab || e.cancelledAt !== undefined) continue;
    if (best === null || e.range[0] < best) best = e.range[0];
  }
  return best;
}

// A sorted COPY: the caller's list keeps its order.
export function sortByStart(schedule: readonly ScheduleEntry[]): ScheduleEntry[] {
  return schedule.toSorted((a, b) => a.range[0] - b.range[0]);
}

// "BE-201 08:00–10:00 an.nv (cancelled 2026-11-02)"
export function labelOf(entry: ScheduleEntry): string {
  const [start, end] = entry.range;
  const state = entry.cancelledAt === undefined ? '' : ' (cancelled ' + entry.cancelledAt.slice(0, 10) + ')';
  return entry.lab + ' ' + formatTime(start) + '–' + formatTime(end) + ' ' + entry.bookedBy + state;
}`,
  "grader": `// Lab 2 grader — "Strict null on the lab schedule".   node scripts/cham-lab-2.mjs [--from <folder with schedule.ts>]
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
const errorsIn = (out, file) => out.split('\\n').filter((l) => l.startsWith(file + '(') && / error TS\\d+/.test(l));
// Code only: comments and string literals removed, so "as" or "!" inside them does not count.
const codeOnly = (s) => s.replace(/\\/\\*[\\s\\S]*?\\*\\//g, '').replace(/\\/\\/.*$/gm, '').replace(/'(?:[^'\\n\\\\]|\\\\.)*'|"(?:[^"\\n\\\\]|\\\\.)*"/g, "''");

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
    console.log(\`\${ok ? '✓' : '✗'} \${label} — \${pts}/\${max}\${extra ? '\\n    ' + extra.trim().split('\\n').slice(0, 4).join('\\n    ') : ''}\`);
  };

  const a = tsc('a.json');
  line(a.code === 0, a.code === 0 ? 2 : 0, 2, 'A  your schedule.ts compiles (strict)', a.code ? a.out : '');
  const b = tsc('b.json');
  const bErr = errorsIn(b.out, 'kiem/phai-dung.ts');
  line(bErr.length === 0, bErr.length === 0 ? 1 : 0, 1, 'B  correct uses still compile', bErr.join('\\n'));

  const src = codeOnly(readFileSync(path.join(tmp, 'src/schedule.ts'), 'utf8'));
  const cheats = [...src.matchAll(/\\bany\\b|@ts-(?:ignore|nocheck|expect-error)|\\bas\\s+(?!const\\b)\\w+|[\\w$]+!(?=[.[;,)\\s])|[)\\]]!(?=[.[;,)\\s])/g)].map((m) => m[0].trim());
  line(cheats.length === 0, cheats.length === 0 ? 1 : 0, 1, 'C  no any / as / ! / @ts- directives', cheats.length ? 'found: ' + [...new Set(cheats)].join(', ') : '');

  const d = run(process.execPath, ['--test', '--test-reporter=tap', 'test/schedule.test.ts']);
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
  "looseTsconfig": `{
  // The config the teammate wrote schedule.ts under: the course config with strict switched OFF.
  "extends": "../tsconfig.json",
  "compilerOptions": { "strict": false, "noUncheckedIndexedAccess": false },
  "include": ["src"]
}`,
};
export const OUT = {
  'l1-npm-ci': `$ npm ci

added 4 packages, and audited 5 packages in 11s

found 0 vulnerabilities
npm notice
npm notice New major version of npm available! 10.9.9 -> 12.2.1
npm notice Changelog: https://github.com/npm/cli/releases/tag/v12.2.1
npm notice To update run: npm install -g npm@12.2.1
npm notice`,
  'l2-ref-check': `$ npm run typecheck && npm test 2>&1 | grep -E '^ℹ (tests|pass|fail)'

> labflow-ts@1.0.0 typecheck
> tsc --noEmit -p tsconfig.json

ℹ tests 23
ℹ pass 23
ℹ fail 0`,
  'l3-loose': `$ npx tsc -p lab2/tsconfig.loose.json && echo 'no errors with strict: false'
no errors with strict: false`,
  'l4-strict': `$ npx tsc -p lab2/tsconfig.json | grep '^lab2/src'
lab2/src/schedule.ts(26,21): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
lab2/src/schedule.ts(26,38): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
lab2/src/schedule.ts(30,3): error TS2322: Type 'ScheduleEntry | undefined' is not assignable to type 'ScheduleEntry'.
lab2/src/schedule.ts(39,7): error TS2322: Type 'null' is not assignable to type 'number'.
lab2/src/schedule.ts(42,26): error TS2532: Object is possibly 'undefined'.
lab2/src/schedule.ts(42,45): error TS2322: Type 'number | undefined' is not assignable to type 'number'.
lab2/src/schedule.ts(48,34): error TS2532: Object is possibly 'undefined'.
lab2/src/schedule.ts(48,47): error TS2532: Object is possibly 'undefined'.
lab2/src/schedule.ts(55,39): error TS2345: Argument of type 'number | undefined' is not assignable to parameter of type 'number'.
lab2/src/schedule.ts(55,65): error TS2345: Argument of type 'number | undefined' is not assignable to parameter of type 'number'.`,
  'l5-starter': `$ npm run lab2

> labflow-ts@1.0.0 lab2
> node scripts/cham-lab-2.mjs

✗ A  your schedule.ts compiles (strict) — 0/2
    src/schedule.ts(26,21): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
      Type 'undefined' is not assignable to type 'string'.
    src/schedule.ts(26,38): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
      Type 'undefined' is not assignable to type 'string'.
✗ B  correct uses still compile — 0/1
    kiem/phai-dung.ts(7,65): error TS2322: Type 'null' is not assignable to type 'string'.
    kiem/phai-dung.ts(11,45): error TS4104: The type 'readonly ScheduleEntry[]' is 'readonly' and cannot be assigned to the mutable type 'ScheduleEntry[]'.
    kiem/phai-dung.ts(12,7): error TS2322: Type 'number | undefined' is not assignable to type 'number'.
    kiem/phai-dung.ts(13,7): error TS2322: Type 'string | undefined' is not assignable to type 'string'.
✓ C  no any / as / ! / @ts- directives — 1/1
✗ D  behaviour tests pass (10/13) — 0/2
    failed: toRange: three times is a TypeError
    failed: noteOf: an empty note stays empty
    failed: sortByStart: sorted copy, the input keeps its order
    ✗ S1 booking 7 may not exist — expected TS2532, got TS4104
    ✗ S2 a note may be NULL — expected TS18047, got no error
    ✗ S3 only cancelled bookings have a date — expected TS18048, got no error
    ✗ S4 a lab may have no booking today — expected TS2531, got TS4104
    ✗ S5 a range is exactly [start, end] — expected TS2322, got no error
    ✗ S6 a range is never changed in place — expected TS2540, got no error
    ✗ S7 only the three LabFlow labs exist — expected TS2322, got no error
    ✗ S8 the list of labs is fixed — expected TS2339, got no error
✗ E  wrong uses refused (0/8) — 0/4

Score: 1/10 — NOT YET (pass mark 7)`,
  'l6-sai-chay': `$ node demo2/ts-lab-2/sai-chay.ts
S1 findEntry(today, 7).bookedBy      → throws TypeError: Cannot read properties of undefined (reading 'bookedBy')
S2 entry.note.toUpperCase()          → throws TypeError: Cannot read properties of null (reading 'toUpperCase')
S3 entry.cancelledAt.slice(0, 10)    → throws TypeError: Cannot read properties of undefined (reading 'slice')
S4 firstStart(today, 'AL-301') + 30  → 30
S5 a range of three numbers          → [480,600]
S6 entry.range[0] = 0                → [0,720]
S7 lab 'BE-999'                      → {"lab":"BE-999"}
S8 LABS.push('BE-999')               → ["BE-201","BE-202","AL-301","BE-999"]`,
  'l7-yeu': `$ node scripts/cham-lab-2.mjs --from lab2/yeu
✓ A  your schedule.ts compiles (strict) — 2/2
✗ B  correct uses still compile — 0/1
    kiem/phai-dung.ts(7,65): error TS2322: Type 'null' is not assignable to type 'string'.
    kiem/phai-dung.ts(11,45): error TS4104: The type 'readonly ScheduleEntry[]' is 'readonly' and cannot be assigned to the mutable type 'ScheduleEntry[]'.
    kiem/phai-dung.ts(12,7): error TS2322: Type 'number | undefined' is not assignable to type 'number'.
    kiem/phai-dung.ts(13,7): error TS2322: Type 'string | undefined' is not assignable to type 'string'.
✗ C  no any / as / ! / @ts- directives — 0/1
    found: from!, to!, as ScheduleEntry, as unknown, as number, ]!, start!, end!
✓ D  behaviour tests pass (13/13) — 2/2
    ✗ S1 booking 7 may not exist — expected TS2532, got TS4104
    ✗ S2 a note may be NULL — expected TS18047, got no error
    ✗ S3 only cancelled bookings have a date — expected TS18048, got no error
    ✗ S4 a lab may have no booking today — expected TS2531, got TS4104
    ✗ S5 a range is exactly [start, end] — expected TS2322, got no error
    ✗ S6 a range is never changed in place — expected TS2540, got no error
    ✗ S7 only the three LabFlow labs exist — expected TS2322, got no error
    ✗ S8 the list of labs is fixed — expected TS2339, got no error
✗ E  wrong uses refused (0/8) — 0/4

Score: 4/10 — NOT YET (pass mark 7)`,
  'l8-vua': `$ node scripts/cham-lab-2.mjs --from lab2/vua
✓ A  your schedule.ts compiles (strict) — 2/2
✗ B  correct uses still compile — 0/1
    kiem/phai-dung.ts(12,7): error TS2322: Type 'number | undefined' is not assignable to type 'number'.
    kiem/phai-dung.ts(13,7): error TS2322: Type 'string | undefined' is not assignable to type 'string'.
✓ C  no any / as / ! / @ts- directives — 1/1
✓ D  behaviour tests pass (13/13) — 2/2
    ✓ S1 booking 7 may not exist — expected TS2532, got TS2532
    ✓ S2 a note may be NULL — expected TS18047, got TS18047
    ✓ S3 only cancelled bookings have a date — expected TS18048, got TS18048
    ✓ S4 a lab may have no booking today — expected TS2531, got TS2531
    ✗ S5 a range is exactly [start, end] — expected TS2322, got no error
    ✗ S6 a range is never changed in place — expected TS2540, got no error
    ✗ S7 only the three LabFlow labs exist — expected TS2322, got no error
    ✗ S8 the list of labs is fixed — expected TS2339, got no error
✗ E  wrong uses refused (4/8) — 2/4

Score: 7/10 — PASS (pass mark 7)`,
  'l9-ref': `$ node scripts/cham-lab-2.mjs --from src/rules
✓ A  your schedule.ts compiles (strict) — 2/2
✓ B  correct uses still compile — 1/1
✓ C  no any / as / ! / @ts- directives — 1/1
✓ D  behaviour tests pass (13/13) — 2/2
    ✓ S1 booking 7 may not exist — expected TS2532, got TS2532
    ✓ S2 a note may be NULL — expected TS18047, got TS18047
    ✓ S3 only cancelled bookings have a date — expected TS18048, got TS18048
    ✓ S4 a lab may have no booking today — expected TS2531, got TS2531
    ✓ S5 a range is exactly [start, end] — expected TS2322, got TS2322
    ✓ S6 a range is never changed in place — expected TS2540, got TS2540
    ✓ S7 only the three LabFlow labs exist — expected TS2322, got TS2322
    ✓ S8 the list of labs is fixed — expected TS2339, got TS2339
✓ E  wrong uses refused (8/8) — 4/4

Score: 10/10 — PASS (pass mark 7)`,
};
