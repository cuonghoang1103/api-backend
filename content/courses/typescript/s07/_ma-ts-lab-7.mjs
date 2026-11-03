/**
 * _ma (bài Lab 7) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "labTsconfig": `{ "extends": "../tsconfig.json", "include": ["src", "test", "kiem/phai-dung.ts"] }`,
  "starter": `// LabFlow — a typed event system (a teammate's first version). It compiles. Is it right?
// The teammate used string names and \`any\` payloads to "make it flexible".

export type BookingAction = string;
export type BookingEvent = string;

export type EventPayloads = { [event: string]: any };
export type EventName = string;

export type PayloadOf<E> = any;

export class EventBus {
  private handlers: { [event: string]: Array<(payload: any) => void> } = {};

  on(name: string, handler: (payload: any) => void): void {
    (this.handlers[name] ??= []).push(handler);
  }
  emit(name: string, payload: any): void {
    for (const handler of this.handlers[name] ?? []) handler(payload);
  }
  count(name: string): number {
    return this.handlers[name]?.length ?? 0;
  }
}

// Frozen does nothing; Patch is a loose index signature.
export type Frozen<T> = T;
export type Patch<T> = { [key: string]: any };`,
  "sai": `// Lab 7 — eight uses that are WRONG. Your advanced types must make tsc refuse every one of them.
// The grader compiles this file against YOUR src/ and expects one error, with this code, on each marked line.
import { EventBus } from '../src/events.ts';
import type { BookingEvent, PayloadOf, Frozen, Patch } from '../src/events.ts';

declare const bus: EventBus;

bus.emit('booking:creatd', { id: 1, lab: 'BE-201' });                        // S1 TS2345 a misspelled event name
bus.emit('booking:created', { id: 1 });                                      // S2 TS2741 the created payload needs a lab
bus.on('booking:cancelled', (p) => { void p.reasn; });                       // S3 TS2551 the cancelled payload has no reasn
const e: BookingEvent = 'booking:expired';                                   // S4 TS2322 'expired' is not a booking event
type Bad = PayloadOf<'booking:deleted'>;                                     // S5 TS2344 'booking:deleted' is not an event
type Lab = { readonly code: string; name: string };
const f: Frozen<Lab> = { code: 'BE-201', name: 'X' };
f.name = 'Renamed';                                                          // S6 TS2540 Frozen makes every field read-only
const patch: Patch<{ id: number; name: string }> = { ides: 1 };              // S7 TS2353 a misspelled key in a PATCH body
bus.on('booking:confirmed', (p: { id: number; reason: string }) => { void p; }); // S8 TS2345 a handler asking for a wider payload
export { e, f, patch };`,
  "dung": `// Lab 7 — CORRECT uses. They must keep compiling with your types (part B).
import { EventBus } from '../src/events.ts';
import type { BookingEvent, EventName, PayloadOf, Frozen, Patch } from '../src/events.ts';

const bus = new EventBus();

// on/emit are typed per event: the handler's payload is exactly that event's payload.
bus.on('booking:created', (p) => console.log(p.id, p.lab));       // p: { id: number; lab: LabCode }
bus.on('booking:cancelled', (p) => console.log(p.reason));        // p: { id: number; reason: string }
bus.emit('booking:created', { id: 1, lab: 'BE-201' });
bus.emit('booking:cancelled', { id: 1, reason: 'exam week' });
const n: number = bus.count('booking:confirmed');

// The template literal event name, the conditional payload, and the two mapped types.
const name: BookingEvent = 'booking:confirmed';
const key: EventName = 'booking:created';
const payload: PayloadOf<'booking:created'> = { id: 1, lab: 'AL-301' };
const frozen: Frozen<{ code: string; seats: number }> = { code: 'BE-201', seats: 40 };
const seats: number = frozen.seats;                               // reading is fine; writing is not
const patch: Patch<{ id: number; name: string }> = { name: 'New name' }; // every field optional
console.log(n, name, key, payload, seats, patch);`,
  "grader": `// Lab 7 grader — "A typed event system".   node scripts/cham-lab-7.mjs [--from <folder with repo.ts>]
// Copies YOUR repo.ts (plus the course's model.ts, booking.ts, schedule.ts, time.ts) into a fresh folder next to the grader-owned tests, then scores 10 points:
//   A  tsc: your events.ts compiles under the course tsconfig (strict) ........................ 2
//   B  tsc: the correct uses in kiem/phai-dung.ts still compile ............................ 1
//   C  honesty: no any, no "as" cast (as const is fine), no "!", no @ts- ................... 1
//   D  node --test: the behaviour tests in test/events.test.ts pass ........................ 2
//   E  the 8 wrong uses in kiem/sai.ts are each refused with the right code ............... 8 × 0.5
import { execFileSync } from 'node:child_process';
import { cpSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const i = process.argv.indexOf('--from');
const from = path.resolve(i > 0 ? process.argv[i + 1] : path.join(root, 'lab7/src'));
const tmp = path.join(root, '.cham-lab7');
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
  cpSync(path.join(from, 'events.ts'), path.join(tmp, 'src/events.ts'));
  for (const f of ['model.ts', 'booking.ts', 'schedule.ts', 'time.ts']) cpSync(path.join(root, 'src/rules', f), path.join(tmp, 'src', f));
  cpSync(path.join(root, 'lab7/test'), path.join(tmp, 'test'), { recursive: true });
  cpSync(path.join(root, 'lab7/kiem'), path.join(tmp, 'kiem'), { recursive: true });
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
  line(a.code === 0, a.code === 0 ? 2 : 0, 2, 'A  your events.ts compiles (strict)', a.code ? a.out : '');
  const b = tsc('b.json');
  const bErr = errorsIn(b.out, 'kiem/phai-dung.ts');
  line(bErr.length === 0, bErr.length === 0 ? 1 : 0, 1, 'B  correct uses still compile', bErr.join('\\n'));

  const src = codeOnly(readFileSync(path.join(tmp, 'src/events.ts'), 'utf8'));
  const cheats = [...src.matchAll(/\\bany\\b|@ts-(?:ignore|nocheck|expect-error)|\\bas\\s+(?!const\\b)\\w+|[\\w$]+!(?=[.[;,)\\s])|[)\\]]!(?=[.[;,)\\s])/g)].map((m) => m[0].trim());
  line(cheats.length === 0, cheats.length === 0 ? 1 : 0, 1, 'C  no any / as / ! / @ts-', cheats.length ? 'found: ' + [...new Set(cheats)].join(', ') : '');

  const d = run(process.execPath, ['--test', '--test-reporter=tap', 'test/events.test.ts']);
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
  "yeu": `// Attempt A — typed event names and payloads, but a non-generic bus and Frozen does nothing.
import type { LabCode } from '../src/schedule.ts';

export type BookingAction = 'created' | 'confirmed' | 'cancelled';
export type BookingEvent = \`booking:\${BookingAction}\`;

export type EventPayloads = {
  'booking:created': { id: number; lab: LabCode };
  'booking:confirmed': { id: number };
  'booking:cancelled': { id: number; reason: string };
};
export type EventName = keyof EventPayloads;
export type PayloadOf<E extends EventName> = EventPayloads[E];

// Not generic per event: the handler payload is unknown, so callers cannot read fields without a check.
export class EventBus {
  private handlers: { [K in EventName]: Array<(payload: unknown) => void> } = {
    'booking:created': [],
    'booking:confirmed': [],
    'booking:cancelled': [],
  };
  on(name: EventName, handler: (payload: unknown) => void): void {
    this.handlers[name].push(handler);
  }
  emit(name: EventName, payload: unknown): void {
    for (const handler of this.handlers[name]) handler(payload);
  }
  count(name: EventName): number {
    return this.handlers[name].length;
  }
}

export type Frozen<T> = T; // does nothing
export type Patch<T> = { [K in keyof T]?: T[K] };`,
  "vua": `// Attempt B — fully typed event bus and Frozen, but Patch is a loose index signature.
import type { LabCode } from '../src/schedule.ts';

export type BookingAction = 'created' | 'confirmed' | 'cancelled';
export type BookingEvent = \`booking:\${BookingAction}\`;

export type EventPayloads = {
  'booking:created': { id: number; lab: LabCode };
  'booking:confirmed': { id: number };
  'booking:cancelled': { id: number; reason: string };
};
export type EventName = keyof EventPayloads;
export type PayloadOf<E extends EventName> = EventPayloads[E];

type HandlerMap = { [K in EventName]: Array<(payload: EventPayloads[K]) => void> };

export class EventBus {
  private handlers: HandlerMap = {
    'booking:created': [],
    'booking:confirmed': [],
    'booking:cancelled': [],
  };
  on<K extends EventName>(name: K, handler: (payload: EventPayloads[K]) => void): void {
    this.handlers[name].push(handler);
  }
  emit<K extends EventName>(name: K, payload: EventPayloads[K]): void {
    for (const handler of this.handlers[name]) handler(payload);
  }
  count<K extends EventName>(name: K): number {
    return this.handlers[name].length;
  }
}

export type Frozen<T> = { readonly [K in keyof T]: T[K] };
// Loose: any key is allowed, so a typo in a PATCH body is not caught.
export type Patch<T> = { [key: string]: unknown };`,
  "ref": `// LabFlow — a typed event system (Chapter 7, = Lab 7 reference solution).
// It combines mapped types, template literal types and conditional types from this chapter.
import type { LabCode } from './schedule.ts';

// The actions a booking goes through.
export type BookingAction = 'created' | 'confirmed' | 'cancelled';

// A template literal type: every event name is "booking:<action>".
export type BookingEvent = \`booking:\${BookingAction}\`; // 'booking:created' | 'booking:confirmed' | 'booking:cancelled'

// The payload each event carries — a plain map from event name to its data.
export type EventPayloads = {
  'booking:created': { id: number; lab: LabCode };
  'booking:confirmed': { id: number };
  'booking:cancelled': { id: number; reason: string };
};

export type EventName = keyof EventPayloads;

// A conditional type with infer: the payload type for a given event name.
export type PayloadOf<E extends EventName> = EventPayloads extends Record<E, infer P> ? P : never;

// A mapped type: one array of handlers per event name, each typed to that event's payload.
type HandlerMap = {
  [K in EventName]: Array<(payload: EventPayloads[K]) => void>;
};

// A typed event bus: on/emit know the exact payload of each event name.
// handlers has an entry for EVERY event (so a new event in EventPayloads forces one here too).
export class EventBus {
  private handlers: HandlerMap = {
    'booking:created': [],
    'booking:confirmed': [],
    'booking:cancelled': [],
  };

  on<K extends EventName>(name: K, handler: (payload: EventPayloads[K]) => void): void {
    this.handlers[name].push(handler);
  }

  emit<K extends EventName>(name: K, payload: EventPayloads[K]): void {
    for (const handler of this.handlers[name]) handler(payload);
  }

  count<K extends EventName>(name: K): number {
    return this.handlers[name].length;
  }
}

// A mapped type that makes every field of T read-only (the built-in Readonly<T>, written out).
export type Frozen<T> = { readonly [K in keyof T]: T[K] };

// A mapped type that makes every field optional (the built-in Partial<T>, written out) — a PATCH body.
export type Patch<T> = { [K in keyof T]?: T[K] };`,
  "test": `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventBus } from '../src/events.ts';

test('EventBus delivers the right payload per event', () => {
  const bus = new EventBus();
  const created: number[] = [];
  const cancelled: string[] = [];
  bus.on('booking:created', (p) => created.push(p.id));
  bus.on('booking:cancelled', (p) => cancelled.push(p.reason));

  bus.emit('booking:created', { id: 1, lab: 'BE-201' });
  bus.emit('booking:created', { id: 2, lab: 'AL-301' });
  bus.emit('booking:cancelled', { id: 1, reason: 'exam week' });
  bus.emit('booking:confirmed', { id: 2 }); // no handler — ignored

  assert.deepEqual(created, [1, 2]);
  assert.deepEqual(cancelled, ['exam week']);
});

test('count reports handlers per event', () => {
  const bus = new EventBus();
  bus.on('booking:created', () => {});
  bus.on('booking:created', () => {});
  assert.equal(bus.count('booking:created'), 2);
  assert.equal(bus.count('booking:confirmed'), 0);
});`,
};
export const OUT = {
  'l1-npm-ci': `$ npm ci

added 4 packages, and audited 5 packages in 957ms

found 0 vulnerabilities`,
  'l2-starter-tsc': `$ npx tsc -p lab7/tsconfig.src.json`,
  'l3-starter': `$ node scripts/cham-lab-7.mjs --from lab7/src
✓ A  your events.ts compiles (strict) — 2/2
✓ B  correct uses still compile — 1/1
✗ C  no any / as / ! / @ts- — 0/1
    found: any
✓ D  behaviour tests pass (2/2) — 2/2
    ✗ S1 a misspelled event name — expected TS2345, got no error
    ✗ S2 the created payload needs a lab — expected TS2741, got no error
    ✗ S3 the cancelled payload has no reasn — expected TS2551, got no error
    ✗ S4 'expired' is not a booking event — expected TS2322, got no error
    ✗ S5 'booking:deleted' is not an event — expected TS2344, got no error
    ✗ S6 Frozen makes every field read-only — expected TS2540, got no error
    ✗ S7 a misspelled key in a PATCH body — expected TS2353, got no error
    ✗ S8 a handler asking for a wider payload — expected TS2345, got no error
✗ E  wrong uses refused (0/8) — 0/4

Score: 5/10 — NOT YET (pass mark 7)`,
  'l4-yeu': `$ node scripts/cham-lab-7.mjs --from lab7/yeu
✓ A  your events.ts compiles (strict) — 2/2
✗ B  correct uses still compile — 0/1
    kiem/phai-dung.ts(8,46): error TS18046: 'p' is of type 'unknown'.
    kiem/phai-dung.ts(8,52): error TS18046: 'p' is of type 'unknown'.
    kiem/phai-dung.ts(9,48): error TS18046: 'p' is of type 'unknown'.
✓ C  no any / as / ! / @ts- — 1/1
✓ D  behaviour tests pass (2/2) — 2/2
    ✓ S1 a misspelled event name — expected TS2345, got TS2345
    ✗ S2 the created payload needs a lab — expected TS2741, got no error
    ✗ S3 the cancelled payload has no reasn — expected TS2551, got TS18046
    ✓ S4 'expired' is not a booking event — expected TS2322, got TS2322
    ✓ S5 'booking:deleted' is not an event — expected TS2344, got TS2344
    ✗ S6 Frozen makes every field read-only — expected TS2540, got no error
    ✓ S7 a misspelled key in a PATCH body — expected TS2353, got TS2353
    ✓ S8 a handler asking for a wider payload — expected TS2345, got TS2345
✗ E  wrong uses refused (5/8) — 2.5/4

Score: 7.5/10 — PASS (pass mark 7)`,
  'l5-vua': `$ node scripts/cham-lab-7.mjs --from lab7/vua
✓ A  your events.ts compiles (strict) — 2/2
✓ B  correct uses still compile — 1/1
✓ C  no any / as / ! / @ts- — 1/1
✓ D  behaviour tests pass (2/2) — 2/2
    ✓ S1 a misspelled event name — expected TS2345, got TS2345
    ✓ S2 the created payload needs a lab — expected TS2741, got TS2741
    ✓ S3 the cancelled payload has no reasn — expected TS2551, got TS2551
    ✓ S4 'expired' is not a booking event — expected TS2322, got TS2322
    ✓ S5 'booking:deleted' is not an event — expected TS2344, got TS2344
    ✓ S6 Frozen makes every field read-only — expected TS2540, got TS2540
    ✗ S7 a misspelled key in a PATCH body — expected TS2353, got no error
    ✓ S8 a handler asking for a wider payload — expected TS2345, got TS2345
✗ E  wrong uses refused (7/8) — 3.5/4

Score: 9.5/10 — PASS (pass mark 7)`,
  'l6-ref': `$ node scripts/cham-lab-7.mjs --from src/rules
✓ A  your events.ts compiles (strict) — 2/2
✓ B  correct uses still compile — 1/1
✓ C  no any / as / ! / @ts- — 1/1
✓ D  behaviour tests pass (2/2) — 2/2
    ✓ S1 a misspelled event name — expected TS2345, got TS2345
    ✓ S2 the created payload needs a lab — expected TS2741, got TS2741
    ✓ S3 the cancelled payload has no reasn — expected TS2551, got TS2551
    ✓ S4 'expired' is not a booking event — expected TS2322, got TS2322
    ✓ S5 'booking:deleted' is not an event — expected TS2344, got TS2344
    ✓ S6 Frozen makes every field read-only — expected TS2540, got TS2540
    ✓ S7 a misspelled key in a PATCH body — expected TS2353, got TS2353
    ✓ S8 a handler asking for a wider payload — expected TS2345, got TS2345
✓ E  wrong uses refused (8/8) — 4/4

Score: 10/10 — PASS (pass mark 7)`,
};
