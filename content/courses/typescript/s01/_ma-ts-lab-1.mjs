/**
 * _ma (bài Lab 1) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "starterTime": `// Convert between "HH:MM" and minutes since 00:00.
export function parseTime(text) {
  const m = /^([0-9]{2}):([0-9]{2})$/.exec(text);
  if (!m) throw new TypeError('Invalid time "' + text + '", expected HH:MM');
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) throw new RangeError('Time out of range: ' + text);
  return h * 60 + min;
}

export function formatTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
}`,
  "starterBooking": `import { parseTime } from './time.js';

export const OPEN = 7 * 60;          // 07:00
export const CLOSE = 21 * 60;        // 21:00
export const STEP = 30;              // BR-04: 30-minute grid
export const MAX_MINUTES = 240;      // Lite-1: at most 4 hours
export const MAX_DAYS_AHEAD = 14;    // BR-05: at most 14 days ahead
export const APPROVAL_SEATS = 30;    // BR-06: more than 30 seats needs approval

export function checkSlot(start, end) {
  const s = parseTime(start);
  const e = parseTime(end);
  if (s % STEP !== 0 || e % STEP !== 0) return { ok: false, code: 'OFF_GRID' };
  if (e <= s) return { ok: false, code: 'END_BEFORE_START' };
  if (s < OPEN || e > CLOSE) return { ok: false, code: 'OUTSIDE_HOURS' };
  if (e - s > MAX_MINUTES) return { ok: false, code: 'TOO_LONG' };
  return { ok: true, minutes: e - s };
}

export function isWithinBookingWindow(daysAhead) {
  return Number.isInteger(daysAhead) && daysAhead >= 0 && daysAhead <= MAX_DAYS_AHEAD;
}

export function needsApproval({ seats, role }) {
  if (!Number.isInteger(seats) || seats < 1) {
    throw new RangeError('seats must be a positive integer, got ' + seats);
  }
  if (role === 'LECTURER' || role === 'ADMIN') return false;
  return seats > APPROVAL_SEATS;
}

export function createBooking({ lab, seats, role, start, end }) {
  const slot = checkSlot(start, end);
  if (!slot.ok) throw new Error(slot.code);
  return {
    lab,
    start,
    end,
    minutes: slot.minutes,
    status: needsApproval({ seats, role }) ? 'PENDING' : 'CONFIRMED',
  };
}

// Share of opening hours already booked, added booking by booking (0..1).
export function usageRate(bookings) {
  let rate = 0;
  for (const b of bookings) rate += b.minutes / (CLOSE - OPEN);
  return rate;
}`,
  "sai": `// Lab 1 — eight calls that are WRONG. Your types must make tsc refuse every one of them.
// The grader compiles this file against YOUR src/ and expects one error, with this code, on each marked line.
import { parseTime, formatTime } from '../src/time.ts';
import { checkSlot, needsApproval, createBooking, usageRate } from '../src/booking.ts';

const input = { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' } as const;

parseTime(420);                                              // S1 TS2345 a number is not "HH:MM"
formatTime('07:30');                                         // S2 TS2345 formatTime takes minutes
checkSlot('08:00');                                          // S3 TS2554 the end time is missing
needsApproval({ seat: 31, role: 'STUDENT' });                // S4 TS2561 typo: seat instead of seats
needsApproval({ seats: 31, role: 'lecturer' });              // S5 TS2820 roles are upper-case
createBooking(input).minute;                                 // S6 TS2551 typo: minute instead of minutes
if (createBooking(input).status === 'APPROVED') {}           // S7 TS2367 there is no APPROVED status
usageRate([{ minute: 60 }]);                                 // S8 TS2561 typo inside a list of bookings`,
  "dung": `// Lab 1 — correct calls that must KEEP compiling. Types that are too strict break these.
import { parseTime, formatTime } from '../src/time.ts';
import { checkSlot, needsApproval, createBooking, usageRate, OPEN } from '../src/booking.ts';

const start: number = parseTime('08:00');
const label: string = formatTime(start + 90);
const slot = checkSlot('08:00', '10:00');
if (slot.ok) {
  const minutes: number = slot.minutes;
  console.log(label, minutes);
}
const wait: boolean = needsApproval({ seats: 31, role: 'STUDENT' });
const booking = createBooking({ lab: 'BE-201', seats: 12, role: 'ADMIN', start: '18:00', end: '21:00' });
const status: 'PENDING' | 'CONFIRMED' = booking.status;
const rate: number = usageRate([booking, { minutes: 30 }]);
const opensAt: number = OPEN;
console.log(wait, status, rate, opensAt);`,
  "test": `// Lab 1 — behaviour must not change while you add types. Run: node --test --test-reporter=spec lab1/test/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseTime, formatTime } from '../src/time.ts';
import { checkSlot, needsApproval, createBooking, usageRate, isWithinBookingWindow } from '../src/booking.ts';

test('parseTime: 07:00 is minute 420', () => assert.equal(parseTime('07:00'), 420));
test('parseTime: rejects 7:00', () => assert.throws(() => parseTime('7:00'), TypeError));
test('parseTime: rejects 23:60', () => assert.throws(() => parseTime('23:60'), RangeError));
test('formatTime: 1290 is 21:30', () => assert.equal(formatTime(1290), '21:30'));
test('checkSlot: 08:00–10:00 lasts 120 minutes', () =>
  assert.deepEqual(checkSlot('08:00', '10:00'), { ok: true, minutes: 120 }));
test('checkSlot: 06:30 starts before opening', () =>
  assert.deepEqual(checkSlot('06:30', '08:00'), { ok: false, code: 'OUTSIDE_HOURS' }));
test('checkSlot: 08:00–12:30 is too long', () =>
  assert.deepEqual(checkSlot('08:00', '12:30'), { ok: false, code: 'TOO_LONG' }));
test('needsApproval: 31 student seats', () => assert.equal(needsApproval({ seats: 31, role: 'STUDENT' }), true));
test('needsApproval: 30 student seats', () => assert.equal(needsApproval({ seats: 30, role: 'STUDENT' }), false));
test('needsApproval: admins never wait', () => assert.equal(needsApproval({ seats: 200, role: 'ADMIN' }), false));
test('needsApproval: 0 seats is a RangeError', () =>
  assert.throws(() => needsApproval({ seats: 0, role: 'STUDENT' }), RangeError));
test('createBooking: off-grid slot throws OFF_GRID', () =>
  assert.throws(() => createBooking({ lab: 'BE-201', seats: 5, role: 'STUDENT', start: '08:15', end: '09:00' }), /OFF_GRID/));
test('createBooking: a lecturer with 31 seats is CONFIRMED', () =>
  assert.equal(createBooking({ lab: 'BE-201', seats: 31, role: 'LECTURER', start: '13:00', end: '15:30' }).status, 'CONFIRMED'));
test('usageRate: 210 + 210 minutes is half a day', () => assert.equal(usageRate([{ minutes: 210 }, { minutes: 210 }]), 0.5));
test('isWithinBookingWindow: 14 days ahead is allowed, 15 is not', () => {
  assert.equal(isWithinBookingWindow(14), true);
  assert.equal(isWithinBookingWindow(15), false);
});`,
  "yeuBooking": `// Lab 1 — a WEAK first attempt: every red line silenced with "any". It compiles and the tests pass. Graded in the lab lesson.
import { parseTime } from './time.ts';

export const OPEN = 7 * 60;          // 07:00
export const CLOSE = 21 * 60;        // 21:00
export const STEP = 30;              // BR-04: 30-minute grid
export const MAX_MINUTES = 240;      // Lite-1: at most 4 hours
export const MAX_DAYS_AHEAD = 14;    // BR-05: at most 14 days ahead
export const APPROVAL_SEATS = 30;    // BR-06: more than 30 seats needs approval

export function checkSlot(start: any, end: any): any {
  const s = parseTime(start);
  const e = parseTime(end);
  if (s % STEP !== 0 || e % STEP !== 0) return { ok: false, code: 'OFF_GRID' };
  if (e <= s) return { ok: false, code: 'END_BEFORE_START' };
  if (s < OPEN || e > CLOSE) return { ok: false, code: 'OUTSIDE_HOURS' };
  if (e - s > MAX_MINUTES) return { ok: false, code: 'TOO_LONG' };
  return { ok: true, minutes: e - s };
}

export function isWithinBookingWindow(daysAhead: any): any {
  return Number.isInteger(daysAhead) && daysAhead >= 0 && daysAhead <= MAX_DAYS_AHEAD;
}

export function needsApproval({ seats, role }: any): any {
  if (!Number.isInteger(seats) || seats < 1) {
    throw new RangeError('seats must be a positive integer, got ' + seats);
  }
  if (role === 'LECTURER' || role === 'ADMIN') return false;
  return seats > APPROVAL_SEATS;
}

export function createBooking({ lab, seats, role, start, end }: any): any {
  const slot = checkSlot(start, end);
  if (!slot.ok) throw new Error(slot.code);
  return {
    lab,
    start,
    end,
    minutes: slot.minutes,
    status: needsApproval({ seats, role }) ? 'PENDING' : 'CONFIRMED',
  };
}

// Share of opening hours already booked, added booking by booking (0..1).
export function usageRate(bookings: any): any {
  let rate = 0;
  for (const b of bookings) rate += b.minutes / (CLOSE - OPEN);
  return rate;
}`,
  "vuaBooking": `// Lab 1 — a SECOND attempt: every parameter typed with string/number, return types left to inference. Graded in the lab lesson.
import { parseTime } from './time.ts';

export const OPEN = 7 * 60;          // 07:00
export const CLOSE = 21 * 60;        // 21:00
export const STEP = 30;              // BR-04: 30-minute grid
export const MAX_MINUTES = 240;      // Lite-1: at most 4 hours
export const MAX_DAYS_AHEAD = 14;    // BR-05: at most 14 days ahead
export const APPROVAL_SEATS = 30;    // BR-06: more than 30 seats needs approval

export function checkSlot(start: string, end: string) {
  const s = parseTime(start);
  const e = parseTime(end);
  if (s % STEP !== 0 || e % STEP !== 0) return { ok: false, code: 'OFF_GRID' };
  if (e <= s) return { ok: false, code: 'END_BEFORE_START' };
  if (s < OPEN || e > CLOSE) return { ok: false, code: 'OUTSIDE_HOURS' };
  if (e - s > MAX_MINUTES) return { ok: false, code: 'TOO_LONG' };
  return { ok: true, minutes: e - s };
}

export function isWithinBookingWindow(daysAhead: number): boolean {
  return Number.isInteger(daysAhead) && daysAhead >= 0 && daysAhead <= MAX_DAYS_AHEAD;
}

export function needsApproval({ seats, role }: { seats: number; role: string }): boolean {
  if (!Number.isInteger(seats) || seats < 1) {
    throw new RangeError('seats must be a positive integer, got ' + seats);
  }
  if (role === 'LECTURER' || role === 'ADMIN') return false;
  return seats > APPROVAL_SEATS;
}

export function createBooking({ lab, seats, role, start, end }: { lab: string; seats: number; role: string; start: string; end: string }) {
  const slot = checkSlot(start, end);
  if (!slot.ok) throw new Error(slot.code);
  return {
    lab,
    start,
    end,
    minutes: slot.minutes,
    status: needsApproval({ seats, role }) ? 'PENDING' : 'CONFIRMED',
  };
}

// Share of opening hours already booked, added booking by booking (0..1).
export function usageRate(bookings: { minutes: number }[]): number {
  let rate = 0;
  for (const b of bookings) rate += b.minutes / (CLOSE - OPEN);
  return rate;
}`,
  "refTime": `// Convert between "HH:MM" and minutes since 00:00.
export function parseTime(text: string): number {
  const m = /^([0-9]{2}):([0-9]{2})$/.exec(text);
  if (!m) throw new TypeError('Invalid time "' + text + '", expected HH:MM');
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) throw new RangeError('Time out of range: ' + text);
  return h * 60 + min;
}

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
}`,
  "refBooking": `import { parseTime } from './time.ts';

export const OPEN = 7 * 60;          // 07:00
export const CLOSE = 21 * 60;        // 21:00
export const STEP = 30;              // BR-04: 30-minute grid
export const MAX_MINUTES = 240;      // Lite-1: at most 4 hours
export const MAX_DAYS_AHEAD = 14;    // BR-05: at most 14 days ahead
export const APPROVAL_SEATS = 30;    // BR-06: more than 30 seats needs approval

export type Role = 'STUDENT' | 'LECTURER' | 'ADMIN';
export type SlotCode = 'OFF_GRID' | 'END_BEFORE_START' | 'OUTSIDE_HOURS' | 'TOO_LONG';
export type SlotResult = { ok: true; minutes: number } | { ok: false; code: SlotCode };

export type BookingInput = { lab: string; seats: number; role: Role; start: string; end: string };
export type Booking = {
  lab: string;
  start: string;
  end: string;
  minutes: number;
  status: 'PENDING' | 'CONFIRMED';
};

export function checkSlot(start: string, end: string): SlotResult {
  const s = parseTime(start);
  const e = parseTime(end);
  if (s % STEP !== 0 || e % STEP !== 0) return { ok: false, code: 'OFF_GRID' };
  if (e <= s) return { ok: false, code: 'END_BEFORE_START' };
  if (s < OPEN || e > CLOSE) return { ok: false, code: 'OUTSIDE_HOURS' };
  if (e - s > MAX_MINUTES) return { ok: false, code: 'TOO_LONG' };
  return { ok: true, minutes: e - s };
}

export function isWithinBookingWindow(daysAhead: number): boolean {
  return Number.isInteger(daysAhead) && daysAhead >= 0 && daysAhead <= MAX_DAYS_AHEAD;
}

export function needsApproval({ seats, role }: { seats: number; role: Role }): boolean {
  if (!Number.isInteger(seats) || seats < 1) {
    throw new RangeError('seats must be a positive integer, got ' + seats);
  }
  if (role === 'LECTURER' || role === 'ADMIN') return false;
  return seats > APPROVAL_SEATS;
}

export function createBooking({ lab, seats, role, start, end }: BookingInput): Booking {
  const slot = checkSlot(start, end);
  if (!slot.ok) throw new Error(slot.code);
  return {
    lab,
    start,
    end,
    minutes: slot.minutes,
    status: needsApproval({ seats, role }) ? 'PENDING' : 'CONFIRMED',
  };
}

// Share of opening hours already booked, added booking by booking (0..1).
export function usageRate(bookings: readonly { minutes: number }[]): number {
  let rate = 0;
  for (const b of bookings) rate += b.minutes / (CLOSE - OPEN);
  return rate;
}`,
  "grader": `// Lab 1 grader — "Convert LabFlow's rules to TypeScript".   node scripts/cham-lab-1.mjs [--from <folder with time.ts + booking.ts>]
// Copies YOUR two files into a fresh folder next to the grader-owned tests, then scores 10 points:
//   A  tsc: your src/ compiles under the course tsconfig (strict) ............ 2
//   B  tsc: the correct calls in kiem/phai-dung.ts still compile .............. 1
//   C  honesty: no "any", no @ts-ignore / @ts-nocheck / @ts-expect-error ...... 1
//   D  node --test: the 15 behaviour tests in test/rules.test.ts pass ......... 2
//   E  the 8 wrong calls in kiem/sai.ts are each refused with the right code .. 8 × 0.5
import { execFileSync } from 'node:child_process';
import { cpSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const i = process.argv.indexOf('--from');
const from = path.resolve(i > 0 ? process.argv[i + 1] : path.join(root, 'lab1/src'));
const tmp = path.join(root, '.cham-lab1');
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

try {
  mkdirSync(path.join(tmp, 'src'));
  for (const f of ['time.ts', 'booking.ts']) cpSync(path.join(from, f), path.join(tmp, 'src', f));
  cpSync(path.join(root, 'lab1/test'), path.join(tmp, 'test'), { recursive: true });
  cpSync(path.join(root, 'lab1/kiem'), path.join(tmp, 'kiem'), { recursive: true });
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
  line(a.code === 0, a.code === 0 ? 2 : 0, 2, 'A  your src/ compiles (strict)', a.code ? a.out : '');
  const b = tsc('b.json');
  const bErr = errorsIn(b.out, 'kiem/phai-dung.ts');
  line(bErr.length === 0, bErr.length === 0 ? 1 : 0, 1, 'B  correct calls still compile', bErr.join('\\n'));

  const src = ['time.ts', 'booking.ts'].map((f) => readFileSync(path.join(tmp, 'src', f), 'utf8')).join('\\n');
  const cheats = [...src.matchAll(/\\bany\\b|@ts-(ignore|nocheck|expect-error)/g)].map((m) => m[0]);
  line(cheats.length === 0, cheats.length === 0 ? 1 : 0, 1, 'C  no any / no @ts- directives', cheats.length ? 'found: ' + [...new Set(cheats)].join(', ') : '');

  const d = run(process.execPath, ['--test', '--test-reporter=tap', 'test/rules.test.ts']);
  const pass = /# pass (\\d+)/.exec(d.out);
  const why = d.out.split('\\n').filter((l) => /^# (Error|SyntaxError|TypeError)|^\\s+error: '/.test(l)).slice(0, 2).join('\\n');
  line(d.code === 0, d.code === 0 ? 2 : 0, 2, \`D  behaviour tests pass (\${pass ? pass[1] : 0}/15)\`, d.code ? why : '');

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
  line(refused === wanted.length, refused * 0.5, 4, \`E  wrong calls refused (\${refused}/\${wanted.length})\`);

  console.log(\`\\nScore: \${score}/10 — \${score >= 7 ? 'PASS' : 'NOT YET'} (pass mark 7)\`);
  process.exitCode = score >= 7 ? 0 : 1;
} finally {
  rmSync(tmp, { recursive: true, force: true });
}`,
  "tsconfig": `{
  // LabFlow TS — the course's standard config (Section 0.3). Node 22 runs .ts files itself (type stripping),
  // so tsc only CHECKS (noEmit) and imports keep their .ts extension.
  "compilerOptions": {
    "target": "es2024",
    "module": "nodenext",
    "types": ["node"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "allowImportingTsExtensions": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}`,
  "labTsconfig": `{
  "extends": "../tsconfig.json",
  "include": ["src", "test", "kiem/phai-dung.ts"]
}`,
  "saiJs": `// Lab 1 — the same 8 wrong calls, run against the ORIGINAL JavaScript rules (js/). What would a user see?
import { parseTime, formatTime } from '../../js/time.js';
import { checkSlot, needsApproval, createBooking, usageRate } from '../../js/booking.js';

const input = { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' };
const calls = [
  ['S1', () => parseTime(420)],
  ['S2', () => formatTime('07:30')],
  ['S3', () => checkSlot('08:00')],
  ['S4', () => needsApproval({ seat: 31, role: 'STUDENT' })],
  ['S5', () => needsApproval({ seats: 31, role: 'lecturer' })],
  ['S6', () => createBooking(input).minute],
  ['S7', () => (createBooking(input).status === 'APPROVED' ? 'branch ran' : 'branch skipped')],
  ['S8', () => usageRate([{ minute: 60 }])],
];
for (const [id, call] of calls) {
  try {
    const v = call();
    console.log(id, 'returned', typeof v === 'string' ? JSON.stringify(v) : String(v));
  } catch (e) {
    console.log(id, 'threw', e.constructor.name + ':', e.message);
  }
}`,
  "demoTsconfig": `{
  // Lab 1 — show what tsc INFERS for attempt B (lab1/vua): emit only the .d.ts files, read them.
  "extends": "../../tsconfig.json",
  "compilerOptions": { "noEmit": false, "declaration": true, "emitDeclarationOnly": true, "rootDir": "../../lab1/vua", "outDir": "./d" },
  "include": ["../../lab1/vua"]
}`,
};
export const OUT = {
  'l1-npm-ci': `$ npm ci

added 4 packages, and audited 5 packages in 4s

found 0 vulnerabilities`,
  'l10-vua-dts': `$ npx tsc -p demo1/ts-lab-1 && cat demo1/ts-lab-1/d/booking.d.ts
export declare const OPEN: number;
export declare const CLOSE: number;
export declare const STEP = 30;
export declare const MAX_MINUTES = 240;
export declare const MAX_DAYS_AHEAD = 14;
export declare const APPROVAL_SEATS = 30;
export declare function checkSlot(start: string, end: string): {
    ok: boolean;
    code: string;
    minutes?: undefined;
} | {
    code?: undefined;
    ok: boolean;
    minutes: number;
};
export declare function isWithinBookingWindow(daysAhead: number): boolean;
export declare function needsApproval({ seats, role }: {
    seats: number;
    role: string;
}): boolean;
export declare function createBooking({ lab, seats, role, start, end }: {
    lab: string;
    seats: number;
    role: string;
    start: string;
    end: string;
}): {
    lab: string;
    start: string;
    end: string;
    minutes: number | undefined;
    status: string;
};
export declare function usageRate(bookings: {
    minutes: number;
}[]): number;`,
  'l2-ref-check': `$ npm run typecheck && npm test

> labflow-ts@1.0.0 typecheck
> tsc --noEmit -p tsconfig.json


> labflow-ts@1.0.0 test
> node --test --test-reporter=spec "src/**/*.test.ts"

