/**
 * _ma.mjs (Chương 8) — SINH TỰ ĐỘNG bằng scripts/tst/sinh-ma.mjs từ dự án chạy thật. Đừng sửa tay.
 */
export const CODE = {
  vitestConfig: `import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: ['tree'],                 // print the describe → it tree
    expect: { requireAssertions: true }, // a test without any expect fails (lesson 1.1)
    restoreMocks: true,                  // undo every vi.spyOn before each test (lesson 2.4)
    exclude: [...configDefaults.exclude, 'test/integration/**', 'demo4/**', 'web/**', 'demo6/**', 'e2e/**', 'demo7/**', '.stryker-tmp/**'], // database: test:int · React: test:web · browser: test:e2e · Stryker sandboxes (8.2)
    coverage: {                          // lesson 8.1: npm run test:cov
      provider: 'v8',
      include: ['src/**/*.js'],          // count every source file, also the ones no test imports
      exclude: ['src/**/*.test.js', 'src/api/main.js', 'src/booking/pgRepo.js', 'src/app.js'], // main.js only calls listen · pgRepo.js: test:int · app.js: lesson 0.2, tested by test/pyramid.*
      reporter: [['text', { skipFull: false }], 'html', 'json-summary'],
      thresholds: { lines: 85, branches: 80, functions: 80, statements: 85 },
    },
    tags: [{ name: 'quarantine', description: 'known flaky: has an issue and an owner, not run in the main suite (lesson 8.3)' }],
  },
});`,
  pkg: `{
  "name": "labflow-lite",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "vitest run",
    "test:unit": "vitest run src/",
    "test:watch": "vitest",
    "test:int": "vitest run --config vitest.integration.config.js",
    "test:web": "vitest run --config vitest.web.config.js web/",
    "build:web": "vite build",
    "test:e2e": "playwright test e2e/ --project=chromium",
    "test:e2e:all": "playwright test e2e/",
    "test:cov": "vitest run src/ --coverage",
    "test:mutation": "stryker run"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "devDependencies": {
    "@playwright/test": "1.64.1",
    "@stryker-mutator/core": "10.1.1",
    "@stryker-mutator/vitest-runner": "10.1.1",
    "@testcontainers/postgresql": "^12.2.1",
    "@testing-library/dom": "10.4.2",
    "@testing-library/jest-dom": "7.0.1",
    "@testing-library/react": "16.3.3",
    "@testing-library/user-event": "14.6.8",
    "@vitest/coverage-istanbul": "5.0.5",
    "@vitest/coverage-v8": "5.0.5",
    "ajv": "8.20.0",
    "ajv-formats": "3.0.1",
    "fast-check": "^4.10.2",
    "happy-dom": "21.0.3",
    "jsdom": "30.1.3",
    "msw": "^3.0.3",
    "supertest": "^7.3.1",
    "testcontainers": "^12.2.1",
    "vite": "8.3.5",
    "vitest": "^5.0.5"
  },
  "dependencies": {
    "express": "^5.3.0",
    "jose": "6.2.12",
    "pg": "^8.23.1",
    "react": "19.3.1",
    "react-dom": "19.3.1",
    "zod": "4.6.7"
  }
}`,
  gitignore: `node_modules/
dist-web/
test-results/
playwright-report/
blob-report/
playwright/.auth/
coverage/
reports/
.stryker-tmp/`,
  strykerConfig: `// Mutation testing with StrykerJS (lesson 8.2): npm run test:mutation  (= npx stryker run)
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  testRunner: 'vitest',
  vitest: { configFile: 'vitest.config.js', dir: 'src' },   // the unit suite only: demo*/ holds tests that are red on purpose
  mutate: ['src/rules/**/*.js', '!src/**/*.test.js'],
  coverageAnalysis: 'perTest',                              // each mutant runs only the tests that reach its code
  reporters: ['clear-text', 'progress', 'html'],
  clearTextReporter: { allowEmojis: false, logTests: false },
  htmlReporter: { fileName: 'reports/mutation/index.html' },
  thresholds: { high: 90, low: 80, break: 80 },            // below 80% the command fails
  tempDirName: '.stryker-tmp',                              // excluded in vitest.config.js (a crashed run leaves a copy of src/ here)
};`,
  strykerYeu: `// Lesson 8.2: Stryker on booking.js, judged by the weak suite only.
export default {
  testRunner: 'vitest',
  vitest: { configFile: 'demo8/vitest.yeu.config.js' },
  mutate: ['src/rules/booking.js'],
  coverageAnalysis: 'perTest',
  reporters: ['clear-text', 'progress'],
  clearTextReporter: { allowEmojis: false, logTests: false },
  thresholds: { high: 80, low: 60, break: 60 },
  tempDirName: '.stryker-tmp',
};`,
  vitestYeu: `// Lesson 8.2: run ONLY the weak suite of lesson 8.1 (100% coverage of booking.js).
import { defineConfig, mergeConfig } from 'vitest/config';
import base from '../vitest.config.js';

export default mergeConfig(base, defineConfig({ test: { include: ['demo8/du-nhanh.test.js'] } }));`,
  booking: `import { parseTime } from './time.js';

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
  time: `// Convert between "HH:MM" and minutes since 00:00.
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
  days: `// BR-05 needs "days ahead" counted in Viet Nam's calendar (UTC+7), whatever the server's time zone.
const VN_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export function daysAheadVN(dateText, now = new Date()) {
  const todayVN = new Date(now.getTime() + VN_OFFSET_MS).toISOString().slice(0, 10);
  return Math.round((Date.parse(dateText + 'T00:00:00Z') - Date.parse(todayVN + 'T00:00:00Z')) / DAY_MS);
}`,
  code: `// Short booking codes students can read aloud: no 0/O and no 1/I to confuse.
export const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function makeBookingCode(random = Math.random, length = 6) {
  let code = '';
  for (let i = 0; i < length; i++) code += ALPHABET[Math.floor(random() * ALPHABET.length)];
  return 'LF-' + code;
}

// A tiny seeded random generator (mulberry32): same seed → same sequence, every run.
export function seededRandom(seed) {
  return function () {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Builds the stored booking; id and clock are parameters so tests can control them.
export function newBookingRecord(input, { newId = () => crypto.randomUUID(), now = () => new Date() } = {}) {
  return { id: newId(), code: makeBookingCode(), createdAt: now().toISOString(), ...input };
}`,
  server: `// LabFlow Lite HTTP API (Chapter 5). Express 5: errors thrown in async handlers reach the error middleware.
import express from 'express';
import { bookLab, BookingError } from '../booking/service.js';
import { BookingInput } from './schemas.js';

const RULE_CODES = ['OFF_GRID', 'END_BEFORE_START', 'OUTSIDE_HOURS', 'TOO_LONG'];
const fail = (res, status, code, extra = {}) => res.status(status).json({ error: { code, ...extra } });
const toPublic = (b) => ({ id: b.id, lab: b.lab, date: b.date, start: b.start, end: b.end, seats: b.seats, status: b.status, minutes: b.minutes });

export function createApp({ repo, auth }) {
  const app = express();
  app.use(express.json());

  const requireUser = async (req, res, next) => {
    const header = req.get('authorization') ?? '';
    if (!header.startsWith('Bearer ')) return fail(res, 401, 'UNAUTHENTICATED');
    try {
      req.user = await auth.verify(header.slice(7));
    } catch {
      return fail(res, 401, 'UNAUTHENTICATED');
    }
    next();
  };
  const requireRole = (role) => (req, res, next) => (req.user.role === role ? next() : fail(res, 403, 'FORBIDDEN'));

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  app.post('/api/bookings', requireUser, async (req, res) => {
    const parsed = BookingInput.safeParse(req.body);
    if (!parsed.success) {
      const details = parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
      return fail(res, 400, 'VALIDATION', { details });
    }
    const booking = await bookLab(repo, { ...parsed.data, role: req.user.role, userId: req.user.id });
    res.status(201).location('/api/bookings/' + booking.id).json(toPublic(booking));
  });

  app.get('/api/bookings/:id', requireUser, async (req, res) => {
    const booking = await repo.findById(Number(req.params.id));
    const mine = booking && (booking.userId === req.user.id || req.user.role === 'ADMIN');
    if (!mine) return fail(res, 404, 'NOT_FOUND');   // someone else's booking looks exactly like a missing one
    res.json(toPublic(booking));
  });

  app.get('/api/admin/bookings', requireUser, requireRole('ADMIN'), async (req, res) => {
    res.json((await repo.list()).map(toPublic));
  });

  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') return fail(res, 400, 'BAD_JSON');
    if (err instanceof BookingError) {
      if (RULE_CODES.includes(err.code)) return fail(res, 422, err.code);
      if (err.code === 'OVERLAP') return fail(res, 409, 'OVERLAP');
      if (err.code === 'STORAGE_DOWN') return fail(res, 503, 'STORAGE_DOWN');
    }
    return fail(res, 500, 'INTERNAL');
  });
  return app;
}`,
  loginGuard: `// BR-02: 5 wrong passwords in a row lock the account for 15 minutes.
export const MAX_FAILURES = 5;
export const LOCK_MINUTES = 15;

export function createLoginGuard(now = () => Date.now()) {
  const state = new Map(); // email -> { failures, lockedUntil }
  return {
    isLocked(email) {
      const s = state.get(email);
      return Boolean(s && s.lockedUntil > now());
    },
    recordFailure(email) {
      const s = state.get(email) ?? { failures: 0, lockedUntil: 0 };
      s.failures += 1;
      if (s.failures >= MAX_FAILURES) {
        s.lockedUntil = now() + LOCK_MINUTES * 60000;
        s.failures = 0;
      }
      state.set(email, s);
    },
    recordSuccess(email) {
      state.delete(email);
    },
  };
}`,
  retry: `// Call fn up to \`attempts\` times; wait delayMs, then 2 × delayMs, … between attempts.
export async function retry(fn, { attempts = 3, delayMs = 1000 } = {}) {
  let lastError;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn(i);
    } catch (err) {
      lastError = err;
      if (i < attempts) await new Promise((resolve) => setTimeout(resolve, delayMs * i));
    }
  }
  throw lastError;
}`,
  service: `import { checkSlot, needsApproval } from '../rules/booking.js';

export class BookingError extends Error {
  constructor(code, options) {
    super(code, options);
    this.name = 'BookingError';
    this.code = code;
  }
}

// An in-memory "database" whose methods are async, like a real one.
export function createMemoryRepo() {
  const rows = [];
  const latency = () => new Promise((resolve) => setTimeout(resolve, 5));
  return {
    async findOverlap(lab, date, start, end) {
      await latency();
      return rows.find((b) => b.lab === lab && b.date === date && b.start < end && start < b.end) ?? null;
    },
    async insert(booking) {
      await latency();
      const row = { id: rows.length + 1, ...booking };
      rows.push(row);
      return row;
    },
    async findById(id) {
      await latency();
      return rows.find((b) => b.id === id) ?? null;
    },
    async list() {
      await latency();
      return [...rows];
    },
    count: () => rows.length,
  };
}

export async function bookLab(repo, input) {
  const slot = checkSlot(input.start, input.end);
  if (!slot.ok) throw new BookingError(slot.code);
  let clash;
  try {
    clash = await repo.findOverlap(input.lab, input.date, input.start, input.end);
  } catch (err) {
    throw new BookingError('STORAGE_DOWN', { cause: err });
  }
  if (clash) throw new BookingError('OVERLAP');
  const status = needsApproval(input) ? 'PENDING' : 'CONFIRMED';
  try {
    return await repo.insert({ ...input, minutes: slot.minutes, status });
  } catch (err) {
    if (err instanceof BookingError) throw err; // Chapter 4: the database itself can say OVERLAP
    throw new BookingError('STORAGE_DOWN', { cause: err });
  }
}`,
  notify: `// After a booking: tell the student it is confirmed, or ask an approver (BR-06 bookings are PENDING).
import { bookLab } from '../booking/service.js';

export const APPROVER = 'approvals@labflow.example';

// Pure: which e-mail a booking needs. No I/O, so it is tested without any double.
export function buildMail(booking, studentEmail) {
  const when = booking.lab + ' on ' + booking.date + ' at ' + booking.start;
  if (booking.status === 'CONFIRMED') return { to: studentEmail, subject: 'Booking confirmed: ' + when };
  return { to: APPROVER, subject: 'Approval needed: ' + booking.seats + ' seats, ' + when };
}

// A failed e-mail must not undo a saved booking: report it and carry on.
export async function bookAndNotify({ repo, mailer, log = console }, input) {
  const booking = await bookLab(repo, input);
  try {
    await mailer.send(buildMail(booking, input.email));
    return { ...booking, notified: true };
  } catch (err) {
    log.warn('mail failed for booking ' + booking.id + ': ' + err.message);
    return { ...booking, notified: false };
  }
}`,
  mailer: `// Adapter around the e-mail provider's HTTP API. The rest of LabFlow Lite only sees mailer.send({ to, subject }).
export class MailError extends Error {
  constructor(code, options) {
    super(code, options);
    this.name = 'MailError';
    this.code = code;
  }
}

export function createHttpMailer({ baseUrl, apiKey }) {
  return {
    async send({ to, subject }) {
      const res = await fetch(baseUrl + '/v1/messages', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: 'Bearer ' + apiKey },
        body: JSON.stringify({ to, subject }),
      });
      if (res.status === 429) throw new MailError('RATE_LIMITED');
      if (!res.ok) throw new MailError('MAIL_FAILED', { cause: new Error('HTTP ' + res.status) });
      const body = await res.json();
      return body.id;
    },
  };
}`,
  thuLoi: `// Plant ONE change in a source file, run the given Vitest files, then always restore the file.
// node scripts/thu-loi.mjs <file> "<exact text>" "<replacement>" <vitest args…>
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const [file, from, to, ...args] = process.argv.slice(2);
const original = readFileSync(file, 'utf8');
if (original.split(from).length !== 2) throw new Error('"' + from + '" must appear exactly once in ' + file);
writeFileSync(file, original.replace(from, to));
console.log('planted in ' + file + ':  ' + from + '  →  ' + to + '\\n');
try {
  const run = spawnSync('npx', ['vitest', 'run', ...args], { stdio: 'inherit', shell: process.platform === 'win32' });
  process.exitCode = run.status;
} finally {
  writeFileSync(file, original);
}`,
  khongAssert: `// RED ON PURPOSE: runs the booking rules, checks nothing (requireAssertions catches it).
import { it } from 'vitest';
import { checkSlot, needsApproval, createBooking, usageRate } from '../src/rules/booking.js';

it('runs the booking rules', () => {
  checkSlot('08:00', '10:00');
  createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' });
  usageRate([{ minutes: 60 }]);
  needsApproval({ seats: 5, role: 'ADMIN' });
});`,
  ganNhuKhong: `// Every line of booking.js runs, and each test has an expect — but what does it check?
import { it, expect } from 'vitest';
import { checkSlot, isWithinBookingWindow, needsApproval, createBooking, usageRate } from '../src/rules/booking.js';

it('checkSlot', () => {
  for (const [start, end] of [['08:15', '09:00'], ['10:00', '09:00'], ['06:00', '08:00'], ['08:00', '13:00'], ['08:00', '10:00']]) {
    expect(checkSlot(start, end)).toBeDefined();
  }
});
it('isWithinBookingWindow', () => {
  expect(isWithinBookingWindow(3)).toBeDefined();
});
it('needsApproval', () => {
  expect(() => needsApproval({ seats: 0, role: 'STUDENT' })).toThrow();
  expect(needsApproval({ seats: 5, role: 'ADMIN' })).toBeDefined();
  expect(needsApproval({ seats: 5, role: 'STUDENT' })).toBeDefined();
});
it('createBooking', () => {
  expect(createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' })).toBeTruthy();
  expect(() => createBooking({ lab: 'BE-201', seats: 5, role: 'STUDENT', start: '06:00', end: '07:00' })).toThrow();
});
it('usageRate', () => {
  expect(usageRate([{ minutes: 60 }])).toBeGreaterThan(0);
});`,
  duNhanh: `// gan-nhu-khong.test.js plus one CONFIRMED booking: now every branch runs too.
import { it, expect } from 'vitest';
import { checkSlot, isWithinBookingWindow, needsApproval, createBooking, usageRate } from '../src/rules/booking.js';

it('checkSlot', () => {
  for (const [start, end] of [['08:15', '09:00'], ['10:00', '09:00'], ['06:00', '08:00'], ['08:00', '13:00'], ['08:00', '10:00']]) {
    expect(checkSlot(start, end)).toBeDefined();
  }
});
it('isWithinBookingWindow', () => {
  expect(isWithinBookingWindow(3)).toBeDefined();
});
it('needsApproval', () => {
  expect(() => needsApproval({ seats: 0, role: 'STUDENT' })).toThrow();
  expect(needsApproval({ seats: 5, role: 'ADMIN' })).toBeDefined();
  expect(needsApproval({ seats: 5, role: 'STUDENT' })).toBeDefined();
});
it('createBooking', () => {
  expect(createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' })).toBeTruthy();
  expect(createBooking({ lab: 'BE-201', seats: 5, role: 'STUDENT', start: '08:00', end: '10:00' })).toBeTruthy();
  expect(() => createBooking({ lab: 'BE-201', seats: 5, role: 'STUDENT', start: '06:00', end: '07:00' })).toThrow();
});
it('usageRate', () => {
  expect(usageRate([{ minutes: 60 }])).toBeGreaterThan(0);
});`,
  codeTest: `// Promoted from practice 2.4 (demo2/th24.test.js) in lesson 8.1: a test in a demo folder protects nothing in CI.
import { describe, it, expect } from 'vitest';
import { makeBookingCode, seededRandom, ALPHABET, newBookingRecord } from './code.js';

describe('makeBookingCode', () => {
  it('is "LF-" and 6 characters from the readable alphabet', () => {
    expect(makeBookingCode(seededRandom(7))).toMatch(/^LF-[A-HJ-NP-Z2-9]{6}$/);
  });
  it('the same seed gives the same code; 20 codes from one seed are all different', () => {
    expect(makeBookingCode(seededRandom(7))).toBe(makeBookingCode(seededRandom(7)));
    const random = seededRandom(7);
    expect(new Set(Array.from({ length: 20 }, () => makeBookingCode(random, 2))).size).toBe(20);
  });
  it('can produce the first and the last character of the alphabet', () => {
    expect(makeBookingCode(() => 0, 1)).toBe('LF-' + ALPHABET[0]);
    expect(makeBookingCode(() => 0.9999, 1)).toBe('LF-' + ALPHABET.at(-1));
  });
});

describe('newBookingRecord', () => {
  it('takes its id and clock from the caller', () => {
    const record = newBookingRecord({ lab: 'BE-201' }, { newId: () => 'b-1', now: () => new Date('2026-11-16T01:00:00Z') });
    expect(record).toMatchObject({ id: 'b-1', createdAt: '2026-11-16T01:00:00.000Z', lab: 'BE-201' });
  });
});`,
  reminderTest: `// Promoted from lesson 3.2 (demo3/vi-mock.test.js) in lesson 8.1.
import { it, expect, vi } from 'vitest';
import { sendReminder } from './reminder.js';

const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock('../lib/mailer.js', () => ({
  createHttpMailer: () => ({ send }),
}));

it('sends "Reminder: <lab> at <start> tomorrow" to the student', async () => {
  send.mockResolvedValue('msg-7');
  expect(await sendReminder({ email: 'an@fpt.edu.vn', lab: 'BE-201', start: '08:00' })).toBe('msg-7');
  expect(send).toHaveBeenCalledWith({ to: 'an@fpt.edu.vn', subject: 'Reminder: BE-201 at 08:00 tomorrow' });
});`,
  th81: `// Practice 8.1: the lines the coverage report showed as never run (server.js 54–56, login-guard.js 5).
import { it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/api/server.js';
import { createAuth } from '../src/api/auth.js';
import { createLoginGuard } from '../src/auth/login-guard.js';
import { SECRET, body } from '../test/support/api.js';

const down = async () => { throw new Error('ECONNREFUSED'); };

it('503 STORAGE_DOWN when the database cannot be reached while booking', async () => {
  const auth = createAuth({ secret: SECRET });
  const app = createApp({ repo: { findOverlap: down, insert: down }, auth });
  const res = await request(app).post('/api/bookings')
    .set('Authorization', 'Bearer ' + (await auth.sign({ id: 'an', role: 'STUDENT' }))).send(body());
  expect(res.status).toBe(503);
  expect(res.body).toEqual({ error: { code: 'STORAGE_DOWN' } });
});

it('500 INTERNAL for any other error, without leaking its message', async () => {
  const auth = createAuth({ secret: SECRET });
  const app = createApp({ repo: { findById: down }, auth });
  const res = await request(app).get('/api/bookings/1')
    .set('Authorization', 'Bearer ' + (await auth.sign({ id: 'an', role: 'STUDENT' })));
  expect(res.status).toBe(500);
  expect(res.body).toEqual({ error: { code: 'INTERNAL' } });
});

it('without an injected clock, the guard uses the real time', () => {
  const guard = createLoginGuard();
  for (let i = 0; i < 5; i++) guard.recordFailure('an@fpt.edu.vn');
  expect(guard.isLocked('an@fpt.edu.vn')).toBe(true);
});`,
  mutationGaps: `// Lesson 8.2: one test per gap that Stryker's survivors pointed at. Each comment names the mutant it kills.
import { describe, it, expect } from 'vitest';
import { needsApproval, createBooking, usageRate } from './booking.js';
import { parseTime } from './time.js';
import { newBookingRecord } from './code.js';

describe('booking rules: the cases nobody wrote', () => {
  it('one seat is a valid booking', () => {                      // seats < 1  →  seats <= 1
    expect(needsApproval({ seats: 1, role: 'STUDENT' })).toBe(false);
  });
  it('the error says what was wrong', () => {                      // message → ""
    expect(() => needsApproval({ seats: 0, role: 'STUDENT' })).toThrow('seats must be a positive integer, got 0');
  });
  it('a small student booking is CONFIRMED', () => {               // 'CONFIRMED' → ""
    expect(createBooking({ lab: 'BE-201', seats: 5, role: 'STUDENT', start: '08:00', end: '09:00' }).status).toBe('CONFIRMED');
  });
  it('usageRate adds up the booked share of the 14 opening hours', () => {   // += → -=, / → *, CLOSE - OPEN → CLOSE + OPEN
    expect(usageRate([{ minutes: 420 }, { minutes: 210 }])).toBe(0.75);
  });
});

describe('parseTime: only exactly HH:MM', () => {
  it.each(['08:000', '108:00'])('refuses %s', (text) => {        // ^ and $ removed from the regex
    expect(() => parseTime(text)).toThrow('Invalid time "' + text + '", expected HH:MM');
  });
  it('the TypeError is ours, not a crash on null', () => {          // if (!m) → if (false)
    expect(() => parseTime('7:00')).toThrow('expected HH:MM');
  });
  it('says which time is out of range', () => {                    // message → ""
    expect(() => parseTime('24:00')).toThrow('Time out of range: 24:00');
  });
});

describe('newBookingRecord without injected helpers', () => {
  it('makes a UUID and stamps the current time', () => {           // default newId / now → () => undefined
    const before = Date.now();
    const record = newBookingRecord({ lab: 'BE-201' });
    expect(record.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(Date.parse(record.createdAt)).toBeGreaterThanOrEqual(before);
  });
});`,
  retryLast: `// Practice 8.2: kills the two retry.js mutants that survived — a pointless wait after the last attempt.
import { it, expect, vi, beforeEach, afterEach } from 'vitest';
import { retry } from './retry.js';

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });

it('gives up right after the 3rd attempt: no wait after the last one', async () => {
  const fn = vi.fn().mockRejectedValue(new Error('SMTP down'));
  let done = false;
  const result = retry(fn).catch((err) => { done = true; return err; });
  await vi.advanceTimersByTimeAsync(1000 + 2000);          // exactly the two waits between attempts
  expect(fn).toHaveBeenCalledTimes(3);
  expect(done).toBe(true);
  expect((await result).message).toBe('SMTP down');
});`,
  gioThat: `// RED SOMETIMES: the answer depends on the real clock of the machine.
import { it, expect } from 'vitest';
import { daysAheadVN } from '../src/rules/days.js';

it('a booking for tomorrow is 1 day ahead', () => {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  expect(daysAheadVN(tomorrow)).toBe(1);
});`,
  ngauNhien: `// RED SOMETIMES: random test data.
import { it, expect } from 'vitest';
import { needsApproval } from '../src/rules/booking.js';

it('a student booking for a normal class is confirmed', () => {
  const seats = 1 + Math.floor(Math.random() * 40);       // "any realistic class size"
  expect(needsApproval({ seats, role: 'STUDENT' })).toBe(false);
});`,
  thuTu: `// RED SOMETIMES: two tests share one login guard, so the result depends on their order.
import { it, expect } from 'vitest';
import { createLoginGuard } from '../src/auth/login-guard.js';

const guard = createLoginGuard(() => Date.parse('2026-11-16T08:00:00Z'));   // shared by every test below

it('a user with no failures is not locked', () => {
  expect(guard.isLocked('an@fpt.edu.vn')).toBe(false);
});

it('5 wrong passwords lock the account', () => {
  for (let i = 0; i < 5; i++) guard.recordFailure('an@fpt.edu.vn');
  expect(guard.isLocked('an@fpt.edu.vn')).toBe(true);
});

it('one wrong password does not lock', () => {
  guard.recordFailure('binh@fpt.edu.vn');
  expect(guard.isLocked('binh@fpt.edu.vn')).toBe(false);
});`,
  repoCham: `// Lesson 8.3: an in-memory repository that behaves like a real database under load —
// every lookup takes a different amount of time (0–40 ms on top of the usual 5 ms).
import { createMemoryRepo } from '../src/booking/service.js';

export function slowRepo() {
  const repo = createMemoryRepo();
  const jitter = () => new Promise((resolve) => setTimeout(resolve, Math.random() * 40));
  return { ...repo, async findOverlap(...args) { await jitter(); return repo.findOverlap(...args); } };
}`,
  duaLech: `// RED SOMETIMES — and this time the test is right: the app has a race.
import { it, expect } from 'vitest';
import { bookLab } from '../src/booking/service.js';
import { slowRepo } from './repo-cham.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it('two students book the same slot at once: exactly one wins', async () => {
  const repo = slowRepo();
  const results = await Promise.allSettled([bookLab(repo, input), bookLab(repo, input)]);
  expect(results.map((r) => r.status).sort()).toEqual(['fulfilled', 'rejected']);
});`,
  mang: `// RED SOMETIMES: a unit test that goes over the network to a slow server.
import { it, expect, beforeAll, afterAll } from 'vitest';
import { createServer } from 'node:http';
import { createHttpMailer } from '../src/lib/mailer.js';

// Stands in for a shared staging mail provider: answers in 20–140 ms, depending on its load.
const server = createServer((req, res) => {
  setTimeout(() => res.writeHead(202, { 'content-type': 'application/json' }).end('{"id":"msg-1"}'), 20 + Math.random() * 120);
});
beforeAll(() => new Promise((resolve) => server.listen(0, resolve)));
afterAll(() => new Promise((resolve) => server.close(resolve)));

it('sends the booking confirmation', { timeout: 100 }, async () => {
  const mailer = createHttpMailer({ baseUrl: 'http://127.0.0.1:' + server.address().port, apiKey: 'k' });
  await expect(mailer.send({ to: 'an@fpt.edu.vn', subject: 'Booked' })).resolves.toBe('msg-1');
});`,
  cachLy: `// Quarantine: the race test is known to be flaky, has an issue and an owner, and does not block anyone's merge.
import { it, expect } from 'vitest';
import { bookLab } from '../src/booking/service.js';
import { needsApproval } from '../src/rules/booking.js';
import { slowRepo } from './repo-cham.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it('31 seats need approval', () => {
  expect(needsApproval({ seats: 31, role: 'STUDENT' })).toBe(true);
});

// LAB-142 (owner: an, fix by 2026-11-20): double booking under load — lesson 8.3
it('two students book the same slot at once: exactly one wins', { tags: ['quarantine'] }, async () => {
  const repo = slowRepo();
  const results = await Promise.allSettled([bookLab(repo, input), bookLab(repo, input)]);
  expect(results.map((r) => r.status).sort()).toEqual(['fulfilled', 'rejected']);
});`,
  daSua: `// The five flaky tests of lesson 8.3, each fixed at its cause — green in any order, any number of times.
import { it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw/http';
import { daysAheadVN } from '../src/rules/days.js';
import { needsApproval } from '../src/rules/booking.js';
import { createLoginGuard } from '../src/auth/login-guard.js';
import { bookLab, createMemoryRepo } from '../src/booking/service.js';
import { createHttpMailer } from '../src/lib/mailer.js';

// 1. Time → pass the clock in, and test the dangerous hour on purpose.
it.each(['2026-11-02T06:30:00+07:00', '2026-11-02T08:00:00+07:00', '2026-11-02T23:59:00+07:00'])('at %s, 2026-11-03 is 1 day ahead', (now) => {
  expect(daysAheadVN('2026-11-03', new Date(now))).toBe(1);
});

// 2. Randomness → name the cases, starting with the boundary.
it.each([[1, false], [30, false], [31, true], [40, true]])('a student with %i seats needs approval: %s', (seats, expected) => {
  expect(needsApproval({ seats, role: 'STUDENT' })).toBe(expected);
});

// 3. Shared state → every test builds its own guard.
let guard;
beforeEach(() => { guard = createLoginGuard(() => Date.parse('2026-11-16T08:00:00Z')); });
it('a user with no failures is not locked', () => {
  expect(guard.isLocked('an@fpt.edu.vn')).toBe(false);
});
it('5 wrong passwords lock the account', () => {
  for (let i = 0; i < 5; i++) guard.recordFailure('an@fpt.edu.vn');
  expect(guard.isLocked('an@fpt.edu.vn')).toBe(true);
});

// 4. Race → the TEST was right; fix the app. Here: one booking at a time per lab (in a real system: a database constraint, lesson 4.1).
function oneAtATime() {
  const tails = new Map();
  return (key, task) => {
    const run = (tails.get(key) ?? Promise.resolve()).then(task, task);
    tails.set(key, run.catch(() => {}));
    return run;
  };
}
it('two students book the same slot at once: exactly one wins', async () => {
  const repo = createMemoryRepo();
  const queue = oneAtATime();
  const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };
  const results = await Promise.allSettled([queue(input.lab, () => bookLab(repo, input)), queue(input.lab, () => bookLab(repo, input))]);
  expect(results.map((r) => r.status).sort()).toEqual(['fulfilled', 'rejected']);
});

// 5. Network → a unit test talks to a fake provider at the boundary (lesson 3.2), never to a shared server.
const server = setupServer(http.post('https://mail.provider.example/v1/messages', () => HttpResponse.json({ id: 'msg-1' }, { status: 202 })));
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterAll(() => server.close());
it('sends the booking confirmation', async () => {
  const mailer = createHttpMailer({ baseUrl: 'https://mail.provider.example', apiKey: 'k' });
  await expect(mailer.send({ to: 'an@fpt.edu.vn', subject: 'Booked' })).resolves.toBe('msg-1');
});`,
  lapLai: `// Run the same Vitest command N times, each in a fresh process, and count the red runs (lesson 8.3).
// node scripts/lap-lai.mjs <N> <vitest args…>      e.g.  node scripts/lap-lai.mjs 20 demo8/thu-tu.test.js --sequence.shuffle
// With --sequence.shuffle, the seed of every red run is printed: re-run it with --sequence.seed=<seed> to see the same order again.
import { spawnSync } from 'node:child_process';

const [n, ...args] = process.argv.slice(2);
let red = 0;
const seeds = [];
const started = Date.now();
for (let i = 0; i < Number(n); i++) {
  const run = spawnSync('npx', ['vitest', 'run', ...args], { encoding: 'utf8', shell: process.platform === 'win32' });
  if (run.status !== 0) {
    red++;
    const seed = /seed "(\\d+)"/.exec(run.stdout);
    if (seed) seeds.push(seed[1]);
  }
}
console.log('red in ' + red + '/' + n + ' runs (' + ((Date.now() - started) / 1000).toFixed(1) + ' s)');
if (seeds.length) console.log('seeds of red runs: ' + seeds.slice(0, 5).join(', ') + (seeds.length > 5 ? ', …' : ''));`,
  th83De: `// Practice 8.3 (given): green when run in file order. Is it?
import { it, expect, vi } from 'vitest';
import { retry } from '../src/lib/retry.js';

it('a mail that works on the 2nd try is sent', async () => {
  const send = vi.fn().mockRejectedValueOnce(new Error('timeout')).mockResolvedValue('sent');
  await expect(retry(send, { delayMs: 10 })).resolves.toBe('sent');
});

it('waits 1 s, then 2 s between attempts', async () => {
  vi.useFakeTimers();
  const send = vi.fn().mockRejectedValueOnce(new Error('timeout')).mockRejectedValueOnce(new Error('timeout')).mockResolvedValue('sent');
  const result = retry(send);
  await vi.advanceTimersByTimeAsync(3000);
  await expect(result).resolves.toBe('sent');
});`,
  th83: `// Practice 8.3 (solution): fake timers are global — whoever turns them on must turn them off.
import { it, expect, vi, afterEach } from 'vitest';
import { retry } from '../src/lib/retry.js';

afterEach(() => { vi.useRealTimers(); });

it('a mail that works on the 2nd try is sent', async () => {
  const send = vi.fn().mockRejectedValueOnce(new Error('timeout')).mockResolvedValue('sent');
  await expect(retry(send, { delayMs: 10 })).resolves.toBe('sent');
});

it('waits 1 s, then 2 s between attempts', async () => {
  vi.useFakeTimers();
  const send = vi.fn().mockRejectedValueOnce(new Error('timeout')).mockRejectedValueOnce(new Error('timeout')).mockResolvedValue('sent');
  const result = retry(send);
  await vi.advanceTimersByTimeAsync(3000);
  await expect(result).resolves.toBe('sent');
});`,
  choThat: `// SLOW: retry() really waits 1 s, then 2 s, between attempts.
import { it, expect, vi } from 'vitest';
import { retry } from '../../src/lib/retry.js';

it('a mail that works on the 3rd try is sent', async () => {
  const send = vi.fn().mockRejectedValueOnce(new Error('timeout')).mockRejectedValueOnce(new Error('timeout')).mockResolvedValue('sent');
  await expect(retry(send)).resolves.toBe('sent');
});

it('gives up after 3 attempts with the last error', async () => {
  const send = vi.fn().mockRejectedValue(new Error('SMTP down'));
  await expect(retry(send)).rejects.toThrow('SMTP down');
  expect(send).toHaveBeenCalledTimes(3);
});`,
  duLieu: `// SLOW: every test seeds 100 bookings through the repository, one await at a time.
import { it, expect, beforeEach } from 'vitest';
import { bookLab, createMemoryRepo } from '../../src/booking/service.js';
import { formatTime } from '../../src/rules/time.js';

let repo;
beforeEach(async () => {
  repo = createMemoryRepo();
  for (let day = 1; day <= 10; day++) {
    for (let h = 8; h < 18; h++) {
      const date = '2026-11-' + String(day).padStart(2, '0');
      await bookLab(repo, { lab: 'BE-201', date, seats: 20, role: 'STUDENT', start: formatTime(h * 60), end: formatTime(h * 60 + 60) });
    }
  }
});

it('a full day refuses one more booking', async () => {
  await expect(bookLab(repo, { lab: 'BE-201', date: '2026-11-03', seats: 5, role: 'STUDENT', start: '09:00', end: '10:00' }))
    .rejects.toMatchObject({ code: 'OVERLAP' });
});
it('another lab is still free', async () => {
  await expect(bookLab(repo, { lab: 'BE-305', date: '2026-11-03', seats: 5, role: 'STUDENT', start: '09:00', end: '10:00' }))
    .resolves.toMatchObject({ id: 101 });
});
it('the evening is still free', async () => {
  await expect(bookLab(repo, { lab: 'BE-201', date: '2026-11-03', seats: 5, role: 'STUDENT', start: '18:00', end: '19:00' }))
    .resolves.toMatchObject({ status: 'CONFIRMED' });
});
it('the list has 100 bookings', async () => {
  expect(await repo.list()).toHaveLength(100);
});`,
  choThatNhanh: `// FAST: the same two tests with fake timers (lesson 2.2) — the waits are checked, not waited for.
import { it, expect, vi, beforeEach, afterEach } from 'vitest';
import { retry } from '../../src/lib/retry.js';

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });

it('a mail that works on the 3rd try is sent', async () => {
  const send = vi.fn().mockRejectedValueOnce(new Error('timeout')).mockRejectedValueOnce(new Error('timeout')).mockResolvedValue('sent');
  const result = retry(send);
  await vi.advanceTimersByTimeAsync(1000 + 2000);
  await expect(result).resolves.toBe('sent');
});

it('gives up after 3 attempts with the last error', async () => {
  const send = vi.fn().mockRejectedValue(new Error('SMTP down'));
  const result = expect(retry(send)).rejects.toThrow('SMTP down');
  await vi.runAllTimersAsync();
  await result;
  expect(send).toHaveBeenCalledTimes(3);
});`,
  duLieuNhanh: `// FAST: each test needs only the bookings it talks about, created through the real code.
import { it, expect, beforeEach } from 'vitest';
import { bookLab, createMemoryRepo } from '../../src/booking/service.js';

const at = (start, end, extra = {}) => ({ lab: 'BE-201', date: '2026-11-03', seats: 5, role: 'STUDENT', start, end, ...extra });
let repo;
beforeEach(async () => {
  repo = createMemoryRepo();
  await bookLab(repo, at('09:00', '10:00'));          // the one booking these tests are about
});

it('a taken slot refuses one more booking', async () => {
  await expect(bookLab(repo, at('09:00', '10:00'))).rejects.toMatchObject({ code: 'OVERLAP' });
});
it('another lab is still free', async () => {
  await expect(bookLab(repo, at('09:00', '10:00', { lab: 'BE-305' }))).resolves.toMatchObject({ id: 2 });
});
it('the next hour is still free', async () => {
  await expect(bookLab(repo, at('10:00', '11:00'))).resolves.toMatchObject({ status: 'CONFIRMED' });
});
it('list returns what was stored', async () => {
  await bookLab(repo, at('10:00', '11:00'));
  expect(await repo.list()).toHaveLength(2);
});`,
  duLieuChung: `// "Faster": seed the 100 bookings ONCE for the whole file (beforeAll) — and see lesson 8.3 come back.
import { it, expect, beforeAll } from 'vitest';
import { bookLab, createMemoryRepo } from '../src/booking/service.js';
import { formatTime } from '../src/rules/time.js';

let repo;
beforeAll(async () => {
  repo = createMemoryRepo();
  for (let day = 1; day <= 10; day++) {
    for (let h = 8; h < 18; h++) {
      const date = '2026-11-' + String(day).padStart(2, '0');
      await bookLab(repo, { lab: 'BE-201', date, seats: 20, role: 'STUDENT', start: formatTime(h * 60), end: formatTime(h * 60 + 60) });
    }
  }
});

it('a full day refuses one more booking', async () => {
  await expect(bookLab(repo, { lab: 'BE-201', date: '2026-11-03', seats: 5, role: 'STUDENT', start: '09:00', end: '10:00' }))
    .rejects.toMatchObject({ code: 'OVERLAP' });
});
it('another lab is still free', async () => {
  await expect(bookLab(repo, { lab: 'BE-305', date: '2026-11-03', seats: 5, role: 'STUDENT', start: '09:00', end: '10:00' }))
    .resolves.toMatchObject({ id: 101 });
});
it('the evening is still free', async () => {
  await expect(bookLab(repo, { lab: 'BE-201', date: '2026-11-03', seats: 5, role: 'STUDENT', start: '18:00', end: '19:00' }))
    .resolves.toMatchObject({ status: 'CONFIRMED' });
});
it('the list has 100 bookings', async () => {
  expect(await repo.list()).toHaveLength(100);
});`,
  doTocDo: `import { it, expect } from 'vitest';
import request from 'supertest';
import { checkSlot } from '../src/rules/booking.js';
import { buildApp } from '../src/app.js';

it('200 unit checks', () => {
  for (let i = 0; i < 200; i++) expect(checkSlot('06:30', '08:00').code).toBe('OUTSIDE_HOURS');
});

it('200 HTTP requests through Express', async () => {
  const app = buildApp();
  for (let i = 0; i < 200; i++) {
    const res = await request(app).post('/bookings')
      .send({ lab: 'BE-201', seats: 20, role: 'STUDENT', start: '06:30', end: '08:00' });
    expect(res.status).toBe(400);
  }
});`,
  th84De: `// Practice 8.4 (given): correct, green — and slow. Make it fast without checking less.
import { it, expect } from 'vitest';
import { bookAndNotify } from '../src/notify/notify.js';
import { createMemoryRepo } from '../src/booking/service.js';
import { createFakeMailer } from '../test/support/fakes.js';
import { retry } from '../src/lib/retry.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00', email: 'an@fpt.edu.vn' };

it('a confirmed booking e-mails the student', async () => {
  const mailer = createFakeMailer();
  bookAndNotify({ repo: createMemoryRepo(), mailer }, input);
  await sleep(1000);                                   // "give the e-mail time to be sent"
  expect(mailer.outbox).toEqual([{ to: 'an@fpt.edu.vn', subject: 'Booking confirmed: BE-201 on 2026-11-16 at 08:00' }]);
});

it('a 31-seat booking asks the approver', async () => {
  const mailer = createFakeMailer();
  bookAndNotify({ repo: createMemoryRepo(), mailer }, { ...input, seats: 31 });
  await sleep(1000);
  expect(mailer.outbox[0].to).toBe('approvals@labflow.example');
});

it('a provider that fails twice is retried until it works', async () => {
  let calls = 0;
  const send = async () => { calls++; if (calls < 3) throw new Error('timeout'); return 'sent'; };
  await expect(retry(send)).resolves.toBe('sent');
  expect(calls).toBe(3);
});`,
  th84: `// Practice 8.4 (solution): await the work instead of sleeping; fake the clock for retry.
import { it, expect, vi, afterEach } from 'vitest';
import { bookAndNotify } from '../src/notify/notify.js';
import { createMemoryRepo } from '../src/booking/service.js';
import { createFakeMailer } from '../test/support/fakes.js';
import { retry } from '../src/lib/retry.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00', email: 'an@fpt.edu.vn' };
afterEach(() => { vi.useRealTimers(); });

it('a confirmed booking e-mails the student', async () => {
  const mailer = createFakeMailer();
  await bookAndNotify({ repo: createMemoryRepo(), mailer }, input);      // done means done: no sleep
  expect(mailer.outbox).toEqual([{ to: 'an@fpt.edu.vn', subject: 'Booking confirmed: BE-201 on 2026-11-16 at 08:00' }]);
});

it('a 31-seat booking asks the approver', async () => {
  const mailer = createFakeMailer();
  await bookAndNotify({ repo: createMemoryRepo(), mailer }, { ...input, seats: 31 });
  expect(mailer.outbox[0].to).toBe('approvals@labflow.example');
});

it('a provider that fails twice is retried until it works', async () => {
  vi.useFakeTimers();
  let calls = 0;
  const send = async () => { calls++; if (calls < 3) throw new Error('timeout'); return 'sent'; };
  const result = retry(send);
  await vi.advanceTimersByTimeAsync(1000 + 2000);
  await expect(result).resolves.toBe('sent');
  expect(calls).toBe(3);
});`,
  checkin: `// Check-in and no-show rules (Chapter 8, Lab 8).
import { parseTime } from './time.js';

export const EARLY = 10;          // BR-07: check-in opens 10 minutes before the start …
export const GRACE = 15;          // … and closes 15 minutes after it; later is a no-show
export const STRIKES = 3;         // BR-08: 3 no-shows within 30 days …
export const LOOKBACK_DAYS = 30;
export const BAN_DAYS = 7;        // … block new bookings until 7 days after the last one

// now is "HH:MM" on the day of the booking.
export function checkIn(booking, now) {
  if (booking.status !== 'CONFIRMED') return { ok: false, code: 'NOT_CONFIRMED' };
  const start = parseTime(booking.start);
  const t = parseTime(now);
  if (t < start - EARLY) return { ok: false, code: 'TOO_EARLY' };
  if (t > start + GRACE) return { ok: false, code: 'NO_SHOW' };
  return { ok: true, late: t > start };
}

const DAY = 24 * 60 * 60 * 1000;
const dayNumber = (iso) => Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10))) / DAY;
const isoDate = (n) => new Date(n * DAY).toISOString().slice(0, 10);

// noShows: dates "YYYY-MM-DD" of earlier no-shows. Returns the last day the student is banned, or null.
export function bannedUntil(noShows, today) {
  const t = dayNumber(today);
  const recent = noShows.map(dayNumber).filter((d) => d <= t && t - d < LOOKBACK_DAYS);
  if (recent.length < STRIKES) return null;
  const end = Math.max(...recent) + BAN_DAYS;
  return end < t ? null : isoDate(end);
}

// A small in-memory log of no-shows per student.
export function createNoShowLog() {
  const byUser = new Map();
  return {
    record(userId, date) {
      byUser.set(userId, [...(byUser.get(userId) ?? []), date]);
    },
    datesFor(userId) {
      return byUser.get(userId) ?? [];
    },
  };
}`,
  checkinTest: `// Lab 8 reference: check-in window (BR-07) and the no-show ban (BR-08).
import { describe, it, expect } from 'vitest';
import { checkIn, bannedUntil, createNoShowLog } from './checkin.js';

const booking = { lab: 'BE-201', start: '08:00', end: '10:00', status: 'CONFIRMED' };

describe('checkIn (BR-07)', () => {
  it.each([
    ['07:49', { ok: false, code: 'TOO_EARLY' }],   // 11 minutes before
    ['07:50', { ok: true, late: false }],           // opens exactly 10 minutes before
    ['08:00', { ok: true, late: false }],           // on time is not late
    ['08:01', { ok: true, late: true }],
    ['08:15', { ok: true, late: true }],            // last minute of the grace period
    ['08:16', { ok: false, code: 'NO_SHOW' }],
  ])('at %s → %o', (now, expected) => {
    expect(checkIn(booking, now)).toEqual(expected);
  });

  it.each(['PENDING', 'CANCELLED'])('refuses a %s booking', (status) => {
    expect(checkIn({ ...booking, status }, '08:00')).toEqual({ ok: false, code: 'NOT_CONFIRMED' });
  });
});

describe('bannedUntil (BR-08)', () => {
  it('bans for 7 days after the third no-show', () => {
    expect(bannedUntil(['2026-11-01', '2026-11-05', '2026-11-10'], '2026-11-12')).toBe('2026-11-17');
  });
  it('counts from the latest no-show, whatever the order', () => {
    expect(bannedUntil(['2026-11-10', '2026-11-01', '2026-11-05'], '2026-11-12')).toBe('2026-11-17');
  });
  it('two no-shows are not enough', () => {
    expect(bannedUntil(['2026-11-05', '2026-11-10'], '2026-11-12')).toBeNull();
  });
  it('the ban still holds on its last day, and is over the day after', () => {
    const three = ['2026-11-01', '2026-11-05', '2026-11-10'];
    expect(bannedUntil(three, '2026-11-17')).toBe('2026-11-17');
    expect(bannedUntil(three, '2026-11-18')).toBeNull();
  });
  it('a no-show 30 days ago no longer counts; 29 days ago still does', () => {
    expect(bannedUntil(['2026-10-13', '2026-11-05', '2026-11-10'], '2026-11-12')).toBeNull();
    expect(bannedUntil(['2026-10-14', '2026-11-05', '2026-11-10'], '2026-11-12')).toBe('2026-11-17');
  });
  it('a no-show today already counts', () => {                     // found by Stryker, not by the 8 hand-made mutants
    expect(bannedUntil(['2026-11-05', '2026-11-10', '2026-11-12'], '2026-11-12')).toBe('2026-11-19');
  });
  it('ignores no-shows dated after today', () => {
    expect(bannedUntil(['2026-11-05', '2026-11-10', '2026-11-20'], '2026-11-12')).toBeNull();
  });
});

describe('createNoShowLog', () => {
  it('keeps each student separate, in order', () => {
    const log = createNoShowLog();       // a fresh log per test: no shared state
    log.record('an', '2026-11-01');
    log.record('binh', '2026-11-02');
    log.record('an', '2026-11-05');
    expect(log.datesFor('an')).toEqual(['2026-11-01', '2026-11-05']);
    expect(log.datesFor('binh')).toEqual(['2026-11-02']);
    expect(log.datesFor('chi')).toEqual([]);
  });
});`,
  lab8Yeu: `// Lab 8 starting point: every line of checkin.js runs, the suite is green... usually.
import { describe, it, expect } from 'vitest';
import { checkIn, bannedUntil, createNoShowLog } from '../src/rules/checkin.js';

const log = createNoShowLog();                      // one log for the whole file
const booking = { lab: 'BE-201', start: '08:00', end: '10:00', status: 'CONFIRMED' };

describe('checkIn', () => {
  it('too early', () => {
    expect(checkIn(booking, '07:00').ok).toBe(false);
  });
  it('on time', () => {
    expect(checkIn(booking, '08:05')).toBeTruthy();
  });
  it('too late', () => {
    expect(checkIn(booking, '09:00').code).toBeDefined();
  });
  it('pending booking', () => {
    expect(checkIn({ ...booking, status: 'PENDING' }, '08:00').ok).toBe(false);
  });
});

describe('no-shows', () => {
  it('records a no-show', () => {
    log.record('an', '2026-11-01');
    expect(log.datesFor('an')).toHaveLength(1);
  });
  it('three no-shows ban the student', () => {
    log.record('an', '2026-11-05');
    log.record('an', '2026-11-10');
    expect(bannedUntil(log.datesFor('an'), '2026-11-12')).not.toBeNull();
  });
  it('a ban ends', () => {
    expect(bannedUntil(log.datesFor('an'), '2026-12-30')).toBeNull();
  });
  it('a student without no-shows', () => {
    expect(log.datesFor('binh')).toEqual([]);
  });
});`,
  dotBien8: `// Lab 8 grader (Chapter 8). Two checks on ONE test file:
//   1. order: the file must stay green in 10 shuffled orders (a test that needs another test first is flaky);
//   2. strength: 8 planted bugs in src/rules/checkin.js, one at a time — each must turn the file red.
// Usage: node scripts/dot-bien-8.mjs [test file]   (default: src/rules/checkin.test.js)
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const TEST = process.argv[2] ?? 'src/rules/checkin.test.js';
const FILE = 'src/rules/checkin.js';
const MUTANTS = [
  ['if (t < start - EARLY)', 'if (t <= start - EARLY)', 'check-in refused exactly 10 minutes before the start'],
  ['if (t > start + GRACE)', 'if (t >= start + GRACE)', 'the 15th minute already counts as a no-show'],
  ['late: t > start', 'late: t >= start', 'arriving exactly on time is marked late'],
  ["booking.status !== 'CONFIRMED'", "booking.status === 'CANCELLED'", 'a PENDING booking can check in'],
  ['t - d < LOOKBACK_DAYS', 't - d <= LOOKBACK_DAYS', 'a no-show 30 days ago still counts'],
  ['recent.length < STRIKES', 'recent.length <= STRIKES', 'three no-shows are not enough for a ban'],
  ['Math.max(...recent)', 'Math.min(...recent)', 'the ban counts from the first no-show, not the last'],
  ['end < t ? null', 'end <= t ? null', 'the last day of the ban is no longer banned'],
];
const vitest = (...args) => spawnSync('npx', ['vitest', 'run', TEST, ...args], { encoding: 'utf8', shell: process.platform === 'win32' });

let green = 0;
for (let seed = 1; seed <= 10; seed++) if (vitest('--sequence.shuffle', '--sequence.seed=' + seed).status === 0) green++;
console.log((green === 10 ? '✔ ' : '✘ ') + 'green in ' + green + '/10 shuffled orders');

let killed = 0;
const original = readFileSync(FILE, 'utf8');
for (const [i, [from, to, label]] of MUTANTS.entries()) {
  if (original.split(from).length !== 2) throw new Error('Mutant ' + (i + 1) + ': must appear exactly once in ' + FILE);
  writeFileSync(FILE, original.replace(from, to));
  try {
    const dead = vitest().status !== 0;
    if (dead) killed++;
    console.log((dead ? '✔ killed  ' : '✘ SURVIVED') + '  #' + (i + 1) + ' ' + label);
  } finally {
    writeFileSync(FILE, original);
  }
}
console.log();
console.log(killed + '/' + MUTANTS.length + ' mutants killed');
process.exitCode = green === 10 && killed === MUTANTS.length ? 0 : 1;`,
};
export const OUT = {
  '81-cai': `$ npm ls @vitest/coverage-v8 @vitest/coverage-istanbul
labflow-lite@1.0.0 …/labflow-lite
├── @vitest/coverage-istanbul@5.0.5
├── @vitest/coverage-v8@5.0.5
└─┬ vitest@5.0.5
  ├── @vitest/coverage-istanbul@5.0.5 deduped
  └── @vitest/coverage-v8@5.0.5 deduped`,
  '81-cov-do': `$ npm run test:cov -- --reporter=dot

> labflow-lite@1.0.0 test:cov
> vitest run src/ --coverage --reporter=dot


 RUN  v5.0.5 …/labflow-lite
      Coverage enabled with v8

·····················································································

 Test Files  10 passed (10)
      Tests  85 passed (85)
   Start at  06:26:10
   Duration  475ms (tests 36%, transform 28%, import 26%, worker 10%)

 % Coverage report from v8
-----------------|---------|----------|---------|---------|-------------------
File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------|---------|----------|---------|---------|-------------------
All files        |   82.93 |    86.13 |   79.31 |    83.9 |                   
 src             |       0 |      100 |       0 |       0 |                   
  app.js         |       0 |      100 |       0 |       0 | 5-15              
 src/api         |   91.22 |    80.76 |   93.75 |   95.55 |                   
  auth.js        |     100 |      100 |     100 |     100 |                   
  schemas.js     |     100 |      100 |     100 |     100 |                   
  server.js      |   89.58 |    79.16 |   91.66 |   94.44 | 54-56             
 src/auth        |   92.85 |    85.71 |      80 |   92.85 |                   
  login-guard.js |   92.85 |    85.71 |      80 |   92.85 | 5                 
 src/booking     |   97.14 |     87.5 |     100 |     100 |                   
  service.js     |   97.14 |     87.5 |     100 |     100 | 28,52             
 src/lib         |     100 |      100 |     100 |     100 |                   
  mailer.js      |     100 |      100 |     100 |     100 |                   
  retry.js       |     100 |      100 |     100 |     100 |                   
 src/notify      |   84.61 |      100 |   66.66 |   83.33 |                   
  notify.js      |     100 |      100 |     100 |     100 |                   
  reminder.js    |       0 |      100 |       0 |       0 | 5-8               
 src/rules       |   70.31 |       85 |   53.33 |   71.15 |                   
  booking.js     |   87.09 |    96.29 |      80 |    87.5 | 46-48             
  cancel.js      |     100 |      100 |     100 |     100 |                   
  code.js        |       0 |        0 |       0 |       0 | 2-23              
  days.js        |     100 |      100 |     100 |     100 |                   
  time.js        |     100 |      100 |     100 |     100 |                   
-----------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 82.93% ( 175/211 )
Branches     : 86.13% ( 87/101 )
Functions    : 79.31% ( 46/58 )
Lines        : 83.9% ( 146/174 )
================================================================================
ERROR: Coverage for lines (83.9%) does not meet global threshold (85%)
ERROR: Coverage for functions (79.31%) does not meet global threshold (80%)
ERROR: Coverage for statements (82.93%) does not meet global threshold (85%)`,
  '81-cov-xanh': `$ npm run test:cov -- --reporter=dot

> labflow-lite@1.0.0 test:cov
> vitest run src/ --coverage --reporter=dot


 RUN  v5.0.5 …/labflow-lite
      Coverage enabled with v8

··························································································

 Test Files  12 passed (12)
      Tests  90 passed (90)
   Start at  06:26:11
   Duration  506ms (tests 33%, transform 31%, import 25%, worker 11%)

 % Coverage report from v8
-----------------|---------|----------|---------|---------|-------------------
File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------|---------|----------|---------|---------|-------------------
All files        |   93.59 |     89.1 |   91.07 |   95.78 |                   
 api             |   91.22 |    80.76 |   93.75 |   95.55 |                   
  auth.js        |     100 |      100 |     100 |     100 |                   
  schemas.js     |     100 |      100 |     100 |     100 |                   
  server.js      |   89.58 |    79.16 |   91.66 |   94.44 | 54-56             
 auth            |   92.85 |    85.71 |      80 |   92.85 |                   
  login-guard.js |   92.85 |    85.71 |      80 |   92.85 | 5                 
 booking         |   97.14 |     87.5 |     100 |     100 |                   
  service.js     |   97.14 |     87.5 |     100 |     100 | 28,52             
 lib             |     100 |      100 |     100 |     100 |                   
  mailer.js      |     100 |      100 |     100 |     100 |                   
  retry.js       |     100 |      100 |     100 |     100 |                   
 notify          |     100 |      100 |     100 |     100 |                   
  notify.js      |     100 |      100 |     100 |     100 |                   
  reminder.js    |     100 |      100 |     100 |     100 |                   
 rules           |   90.62 |     92.5 |      80 |    92.3 |                   
  booking.js     |   87.09 |    96.29 |      80 |    87.5 | 46-48             
  cancel.js      |     100 |      100 |     100 |     100 |                   
  code.js        |   86.66 |       60 |   66.66 |   91.66 | 22                
  days.js        |     100 |      100 |     100 |     100 |                   
  time.js        |     100 |      100 |     100 |     100 |                   
-----------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 93.59% ( 190/203 )
Branches     : 89.1% ( 90/101 )
Functions    : 91.07% ( 51/56 )
Lines        : 95.78% ( 159/166 )
================================================================================`,
  '81-du-nhanh-loi1': `$ node scripts/thu-loi.mjs src/rules/booking.js 'return seats > APPROVAL_SEATS;' 'return seats >= APPROVAL_SEATS;' demo8/du-nhanh.test.js
planted in src/rules/booking.js:  return seats > APPROVAL_SEATS;  →  return seats >= APPROVAL_SEATS;


 RUN  v5.0.5 …/labflow-lite

 ✓ demo8/du-nhanh.test.js (5 tests) 3ms
   ✓ checkSlot 1ms
   ✓ isWithinBookingWindow 0ms
   ✓ needsApproval 0ms
   ✓ createBooking 0ms
   ✓ usageRate 0ms

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  06:26:13
   Duration  116ms (transform 59%, import 24%, tests 8%, worker 8%)`,
  '81-du-nhanh-loi2': `$ node scripts/thu-loi.mjs src/rules/booking.js "role === 'LECTURER' || role === 'ADMIN'" "role === 'LECTURER'" demo8/du-nhanh.test.js
planted in src/rules/booking.js:  role === 'LECTURER' || role === 'ADMIN'  →  role === 'LECTURER'


 RUN  v5.0.5 …/labflow-lite

 ✓ demo8/du-nhanh.test.js (5 tests) 3ms
   ✓ checkSlot 1ms
   ✓ isWithinBookingWindow 0ms
   ✓ needsApproval 0ms
   ✓ createBooking 0ms
   ✓ usageRate 0ms

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  06:26:14
   Duration  105ms (transform 53%, import 27%, tests 11%, worker 9%)`,
  '81-du-nhanh-loi3': `$ node scripts/thu-loi.mjs src/rules/booking.js 'e - s > MAX_MINUTES' 'e - s >= MAX_MINUTES' src/rules/booking.test.js
planted in src/rules/booking.js:  e - s > MAX_MINUTES  →  e - s >= MAX_MINUTES


 RUN  v5.0.5 …/labflow-lite

 ❯ src/rules/booking.test.js (28 tests | 1 failed) 10ms
   ❯ checkSlot (11)
     ❯ accepts (4)
       ✓ 07:00–08:00 (60 min) 1ms
       ✓ 20:00–21:00 (60 min) 0ms
       ✓ 08:00–08:30 (30 min) 0ms
       × 08:00–12:00 (240 min) 4ms
     ✓ rejects (7)
       ✓ 06:30–08:00 with OUTSIDE_HOURS 0ms
       ✓ 20:00–21:30 with OUTSIDE_HOURS 0ms
       ✓ 08:15–09:00 with OFF_GRID 0ms
       ✓ 08:00–09:10 with OFF_GRID 0ms
       ✓ 10:00–09:00 with END_BEFORE_START 0ms
       ✓ 09:00–09:00 with END_BEFORE_START 0ms
       ✓ 08:00–12:30 with TOO_LONG 0ms
   ✓ isWithinBookingWindow (BR-05) (8)
     ✓ -1 days → false 0ms
     ✓ 0 days → true 0ms
     ✓ 14 days → true 0ms
     ✓ 15 days → false 0ms
     ✓ rejects 1.5 0ms
     ✓ rejects NaN 0ms
     ✓ rejects 3 0ms
     ✓ rejects null 0ms
   ✓ needsApproval (BR-06 decision table) (7)
     ✓ STUDENT, 30 seats → false 0ms
     ✓ STUDENT, 31 seats → true 0ms
     ✓ LECTURER, 31 seats → false 0ms
     ✓ ADMIN, 31 seats → false 0ms
     ✓ throws RangeError for 0 seats 0ms
     ✓ throws RangeError for -5 seats 0ms
     ✓ throws RangeError for 2.5 seats 1ms
   ✓ createBooking (2)
     ✓ builds a PENDING booking for 31 seats 0ms
     ✓ throws the rule code for a bad slot 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/rules/booking.test.js > checkSlot > accepts > 08:00–12:00 (240 min)
AssertionError: expected { ok: false, code: 'TOO_LONG' } to deeply equal { ok: true, minutes: 240 }

- Expected
+ Received

  {
-   "minutes": 240,
-   "ok": true,
+   "code": "TOO_LONG",
+   "ok": false,
  }

 ❯ src/rules/booking.test.js:12:37
     10|       { start: '08:00', end: '12:00', minutes: 240 },  // longest: exa…
     11|     ])('$start–$end ($minutes min)', ({ start, end, minutes }) => {
     12|       expect(checkSlot(start, end)).toEqual({ ok: true, minutes });
       |                                     ^
     13|     });
     14|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 27 passed (28)
   Start at  06:26:14
   Duration  117ms (transform 42%, tests 27%, import 25%, worker 6%)`,
  '81-du-nhanh': `$ npx vitest run demo8/du-nhanh.test.js --coverage --coverage.include=src/rules/booking.js

 RUN  v5.0.5 …/labflow-lite
      Coverage enabled with v8

 ✓ demo8/du-nhanh.test.js (5 tests) 3ms
   ✓ checkSlot 1ms
   ✓ isWithinBookingWindow 0ms
   ✓ needsApproval 1ms
   ✓ createBooking 0ms
   ✓ usageRate 0ms

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  06:26:13
   Duration  125ms (transform 37%, worker 28%, import 25%, tests 9%)

 % Coverage report from v8
------------|---------|----------|---------|---------|-------------------
File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------|---------|----------|---------|---------|-------------------
All files   |     100 |      100 |     100 |     100 |                   
 booking.js |     100 |      100 |     100 |     100 |                   
------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 100% ( 31/31 )
Branches     : 100% ( 27/27 )
Functions    : 100% ( 5/5 )
Lines        : 100% ( 24/24 )
================================================================================`,
  '81-gan-nhu-khong': `$ npx vitest run demo8/gan-nhu-khong.test.js --coverage --coverage.include=src/rules/booking.js

 RUN  v5.0.5 …/labflow-lite
      Coverage enabled with v8

 ✓ demo8/gan-nhu-khong.test.js (5 tests) 3ms
   ✓ checkSlot 1ms
   ✓ isWithinBookingWindow 0ms
   ✓ needsApproval 1ms
   ✓ createBooking 0ms
   ✓ usageRate 0ms

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  06:26:12
   Duration  121ms (transform 38%, worker 26%, import 26%, tests 9%)

 % Coverage report from v8
------------|---------|----------|---------|---------|-------------------
File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------|---------|----------|---------|---------|-------------------
All files   |     100 |    96.29 |     100 |     100 |                   
 booking.js |     100 |    96.29 |     100 |     100 | 40                
------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 100% ( 31/31 )
Branches     : 96.29% ( 26/27 )
Functions    : 100% ( 5/5 )
Lines        : 100% ( 24/24 )
================================================================================`,
  '81-html': `$ npx vitest run demo8/gan-nhu-khong.test.js --coverage --coverage.include=src/rules/booking.js > /dev/null; ls coverage; grep -o 'title="branch not covered" >[^<]*' coverage/booking.js.html
base.css
block-navigation.js
booking.js.html
coverage-summary.json
favicon.png
index.html
prettify.css
prettify.js
sort-arrow-sprite.png
sorter.js
title="branch not covered" >'CONFIRMED',`,
  '81-include': `$ npx vitest run src/ --coverage --reporter=dot --coverage.include='src/**/*.js'

 RUN  v5.0.5 …/labflow-lite
      Coverage enabled with v8

·····················································································

 Test Files  10 passed (10)
      Tests  85 passed (85)
   Start at  06:24:59
   Duration  616ms (import 34%, tests 32%, transform 23%, worker 11%)

 % Coverage report from v8
-----------------|---------|----------|---------|---------|-------------------
File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------|---------|----------|---------|---------|-------------------
All files        |   78.12 |    79.81 |   74.19 |   78.91 |                   
 src             |       0 |      100 |       0 |       0 |                   
  app.js         |       0 |      100 |       0 |       0 | 5-15              
 src/api         |   85.24 |       75 |   88.23 |   89.58 |                   
  main.js        |       0 |        0 |       0 |       0 | 7-9               
  server.js      |   89.58 |    79.16 |   91.66 |   94.44 | 54-56             
 src/auth        |   92.85 |    85.71 |      80 |   92.85 |                   
  login-guard.js |   92.85 |    85.71 |      80 |   92.85 | 5                 
 src/booking     |   77.27 |    63.63 |      80 |   77.77 |                   
  pgRepo.js      |       0 |        0 |       0 |       0 | 5-21              
  service.js     |   97.14 |     87.5 |     100 |     100 | 28,52             
 src/notify      |   84.61 |      100 |   66.66 |   83.33 |                   
  reminder.js    |       0 |      100 |       0 |       0 | 5-8               
 src/rules       |   70.31 |       85 |   53.33 |   71.15 |                   
  booking.js     |   87.09 |    96.29 |      80 |    87.5 | 46-48             
  code.js        |       0 |        0 |       0 |       0 | 2-23              
-----------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 78.12% ( 175/224 )
Branches     : 79.81% ( 87/109 )
Functions    : 74.19% ( 46/62 )
Lines        : 78.91% ( 146/185 )
================================================================================`,
  '81-istanbul-src': `$ npx vitest run src/ --coverage --coverage.provider=istanbul --coverage.reporter=text-summary --reporter=dot

 RUN  v5.0.5 …/labflow-lite
      Coverage enabled with istanbul

····················································································································

 Test Files  15 passed (15)
      Tests  116 passed (116)
   Start at  07:55:47
   Duration  671ms (transform 68%, tests 16%, import 13%, worker 3%)

 % Coverage report from istanbul

=============================== Coverage summary ===============================
Statements   : 96.99% ( 226/233 )
Branches     : 91.45% ( 107/117 )
Functions    : 96.87% ( 62/64 )
Lines        : 98.41% ( 186/189 )
================================================================================`,
  '81-istanbul-web': `$ npx vitest run --config vitest.web.config.js web/ --reporter=dot --coverage --coverage.provider=istanbul --coverage.include='web/*.{js,jsx}' --coverage.exclude='**/*.test.*'

 RUN  v5.0.5 …/labflow-lite
      Coverage enabled with istanbul

················

 Test Files  2 passed (2)
      Tests  16 passed (16)
   Start at  06:26:29
   Duration  1.62s (tests 52%, environment 37%, setup 7%, import 3%, transform 1%)

 % Coverage report from istanbul
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   80.95 |    78.78 |   66.66 |   83.07 |                   
 AdminBookings.jsx |   95.65 |      100 |     100 |   94.11 | 16                
 BookingForm.jsx   |   87.17 |    88.57 |     100 |   96.87 | 62                
 api.js            |       0 |        0 |       0 |       0 | 2-12              
 support.jsx       |     100 |    69.23 |     100 |     100 | 8-11              
-------------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 80.95% ( 68/84 )
Branches     : 78.78% ( 52/66 )
Functions    : 66.66% ( 12/18 )
Lines        : 83.07% ( 54/65 )
================================================================================`,
  '81-khong-assert': `$ npx vitest run demo8/khong-assert.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo8/khong-assert.test.js (1 test | 1 failed) 3ms
   × runs the booking rules 3ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo8/khong-assert.test.js > runs the booking rules
Error: expected any number of assertion, but got none
 ❯ demo8/khong-assert.test.js:5:1
      3| import { checkSlot, needsApproval, createBooking, usageRate } from '..…
      4|
      5| it('runs the booking rules', () => {
       | ^
      6|   checkSlot('08:00', '10:00');
      7|   createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '0…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  06:25:00
   Duration  109ms (import 39%, transform 31%, tests 17%, worker 13%)`,
  '81-lan-dau': `$ npx vitest run src/ --coverage --reporter=dot

 RUN  v5.0.5 …/labflow-lite
      Coverage enabled with v8

·····················································································

 Test Files  10 passed (10)
      Tests  85 passed (85)
   Start at  06:24:58
   Duration  484ms (tests 42%, import 34%, worker 13%, transform 11%)

 % Coverage report from v8
-----------------|---------|----------|---------|---------|-------------------
File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------|---------|----------|---------|---------|-------------------
All files        |   94.47 |     90.9 |   94.44 |   96.31 |                   
 src/api         |   91.22 |    80.76 |   93.75 |   95.55 |                   
  server.js      |   89.58 |    79.16 |   91.66 |   94.44 | 54-56             
 src/auth        |   92.85 |    85.71 |      80 |   92.85 |                   
  login-guard.js |   92.85 |    85.71 |      80 |   92.85 | 5                 
 src/booking     |   97.14 |     87.5 |     100 |     100 |                   
  service.js     |   97.14 |     87.5 |     100 |     100 | 28,52             
 src/rules       |   91.83 |    97.14 |   88.88 |    92.5 |                   
  booking.js     |   87.09 |    96.29 |      80 |    87.5 | 46-48             
-----------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 94.47% ( 188/199 )
Branches     : 90.9% ( 90/99 )
Functions    : 94.44% ( 51/54 )
Lines        : 96.31% ( 157/163 )
================================================================================`,
  '81-per-file': `$ npm run test:cov -- --reporter=dot --coverage.thresholds.perFile

> labflow-lite@1.0.0 test:cov
> vitest run src/ --coverage --reporter=dot --coverage.thresholds.perFile


 RUN  v5.0.5 …/labflow-lite
      Coverage enabled with v8

··························································································

 Test Files  12 passed (12)
      Tests  90 passed (90)
   Start at  06:26:31
   Duration  527ms (tests 37%, import 36%, transform 13%, worker 13%)

 % Coverage report from v8
-----------------|---------|----------|---------|---------|-------------------
File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------|---------|----------|---------|---------|-------------------
All files        |   93.59 |     89.1 |   91.07 |   95.78 |                   
 api             |   91.22 |    80.76 |   93.75 |   95.55 |                   
  auth.js        |     100 |      100 |     100 |     100 |                   
  schemas.js     |     100 |      100 |     100 |     100 |                   
  server.js      |   89.58 |    79.16 |   91.66 |   94.44 | 54-56             
 auth            |   92.85 |    85.71 |      80 |   92.85 |                   
  login-guard.js |   92.85 |    85.71 |      80 |   92.85 | 5                 
 booking         |   97.14 |     87.5 |     100 |     100 |                   
  service.js     |   97.14 |     87.5 |     100 |     100 | 28,52             
 lib             |     100 |      100 |     100 |     100 |                   
  mailer.js      |     100 |      100 |     100 |     100 |                   
  retry.js       |     100 |      100 |     100 |     100 |                   
 notify          |     100 |      100 |     100 |     100 |                   
  notify.js      |     100 |      100 |     100 |     100 |                   
  reminder.js    |     100 |      100 |     100 |     100 |                   
 rules           |   90.62 |     92.5 |      80 |    92.3 |                   
  booking.js     |   87.09 |    96.29 |      80 |    87.5 | 46-48             
  cancel.js      |     100 |      100 |     100 |     100 |                   
  code.js        |   86.66 |       60 |   66.66 |   91.66 | 22                
  days.js        |     100 |      100 |     100 |     100 |                   
  time.js        |     100 |      100 |     100 |     100 |                   
-----------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 93.59% ( 190/203 )
Branches     : 89.1% ( 90/101 )
Functions    : 91.07% ( 51/56 )
Lines        : 95.78% ( 159/166 )
================================================================================
ERROR: Coverage for branches (79.16%) does not meet global threshold (80%) for src/api/server.js
ERROR: Coverage for functions (66.66%) does not meet global threshold (80%) for src/rules/code.js
ERROR: Coverage for branches (60%) does not meet global threshold (80%) for src/rules/code.js`,
  '81-th': `$ npx vitest run src/ demo8/th81.test.js --reporter=dot --coverage --coverage.include=src/api/server.js --coverage.include=src/auth/login-guard.js

 RUN  v5.0.5 …/labflow-lite
      Coverage enabled with v8

·····························································································

 Test Files  13 passed (13)
      Tests  93 passed (93)
   Start at  06:26:32
   Duration  481ms (import 37%, tests 33%, transform 17%, worker 12%)

 % Coverage report from v8
-----------------|---------|----------|---------|---------|-------------------
File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------|---------|----------|---------|---------|-------------------
All files        |   96.77 |    93.54 |   94.11 |     100 |                   
 api             |   95.83 |    91.66 |   91.66 |     100 |                   
  server.js      |   95.83 |    91.66 |   91.66 |     100 | 50,54             
 auth            |     100 |      100 |     100 |     100 |                   
  login-guard.js |     100 |      100 |     100 |     100 |                   
-----------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 96.77% ( 60/62 )
Branches     : 93.54% ( 29/31 )
Functions    : 94.11% ( 16/17 )
Lines        : 100% ( 50/50 )
================================================================================`,
  '81-that-cov': `$ npx vitest run src/rules/booking.test.js --reporter=dot --coverage --coverage.include=src/rules/booking.js

 RUN  v5.0.5 …/labflow-lite
      Coverage enabled with v8

····························

 Test Files  1 passed (1)
      Tests  28 passed (28)
   Start at  06:26:26
   Duration  126ms (import 36%, worker 30%, transform 18%, tests 16%)

 % Coverage report from v8
------------|---------|----------|---------|---------|-------------------
File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------|---------|----------|---------|---------|-------------------
All files   |   87.09 |    96.29 |      80 |    87.5 |                   
 booking.js |   87.09 |    96.29 |      80 |    87.5 | 46-48             
------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 87.09% ( 27/31 )
Branches     : 96.29% ( 26/27 )
Functions    : 80% ( 4/5 )
Lines        : 87.5% ( 21/24 )
================================================================================`,
  '81-v8-src': `$ npx vitest run src/ --coverage --coverage.reporter=text-summary --reporter=dot

 RUN  v5.0.5 …/labflow-lite
      Coverage enabled with v8

····················································································································

 Test Files  15 passed (15)
      Tests  116 passed (116)
   Start at  07:55:45
   Duration  684ms (import 32%, transform 30%, tests 25%, worker 13%)

 % Coverage report from v8

=============================== Coverage summary ===============================
Statements   : 96.99% ( 226/233 )
Branches     : 93.16% ( 109/117 )
Functions    : 96.87% ( 62/64 )
Lines        : 98.41% ( 186/189 )
================================================================================`,
  '81-v8-web': `$ npx vitest run --config vitest.web.config.js web/ --reporter=dot --coverage --coverage.provider=v8 --coverage.include='web/*.{js,jsx}' --coverage.exclude='**/*.test.*'

 RUN  v5.0.5 …/labflow-lite
      Coverage enabled with v8

················

 Test Files  2 passed (2)
      Tests  16 passed (16)
   Start at  06:26:26
   Duration  2.03s (tests 44%, environment 42%, setup 9%, import 3%, worker 2%, transform 1%)

 % Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   81.39 |    78.78 |   66.66 |   83.58 |                   
 AdminBookings.jsx |   95.83 |      100 |     100 |   94.44 | 16                
 BookingForm.jsx   |    87.5 |    88.57 |     100 |   96.96 | 62                
 api.js            |       0 |        0 |       0 |       0 | 2-12              
 support.jsx       |     100 |    69.23 |     100 |     100 | 8-11              
-------------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 81.39% ( 70/86 )
Branches     : 78.78% ( 52/66 )
Functions    : 66.66% ( 12/18 )
Lines        : 83.58% ( 56/67 )
================================================================================`,
  '82-cai': `$ npm ls @stryker-mutator/core @stryker-mutator/vitest-runner
labflow-lite@1.0.0 …/labflow-lite
├── @stryker-mutator/core@10.1.1
└─┬ @stryker-mutator/vitest-runner@10.1.1
  └── @stryker-mutator/core@10.1.1 deduped`,
  '82-chi-phi': `$ TIMEFORMAT='real %Rs'; time (npm run test:unit > /dev/null); time (npx stryker run > /dev/null); time (npx stryker run --coverageAnalysis off > /dev/null); time (npx stryker run --concurrency 1 > /dev/null); time (npx stryker run --mutate 'src/**/*.js,!src/**/*.test.js,!src/api/main.js' | grep -E 'Instrumented|^All files')
real 0.768s
real 10.531s
real 11.177s
real 38.370s
06:33:07 (47310) INFO Instrumenter Instrumented 16 source file(s) with 465 mutant(s)
All files        |  81.94 |   89.23 |      380 |         1 |         46 |       38 |        0 |
real 28.486s`,
  '82-incremental': `$ rm -f reports/stryker-incremental.json; npx stryker run --incremental | grep -E 'Done in'; npx stryker run --incremental | grep -E -A3 'Incremental report' | grep -E 'Mutants|Tests|Result'; npx stryker run --incremental | grep -E 'Done in'; printf "\\nit('a booking of exactly 30 seats is confirmed', () => {\\n  expect(needsApproval({ seats: 30, role: 'STUDENT' })).toBe(false);\\n});\\n" >> src/rules/mutation-gaps.test.js; npx stryker run --incremental | grep -E -A3 'Incremental report|Done in' | grep -E 'Mutants|Tests|Result|Done in'
06:30:37 (40491) INFO MutationTestExecutor Done in 10 seconds.
	Mutants:	0 files changed (+0 -0)
	Tests:		0 files changed (+0 -0)
	Result:		163 of 163 mutant result(s) are reused.
06:30:44 (41314) INFO MutationTestExecutor Done in 2 seconds.
	Mutants:	0 files changed (+0 -0)
	Tests:		1 files changed (+2 -1)
	Result:		158 of 163 mutant result(s) are reused.
06:30:48 (41633) INFO MutationTestExecutor Done in 2 seconds.`,
  '82-lan-dau': `$ npx stryker run
06:29:26 (34762) INFO ProjectReader Found 5 of 218 file(s) to be mutated.
06:29:26 (34762) INFO Instrumenter Instrumented 5 source file(s) with 163 mutant(s)
06:29:26 (34762) INFO ConcurrencyTokenProvider Creating 9 test runner process(es).
06:29:26 (34762) INFO BroadcastReporter Detected that current console does not support the "progress" reporter, downgrading to "progress-append-only" reporter
06:29:27 (34762) INFO DryRunExecutor Starting initial test run (vitest test runner with "perTest" coverage analysis). This may take a while.
06:29:28 (34762) INFO DryRunExecutor Initial test run succeeded. Ran 77 tests in 1 second (net 331.53008400000056 ms, overhead 873.4699159999994 ms).

All tests
  api/server.test.js
    ✓ POST /api/bookings > 201 with Location and the public booking [line 8] (killed 34)
    ✘ POST /api/bookings > 401 without a token [line 16] (covered 0)
    ✘ POST /api/bookings > 400 VALIDATION for seats 0, and for a role in the body [line 21] (covered 0)
    ✓ POST /api/bookings > 422 for a rule, 409 for a taken slot [line 30] (killed 7)
    ~ who may read what > the owner reading booking 1 → 200 [line 47] (covered 73)
    ~ who may read what > another student reading booking 1 → 404 [line 47] (covered 73)
    ~ who may read what > a lecturer reading booking 1 → 404 [line 47] (covered 73)
    ~ who may read what > an admin reading booking 1 → 200 [line 47] (covered 73)
    ✘ who may read what > STUDENT on the admin list → 403 [line 53] (covered 0)
    ✘ who may read what > LECTURER on the admin list → 403 [line 53] (covered 0)
    ✘ who may read what > ADMIN on the admin list → 200 [line 53] (covered 0)
    ✘ who may read what > an expired token → 401 (clock fixed in 2030) [line 58] (covered 0)
  booking/service.test.js
    ~ bookLab > stores a confirmed booking [line 7] (covered 73)
    ~ bookLab > rejects a rule violation with its code before touching the database [line 11] (covered 44)
    ~ bookLab > rejects an overlapping booking with OVERLAP [line 16] (covered 73)
    ~ bookLab > accepts the slot that starts when the previous one ends [line 22] (covered 73)
    ~ bookLab > turns a failing lookup into STORAGE_DOWN and keeps the cause [line 28] (covered 52)
    ~ bookLab > turns a failing insert into STORAGE_DOWN [line 36] (covered 73)
  notify/notify.test.js
    ✘ buildMail (pure) > CONFIRMED booking with 20 seats → mail to an@fpt.edu.vn [line 13] (covered 0)
    ✘ buildMail (pure) > PENDING booking with 31 seats → mail to approvals@labflow.example [line 13] (covered 0)
    ~ bookAndNotify > a confirmed booking e-mails the student once [line 19] (covered 73)
    ~ bookAndNotify > a 31-seat student booking e-mails only the approver [line 26] (covered 73)
    ~ bookAndNotify > a failed e-mail keeps the booking and reports notified: false [line 32] (covered 73)
    ~ bookAndNotify > a failed e-mail is logged with the booking id and the reason [line 39] (covered 73)
    ~ bookAndNotify > a rejected booking sends no e-mail [line 45] (covered 44)
  rules
    booking.test.js
      ✓ checkSlot > accepts > 07:00–08:00 (60 min) [line 11] (killed 1)
      ✓ checkSlot > accepts > 20:00–21:00 (60 min) [line 11] (killed 1)
      ✓ checkSlot > accepts > 08:00–08:30 (30 min) [line 11] (killed 1)
      ✓ checkSlot > accepts > 08:00–12:00 (240 min) [line 11] (killed 1)
      ~ checkSlot > rejects > 06:30–08:00 with OUTSIDE_HOURS [line 25] (covered 44)
      ✓ checkSlot > rejects > 20:00–21:30 with OUTSIDE_HOURS [line 25] (killed 1)
      ✓ checkSlot > rejects > 08:15–09:00 with OFF_GRID [line 25] (killed 6)
      ✓ checkSlot > rejects > 08:00–09:10 with OFF_GRID [line 25] (killed 1)
      ✓ checkSlot > rejects > 10:00–09:00 with END_BEFORE_START [line 25] (killed 4)
      ✓ checkSlot > rejects > 09:00–09:00 with END_BEFORE_START [line 25] (killed 1)
      ✓ checkSlot > rejects > 08:00–12:30 with TOO_LONG [line 25] (killed 4)
      ✓ isWithinBookingWindow (BR-05) > -1 days → false [line 32] (killed 7)
      ✓ isWithinBookingWindow (BR-05) > 0 days → true [line 32] (killed 3)
      ✓ isWithinBookingWindow (BR-05) > 14 days → true [line 32] (killed 1)
      ✓ isWithinBookingWindow (BR-05) > 15 days → false [line 32] (killed 1)
      ~ isWithinBookingWindow (BR-05) > rejects 1.5 [line 35] (covered 6)
      ~ isWithinBookingWindow (BR-05) > rejects NaN [line 35] (covered 6)
      ~ isWithinBookingWindow (BR-05) > rejects 3 [line 35] (covered 6)
      ~ isWithinBookingWindow (BR-05) > rejects null [line 35] (covered 6)
      ✓ needsApproval (BR-06 decision table) > STUDENT, 30 seats → false [line 46] (killed 2)
      ✓ needsApproval (BR-06 decision table) > STUDENT, 31 seats → true [line 46] (killed 4)
      ✓ needsApproval (BR-06 decision table) > LECTURER, 31 seats → false [line 46] (killed 5)
      ✓ needsApproval (BR-06 decision table) > ADMIN, 31 seats → false [line 46] (killed 2)
      ✓ needsApproval (BR-06 decision table) > throws RangeError for 0 seats [line 49] (killed 4)
      ~ needsApproval (BR-06 decision table) > throws RangeError for -5 seats [line 49] (covered 10)
      ~ needsApproval (BR-06 decision table) > throws RangeError for 2.5 seats [line 49] (covered 7)
      ✓ createBooking > builds a PENDING booking for 31 seats [line 55] (killed 6)
      ✓ createBooking > throws the rule code for a bad slot [line 59] (killed 2)
    cancel.test.js
      ✓ canCancel (Lite-3: until 60 minutes before the start) > at 07:00, a 09:00 booking can be cancelled → true [line 12] (killed 3)
      ✓ canCancel (Lite-3: until 60 minutes before the start) > at 08:00, a 09:00 booking can be cancelled → true [line 12] (killed 1)
      ✓ canCancel (Lite-3: until 60 minutes before the start) > at 08:01, a 09:00 booking can be cancelled → false [line 12] (killed 3)
      ~ canCancel (Lite-3: until 60 minutes before the start) > at 09:30, a 09:00 booking can be cancelled → false [line 12] (covered 7)
    code.test.js
      ✓ makeBookingCode > is "LF-" and 6 characters from the readable alphabet [line 6] (killed 10)
      ✓ makeBookingCode > the same seed gives the same code; 20 codes from one seed are all different [line 9] (killed 3)
      ~ makeBookingCode > can produce the first and the last character of the alphabet [line 14] (covered 9)
      ✓ newBookingRecord > takes its id and clock from the caller [line 21] (killed 2)
    days.test.js
      ✓ daysAheadVN (BR-05 counted in Viet Nam time) > now 2026-11-02T06:30:00+07:00 → 2026-11-16 is 14 days ahead [line 10] (killed 11)
      ~ daysAheadVN (BR-05 counted in Viet Nam time) > now 2026-11-02T23:59:00+07:00 → 2026-11-16 is 14 days ahead [line 10] (covered 7)
      ~ daysAheadVN (BR-05 counted in Viet Nam time) > now 2026-11-03T00:00:00+07:00 → 2026-11-16 is 13 days ahead [line 10] (covered 7)
      ~ daysAheadVN (BR-05 counted in Viet Nam time) > now 2026-11-02T06:30:00+07:00 → 2026-11-02 is 0 days ahead [line 10] (covered 7)
    time.test.js
      ~ parseTime > 00:00 → 0 [line 6] (covered 21)
      ~ parseTime > 07:00 → 420 [line 6] (covered 21)
      ~ parseTime > 21:30 → 1290 [line 6] (covered 21)
      ✓ parseTime > 23:59 → 1439 [line 6] (killed 2)
      ~ parseTime > throws TypeError for "7:00" [line 9] (covered 12)
      ~ parseTime > throws TypeError for "07-00" [line 9] (covered 12)
      ~ parseTime > throws TypeError for "" [line 9] (covered 12)
      ~ parseTime > throws TypeError for "abc" [line 9] (covered 12)
      ✓ parseTime > throws RangeError for 24:00 [line 12] (killed 3)
      ✓ parseTime > throws RangeError for 07:60 [line 12] (killed 1)
      ✓ formatTime > pads to HH:MM [line 18] (killed 5)
      ✓ formatTime > round-trips with parseTime for every minute of the day [line 21] (killed 1)

[NoCoverage] StringLiteral
src/rules/booking.js:40:58
-       status: needsApproval({ seats, role }) ? 'PENDING' : 'CONFIRMED',
+       status: needsApproval({ seats, role }) ? 'PENDING' : "",

[NoCoverage] BlockStatement
src/rules/booking.js:45:37
-   export function usageRate(bookings) {
-     let rate = 0;
-     for (const b of bookings) rate += b.minutes / (CLOSE - OPEN);
-     return rate;
-   }
+   export function usageRate(bookings) {}

[NoCoverage] AssignmentOperator
src/rules/booking.js:47:29
-     for (const b of bookings) rate += b.minutes / (CLOSE - OPEN);
+     for (const b of bookings) rate -= b.minutes / (CLOSE - OPEN);

[NoCoverage] ArithmeticOperator
src/rules/booking.js:47:37
-     for (const b of bookings) rate += b.minutes / (CLOSE - OPEN);
+     for (const b of bookings) rate += b.minutes * (CLOSE - OPEN);

[NoCoverage] ArithmeticOperator
src/rules/booking.js:47:50
-     for (const b of bookings) rate += b.minutes / (CLOSE - OPEN);
+     for (const b of bookings) rate += b.minutes / (CLOSE + OPEN);

[Survived] StringLiteral
src/rules/booking.js:26:26
-       throw new RangeError('seats must be a positive integer, got ' + seats);
+       throw new RangeError("" + seats);

[Survived] EqualityOperator
src/rules/booking.js:25:35
-     if (!Number.isInteger(seats) || seats < 1) {
+     if (!Number.isInteger(seats) || seats <= 1) {

[NoCoverage] ArrowFunction
src/rules/code.js:22:51
-   export function newBookingRecord(input, { newId = () => crypto.randomUUID(), now = () => new Date() } = {}) {
+   export function newBookingRecord(input, { newId = () => undefined, now = () => new Date() } = {}) {

[NoCoverage] ArrowFunction
src/rules/code.js:22:84
-   export function newBookingRecord(input, { newId = () => crypto.randomUUID(), now = () => new Date() } = {}) {
+   export function newBookingRecord(input, { newId = () => crypto.randomUUID(), now = () => undefined } = {}) {

[Survived] ArithmeticOperator
src/rules/code.js:16:10
-       t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
+       t ^= t - Math.imul(t ^ t >>> 7, t | 61);

[Survived] StringLiteral
src/rules/days.js:7:81
-     return Math.round((Date.parse(dateText + 'T00:00:00Z') - Date.parse(todayVN + 'T00:00:00Z')) / DAY_MS);
+     return Math.round((Date.parse(dateText + 'T00:00:00Z') - Date.parse(todayVN + "")) / DAY_MS);

[Survived] StringLiteral
src/rules/days.js:7:44
-     return Math.round((Date.parse(dateText + 'T00:00:00Z') - Date.parse(todayVN + 'T00:00:00Z')) / DAY_MS);
+     return Math.round((Date.parse(dateText + "") - Date.parse(todayVN + 'T00:00:00Z')) / DAY_MS);

[Survived] StringLiteral
src/rules/time.js:4:31
-     if (!m) throw new TypeError('Invalid time "' + text + '", expected HH:MM');
+     if (!m) throw new TypeError("" + text + '", expected HH:MM');

[Survived] StringLiteral
src/rules/time.js:4:57
-     if (!m) throw new TypeError('Invalid time "' + text + '", expected HH:MM');
+     if (!m) throw new TypeError('Invalid time "' + text + "");

[Survived] Regex
src/rules/time.js:3:13
-     const m = /^([0-9]{2}):([0-9]{2})$/.exec(text);
+     const m = /^([0-9]{2}):([0-9]{2})/.exec(text);

[Survived] Regex
src/rules/time.js:3:13
-     const m = /^([0-9]{2}):([0-9]{2})$/.exec(text);
+     const m = /([0-9]{2}):([0-9]{2})$/.exec(text);

[Survived] StringLiteral
src/rules/time.js:7:48
-     if (h > 23 || min > 59) throw new RangeError('Time out of range: ' + text);
+     if (h > 23 || min > 59) throw new RangeError("" + text);

[Survived] ConditionalExpression
src/rules/time.js:4:7
-     if (!m) throw new TypeError('Invalid time "' + text + '", expected HH:MM');
+     if (false) throw new TypeError('Invalid time "' + text + '", expected HH:MM');

Ran 4.83 tests per mutant on average.
------------|------------------|----------|-----------|------------|----------|----------|
            | % Mutation score |          |           |            |          |          |
File        |  total | covered | # killed | # timeout | # survived | # no cov | # errors |
------------|--------|---------|----------|-----------|------------|----------|----------|
All files   |  88.96 |   92.95 |      144 |         1 |         11 |        7 |        0 |
 booking.js |  92.55 |   97.75 |       87 |         0 |          2 |        5 |        0 |
 cancel.js  | 100.00 |  100.00 |        7 |         0 |          0 |        0 |        0 |
 code.js    |  84.21 |   94.12 |       15 |         1 |          1 |        2 |        0 |
 days.js    |  84.62 |   84.62 |       11 |         0 |          2 |        0 |        0 |
 time.js    |  80.00 |   80.00 |       24 |         0 |          6 |        0 |        0 |
------------|--------|---------|----------|-----------|------------|----------|----------|
06:29:35 (34762) INFO MutationTestReportHelper Final mutation score of 88.96 is greater than or equal to break threshold 80
06:29:35 (34762) INFO HtmlReporter Your report can be found at: file://…/labflow-lite/reports/mutation/index.html
06:29:35 (34762) INFO MutationTestExecutor Done in 9 seconds.`,
  '82-sandbox-sot': `$ ls .stryker-tmp && npm run test:unit | grep -E 'stryker-tmp.*server|Test Files|Tests  '
sandbox-2n9pUw
 ✓ .stryker-tmp/sandbox-2n9pUw/src/api/server.test.js (12 tests) 231ms
 Test Files  20 passed (20)
      Tests  170 passed (170)`,
  '82-sau': `$ npx stryker run
06:29:05 (33947) INFO ProjectReader Found 5 of 220 file(s) to be mutated.
06:29:05 (33947) INFO Instrumenter Instrumented 5 source file(s) with 163 mutant(s)
06:29:05 (33947) INFO ConcurrencyTokenProvider Creating 9 test runner process(es).
06:29:05 (33947) INFO BroadcastReporter Detected that current console does not support the "progress" reporter, downgrading to "progress-append-only" reporter
06:29:05 (33947) INFO DryRunExecutor Starting initial test run (vitest test runner with "perTest" coverage analysis). This may take a while.
06:29:07 (33947) INFO DryRunExecutor Initial test run succeeded. Ran 86 tests in 1 second (net 330.9159609999999 ms, overhead 949.0840390000001 ms).

All tests
  api/server.test.js
    ✓ POST /api/bookings > 201 with Location and the public booking [line 8] (killed 34)
    ✘ POST /api/bookings > 401 without a token [line 16] (covered 0)
    ✘ POST /api/bookings > 400 VALIDATION for seats 0, and for a role in the body [line 21] (covered 0)
    ✓ POST /api/bookings > 422 for a rule, 409 for a taken slot [line 30] (killed 7)
    ~ who may read what > the owner reading booking 1 → 200 [line 47] (covered 73)
    ~ who may read what > another student reading booking 1 → 404 [line 47] (covered 73)
    ~ who may read what > a lecturer reading booking 1 → 404 [line 47] (covered 73)
    ~ who may read what > an admin reading booking 1 → 200 [line 47] (covered 73)
    ✘ who may read what > STUDENT on the admin list → 403 [line 53] (covered 0)
    ✘ who may read what > LECTURER on the admin list → 403 [line 53] (covered 0)
    ✘ who may read what > ADMIN on the admin list → 200 [line 53] (covered 0)
    ✘ who may read what > an expired token → 401 (clock fixed in 2030) [line 58] (covered 0)
  booking/service.test.js
    ~ bookLab > stores a confirmed booking [line 7] (covered 73)
    ~ bookLab > rejects a rule violation with its code before touching the database [line 11] (covered 44)
    ~ bookLab > rejects an overlapping booking with OVERLAP [line 16] (covered 73)
    ~ bookLab > accepts the slot that starts when the previous one ends [line 22] (covered 73)
    ~ bookLab > turns a failing lookup into STORAGE_DOWN and keeps the cause [line 28] (covered 52)
    ~ bookLab > turns a failing insert into STORAGE_DOWN [line 36] (covered 73)
  notify/notify.test.js
    ✘ buildMail (pure) > CONFIRMED booking with 20 seats → mail to an@fpt.edu.vn [line 13] (covered 0)
    ✘ buildMail (pure) > PENDING booking with 31 seats → mail to approvals@labflow.example [line 13] (covered 0)
    ~ bookAndNotify > a confirmed booking e-mails the student once [line 19] (covered 73)
    ~ bookAndNotify > a 31-seat student booking e-mails only the approver [line 26] (covered 73)
    ~ bookAndNotify > a failed e-mail keeps the booking and reports notified: false [line 32] (covered 73)
    ~ bookAndNotify > a failed e-mail is logged with the booking id and the reason [line 39] (covered 73)
    ~ bookAndNotify > a rejected booking sends no e-mail [line 45] (covered 44)
  rules
    booking.test.js
      ✓ checkSlot > accepts > 07:00–08:00 (60 min) [line 11] (killed 1)
      ✓ checkSlot > accepts > 20:00–21:00 (60 min) [line 11] (killed 1)
      ✓ checkSlot > accepts > 08:00–08:30 (30 min) [line 11] (killed 1)
      ✓ checkSlot > accepts > 08:00–12:00 (240 min) [line 11] (killed 1)
      ~ checkSlot > rejects > 06:30–08:00 with OUTSIDE_HOURS [line 25] (covered 44)
      ✓ checkSlot > rejects > 20:00–21:30 with OUTSIDE_HOURS [line 25] (killed 1)
      ✓ checkSlot > rejects > 08:15–09:00 with OFF_GRID [line 25] (killed 6)
      ✓ checkSlot > rejects > 08:00–09:10 with OFF_GRID [line 25] (killed 1)
      ✓ checkSlot > rejects > 10:00–09:00 with END_BEFORE_START [line 25] (killed 4)
      ✓ checkSlot > rejects > 09:00–09:00 with END_BEFORE_START [line 25] (killed 1)
      ✓ checkSlot > rejects > 08:00–12:30 with TOO_LONG [line 25] (killed 4)
      ✓ isWithinBookingWindow (BR-05) > -1 days → false [line 32] (killed 7)
      ✓ isWithinBookingWindow (BR-05) > 0 days → true [line 32] (killed 3)
      ✓ isWithinBookingWindow (BR-05) > 14 days → true [line 32] (killed 1)
      ✓ isWithinBookingWindow (BR-05) > 15 days → false [line 32] (killed 1)
      ~ isWithinBookingWindow (BR-05) > rejects 1.5 [line 35] (covered 6)
      ~ isWithinBookingWindow (BR-05) > rejects NaN [line 35] (covered 6)
      ~ isWithinBookingWindow (BR-05) > rejects 3 [line 35] (covered 6)
      ~ isWithinBookingWindow (BR-05) > rejects null [line 35] (covered 6)
      ✓ needsApproval (BR-06 decision table) > STUDENT, 30 seats → false [line 46] (killed 2)
      ✓ needsApproval (BR-06 decision table) > STUDENT, 31 seats → true [line 46] (killed 4)
      ✓ needsApproval (BR-06 decision table) > LECTURER, 31 seats → false [line 46] (killed 5)
      ✓ needsApproval (BR-06 decision table) > ADMIN, 31 seats → false [line 46] (killed 2)
      ✓ needsApproval (BR-06 decision table) > throws RangeError for 0 seats [line 49] (killed 4)
      ~ needsApproval (BR-06 decision table) > throws RangeError for -5 seats [line 49] (covered 10)
      ~ needsApproval (BR-06 decision table) > throws RangeError for 2.5 seats [line 49] (covered 7)
      ✓ createBooking > builds a PENDING booking for 31 seats [line 55] (killed 6)
      ✓ createBooking > throws the rule code for a bad slot [line 59] (killed 2)
    cancel.test.js
      ✓ canCancel (Lite-3: until 60 minutes before the start) > at 07:00, a 09:00 booking can be cancelled → true [line 12] (killed 3)
      ✓ canCancel (Lite-3: until 60 minutes before the start) > at 08:00, a 09:00 booking can be cancelled → true [line 12] (killed 1)
      ✓ canCancel (Lite-3: until 60 minutes before the start) > at 08:01, a 09:00 booking can be cancelled → false [line 12] (killed 3)
      ~ canCancel (Lite-3: until 60 minutes before the start) > at 09:30, a 09:00 booking can be cancelled → false [line 12] (covered 7)
    code.test.js
      ✓ makeBookingCode > is "LF-" and 6 characters from the readable alphabet [line 6] (killed 10)
      ✓ makeBookingCode > the same seed gives the same code; 20 codes from one seed are all different [line 9] (killed 3)
      ~ makeBookingCode > can produce the first and the last character of the alphabet [line 14] (covered 9)
      ~ newBookingRecord > takes its id and clock from the caller [line 21] (covered 11)
    days.test.js
      ✓ daysAheadVN (BR-05 counted in Viet Nam time) > now 2026-11-02T06:30:00+07:00 → 2026-11-16 is 14 days ahead [line 10] (killed 11)
      ~ daysAheadVN (BR-05 counted in Viet Nam time) > now 2026-11-02T23:59:00+07:00 → 2026-11-16 is 14 days ahead [line 10] (covered 7)
      ~ daysAheadVN (BR-05 counted in Viet Nam time) > now 2026-11-03T00:00:00+07:00 → 2026-11-16 is 13 days ahead [line 10] (covered 7)
      ~ daysAheadVN (BR-05 counted in Viet Nam time) > now 2026-11-02T06:30:00+07:00 → 2026-11-02 is 0 days ahead [line 10] (covered 7)
    mutation-gaps.test.js
      ✓ booking rules: the cases nobody wrote > one seat is a valid booking [line 8] (killed 1)
      ✓ booking rules: the cases nobody wrote > the error says what was wrong [line 11] (killed 1)
      ✓ booking rules: the cases nobody wrote > a small student booking is CONFIRMED [line 14] (killed 1)
      ✓ booking rules: the cases nobody wrote > usageRate adds up the booked share of the 14 opening hours [line 17] (killed 4)
      ✓ parseTime: only exactly HH:MM > refuses 08:000 [line 23] (killed 4)
      ✓ parseTime: only exactly HH:MM > refuses 108:00 [line 23] (killed 1)
      ~ parseTime: only exactly HH:MM > the TypeError is ours, not a crash on null [line 26] (covered 12)
      ✓ parseTime: only exactly HH:MM > says which time is out of range [line 29] (killed 4)
      ✓ newBookingRecord without injected helpers > makes a UUID and stamps the current time [line 35] (killed 4)
    time.test.js
      ~ parseTime > 00:00 → 0 [line 6] (covered 21)
      ~ parseTime > 07:00 → 420 [line 6] (covered 21)
      ~ parseTime > 21:30 → 1290 [line 6] (covered 21)
      ✓ parseTime > 23:59 → 1439 [line 6] (killed 2)
      ~ parseTime > throws TypeError for "7:00" [line 9] (covered 12)
      ~ parseTime > throws TypeError for "07-00" [line 9] (covered 12)
      ~ parseTime > throws TypeError for "" [line 9] (covered 12)
      ~ parseTime > throws TypeError for "abc" [line 9] (covered 12)
      ~ parseTime > throws RangeError for 24:00 [line 12] (covered 17)
      ✓ parseTime > throws RangeError for 07:60 [line 12] (killed 1)
      ✓ formatTime > pads to HH:MM [line 18] (killed 5)
      ✓ formatTime > round-trips with parseTime for every minute of the day [line 21] (killed 1)

[Survived] ArithmeticOperator
src/rules/code.js:16:10
-       t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
+       t ^= t - Math.imul(t ^ t >>> 7, t | 61);

[Survived] StringLiteral
src/rules/days.js:7:81
-     return Math.round((Date.parse(dateText + 'T00:00:00Z') - Date.parse(todayVN + 'T00:00:00Z')) / DAY_MS);
+     return Math.round((Date.parse(dateText + 'T00:00:00Z') - Date.parse(todayVN + "")) / DAY_MS);

[Survived] StringLiteral
src/rules/days.js:7:44
-     return Math.round((Date.parse(dateText + 'T00:00:00Z') - Date.parse(todayVN + 'T00:00:00Z')) / DAY_MS);
+     return Math.round((Date.parse(dateText + "") - Date.parse(todayVN + 'T00:00:00Z')) / DAY_MS);

Ran 4.29 tests per mutant on average.
------------|------------------|----------|-----------|------------|----------|----------|
            | % Mutation score |          |           |            |          |          |
File        |  total | covered | # killed | # timeout | # survived | # no cov | # errors |
------------|--------|---------|----------|-----------|------------|----------|----------|
All files   |  98.16 |   98.16 |      159 |         1 |          3 |        0 |        0 |
 booking.js | 100.00 |  100.00 |       94 |         0 |          0 |        0 |        0 |
 cancel.js  | 100.00 |  100.00 |        7 |         0 |          0 |        0 |        0 |
 code.js    |  94.74 |   94.74 |       17 |         1 |          1 |        0 |        0 |
 days.js    |  84.62 |   84.62 |       11 |         0 |          2 |        0 |        0 |
 time.js    | 100.00 |  100.00 |       30 |         0 |          0 |        0 |        0 |
------------|--------|---------|----------|-----------|------------|----------|----------|
06:29:14 (33947) INFO MutationTestReportHelper Final mutation score of 98.16 is greater than or equal to break threshold 80
06:29:14 (33947) INFO HtmlReporter Your report can be found at: file://…/labflow-lite/reports/mutation/index.html
06:29:14 (33947) INFO MutationTestExecutor Done in 9 seconds.`,
  '82-th-sau': `$ npx stryker run --mutate src/lib/retry.js
06:29:15 (34361) INFO ProjectReader Found 1 of 220 file(s) to be mutated.
06:29:15 (34361) INFO Instrumenter Instrumented 1 source file(s) with 14 mutant(s)
06:29:15 (34361) INFO ConcurrencyTokenProvider Creating 9 test runner process(es).
06:29:15 (34361) INFO BroadcastReporter Detected that current console does not support the "progress" reporter, downgrading to "progress-append-only" reporter
06:29:16 (34361) INFO DryRunExecutor Starting initial test run (vitest test runner with "perTest" coverage analysis). This may take a while.
06:29:16 (34361) INFO DryRunExecutor Initial test run succeeded. Ran 4 tests in 0 seconds (net 9.076416999999992 ms, overhead 223.923583 ms).

All tests
  retry-last.test.js
    ✓ gives up right after the 3rd attempt: no wait after the last one [line 8] (killed 2)
  retry.test.js
    ✓ retry > returns at once when the first attempt works [line 8] (killed 5)
    ✓ retry > waits 1 s then 2 s between attempts [line 14] (killed 7)
    ~ retry > gives up after 3 attempts and rethrows the last error [line 31] (covered 14)

Ran 1.36 tests per mutant on average.
----------|------------------|----------|-----------|------------|----------|----------|
          | % Mutation score |          |           |            |          |          |
File      |  total | covered | # killed | # timeout | # survived | # no cov | # errors |
----------|--------|---------|----------|-----------|------------|----------|----------|
All files | 100.00 |  100.00 |       14 |         0 |          0 |        0 |        0 |
 retry.js | 100.00 |  100.00 |       14 |         0 |          0 |        0 |        0 |
----------|--------|---------|----------|-----------|------------|----------|----------|
06:29:16 (34361) INFO MutationTestReportHelper Final mutation score of 100.00 is greater than or equal to break threshold 80
06:29:16 (34361) INFO HtmlReporter Your report can be found at: file://…/labflow-lite/reports/mutation/index.html
06:29:16 (34361) INFO MutationTestExecutor Done in 1 second.`,
  '82-th-truoc': `$ npx stryker run --mutate src/lib/retry.js
06:29:36 (35156) INFO ProjectReader Found 1 of 218 file(s) to be mutated.
06:29:36 (35156) INFO Instrumenter Instrumented 1 source file(s) with 14 mutant(s)
06:29:36 (35156) INFO ConcurrencyTokenProvider Creating 9 test runner process(es).
06:29:36 (35156) INFO BroadcastReporter Detected that current console does not support the "progress" reporter, downgrading to "progress-append-only" reporter
06:29:37 (35156) INFO DryRunExecutor Starting initial test run (vitest test runner with "perTest" coverage analysis). This may take a while.
06:29:37 (35156) INFO DryRunExecutor Initial test run succeeded. Ran 3 tests in 0 seconds (net 6.054041000000041 ms, overhead 152.94595899999996 ms).

All tests/retry.test.js
  ✓ retry > returns at once when the first attempt works [line 8] (killed 5)
  ✓ retry > waits 1 s then 2 s between attempts [line 14] (killed 7)
  ~ retry > gives up after 3 attempts and rethrows the last error [line 31] (covered 14)

[Survived] ConditionalExpression
src/lib/retry.js:9:11
-         if (i < attempts) await new Promise((resolve) => setTimeout(resolve, delayMs * i));
+         if (true) await new Promise((resolve) => setTimeout(resolve, delayMs * i));

[Survived] EqualityOperator
src/lib/retry.js:9:11
-         if (i < attempts) await new Promise((resolve) => setTimeout(resolve, delayMs * i));
+         if (i <= attempts) await new Promise((resolve) => setTimeout(resolve, delayMs * i));

Ran 1.21 tests per mutant on average.
----------|------------------|----------|-----------|------------|----------|----------|
          | % Mutation score |          |           |            |          |          |
File      |  total | covered | # killed | # timeout | # survived | # no cov | # errors |
----------|--------|---------|----------|-----------|------------|----------|----------|
All files |  85.71 |   85.71 |       12 |         0 |          2 |        0 |        0 |
 retry.js |  85.71 |   85.71 |       12 |         0 |          2 |        0 |        0 |
----------|--------|---------|----------|-----------|------------|----------|----------|
06:29:37 (35156) INFO MutationTestReportHelper Final mutation score of 85.71 is greater than or equal to break threshold 80
06:29:37 (35156) INFO HtmlReporter Your report can be found at: file://…/labflow-lite/reports/mutation/index.html
06:29:37 (35156) INFO MutationTestExecutor Done in 1 second.`,
  '82-tuong-duong': `$ node -e "console.log(Date.parse('2026-11-16'), Date.parse('2026-11-16T00:00:00Z'))"
1794787200000 1794787200000`,
  '82-yeu': `$ npx stryker run demo8/stryker.yeu.config.mjs
06:28:47 (32884) INFO ProjectReader Found 1 of 221 file(s) to be mutated.
06:28:47 (32884) INFO Instrumenter Instrumented 1 source file(s) with 94 mutant(s)
06:28:47 (32884) INFO ConcurrencyTokenProvider Creating 9 test runner process(es).
06:28:47 (32884) INFO BroadcastReporter Detected that current console does not support the "progress" reporter, downgrading to "progress-append-only" reporter
06:28:47 (32884) INFO DryRunExecutor Starting initial test run (vitest test runner with "perTest" coverage analysis). This may take a while.
06:28:48 (32884) INFO DryRunExecutor Initial test run succeeded. Ran 5 tests in 0 seconds (net 4.120083000000022 ms, overhead 128.87991699999998 ms).

All tests/du-nhanh.test.js
  ✓ checkSlot [line 5] (killed 1)
  ✓ isWithinBookingWindow [line 10] (killed 1)
  ✓ needsApproval [line 13] (killed 8)
  ✓ createBooking [line 18] (killed 27)
  ✓ usageRate [line 23] (killed 2)

[Survived] ConditionalExpression
src/rules/booking.js:13:7
-     if (s % STEP !== 0 || e % STEP !== 0) return { ok: false, code: 'OFF_GRID' };
+     if (false || e % STEP !== 0) return { ok: false, code: 'OFF_GRID' };

[Survived] ConditionalExpression
src/rules/booking.js:13:7
-     if (s % STEP !== 0 || e % STEP !== 0) return { ok: false, code: 'OFF_GRID' };
+     if (false) return { ok: false, code: 'OFF_GRID' };

[Survived] LogicalOperator
src/rules/booking.js:13:7
-     if (s % STEP !== 0 || e % STEP !== 0) return { ok: false, code: 'OFF_GRID' };
+     if (s % STEP !== 0 && e % STEP !== 0) return { ok: false, code: 'OFF_GRID' };

[Survived] ConditionalExpression
src/rules/booking.js:13:25
-     if (s % STEP !== 0 || e % STEP !== 0) return { ok: false, code: 'OFF_GRID' };
+     if (s % STEP !== 0 || false) return { ok: false, code: 'OFF_GRID' };

[Survived] ObjectLiteral
src/rules/booking.js:13:48
-     if (s % STEP !== 0 || e % STEP !== 0) return { ok: false, code: 'OFF_GRID' };
+     if (s % STEP !== 0 || e % STEP !== 0) return {};

[Survived] BooleanLiteral
src/rules/booking.js:13:54
-     if (s % STEP !== 0 || e % STEP !== 0) return { ok: false, code: 'OFF_GRID' };
+     if (s % STEP !== 0 || e % STEP !== 0) return { ok: true, code: 'OFF_GRID' };

[Survived] StringLiteral
src/rules/booking.js:13:67
-     if (s % STEP !== 0 || e % STEP !== 0) return { ok: false, code: 'OFF_GRID' };
+     if (s % STEP !== 0 || e % STEP !== 0) return { ok: false, code: "" };

[Survived] EqualityOperator
src/rules/booking.js:14:7
-     if (e <= s) return { ok: false, code: 'END_BEFORE_START' };
+     if (e < s) return { ok: false, code: 'END_BEFORE_START' };

[Survived] ObjectLiteral
src/rules/booking.js:14:22
-     if (e <= s) return { ok: false, code: 'END_BEFORE_START' };
+     if (e <= s) return {};

[Survived] ConditionalExpression
src/rules/booking.js:14:7
-     if (e <= s) return { ok: false, code: 'END_BEFORE_START' };
+     if (false) return { ok: false, code: 'END_BEFORE_START' };

[Survived] BooleanLiteral
src/rules/booking.js:14:28
-     if (e <= s) return { ok: false, code: 'END_BEFORE_START' };
+     if (e <= s) return { ok: true, code: 'END_BEFORE_START' };

[Survived] StringLiteral
src/rules/booking.js:14:41
-     if (e <= s) return { ok: false, code: 'END_BEFORE_START' };
+     if (e <= s) return { ok: false, code: "" };

[Survived] EqualityOperator
src/rules/booking.js:15:7
-     if (s < OPEN || e > CLOSE) return { ok: false, code: 'OUTSIDE_HOURS' };
+     if (s <= OPEN || e > CLOSE) return { ok: false, code: 'OUTSIDE_HOURS' };

[Survived] EqualityOperator
src/rules/booking.js:15:19
-     if (s < OPEN || e > CLOSE) return { ok: false, code: 'OUTSIDE_HOURS' };
+     if (s < OPEN || e >= CLOSE) return { ok: false, code: 'OUTSIDE_HOURS' };

[Survived] ConditionalExpression
src/rules/booking.js:15:19
-     if (s < OPEN || e > CLOSE) return { ok: false, code: 'OUTSIDE_HOURS' };
+     if (s < OPEN || false) return { ok: false, code: 'OUTSIDE_HOURS' };

[Survived] ObjectLiteral
src/rules/booking.js:15:37
-     if (s < OPEN || e > CLOSE) return { ok: false, code: 'OUTSIDE_HOURS' };
+     if (s < OPEN || e > CLOSE) return {};

[Survived] StringLiteral
src/rules/booking.js:15:56
-     if (s < OPEN || e > CLOSE) return { ok: false, code: 'OUTSIDE_HOURS' };
+     if (s < OPEN || e > CLOSE) return { ok: false, code: "" };

[Survived] EqualityOperator
src/rules/booking.js:16:7
-     if (e - s > MAX_MINUTES) return { ok: false, code: 'TOO_LONG' };
+     if (e - s >= MAX_MINUTES) return { ok: false, code: 'TOO_LONG' };

[Survived] ObjectLiteral
src/rules/booking.js:16:35
-     if (e - s > MAX_MINUTES) return { ok: false, code: 'TOO_LONG' };
+     if (e - s > MAX_MINUTES) return {};

[Survived] ConditionalExpression
src/rules/booking.js:16:7
-     if (e - s > MAX_MINUTES) return { ok: false, code: 'TOO_LONG' };
+     if (false) return { ok: false, code: 'TOO_LONG' };

[Survived] BooleanLiteral
src/rules/booking.js:16:41
-     if (e - s > MAX_MINUTES) return { ok: false, code: 'TOO_LONG' };
+     if (e - s > MAX_MINUTES) return { ok: true, code: 'TOO_LONG' };

[Survived] StringLiteral
src/rules/booking.js:16:54
-     if (e - s > MAX_MINUTES) return { ok: false, code: 'TOO_LONG' };
+     if (e - s > MAX_MINUTES) return { ok: false, code: "" };

[Survived] ArithmeticOperator
src/rules/booking.js:17:31
-     return { ok: true, minutes: e - s };
+     return { ok: true, minutes: e + s };

[Survived] ConditionalExpression
src/rules/booking.js:21:10
-     return Number.isInteger(daysAhead) && daysAhead >= 0 && daysAhead <= MAX_DAYS_AHEAD;
+     return true;

[Survived] ConditionalExpression
src/rules/booking.js:21:10
-     return Number.isInteger(daysAhead) && daysAhead >= 0 && daysAhead <= MAX_DAYS_AHEAD;
+     return false;

[Survived] LogicalOperator
src/rules/booking.js:21:10
-     return Number.isInteger(daysAhead) && daysAhead >= 0 && daysAhead <= MAX_DAYS_AHEAD;
+     return Number.isInteger(daysAhead) && daysAhead >= 0 || daysAhead <= MAX_DAYS_AHEAD;

[Survived] ConditionalExpression
src/rules/booking.js:21:41
-     return Number.isInteger(daysAhead) && daysAhead >= 0 && daysAhead <= MAX_DAYS_AHEAD;
+     return Number.isInteger(daysAhead) && true && daysAhead <= MAX_DAYS_AHEAD;

[Survived] LogicalOperator
src/rules/booking.js:21:10
-     return Number.isInteger(daysAhead) && daysAhead >= 0 && daysAhead <= MAX_DAYS_AHEAD;
+     return Number.isInteger(daysAhead) || daysAhead >= 0 && daysAhead <= MAX_DAYS_AHEAD;

[Survived] ConditionalExpression
src/rules/booking.js:21:10
-     return Number.isInteger(daysAhead) && daysAhead >= 0 && daysAhead <= MAX_DAYS_AHEAD;
+     return true && daysAhead <= MAX_DAYS_AHEAD;

[Survived] EqualityOperator
src/rules/booking.js:21:41
-     return Number.isInteger(daysAhead) && daysAhead >= 0 && daysAhead <= MAX_DAYS_AHEAD;
+     return Number.isInteger(daysAhead) && daysAhead > 0 && daysAhead <= MAX_DAYS_AHEAD;

[Survived] EqualityOperator
src/rules/booking.js:21:41
-     return Number.isInteger(daysAhead) && daysAhead >= 0 && daysAhead <= MAX_DAYS_AHEAD;
+     return Number.isInteger(daysAhead) && daysAhead < 0 && daysAhead <= MAX_DAYS_AHEAD;

[Survived] ConditionalExpression
src/rules/booking.js:21:59
-     return Number.isInteger(daysAhead) && daysAhead >= 0 && daysAhead <= MAX_DAYS_AHEAD;
+     return Number.isInteger(daysAhead) && daysAhead >= 0 && true;

[Survived] EqualityOperator
src/rules/booking.js:21:59
-     return Number.isInteger(daysAhead) && daysAhead >= 0 && daysAhead <= MAX_DAYS_AHEAD;
+     return Number.isInteger(daysAhead) && daysAhead >= 0 && daysAhead < MAX_DAYS_AHEAD;

[Survived] EqualityOperator
src/rules/booking.js:21:59
-     return Number.isInteger(daysAhead) && daysAhead >= 0 && daysAhead <= MAX_DAYS_AHEAD;
+     return Number.isInteger(daysAhead) && daysAhead >= 0 && daysAhead > MAX_DAYS_AHEAD;

[Survived] StringLiteral
src/rules/booking.js:26:26
-       throw new RangeError('seats must be a positive integer, got ' + seats);
+       throw new RangeError("" + seats);

[Survived] ConditionalExpression
src/rules/booking.js:28:7
-     if (role === 'LECTURER' || role === 'ADMIN') return false;
+     if (false) return false;

[Survived] LogicalOperator
src/rules/booking.js:28:7
-     if (role === 'LECTURER' || role === 'ADMIN') return false;
+     if (role === 'LECTURER' && role === 'ADMIN') return false;

[Survived] EqualityOperator
src/rules/booking.js:25:35
-     if (!Number.isInteger(seats) || seats < 1) {
+     if (!Number.isInteger(seats) || seats <= 1) {

[Survived] EqualityOperator
src/rules/booking.js:28:7
-     if (role === 'LECTURER' || role === 'ADMIN') return false;
+     if (role !== 'LECTURER' || role === 'ADMIN') return false;

[Survived] ConditionalExpression
src/rules/booking.js:28:7
-     if (role === 'LECTURER' || role === 'ADMIN') return false;
+     if (false || role === 'ADMIN') return false;

[Survived] ConditionalExpression
src/rules/booking.js:28:30
-     if (role === 'LECTURER' || role === 'ADMIN') return false;
+     if (role === 'LECTURER' || false) return false;

[Survived] StringLiteral
src/rules/booking.js:28:16
-     if (role === 'LECTURER' || role === 'ADMIN') return false;
+     if (role === "" || role === 'ADMIN') return false;

[Survived] ConditionalExpression
src/rules/booking.js:28:7
-     if (role === 'LECTURER' || role === 'ADMIN') return false;
+     if (true) return false;

[Survived] EqualityOperator
src/rules/booking.js:28:30
-     if (role === 'LECTURER' || role === 'ADMIN') return false;
+     if (role === 'LECTURER' || role !== 'ADMIN') return false;

[Survived] BooleanLiteral
src/rules/booking.js:28:55
-     if (role === 'LECTURER' || role === 'ADMIN') return false;
+     if (role === 'LECTURER' || role === 'ADMIN') return true;

[Survived] StringLiteral
src/rules/booking.js:28:39
-     if (role === 'LECTURER' || role === 'ADMIN') return false;
+     if (role === 'LECTURER' || role === "") return false;

[Survived] ConditionalExpression
src/rules/booking.js:29:10
-     return seats > APPROVAL_SEATS;
+     return true;

[Survived] EqualityOperator
src/rules/booking.js:29:10
-     return seats > APPROVAL_SEATS;
+     return seats <= APPROVAL_SEATS;

[Survived] EqualityOperator
src/rules/booking.js:29:10
-     return seats > APPROVAL_SEATS;
+     return seats >= APPROVAL_SEATS;

[Survived] ConditionalExpression
src/rules/booking.js:29:10
-     return seats > APPROVAL_SEATS;
+     return false;

[Survived] ObjectLiteral
src/rules/booking.js:35:10
-     return {
-       lab,
-       start,
-       end,
-       minutes: slot.minutes,
-       status: needsApproval({ seats, role }) ? 'PENDING' : 'CONFIRMED',
-     };
+     return {};

[Survived] StringLiteral
src/rules/booking.js:40:58
-       status: needsApproval({ seats, role }) ? 'PENDING' : 'CONFIRMED',
+       status: needsApproval({ seats, role }) ? 'PENDING' : "",

[Survived] StringLiteral
src/rules/booking.js:40:46
-       status: needsApproval({ seats, role }) ? 'PENDING' : 'CONFIRMED',
+       status: needsApproval({ seats, role }) ? "" : 'CONFIRMED',

[Survived] ArithmeticOperator
src/rules/booking.js:47:37
-     for (const b of bookings) rate += b.minutes / (CLOSE - OPEN);
+     for (const b of bookings) rate += b.minutes * (CLOSE - OPEN);

[Survived] ArithmeticOperator
src/rules/booking.js:47:50
-     for (const b of bookings) rate += b.minutes / (CLOSE - OPEN);
+     for (const b of bookings) rate += b.minutes / (CLOSE + OPEN);

Ran 1.56 tests per mutant on average.
------------|------------------|----------|-----------|------------|----------|----------|
            | % Mutation score |          |           |            |          |          |
File        |  total | covered | # killed | # timeout | # survived | # no cov | # errors |
------------|--------|---------|----------|-----------|------------|----------|----------|
All files   |  41.49 |   41.49 |       39 |         0 |         55 |        0 |        0 |
 booking.js |  41.49 |   41.49 |       39 |         0 |         55 |        0 |        0 |
------------|--------|---------|----------|-----------|------------|----------|----------|
06:28:50 (32884) ERROR MutationTestReportHelper Final mutation score 41.49 under breaking threshold 60, setting exit code to 1 (failure).
06:28:50 (32884) INFO MutationTestReportHelper (improve mutation score or set \`thresholds.break = null\` to prevent this error in the future)
06:28:50 (32884) INFO MutationTestExecutor Done in 3 seconds.`,
  '83-cach-ly': `$ npx vitest --listTags; npx vitest run demo8/cach-ly.test.js --tagsFilter='!quarantine'; npx vitest run demo8/cach-ly.test.js --tagsFilter=quarantine --repeats=19 --reporter=dot 2>&1 | grep -E 'Tests  |⎯\\[1/'
  quarantine: known flaky: has an issue and an owner, not run in the main suite (lesson 8.3)

 RUN  v5.0.5 …/labflow-lite

 ✓ demo8/cach-ly.test.js (2 tests | 1 skipped) 2ms
   ✓ 31 seats need approval 1ms
   ↓ two students book the same slot at once: exactly one wins

 Test Files  1 passed (1)
      Tests  1 passed | 1 skipped (2)
   Start at  06:39:34
   Duration  105ms (transform 54%, import 31%, worker 9%, tests 6%)

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/8]⎯
      Tests  1 failed | 1 skipped (2)`,
  '83-da-sua': `$ npx vitest run demo8/da-sua.test.js --repeats=99 --sequence.shuffle; node scripts/lap-lai.mjs 20 demo8/da-sua.test.js --sequence.shuffle

 RUN  v5.0.5 …/labflow-lite
      Running tests with seed "1793489808682"

 ✓ demo8/da-sua.test.js (11 tests) 2094ms
   ✓ at 2026-11-02T06:30:00+07:00, 2026-11-03 is 1 day ahead 2ms (repeat x99)
   ✓ at 2026-11-02T08:00:00+07:00, 2026-11-03 is 1 day ahead 3ms (repeat x99)
   ✓ at 2026-11-02T23:59:00+07:00, 2026-11-03 is 1 day ahead 3ms (repeat x99)
   ✓ a student with 1 seats needs approval: false 2ms (repeat x99)
   ✓ a student with 30 seats needs approval: false 4ms (repeat x99)
   ✓ a student with 31 seats needs approval: true 2ms (repeat x99)
   ✓ a student with 40 seats needs approval: true 2ms (repeat x99)
   ✓ a user with no failures is not locked 2ms (repeat x99)
   ✓ 5 wrong passwords lock the account 2ms (repeat x99)
   ✓ two students book the same slot at once: exactly one wins 1866ms (repeat x99)
   ✓ sends the booking confirmation 202ms (repeat x99)

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  06:36:48
   Duration  2.27s (tests 96%, import 3%, transform 1%)

red in 0/20 runs (13.4 s)`,
  '83-dua-lech': `$ npx vitest run demo8/dua-lech.test.js --repeats=99 --reporter=dot

 RUN  v5.0.5 …/labflow-lite

x

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
AssertionError: expected [ 'fulfilled', 'fulfilled' ] to deeply equal [ 'fulfilled', 'rejected' ]

- Expected
+ Received

  [
    "fulfilled",
-   "rejected",
+   "fulfilled",
  ]

 ❯ demo8/dua-lech.test.js:11:47
      9|   const repo = slowRepo();
     10|   const results = await Promise.allSettled([bookLab(repo, input), book…
     11|   expect(results.map((r) => r.status).sort()).toEqual(['fulfilled', 'r…
       |                                               ^
     12| });
     13|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/33]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  06:38:26
   Duration  3.59s (tests 99%)`,
  '83-gio-that-sang': `$ date '+%H:%M %Z' && npx vitest run demo8/gio-that.test.js
06:19 +07

 RUN  v5.0.5 …/labflow-lite

 ❯ demo8/gio-that.test.js (1 test | 1 failed) 6ms
   × a booking for tomorrow is 1 day ahead 5ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo8/gio-that.test.js > a booking for tomorrow is 1 day ahead
AssertionError: expected +0 to be 1 // Object.is equality

- Expected
+ Received

- 1
+ 0

 ❯ demo8/gio-that.test.js:7:33
      5| it('a booking for tomorrow is 1 day ahead', () => {
      6|   const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOStr…
      7|   expect(daysAheadVN(tomorrow)).toBe(1);
       |                                 ^
      8| });
      9|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  06:19:48
   Duration  133ms (transform 48%, import 25%, tests 17%, worker 10%)`,
  '83-gio-that-sau': `$ date '+%H:%M %Z' && npx vitest run demo8/gio-that.test.js
07:01 +07

 RUN  v5.0.5 …/labflow-lite

 ✓ demo8/gio-that.test.js (1 test) 3ms
   ✓ a booking for tomorrow is 1 day ahead 2ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  07:01:04
   Duration  103ms (import 40%, transform 29%, worker 16%, tests 14%)`,
  '83-mang': `$ npx vitest run demo8/mang.test.js --repeats=99 --reporter=dot

 RUN  v5.0.5 …/labflow-lite

x

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
 FAIL  demo8/mang.test.js > sends the booking confirmation
Error: Test timed out in 100ms.
If this is a long-running test, pass a timeout value as the last argument or configure it globally with "testTimeout".
 ❯ demo8/mang.test.js:13:1
     11| afterAll(() => new Promise((resolve) => server.close(resolve)));
     12|
     13| it('sends the booking confirmation', { timeout: 100 }, async () => {
       | ^
     14|   const mailer = createHttpMailer({ baseUrl: 'http://127.0.0.1:' + ser…
     15|   await expect(mailer.send({ to: 'an@fpt.edu.vn', subject: 'Booked' })…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/28]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  06:35:15
   Duration  7.55s (tests 100%)`,
  '83-ngau-nhien': `$ npx vitest run demo8/ngau-nhien.test.js --repeats=99 --reporter=dot

 RUN  v5.0.5 …/labflow-lite

x

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo8/ngau-nhien.test.js > a student booking for a normal class is confirmed
 FAIL  demo8/ngau-nhien.test.js > a student booking for a normal class is confirmed
 FAIL  demo8/ngau-nhien.test.js > a student booking for a normal class is confirmed
 FAIL  demo8/ngau-nhien.test.js > a student booking for a normal class is confirmed
 FAIL  demo8/ngau-nhien.test.js > a student booking for a normal class is confirmed
 FAIL  demo8/ngau-nhien.test.js > a student booking for a normal class is confirmed
 FAIL  demo8/ngau-nhien.test.js > a student booking for a normal class is confirmed
 FAIL  demo8/ngau-nhien.test.js > a student booking for a normal class is confirmed
 FAIL  demo8/ngau-nhien.test.js > a student booking for a normal class is confirmed
 FAIL  demo8/ngau-nhien.test.js > a student booking for a normal class is confirmed
 FAIL  demo8/ngau-nhien.test.js > a student booking for a normal class is confirmed
 FAIL  demo8/ngau-nhien.test.js > a student booking for a normal class is confirmed
 FAIL  demo8/ngau-nhien.test.js > a student booking for a normal class is confirmed
 FAIL  demo8/ngau-nhien.test.js > a student booking for a normal class is confirmed
 FAIL  demo8/ngau-nhien.test.js > a student booking for a normal class is confirmed
 FAIL  demo8/ngau-nhien.test.js > a student booking for a normal class is confirmed
 FAIL  demo8/ngau-nhien.test.js > a student booking for a normal class is confirmed
 FAIL  demo8/ngau-nhien.test.js > a student booking for a normal class is confirmed
 FAIL  demo8/ngau-nhien.test.js > a student booking for a normal class is confirmed
 FAIL  demo8/ngau-nhien.test.js > a student booking for a normal class is confirmed
 FAIL  demo8/ngau-nhien.test.js > a student booking for a normal class is confirmed
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 ❯ demo8/ngau-nhien.test.js:7:53
      5| it('a student booking for a normal class is confirmed', () => {
      6|   const seats = 1 + Math.floor(Math.random() * 40);       // "any real…
      7|   expect(needsApproval({ seats, role: 'STUDENT' })).toBe(false);
       |                                                     ^
      8| });
      9|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/21]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  06:34:50
   Duration  178ms (tests 36%, transform 35%, import 20%, worker 8%)`,
  '83-retry': `$ node scripts/lap-lai.mjs 50 demo8/dua-lech.test.js; node scripts/lap-lai.mjs 50 demo8/dua-lech.test.js --retry=2; for i in 1 2 3 4 5 6; do npx vitest run demo8/dua-lech.test.js --retry=2 2>&1 | grep -E 'exactly one wins [0-9]|Tests  '; done
red in 17/50 runs (28.9 s)
red in 0/50 runs (30.7 s)
   ✓ two students book the same slot at once: exactly one wins 17ms
      Tests  1 passed (1)
   ✓ two students book the same slot at once: exactly one wins 38ms
      Tests  1 passed (1)
   ✓ two students book the same slot at once: exactly one wins 45ms
      Tests  1 passed (1)
   ✓ two students book the same slot at once: exactly one wins 45ms
      Tests  1 passed (1)
   ✓ two students book the same slot at once: exactly one wins 88ms (retry x1)
      Tests  1 passed (1)
   ✓ two students book the same slot at once: exactly one wins 25ms
      Tests  1 passed (1)`,
  '83-th-de': `$ node scripts/lap-lai.mjs 20 demo8/th83-de.test.js; node scripts/lap-lai.mjs 20 demo8/th83-de.test.js --sequence.shuffle
red in 0/20 runs (11.0 s)
red in 8/20 runs (51.0 s)
seeds of red runs: 1793489836995, 1793489843648, 1793489850288, 1793489856370, 1793489862990, …`,
  '83-th': `$ node scripts/lap-lai.mjs 20 demo8/th83.test.js --sequence.shuffle; npx vitest run demo8/th83-de.test.js --sequence.shuffle --sequence.seed=1793489836995 2>&1 | grep -E 'seed|✓|×|Error|Tests  '
red in 0/20 runs (16.4 s)
      Running tests with seed "1793489836995"
   × a mail that works on the 2nd try is sent 5003ms
   ✓ waits 1 s, then 2 s between attempts 6ms
Error: Test timed out in 5000ms.
      6|   const send = vi.fn().mockRejectedValueOnce(new Error('timeout')).moc…
      Tests  1 failed | 1 passed (2)`,
  '83-thu-tu-seed': `$ npx vitest run demo8/thu-tu.test.js --sequence.shuffle --sequence.seed=1793489700951; npx vitest run demo8/thu-tu.test.js --sequence.shuffle --sequence.seed=1793489700951 | grep -E 'Tests  '

 RUN  v5.0.5 …/labflow-lite
      Running tests with seed "1793489700951"

 ❯ demo8/thu-tu.test.js (3 tests | 1 failed) 5ms
   × a user with no failures is not locked 3ms
   ✓ 5 wrong passwords lock the account 0ms
   ✓ one wrong password does not lock 1ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo8/thu-tu.test.js > a user with no failures is not locked
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 ❯ demo8/thu-tu.test.js:8:43
      6|
      7| it('a user with no failures is not locked', () => {
      8|   expect(guard.isLocked('an@fpt.edu.vn')).toBe(false);
       |                                           ^
      9| });
     10|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 2 passed (3)
   Start at  06:35:38
   Duration  94ms (import 35%, tests 29%, transform 23%, worker 13%)


⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo8/thu-tu.test.js > a user with no failures is not locked
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 ❯ demo8/thu-tu.test.js:8:43
      6|
      7| it('a user with no failures is not locked', () => {
      8|   expect(guard.isLocked('an@fpt.edu.vn')).toBe(false);
       |                                           ^
      9| });
     10|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

      Tests  1 failed | 2 passed (3)`,
  '83-thu-tu': `$ node scripts/lap-lai.mjs 20 demo8/thu-tu.test.js; node scripts/lap-lai.mjs 20 demo8/thu-tu.test.js --sequence.shuffle
red in 0/20 runs (9.9 s)
red in 13/20 runs (10.0 s)
seeds of red runs: 1793489700951, 1793489701473, 1793489701979, 1793489702470, 1793489703960, …`,
  '84-cham-noi-tiep': `$ npx vitest run demo8/cham/ --no-file-parallelism | grep -E '^ [✓×❯] |Tests  |Duration'
 ✓ demo8/cham/cho-that.test.js (2 tests) 6010ms
 ✓ demo8/cham/du-lieu.test.js (4 tests) 4844ms
      Tests  6 passed (6)
   Duration  11.07s (tests 100%)`,
  '84-cham': `$ npx vitest run demo8/cham/

 RUN  v5.0.5 …/labflow-lite

 ✓ demo8/cham/du-lieu.test.js (4 tests) 4733ms
   ✓ a full day refuses one more booking 1165ms
   ✓ another lab is still free 1168ms
   ✓ the evening is still free 1160ms
   ✓ the list has 100 bookings 1239ms
 ✓ demo8/cham/cho-that.test.js (2 tests) 6011ms
   ✓ a mail that works on the 3rd try is sent 3004ms
   ✓ gives up after 3 attempts with the last error 3006ms

 Test Files  2 passed (2)
      Tests  6 passed (6)
   Start at  06:42:21
   Duration  6.14s (tests 99%)`,
  '84-changed': `$ sed -i '' 's/export const LOCK_MINUTES = 15;/export const LOCK_MINUTES = 15; \\/\\/ BR-02/' src/auth/login-guard.js && git status --short && npx vitest run src/ --changed | grep -E 'Test Files|Affected|Tests  |Duration'; git checkout -q src/auth/login-guard.js; sed -i '' 's#^// Convert between#// (edited) Convert between#' src/rules/time.js && git status --short && npx vitest run src/ --changed --reporter=dot | grep -E 'Test Files|Affected|Tests  |Duration'; git checkout -q src/rules/time.js; git status --short
 M src/auth/login-guard.js
 Test Files  1 passed (1)
   Affected  1 of 14 test files (related to 1 changed file)
      Tests  5 passed (5)
   Duration  87ms (import 49%, tests 24%, worker 21%, transform 6%, environment 1%)
 M src/rules/time.js
 Test Files  6 passed (6)
   Affected  6 of 14 test files (related to 1 changed file)
      Tests  74 passed (74)
   Duration  384ms (tests 62%, import 33%, worker 3%, transform 2%)`,
  '84-chung': `$ npx vitest run demo8/du-lieu-chung.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo8/du-lieu-chung.test.js (4 tests | 1 failed) 1289ms
   ✓ a full day refuses one more booking 8ms
   ✓ another lab is still free 12ms
   ✓ the evening is still free 11ms
   × the list has 100 bookings 11ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo8/du-lieu-chung.test.js > the list has 100 bookings
AssertionError: expected [ …(102) ] to have a length of 100 but got 102

- Expected
+ Received

- 100
+ 102

 ❯ demo8/du-lieu-chung.test.js:30:29
     28| });
     29| it('the list has 100 bookings', async () => {
     30|   expect(await repo.list()).toHaveLength(100);
       |                             ^
     31| });
     32|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 3 passed (4)
   Start at  06:42:40
   Duration  1.42s (tests 98%, import 1%, transform 1%)`,
  '84-do-toc-do': `$ npx vitest run test/do-toc-do.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ test/do-toc-do.test.js (2 tests) 196ms
   ✓ 200 unit checks 3ms
   ✓ 200 HTTP requests through Express 192ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  06:42:42
   Duration  416ms (tests 58%, import 35%, transform 6%, worker 1%)`,
  '84-nhanh': `$ npx vitest run demo8/nhanh/

 RUN  v5.0.5 …/labflow-lite

 ✓ demo8/nhanh/cho-that.test.js (2 tests) 7ms
   ✓ a mail that works on the 3rd try is sent 4ms
   ✓ gives up after 3 attempts with the last error 2ms
 ✓ demo8/nhanh/du-lieu.test.js (4 tests) 97ms
   ✓ a taken slot refuses one more booking 19ms
   ✓ another lab is still free 24ms
   ✓ the next hour is still free 22ms
   ✓ list returns what was stored 31ms

 Test Files  2 passed (2)
      Tests  6 passed (6)
   Start at  06:42:40
   Duration  210ms (tests 73%, import 12%, transform 11%, worker 4%)`,
  '84-related': `$ npx vitest related src/rules/time.js --run --dir src --reporter=dot | grep -E 'Test Files|Tests  |Duration'; npx vitest list src/ --filesOnly | wc -l
 Test Files  6 passed (6)
      Tests  74 passed (74)
   Duration  395ms (tests 63%, import 32%, worker 3%, transform 2%)
      14`,
  '84-shard': `$ for i in 1 2 3; do npx vitest run src/ --shard=$i/3 --reporter=dot | grep -E 'Test Files|Tests  '; done
 Test Files  5 passed (5)
      Tests  31 passed (31)
 Test Files  5 passed (5)
      Tests  56 passed (56)
 Test Files  4 passed (4)
      Tests  13 passed (13)`,
  '84-tang': `$ TIMEFORMAT='real %Rs'; time (npm run test:unit | grep -E 'Tests  '); time (npm run test:web | grep -E 'Tests  '); time (npm run test:int -- test/integration | grep -E 'Tests  '); time (npm run test:e2e | grep -E 'passed')
      Tests  100 passed (100)
real 1.092s
      Tests  16 passed (16)
real 2.692s
      Tests  11 passed (11)
real 3.703s
  9 passed (9.0s)
real 9.634s`,
  '84-th': `$ npx vitest run demo8/th84-de.test.js demo8/th84.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo8/th84.test.js (3 tests) 29ms
   ✓ a confirmed booking e-mails the student 14ms
   ✓ a 31-seat booking asks the approver 12ms
   ✓ a provider that fails twice is retried until it works 2ms
 ✓ demo8/th84-de.test.js (3 tests) 5006ms
   ✓ a confirmed booking e-mails the student 1002ms
   ✓ a 31-seat booking asks the approver 1001ms
   ✓ a provider that fails twice is retried until it works 3002ms

 Test Files  2 passed (2)
      Tests  6 passed (6)
   Start at  06:42:43
   Duration  5.11s (tests 99%)`,
  '84-timeout': `$ npx vitest run demo8/th84-de.test.js demo8/th84.test.js --testTimeout=500 2>&1 | grep -E '^ +[✓×] |Test timed out|Tests  |Duration'
 ✓ demo8/th84.test.js (3 tests) 30ms
   ✓ a confirmed booking e-mails the student 15ms
   ✓ a 31-seat booking asks the approver 12ms
   ✓ a provider that fails twice is retried until it works 2ms
   × a confirmed booking e-mails the student 506ms
   × a 31-seat booking asks the approver 501ms
   × a provider that fails twice is retried until it works 501ms
Error: Test timed out in 500ms.
Error: Test timed out in 500ms.
Error: Test timed out in 500ms.
      Tests  3 failed | 3 passed (6)
   Duration  1.64s (tests 97%, transform 1%, import 1%)`,
  '84-tuy-chon': `$ TIMEFORMAT='%R'; for o in '' '--maxWorkers=1' '--no-isolate' '--pool=threads'; do printf '%-18s' "src/ $o"; for i in 1 2 3; do t=$( { time npx vitest run src/ $o > /dev/null; } 2>&1 ); printf ' %ss' $t; done; echo; done; for o in '' '--maxWorkers=1' '--no-isolate'; do printf '%-18s' "web/ $o"; for i in 1 2 3; do t=$( { time npx vitest run --config vitest.web.config.js web/ $o > /dev/null; } 2>&1 ); printf ' %ss' $t; done; echo; done
src/               1.150s 0.979s 1.062s
src/ --maxWorkers=1 2.306s 2.276s 2.156s
src/ --no-isolate  0.894s 0.926s 0.859s
src/ --pool=threads 0.946s 0.898s 0.990s
web/               2.624s 2.162s 2.107s
web/ --maxWorkers=1 2.705s 2.783s 2.740s
web/ --no-isolate  2.106s 2.148s 2.083s`,
  'lab8-mut-yeu': `$ node scripts/dot-bien-8.mjs demo8/lab8-yeu.test.js
✘ green in 4/10 shuffled orders
✘ SURVIVED  #1 check-in refused exactly 10 minutes before the start
✘ SURVIVED  #2 the 15th minute already counts as a no-show
✘ SURVIVED  #3 arriving exactly on time is marked late
✔ killed    #4 a PENDING booking can check in
✘ SURVIVED  #5 a no-show 30 days ago still counts
✔ killed    #6 three no-shows are not enough for a ban
✔ killed    #7 the ban counts from the first no-show, not the last
✘ SURVIVED  #8 the last day of the ban is no longer banned

3/8 mutants killed`,
  'lab8-mut': `$ TIMEFORMAT='real %Rs'; time node scripts/dot-bien-8.mjs
✔ green in 10/10 shuffled orders
✔ killed    #1 check-in refused exactly 10 minutes before the start
✔ killed    #2 the 15th minute already counts as a no-show
✔ killed    #3 arriving exactly on time is marked late
✔ killed    #4 a PENDING booking can check in
✔ killed    #5 a no-show 30 days ago still counts
✔ killed    #6 three no-shows are not enough for a ban
✔ killed    #7 the ban counts from the first no-show, not the last
✔ killed    #8 the last day of the ban is no longer banned

8/8 mutants killed
real 9.709s`,
  'lab8-ref-run': `$ npx vitest run src/rules/checkin.test.js --coverage --coverage.include=src/rules/checkin.js

 RUN  v5.0.5 …/labflow-lite
      Coverage enabled with v8

 ✓ src/rules/checkin.test.js (16 tests) 4ms
   ✓ checkIn (BR-07) (8)
     ✓ at 07:49 → { ok: false, code: 'TOO_EARLY' } 1ms
     ✓ at 07:50 → { ok: true, late: false } 0ms
     ✓ at 08:00 → { ok: true, late: false } 0ms
     ✓ at 08:01 → { ok: true, late: true } 0ms
     ✓ at 08:15 → { ok: true, late: true } 0ms
     ✓ at 08:16 → { ok: false, code: 'NO_SHOW' } 0ms
     ✓ refuses a PENDING booking 0ms
     ✓ refuses a CANCELLED booking 0ms
   ✓ bannedUntil (BR-08) (7)
     ✓ bans for 7 days after the third no-show 1ms
     ✓ counts from the latest no-show, whatever the order 0ms
     ✓ two no-shows are not enough 0ms
     ✓ the ban still holds on its last day, and is over the day after 0ms
     ✓ a no-show 30 days ago no longer counts; 29 days ago still does 0ms
     ✓ a no-show today already counts 0ms
     ✓ ignores no-shows dated after today 0ms
   ✓ createNoShowLog (1)
     ✓ keeps each student separate, in order 0ms

 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  07:05:24
   Duration  126ms (worker 33%, import 32%, transform 20%, tests 14%)

 % Coverage report from v8
------------|---------|----------|---------|---------|-------------------
File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------|---------|----------|---------|---------|-------------------
All files   |     100 |      100 |     100 |     100 |                   
 checkin.js |     100 |      100 |     100 |     100 |                   
------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 100% ( 30/30 )
Branches     : 100% ( 16/16 )
Functions    : 100% ( 8/8 )
Lines        : 100% ( 23/23 )
================================================================================`,
  'lab8-stryker-1': `$ npx stryker run --mutate src/rules/checkin.js
06:45:11 (82846) INFO ProjectReader Found 1 of 234 file(s) to be mutated.
06:45:11 (82846) INFO Instrumenter Instrumented 1 source file(s) with 74 mutant(s)
06:45:11 (82846) INFO ConcurrencyTokenProvider Creating 9 test runner process(es).
06:45:11 (82846) INFO BroadcastReporter Detected that current console does not support the "progress" reporter, downgrading to "progress-append-only" reporter
06:45:11 (82846) INFO DryRunExecutor Starting initial test run (vitest test runner with "perTest" coverage analysis). This may take a while.
06:45:12 (82846) INFO DryRunExecutor Initial test run succeeded. Ran 15 tests in 0 seconds (net 4.785291000000086 ms, overhead 199.2147089999999 ms).

All tests/checkin.test.js
  ✓ checkIn (BR-07) > at 07:49 → { ok: false, code: 'TOO_EARLY' } [line 15] (killed 9)
  ✓ checkIn (BR-07) > at 07:50 → { ok: true, late: false } [line 15] (killed 10)
  ✓ checkIn (BR-07) > at 08:00 → { ok: true, late: false } [line 15] (killed 1)
  ✓ checkIn (BR-07) > at 08:01 → { ok: true, late: true } [line 15] (killed 1)
  ✓ checkIn (BR-07) > at 08:15 → { ok: true, late: true } [line 15] (killed 1)
  ✓ checkIn (BR-07) > at 08:16 → { ok: false, code: 'NO_SHOW' } [line 15] (killed 4)
  ✓ checkIn (BR-07) > refuses a PENDING booking [line 19] (killed 4)
  ~ checkIn (BR-07) > refuses a CANCELLED booking [line 19] (covered 8)
  ✓ bannedUntil (BR-08) > bans for 7 days after the third no-show [line 25] (killed 25)
  ~ bannedUntil (BR-08) > counts from the latest no-show, whatever the order [line 28] (covered 30)
  ✓ bannedUntil (BR-08) > two no-shows are not enough [line 31] (killed 1)
  ✓ bannedUntil (BR-08) > the ban still holds on its last day, and is over the day after [line 34] (killed 2)
  ✓ bannedUntil (BR-08) > a no-show 30 days ago no longer counts; 29 days ago still does [line 39] (killed 5)
  ✓ bannedUntil (BR-08) > ignores no-shows dated after today [line 43] (killed 1)
  ✓ createNoShowLog > keeps each student separate, in order [line 49] (killed 9)

[Survived] EqualityOperator
src/rules/checkin.js:27:55
-     const recent = noShows.map(dayNumber).filter((d) => d <= t && t - d < LOOKBACK_DAYS);
+     const recent = noShows.map(dayNumber).filter((d) => d < t && t - d < LOOKBACK_DAYS);

Ran 2.28 tests per mutant on average.
------------|------------------|----------|-----------|------------|----------|----------|
            | % Mutation score |          |           |            |          |          |
File        |  total | covered | # killed | # timeout | # survived | # no cov | # errors |
------------|--------|---------|----------|-----------|------------|----------|----------|
All files   |  98.65 |   98.65 |       73 |         0 |          1 |        0 |        0 |
 checkin.js |  98.65 |   98.65 |       73 |         0 |          1 |        0 |        0 |
------------|--------|---------|----------|-----------|------------|----------|----------|
06:45:14 (82846) INFO MutationTestReportHelper Final mutation score of 98.65 is greater than or equal to break threshold 80
06:45:14 (82846) INFO HtmlReporter Your report can be found at: file://…/labflow-lite/reports/mutation/index.html
06:45:14 (82846) INFO MutationTestExecutor Done in 3 seconds.`,
  'lab8-stryker-2': `$ npx stryker run --mutate src/rules/checkin.js
06:45:24 (83318) INFO ProjectReader Found 1 of 234 file(s) to be mutated.
06:45:24 (83318) INFO Instrumenter Instrumented 1 source file(s) with 74 mutant(s)
06:45:24 (83318) INFO ConcurrencyTokenProvider Creating 9 test runner process(es).
06:45:24 (83318) INFO BroadcastReporter Detected that current console does not support the "progress" reporter, downgrading to "progress-append-only" reporter
06:45:24 (83318) INFO DryRunExecutor Starting initial test run (vitest test runner with "perTest" coverage analysis). This may take a while.
06:45:24 (83318) INFO DryRunExecutor Initial test run succeeded. Ran 16 tests in 0 seconds (net 5.055289000000073 ms, overhead 187.94471099999993 ms).

All tests/checkin.test.js
  ✓ checkIn (BR-07) > at 07:49 → { ok: false, code: 'TOO_EARLY' } [line 15] (killed 9)
  ✓ checkIn (BR-07) > at 07:50 → { ok: true, late: false } [line 15] (killed 10)
  ✓ checkIn (BR-07) > at 08:00 → { ok: true, late: false } [line 15] (killed 1)
  ✓ checkIn (BR-07) > at 08:01 → { ok: true, late: true } [line 15] (killed 1)
  ✓ checkIn (BR-07) > at 08:15 → { ok: true, late: true } [line 15] (killed 1)
  ✓ checkIn (BR-07) > at 08:16 → { ok: false, code: 'NO_SHOW' } [line 15] (killed 4)
  ✓ checkIn (BR-07) > refuses a PENDING booking [line 19] (killed 4)
  ~ checkIn (BR-07) > refuses a CANCELLED booking [line 19] (covered 8)
  ✓ bannedUntil (BR-08) > bans for 7 days after the third no-show [line 25] (killed 25)
  ~ bannedUntil (BR-08) > counts from the latest no-show, whatever the order [line 28] (covered 30)
  ✓ bannedUntil (BR-08) > two no-shows are not enough [line 31] (killed 1)
  ✓ bannedUntil (BR-08) > the ban still holds on its last day, and is over the day after [line 34] (killed 2)
  ✓ bannedUntil (BR-08) > a no-show 30 days ago no longer counts; 29 days ago still does [line 39] (killed 5)
  ✓ bannedUntil (BR-08) > a no-show today already counts [line 43] (killed 1)
  ✓ bannedUntil (BR-08) > ignores no-shows dated after today [line 46] (killed 1)
  ✓ createNoShowLog > keeps each student separate, in order [line 52] (killed 9)

Ran 2.30 tests per mutant on average.
------------|------------------|----------|-----------|------------|----------|----------|
            | % Mutation score |          |           |            |          |          |
File        |  total | covered | # killed | # timeout | # survived | # no cov | # errors |
------------|--------|---------|----------|-----------|------------|----------|----------|
All files   | 100.00 |  100.00 |       74 |         0 |          0 |        0 |        0 |
 checkin.js | 100.00 |  100.00 |       74 |         0 |          0 |        0 |        0 |
------------|--------|---------|----------|-----------|------------|----------|----------|
06:45:26 (83318) INFO MutationTestReportHelper Final mutation score of 100.00 is greater than or equal to break threshold 80
06:45:26 (83318) INFO HtmlReporter Your report can be found at: file://…/labflow-lite/reports/mutation/index.html
06:45:26 (83318) INFO MutationTestExecutor Done in 3 seconds.`,
  'lab8-unit': `$ npm run test:unit | grep -E 'Test Files|Tests  '; npm run test:cov -- --reporter=dot | grep -E 'checkin|All files|ERROR|Lines'; npm run test:mutation | grep -E '^All files|checkin.js|Done in'
 Test Files  15 passed (15)
      Tests  116 passed (116)
File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
All files        |   96.99 |    93.16 |   96.87 |   98.41 |                   
  checkin.js     |     100 |      100 |     100 |     100 |                   
Lines        : 98.41% ( 186/189 )
All files   |  98.73 |   98.73 |      233 |         1 |          3 |        0 |        0 |
 checkin.js | 100.00 |  100.00 |       74 |         0 |          0 |        0 |        0 |
06:47:56 (87028) INFO MutationTestExecutor Done in 12 seconds.`,
  'lab8-yeu-lap': `$ node scripts/lap-lai.mjs 20 demo8/lab8-yeu.test.js; node scripts/lap-lai.mjs 20 demo8/lab8-yeu.test.js --sequence.shuffle
red in 0/20 runs (10.6 s)
red in 10/20 runs (10.3 s)
seeds of red runs: 1793490279553, 1793490281583, 1793490282093, 1793490283626, 1793490284650, …`,
  'lab8-yeu-run': `$ npx vitest run demo8/lab8-yeu.test.js --coverage --coverage.include=src/rules/checkin.js

 RUN  v5.0.5 …/labflow-lite
      Coverage enabled with v8

 ✓ demo8/lab8-yeu.test.js (8 tests) 5ms
   ✓ checkIn (4)
     ✓ too early 1ms
     ✓ on time 0ms
     ✓ too late 0ms
     ✓ pending booking 0ms
   ✓ no-shows (4)
     ✓ records a no-show 1ms
     ✓ three no-shows ban the student 1ms
     ✓ a ban ends 0ms
     ✓ a student without no-shows 0ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  06:44:27
   Duration  160ms (transform 45%, import 23%, worker 21%, tests 11%)

 % Coverage report from v8
------------|---------|----------|---------|---------|-------------------
File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------|---------|----------|---------|---------|-------------------
All files   |     100 |    93.75 |     100 |     100 |                   
 checkin.js |     100 |    93.75 |     100 |     100 | 30                
------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 100% ( 30/30 )
Branches     : 93.75% ( 15/16 )
Functions    : 100% ( 8/8 )
Lines        : 100% ( 23/23 )
================================================================================`,
  'lab8-yeu-seed': `$ npx vitest run demo8/lab8-yeu.test.js --sequence.shuffle --sequence.seed=1793490279553

 RUN  v5.0.5 …/labflow-lite
      Running tests with seed "1793490279553"

 ❯ demo8/lab8-yeu.test.js (8 tests | 2 failed) 8ms
   ✓ checkIn (4)
     ✓ too early 0ms
     ✓ on time 0ms
     ✓ too late 0ms
     ✓ pending booking 1ms
   ❯ no-shows (4)
     × records a no-show 2ms
     × three no-shows ban the student 3ms
     ✓ a ban ends 0ms
     ✓ a student without no-shows 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo8/lab8-yeu.test.js > no-shows > records a no-show
AssertionError: expected [ '2026-11-05', '2026-11-10', …(1) ] to have a length of 1 but got 3

- Expected
+ Received

- 1
+ 3

 ❯ demo8/lab8-yeu.test.js:26:32
     24|   it('records a no-show', () => {
     25|     log.record('an', '2026-11-01');
     26|     expect(log.datesFor('an')).toHaveLength(1);
       |                                ^
     27|   });
     28|   it('three no-shows ban the student', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  demo8/lab8-yeu.test.js > no-shows > three no-shows ban the student
AssertionError: expected null not to be null
 ❯ demo8/lab8-yeu.test.js:31:63
     29|     log.record('an', '2026-11-05');
     30|     log.record('an', '2026-11-10');
     31|     expect(bannedUntil(log.datesFor('an'), '2026-11-12')).not.toBeNull…
       |                                                               ^
     32|   });
     33|   it('a ban ends', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed (1)
      Tests  2 failed | 6 passed (8)
   Start at  06:45:27
   Duration  133ms (import 33%, tests 28%, transform 28%, worker 10%)`,
};
