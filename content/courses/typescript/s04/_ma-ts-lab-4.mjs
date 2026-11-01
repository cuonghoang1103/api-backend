/**
 * _ma (bài Lab 4) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "labTsconfig": `{
  "extends": "../tsconfig.json",
  "include": ["src", "test", "kiem/phai-dung.ts"]
}`,
  "starter": `// LabFlow — data model (a teammate's first version). It compiles under strict. Is it right?
import type { Role } from './booking.ts';

export type Lab = {
  code: string;
  name: string;
  capacity?: number; // "made optional: the seed did not compile without it"
  equipment: string[];
};

export type User = {
  id: number;
  createdAt: string;
  email: string;
  name: string;
  role: string;
  studentCode?: string;
};

export type BookingRecord = {
  id: number;
  createdAt: string;
  lab: string;
  userId: number;
  range: number[];
  seats: number;
  status: string;
  note: string | null;
};

export type BookingView = BookingRecord & { labName: string; userName: string };

export type LabTable = { [code: string]: Lab };

export const LAB_INFO: LabTable = {
  'BE-201': { code: 'BE-201', name: 'Backend Lab 1', capacity: 40, equipment: ['projector', 'whiteboard'] },
  'BE-202': { code: 'BE-202', name: 'Backend Lab 2', capacity: 40, equipment: [] },
  'AL-301': { code: 'AL-301', name: 'AI Lab', capacity: 30, equipment: ['GPU server'] },
};

export function labName(code: string): string {
  return LAB_INFO[code]?.name ?? 'unknown lab';
}

export function freeSeats(lab: Lab, booked: number): number {
  return Math.max(0, (lab.capacity ?? 0) - booked);
}

export function seatsByLab(bookings: BookingRecord[]): { [lab: string]: number } {
  const total: { [lab: string]: number } = {};
  for (const b of bookings) {
    if (b.status !== 'CANCELLED') total[b.lab] = (total[b.lab] ?? 0) + b.seats;
  }
  return total;
}

export function indexById(users: User[]): { [id: number]: User } {
  const byId: { [id: number]: User } = {};
  for (const u of users) byId[u.id] = u;
  return byId;
}

export function withStatus(b: BookingRecord, status: string): BookingRecord {
  b.status = status;
  return b;
}

export function toView(b: BookingRecord, users: { [id: number]: User }): BookingView {
  return { ...b, labName: labName(b.lab), userName: users[b.userId]?.name ?? '(deleted user)' };
}`,
  "dung": `// Lab 4 — CORRECT uses. They must keep compiling with your types (part B).
import { LAB_INFO, labName, freeSeats, seatsByLab, indexById, withStatus, toView } from '../src/model.ts';
import type { Lab, User, BookingRecord, BookingView } from '../src/model.ts';
import { LABS } from '../src/schedule.ts';

const an: User = { id: 1, createdAt: '2026-11-01T08:00:00Z', email: 'an.nv@fpt.edu.vn', name: 'An', role: 'STUDENT', studentCode: 'HE176322' };
const rec: BookingRecord = { id: 10, createdAt: '2026-11-01T09:00:00Z', lab: 'BE-201', userId: 1, range: [480, 600], seats: 30, status: 'PENDING', note: null };

for (const code of LABS) {
  const capacity: number = LAB_INFO[code].capacity;            // every lab is there: no undefined to check
  console.log(labName(code), capacity);
}
const lab: Lab = LAB_INFO['AL-301'];
const tools: number = lab.equipment?.length ?? 0;             // optional: checked before use
const free: number = freeSeats(lab, 12);
const perLab: number = seatsByLab([rec])['BE-202'];          // a number, not number | undefined
const byId = indexById([an]);
const maybe: User | undefined = byId[1];                      // an open key set may miss
const approved: BookingRecord = withStatus(rec, 'CONFIRMED');
const view: BookingView = toView(rec, byId);
const room: Lab = { code: 'BE-202', name: 'Backend Lab 2', capacity: 40, equipment: [] };   // recorded: nothing
console.log(tools, free, perLab, maybe, approved, view.labName, room);`,
  "sai": `// Lab 4 — eight uses that are WRONG. Your types must make tsc refuse every one of them.
// The grader compiles this file against YOUR src/ and expects one error, with this code, on each marked line.
import { LAB_INFO } from '../src/model.ts';
import type { Lab, User, BookingRecord } from '../src/model.ts';

declare const lab: Lab;
declare const record: BookingRecord;

const ai: Lab = { code: 'AL-301', name: 'AI Lab' };                       // S1 TS2741 a lab without a capacity
const typo: Lab = { code: 'BE-201', name: 'Backend Lab 1', capasity: 40 }; // S2 TS2561 a misspelled property
const t: User = { id: 3, createdAt: '2026-11-01', email: 't@fpt.edu.vn', name: 'T', role: 'TEACHER' }; // S3 TS2322 there is no TEACHER role
record.status = 'CONFIRMED';                                               // S4 TS2540 a stored record is changed with withStatus
lab.equipment?.push('printer');                                            // S5 TS2339 nobody edits a lab's equipment list in place
const n = lab.equipment.length;                                            // S6 TS18048 equipment may not be recorded yet
const ghost = LAB_INFO['BE-999'];                                          // S7 TS7053 there is no lab BE-999
const anon: User = { email: 'x@fpt.edu.vn', name: 'X', role: 'STUDENT' };  // S8 TS2739 a user has an id and a createdAt
export { ai, typo, t, n, ghost, anon };`,
  "saiChay": `// Lab 4 — the eight wrong uses, run by Node against the STARTER model (lab4/src/model.ts). Types are erased: this is what users would see.
import { LAB_INFO, freeSeats, labName, indexById } from '../../lab4/src/model.ts';
import { needsApproval } from '../../lab4/src/booking.ts';

const run = (id: string, what: () => unknown) => {
  try {
    console.log(id, JSON.stringify(what()));
  } catch (e) {
    console.log(id, 'throws', (e as Error).constructor.name + ':', (e as Error).message);
  }
};
const record = { id: 11, createdAt: '2026-11-01', lab: 'AL-301', userId: 2, range: [600, 720], seats: 25, status: 'PENDING', note: null };
const pendingList = [record];

run('S1 a lab without a capacity: free seats =', () => freeSeats(JSON.parse('{"code":"AL-301","name":"AI Lab","equipment":[]}'), 10));
run('S2 capasity: free seats =', () => freeSeats(JSON.parse('{"code":"BE-201","name":"Backend Lab 1","capasity":40,"equipment":[]}'), 10));
run('S3 a TEACHER books 40 seats, needs approval =', () => needsApproval(JSON.parse('{"seats":40,"role":"TEACHER"}')));
run('S4 record.status = CONFIRMED, the pending list now shows =', () => { record.status = 'CONFIRMED'; return pendingList.map((b) => b.status); });
run('S5 push printer into BE-202, LAB_INFO now says =', () => { LAB_INFO['BE-202']?.equipment.push('printer'); return LAB_INFO['BE-202']?.equipment; });
run('S6 equipment.length of a lab from the database =', () => JSON.parse('{"code":"BE-202","name":"Backend Lab 2","capacity":40}').equipment.length);
run('S7 BE-999: lab, name =', () => String(LAB_INFO['BE-999']) + ', ' + labName('BE-999'));
run('S8 a user without an id, indexed by id: keys =', () => Object.keys(indexById([JSON.parse('{"email":"x@fpt.edu.vn","name":"X","role":"STUDENT"}')])));`,
  "grader": `// Lab 4 grader — "The LabFlow data model".   node scripts/cham-lab-4.mjs [--from <folder with model.ts>]
// Copies YOUR model.ts (plus the course’s time.ts, booking.ts, schedule.ts) into a fresh folder next to the grader-owned tests, then scores 10 points:
//   A  tsc: your model.ts compiles under the course tsconfig (strict) ........................ 2
//   B  tsc: the correct uses in kiem/phai-dung.ts still compile ............................ 1
//   C  honesty: no any, no "as" cast (as const is fine), no "!", no @ts- ................... 1
//   D  node --test: the 10 behaviour tests in test/model.test.ts pass ................... 2
//   E  the 8 wrong uses in kiem/sai.ts are each refused with the right code ............... 8 × 0.5
import { execFileSync } from 'node:child_process';
import { cpSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const i = process.argv.indexOf('--from');
const from = path.resolve(i > 0 ? process.argv[i + 1] : path.join(root, 'lab4/src'));
const tmp = path.join(root, '.cham-lab4');
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
  cpSync(path.join(from, 'model.ts'), path.join(tmp, 'src/model.ts'));
  for (const f of ['time.ts', 'booking.ts', 'schedule.ts']) cpSync(path.join(root, 'src/rules', f), path.join(tmp, 'src', f));
  cpSync(path.join(root, 'lab4/test'), path.join(tmp, 'test'), { recursive: true });
  cpSync(path.join(root, 'lab4/kiem'), path.join(tmp, 'kiem'), { recursive: true });
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
  line(a.code === 0, a.code === 0 ? 2 : 0, 2, 'A  your model.ts compiles (strict)', a.code ? a.out : '');
  const b = tsc('b.json');
  const bErr = errorsIn(b.out, 'kiem/phai-dung.ts');
  line(bErr.length === 0, bErr.length === 0 ? 1 : 0, 1, 'B  correct uses still compile', bErr.join('\\n'));

  const src = codeOnly(readFileSync(path.join(tmp, 'src/model.ts'), 'utf8'));
  const cheats = [...src.matchAll(/\\bany\\b|@ts-(?:ignore|nocheck|expect-error)|\\bas\\s+(?!const\\b)\\w+|[\\w$]+!(?=[.[;,)\\s])|[)\\]]!(?=[.[;,)\\s])/g)].map((m) => m[0].trim());
  line(cheats.length === 0, cheats.length === 0 ? 1 : 0, 1, 'C  no any / as / ! / @ts-', cheats.length ? 'found: ' + [...new Set(cheats)].join(', ') : '');

  const d = run(process.execPath, ['--test', '--test-reporter=tap', 'test/model.test.ts']);
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
  "yeu": `// Attempt A — "a flexible model": the tests pass, and nothing complains any more.
export interface Lab {
  code: string;
  name: string;
  capacity: number;
  equipment?: string[];
  [extra: string]: any; // room for whatever the seed adds later
}

export interface User {
  id: number;
  createdAt: string;
  email: string;
  name: string;
  role: string;
  studentCode?: string;
}

export interface BookingRecord {
  id: number;
  createdAt: string;
  lab: string;
  userId: number;
  range: number[];
  seats: number;
  status: string;
  note: string | null;
}

export type BookingView = BookingRecord & { labName: string; userName: string };

export const LAB_INFO: any = {
  'BE-201': { code: 'BE-201', name: 'Backend Lab 1', capacity: 40, equipment: ['projector', 'whiteboard'] },
  'BE-202': { code: 'BE-202', name: 'Backend Lab 2', capacity: 40 },
  'AL-301': { code: 'AL-301', name: 'AI Lab', capacity: 30, equipment: ['GPU server'] },
};

export function labName(code: string): string {
  return LAB_INFO[code].name;
}

export function freeSeats(lab: Lab, booked: number): number {
  return Math.max(0, lab.capacity - booked);
}

export function seatsByLab(bookings: BookingRecord[]): any {
  const total: any = { 'BE-201': 0, 'BE-202': 0, 'AL-301': 0 };
  for (const b of bookings) {
    if (b.status !== 'CANCELLED') total[b.lab] += b.seats;
  }
  return total;
}

export function indexById(users: User[]): { [id: number]: User } {
  const byId: { [id: number]: User } = {};
  for (const u of users) byId[u.id] = u;
  return byId;
}

export function withStatus(b: BookingRecord, status: string): BookingRecord {
  return { ...b, status };
}

export function toView(b: BookingRecord, users: { [id: number]: User }): BookingView {
  return { ...b, labName: labName(b.lab), userName: users[b.userId]?.name ?? '(deleted user)' };
}`,
  "vua": `// Attempt B — interfaces, literal unions, a required capacity. No readonly, and the lab table is an open dictionary.
import type { Role } from './booking.ts';
import type { LabCode, TimeRange } from './schedule.ts';

export interface Entity {
  id: number;
  createdAt: string;
}

export interface Lab {
  code: LabCode;
  name: string;
  capacity: number;
  equipment?: string[];
}

export interface User extends Entity {
  email: string;
  name: string;
  role: Role;
  studentCode?: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface BookingRecord extends Entity {
  lab: LabCode;
  userId: number;
  range: TimeRange;
  seats: number;
  status: BookingStatus;
  note: string | null;
}

export type BookingView = BookingRecord & { labName: string; userName: string };

export const LAB_INFO: { [code: string]: Lab } = {
  'BE-201': { code: 'BE-201', name: 'Backend Lab 1', capacity: 40, equipment: ['projector', 'whiteboard'] },
  'BE-202': { code: 'BE-202', name: 'Backend Lab 2', capacity: 40 },
  'AL-301': { code: 'AL-301', name: 'AI Lab', capacity: 30, equipment: ['GPU server'] },
};

export function labName(code: LabCode): string {
  return LAB_INFO[code]?.name ?? code;
}

export function freeSeats(lab: Lab, booked: number): number {
  return Math.max(0, lab.capacity - booked);
}

export function seatsByLab(bookings: readonly BookingRecord[]): { [lab: string]: number } {
  const total: { [lab: string]: number } = { 'BE-201': 0, 'BE-202': 0, 'AL-301': 0 };
  for (const b of bookings) {
    if (b.status !== 'CANCELLED') total[b.lab] = (total[b.lab] ?? 0) + b.seats;
  }
  return total;
}

export function indexById(users: readonly User[]): { [id: number]: User } {
  const byId: { [id: number]: User } = {};
  for (const u of users) byId[u.id] = u;
  return byId;
}

export function withStatus(b: BookingRecord, status: BookingStatus): BookingRecord {
  return { ...b, status };
}

export function toView(b: BookingRecord, users: { [id: number]: User }): BookingView {
  return { ...b, labName: labName(b.lab), userName: users[b.userId]?.name ?? '(deleted user)' };
}`,
  "ref": `// LabFlow — the data model: labs, users, stored bookings (Chapter 4, = Lab 4 reference solution).
import type { Role } from './booking.ts';
import type { LabCode, TimeRange } from './schedule.ts';

// Every stored record has an id and a creation time, both set once by the database.
export interface Entity {
  readonly id: number;
  readonly createdAt: string;
}

// A lab room. equipment is absent until someone records it ([] would mean "recorded: nothing").
export interface Lab {
  readonly code: LabCode;
  name: string;
  capacity: number;
  equipment?: readonly string[];
}

export interface User extends Entity {
  email: string;
  name: string;
  role: Role;
  studentCode?: string; // students only
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

// A stored booking is a snapshot: change it with withStatus, which returns a NEW record.
export interface BookingRecord extends Entity {
  readonly lab: LabCode;
  readonly userId: number;
  readonly range: TimeRange;
  readonly seats: number;
  readonly status: BookingStatus;
  readonly note: string | null;
}

// What the admin list shows: the record plus two names looked up elsewhere.
export type BookingView = BookingRecord & { labName: string; userName: string };

// One entry per lab — no more, no less. Add a lab to LABS and tsc points here.
export const LAB_INFO: Record<LabCode, Lab> = {
  'BE-201': { code: 'BE-201', name: 'Backend Lab 1', capacity: 40, equipment: ['projector', 'whiteboard'] },
  'BE-202': { code: 'BE-202', name: 'Backend Lab 2', capacity: 40 },
  'AL-301': { code: 'AL-301', name: 'AI Lab', capacity: 30, equipment: ['GPU server'] },
};

export function labName(code: LabCode): string {
  return LAB_INFO[code].name;
}

export function freeSeats(lab: Lab, booked: number): number {
  return Math.max(0, lab.capacity - booked);
}

// Seats booked per lab (cancelled bookings do not count). Every lab appears, even with 0.
export function seatsByLab(bookings: readonly BookingRecord[]): Record<LabCode, number> {
  const total: Record<LabCode, number> = { 'BE-201': 0, 'BE-202': 0, 'AL-301': 0 };
  for (const b of bookings) {
    if (b.status !== 'CANCELLED') total[b.lab] += b.seats;
  }
  return total;
}

// Users by id: ids arrive at runtime, so the key set is open. A read may miss: User | undefined.
export function indexById(users: readonly User[]): Record<number, User> {
  const byId: Record<number, User> = {};
  for (const u of users) byId[u.id] = u;
  return byId;
}

// A new record with another status; the original is untouched.
export function withStatus(b: BookingRecord, status: BookingStatus): BookingRecord {
  return { ...b, status };
}

export function toView(b: BookingRecord, users: Record<number, User>): BookingView {
  return { ...b, labName: labName(b.lab), userName: users[b.userId]?.name ?? '(deleted user)' };
}`,
  "test": `// Lab 4 — behaviour of the data model. Run: node --test --test-reporter=spec lab4/test/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LAB_INFO, labName, freeSeats, seatsByLab, indexById, withStatus, toView } from '../src/model.ts';
import type { BookingRecord, User } from '../src/model.ts';

const an: User = { id: 1, createdAt: '2026-11-01T08:00:00Z', email: 'an.nv@fpt.edu.vn', name: 'Nguyen Van An', role: 'STUDENT', studentCode: 'HE176322' };
const binh: User = { id: 2, createdAt: '2026-11-01T08:05:00Z', email: 'binh.tt@fpt.edu.vn', name: 'Tran Thi Binh', role: 'LECTURER' };
const b1: BookingRecord = { id: 10, createdAt: '2026-11-01T09:00:00Z', lab: 'BE-201', userId: 1, range: [480, 600], seats: 30, status: 'CONFIRMED', note: null };
const b2: BookingRecord = { ...b1, id: 11, lab: 'AL-301', userId: 2, seats: 25, status: 'PENDING', note: 'AI demo' };
const b3: BookingRecord = { ...b1, id: 12, seats: 5, status: 'CANCELLED' };

test('LAB_INFO has the three labs', () => assert.deepEqual(Object.keys(LAB_INFO), ['BE-201', 'BE-202', 'AL-301']));
test('labName', () => assert.equal(labName('AL-301'), 'AI Lab'));
test('freeSeats never goes below 0', () => {
  assert.equal(freeSeats(LAB_INFO['BE-201'], 30), 10);
  assert.equal(freeSeats(LAB_INFO['AL-301'], 35), 0);
});
test('equipment: BE-202 has not been recorded yet', () => assert.equal(LAB_INFO['BE-202'].equipment, undefined));
test('seatsByLab lists EVERY lab, even with 0', () => assert.deepEqual(seatsByLab([b1, b2]), { 'BE-201': 30, 'BE-202': 0, 'AL-301': 25 }));
test('seatsByLab ignores cancelled bookings', () => assert.deepEqual(seatsByLab([b1, b3]), { 'BE-201': 30, 'BE-202': 0, 'AL-301': 0 }));
test('indexById finds by id, misses with undefined', () => {
  const byId = indexById([an, binh]);
  assert.equal(byId[2]?.name, 'Tran Thi Binh');
  assert.equal(byId[99], undefined);
});
test('withStatus returns a NEW record and leaves the list alone', () => {
  const list = [b2];
  const approved = withStatus(b2, 'CONFIRMED');
  assert.equal(approved.status, 'CONFIRMED');
  assert.equal(list[0]?.status, 'PENDING');
});
test('toView adds the two names', () => {
  const v = toView(b2, indexById([an, binh]));
  assert.deepEqual([v.labName, v.userName, v.seats], ['AI Lab', 'Tran Thi Binh', 25]);
});
test('toView survives a deleted user', () => assert.equal(toView(b1, indexById([binh])).userName, '(deleted user)'));`,
};
export const OUT = {
  'l1-npm-ci': `$ npm ci

added 4 packages, and audited 5 packages in 4s

found 0 vulnerabilities
npm notice
npm notice New major version of npm available! 10.9.9 -> 12.2.1
npm notice Changelog: https://github.com/npm/cli/releases/tag/v12.2.1
npm notice To update run: npm install -g npm@12.2.1
npm notice`,
  'l2-ref-check': `$ npm run typecheck && npm test 2>&1 | grep -E '^ℹ (tests|pass|fail)'

> labflow-ts@1.0.0 typecheck
> tsc --noEmit -p tsconfig.json

ℹ tests 43
ℹ pass 43
ℹ fail 0`,
  'l4-strict': `$ npx tsc -p lab4/tsconfig.json | grep '^lab4/src/' || echo 'lab4/src: 0 errors'
lab4/src: 0 errors`,
  'l5-starter': `$ npm run lab4

> labflow-ts@1.0.0 lab4
> node scripts/cham-lab-4.mjs

✓ A  your model.ts compiles (strict) — 2/2
✗ B  correct uses still compile — 0/1
    kiem/phai-dung.ts(10,9): error TS2322: Type 'number | undefined' is not assignable to type 'number'.
    kiem/phai-dung.ts(10,28): error TS2532: Object is possibly 'undefined'.
    kiem/phai-dung.ts(13,7): error TS2322: Type 'Lab | undefined' is not assignable to type 'Lab'.
    kiem/phai-dung.ts(16,7): error TS2322: Type 'number | undefined' is not assignable to type 'number'.
✓ C  no any / as / ! / @ts- — 1/1
✗ D  behaviour tests pass (6/10) — 0/2
    failed: equipment: BE-202 has not been recorded yet
    failed: seatsByLab lists EVERY lab, even with 0
    failed: seatsByLab ignores cancelled bookings
    failed: withStatus returns a NEW record and leaves the list alone
    ✓ S1 a lab without a capacity — expected TS2741, got TS2741
    ✓ S2 a misspelled property — expected TS2561, got TS2561
    ✗ S3 there is no TEACHER role — expected TS2322, got no error
    ✗ S4 a stored record is changed with withStatus — expected TS2540, got no error
    ✗ S5 nobody edits a lab's equipment list in place — expected TS2339, got no error
    ✗ S6 equipment may not be recorded yet — expected TS18048, got no error
    ✗ S7 there is no lab BE-999 — expected TS7053, got no error
    ✓ S8 a user has an id and a createdAt — expected TS2739, got TS2739
✗ E  wrong uses refused (3/8) — 1.5/4

Score: 4.5/10 — NOT YET (pass mark 7)`,
  'l6-sai-chay': `$ node demo4/ts-lab-4/sai-chay.ts
S1 a lab without a capacity: free seats = 0
S2 capasity: free seats = 0
S3 a TEACHER books 40 seats, needs approval = true
S4 record.status = CONFIRMED, the pending list now shows = ["CONFIRMED"]
S5 push printer into BE-202, LAB_INFO now says = ["printer"]
S6 equipment.length of a lab from the database = throws TypeError: Cannot read properties of undefined (reading 'length')
S7 BE-999: lab, name = "undefined, unknown lab"
S8 a user without an id, indexed by id: keys = ["undefined"]`,
  'l7-yeu': `$ node scripts/cham-lab-4.mjs --from lab4/yeu
✓ A  your model.ts compiles (strict) — 2/2
✓ B  correct uses still compile — 1/1
✗ C  no any / as / ! / @ts- — 0/1
    found: any
✓ D  behaviour tests pass (10/10) — 2/2
    ✓ S1 a lab without a capacity — expected TS2741, got TS2741
    ✗ S2 a misspelled property — expected TS2561, got TS2741
    ✗ S3 there is no TEACHER role — expected TS2322, got no error
    ✗ S4 a stored record is changed with withStatus — expected TS2540, got no error
    ✗ S5 nobody edits a lab's equipment list in place — expected TS2339, got no error
    ✓ S6 equipment may not be recorded yet — expected TS18048, got TS18048
    ✗ S7 there is no lab BE-999 — expected TS7053, got no error
    ✓ S8 a user has an id and a createdAt — expected TS2739, got TS2739
✗ E  wrong uses refused (3/8) — 1.5/4

Score: 6.5/10 — NOT YET (pass mark 7)`,
  'l8-vua': `$ node scripts/cham-lab-4.mjs --from lab4/vua
✓ A  your model.ts compiles (strict) — 2/2
✗ B  correct uses still compile — 0/1
    kiem/phai-dung.ts(10,28): error TS2532: Object is possibly 'undefined'.
    kiem/phai-dung.ts(13,7): error TS2322: Type 'Lab | undefined' is not assignable to type 'Lab'.
    kiem/phai-dung.ts(16,7): error TS2322: Type 'number | undefined' is not assignable to type 'number'.
✓ C  no any / as / ! / @ts- — 1/1
✓ D  behaviour tests pass (10/10) — 2/2
    ✓ S1 a lab without a capacity — expected TS2741, got TS2741
    ✓ S2 a misspelled property — expected TS2561, got TS2561
    ✓ S3 there is no TEACHER role — expected TS2322, got TS2322
    ✗ S4 a stored record is changed with withStatus — expected TS2540, got no error
    ✗ S5 nobody edits a lab's equipment list in place — expected TS2339, got no error
    ✓ S6 equipment may not be recorded yet — expected TS18048, got TS18048
    ✗ S7 there is no lab BE-999 — expected TS7053, got no error
    ✓ S8 a user has an id and a createdAt — expected TS2739, got TS2739
✗ E  wrong uses refused (5/8) — 2.5/4

Score: 7.5/10 — PASS (pass mark 7)`,
  'l9-ref': `$ node scripts/cham-lab-4.mjs --from src/rules
✓ A  your model.ts compiles (strict) — 2/2
✓ B  correct uses still compile — 1/1
✓ C  no any / as / ! / @ts- — 1/1
✓ D  behaviour tests pass (10/10) — 2/2
    ✓ S1 a lab without a capacity — expected TS2741, got TS2741
    ✓ S2 a misspelled property — expected TS2561, got TS2561
    ✓ S3 there is no TEACHER role — expected TS2322, got TS2322
    ✓ S4 a stored record is changed with withStatus — expected TS2540, got TS2540
    ✓ S5 nobody edits a lab's equipment list in place — expected TS2339, got TS2339
    ✓ S6 equipment may not be recorded yet — expected TS18048, got TS18048
    ✓ S7 there is no lab BE-999 — expected TS7053, got TS7053
    ✓ S8 a user has an id and a createdAt — expected TS2739, got TS2739
✓ E  wrong uses refused (8/8) — 4/4

Score: 10/10 — PASS (pass mark 7)`,
};