✔ 08:00–10:00 is a 120-minute slot (1.491ms)
✔ 08:15 is off the 30-minute grid (0.086375ms)
✔ a student needs approval above 30 seats (BR-06) (0.085833ms)
✔ a lecturer never needs approval (0.050042ms)
✔ createBooking returns a PENDING 31-seat student booking (0.153875ms)
✔ two 7-hour days fill the lab once (0.067209ms)
✔ 07:00 is minute 420 (0.508584ms)
✔ rejects "7:00" (needs two digits) (0.224208ms)
✔ rejects 24:00 (0.064083ms)
✔ formats minute 450 as 07:30 (0.0615ms)
ℹ tests 10
ℹ suites 0
ℹ pass 10
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 83.915042`,
  'l3-starter': `$ npm run lab1

> labflow-ts@1.0.0 lab1
> node scripts/cham-lab-1.mjs

✗ A  your src/ compiles (strict) — 0/2
    src/booking.ts(10,27): error TS7006: Parameter 'start' implicitly has an 'any' type.
    src/booking.ts(10,34): error TS7006: Parameter 'end' implicitly has an 'any' type.
    src/booking.ts(20,39): error TS7006: Parameter 'daysAhead' implicitly has an 'any' type.
    src/booking.ts(24,33): error TS7031: Binding element 'seats' implicitly has an 'any' type.
✗ B  correct calls still compile — 0/1
    kiem/phai-dung.ts(9,9): error TS2322: Type 'number | undefined' is not assignable to type 'number'.
    kiem/phai-dung.ts(14,7): error TS2322: Type 'string' is not assignable to type '"CONFIRMED" | "PENDING"'.
✓ C  no any / no @ts- directives — 1/1
✗ D  behaviour tests pass (0/15) — 0/2
    # Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/labflow-ts/.cham-lab1/src/time.js' imported from …/labflow-ts/.cham-lab1/src/booking.ts
      error: 'test failed'
    ✗ S1 a number is not "HH:MM" — expected TS2345, got no error
    ✗ S2 formatTime takes minutes — expected TS2345, got no error
    ✓ S3 the end time is missing — expected TS2554, got TS2554
    ✓ S4 typo: seat instead of seats — expected TS2561, got TS2561
    ✗ S5 roles are upper-case — expected TS2820, got no error
    ✓ S6 typo: minute instead of minutes — expected TS2551, got TS2551
    ✗ S7 there is no APPROVED status — expected TS2367, got no error
    ✗ S8 typo inside a list of bookings — expected TS2561, got no error
✗ E  wrong calls refused (3/8) — 1.5/4

Score: 2.5/10 — NOT YET (pass mark 7)`,
  'l4-starter-tsc': `$ npx tsc -p lab1
lab1/kiem/phai-dung.ts(9,9): error TS2322: Type 'number | undefined' is not assignable to type 'number'.
  Type 'undefined' is not assignable to type 'number'.
lab1/kiem/phai-dung.ts(14,7): error TS2322: Type 'string' is not assignable to type '"CONFIRMED" | "PENDING"'.
lab1/src/booking.ts(10,27): error TS7006: Parameter 'start' implicitly has an 'any' type.
lab1/src/booking.ts(10,34): error TS7006: Parameter 'end' implicitly has an 'any' type.
lab1/src/booking.ts(20,39): error TS7006: Parameter 'daysAhead' implicitly has an 'any' type.
lab1/src/booking.ts(24,33): error TS7031: Binding element 'seats' implicitly has an 'any' type.
lab1/src/booking.ts(24,40): error TS7031: Binding element 'role' implicitly has an 'any' type.
lab1/src/booking.ts(32,33): error TS7031: Binding element 'lab' implicitly has an 'any' type.
lab1/src/booking.ts(32,38): error TS7031: Binding element 'seats' implicitly has an 'any' type.
lab1/src/booking.ts(32,45): error TS7031: Binding element 'role' implicitly has an 'any' type.
lab1/src/booking.ts(32,51): error TS7031: Binding element 'start' implicitly has an 'any' type.
lab1/src/booking.ts(32,58): error TS7031: Binding element 'end' implicitly has an 'any' type.
lab1/src/booking.ts(45,27): error TS7006: Parameter 'bookings' implicitly has an 'any' type.
lab1/src/time.ts(2,27): error TS7006: Parameter 'text' implicitly has an 'any' type.
lab1/src/time.ts(11,28): error TS7006: Parameter 'minutes' implicitly has an 'any' type.`,
  'l5-starter-run': `$ node --test --test-reporter=spec lab1/test/rules.test.ts
node:internal/modules/esm/resolve:275
    throw new ERR_MODULE_NOT_FOUND(
          ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/labflow-ts/lab1/src/time.js' imported from …/labflow-ts/lab1/src/booking.ts
    at finalizeResolution (node:internal/modules/esm/resolve:275:11)
    at moduleResolve (node:internal/modules/esm/resolve:865:10)
    at defaultResolve (node:internal/modules/esm/resolve:989:11)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:747:20)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:724:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:320:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:182:49) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file://…/labflow-ts/lab1/src/time.js'
}

Node.js v22.23.3
✖ lab1/test/rules.test.ts (62.873ms)
ℹ tests 1
ℹ suites 0
ℹ pass 0
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 67.313625

✖ failing tests:

test at lab1/test/rules.test.ts:1:1
✖ lab1/test/rules.test.ts (62.873ms)
  'test failed'`,
  'l6-yeu': `$ node scripts/cham-lab-1.mjs --from lab1/yeu
✓ A  your src/ compiles (strict) — 2/2
✓ B  correct calls still compile — 1/1
✗ C  no any / no @ts- directives — 0/1
    found: any
✓ D  behaviour tests pass (15/15) — 2/2
    ✗ S1 a number is not "HH:MM" — expected TS2345, got no error
    ✗ S2 formatTime takes minutes — expected TS2345, got no error
    ✓ S3 the end time is missing — expected TS2554, got TS2554
    ✗ S4 typo: seat instead of seats — expected TS2561, got no error
    ✗ S5 roles are upper-case — expected TS2820, got no error
    ✗ S6 typo: minute instead of minutes — expected TS2551, got no error
    ✗ S7 there is no APPROVED status — expected TS2367, got no error
    ✗ S8 typo inside a list of bookings — expected TS2561, got no error
✗ E  wrong calls refused (1/8) — 0.5/4

Score: 5.5/10 — NOT YET (pass mark 7)`,
  'l7-vua': `$ node scripts/cham-lab-1.mjs --from lab1/vua
✓ A  your src/ compiles (strict) — 2/2
✗ B  correct calls still compile — 0/1
    kiem/phai-dung.ts(9,9): error TS2322: Type 'number | undefined' is not assignable to type 'number'.
    kiem/phai-dung.ts(14,7): error TS2322: Type 'string' is not assignable to type '"CONFIRMED" | "PENDING"'.
    kiem/phai-dung.ts(15,33): error TS2322: Type '{ lab: string; start: string; end: string; minutes: number | undefined; status: string; }' is not assignable to type '{ minutes: number; }'.
✓ C  no any / no @ts- directives — 1/1
✓ D  behaviour tests pass (15/15) — 2/2
    ✓ S1 a number is not "HH:MM" — expected TS2345, got TS2345
    ✓ S2 formatTime takes minutes — expected TS2345, got TS2345
    ✓ S3 the end time is missing — expected TS2554, got TS2554
    ✓ S4 typo: seat instead of seats — expected TS2561, got TS2561
    ✗ S5 roles are upper-case — expected TS2820, got no error
    ✓ S6 typo: minute instead of minutes — expected TS2551, got TS2551
    ✗ S7 there is no APPROVED status — expected TS2367, got no error
    ✓ S8 typo inside a list of bookings — expected TS2561, got TS2561
✗ E  wrong calls refused (6/8) — 3/4

Score: 8/10 — PASS (pass mark 7)`,
  'l8-ref': `$ node scripts/cham-lab-1.mjs --from src/rules
✓ A  your src/ compiles (strict) — 2/2
✓ B  correct calls still compile — 1/1
✓ C  no any / no @ts- directives — 1/1
✓ D  behaviour tests pass (15/15) — 2/2
    ✓ S1 a number is not "HH:MM" — expected TS2345, got TS2345
    ✓ S2 formatTime takes minutes — expected TS2345, got TS2345
    ✓ S3 the end time is missing — expected TS2554, got TS2554
    ✓ S4 typo: seat instead of seats — expected TS2561, got TS2561
    ✓ S5 roles are upper-case — expected TS2820, got TS2820
    ✓ S6 typo: minute instead of minutes — expected TS2551, got TS2551
    ✓ S7 there is no APPROVED status — expected TS2367, got TS2367
    ✓ S8 typo inside a list of bookings — expected TS2561, got TS2561
✓ E  wrong calls refused (8/8) — 4/4

Score: 10/10 — PASS (pass mark 7)`,
  'l9-sai-js': `$ node demo1/ts-lab-1/sai-js.mjs
S1 threw TypeError: Invalid time "420", expected HH:MM
S2 returned "NaN:NaN"
S3 threw TypeError: Invalid time "undefined", expected HH:MM
S4 threw RangeError: seats must be a positive integer, got undefined
S5 returned true
S6 returned undefined
S7 returned "branch skipped"
S8 returned NaN`,
};
