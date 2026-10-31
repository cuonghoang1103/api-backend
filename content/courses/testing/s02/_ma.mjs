/**
 * _ma.mjs (Chương 2) — SINH TỰ ĐỘNG từ labflow-lite chạy thật (Node 22.23.3, Vitest 5.0.5), 01/11/2026. Đừng sửa tay.
 */
export const CODE = {
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
    throw new BookingError('STORAGE_DOWN', { cause: err });
  }
}`,
  cancel: `// Lite-3: a booking can be cancelled until 60 minutes before it starts.
export const CANCEL_LIMIT_MINUTES = 60;

export function canCancel(startsAt, now = new Date()) {
  const minutesLeft = (startsAt.getTime() - now.getTime()) / 60000;
  return minutesLeft >= CANCEL_LIMIT_MINUTES;
}`,
  days: `// BR-05 needs "days ahead" counted in Viet Nam's calendar (UTC+7), whatever the server's time zone.
const VN_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export function daysAheadVN(dateText, now = new Date()) {
  const todayVN = new Date(now.getTime() + VN_OFFSET_MS).toISOString().slice(0, 10);
  return Math.round((Date.parse(dateText + 'T00:00:00Z') - Date.parse(todayVN + 'T00:00:00Z')) / DAY_MS);
}`,
  guard: `// BR-02: 5 wrong passwords in a row lock the account for 15 minutes.
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
  looseConfig: `import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { reporters: ['tree'] } });`,
  quen: `import { it, expect } from 'vitest';
import { bookLab, createMemoryRepo } from '../src/booking/service.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it('forgot to await: the assertion runs after the test has ended', () => {
  const repo = createMemoryRepo();
  bookLab(repo, input).then((booking) => {
    expect(booking.status).toBe('WRONG ON PURPOSE');
  });
});

it('forgot to await rejects', () => {
  const repo = createMemoryRepo();
  expect(bookLab(repo, { ...input, start: '06:00' })).rejects.toThrow('THIS IS NOT THE CODE');
});`,
  dung: `import { describe, it, expect } from 'vitest';
import { bookLab, createMemoryRepo, BookingError } from '../src/booking/service.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

describe('bookLab (async)', () => {
  it('stores a confirmed booking — await the result, then assert', async () => {
    const repo = createMemoryRepo();
    const booking = await bookLab(repo, input);
    expect(booking).toMatchObject({ id: 1, status: 'CONFIRMED', minutes: 120 });
  });

  it('resolves: assert on the promise itself', async () => {
    await expect(bookLab(createMemoryRepo(), input)).resolves.toMatchObject({ status: 'CONFIRMED' });
  });

  it('rejects a second booking of the same slot with OVERLAP', async () => {
    const repo = createMemoryRepo();
    await bookLab(repo, input);
    await expect(bookLab(repo, input)).rejects.toThrow(BookingError);
    await expect(bookLab(repo, input)).rejects.toMatchObject({ code: 'OVERLAP' });
  });

  it('allows the next slot right after (10:00–12:00)', async () => {
    const repo = createMemoryRepo();
    await bookLab(repo, input);
    await expect(bookLab(repo, { ...input, start: '10:00', end: '12:00' })).resolves.toMatchObject({ id: 2 });
  });
});`,
  duaBefore: `import { it, expect } from 'vitest';
import { bookLab, createMemoryRepo } from '../src/booking/service.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it('two students book the same slot at the same moment: only one wins', async () => {
  const repo = createMemoryRepo();
  const results = await Promise.allSettled([bookLab(repo, input), bookLab(repo, input)]);
  const statuses = results.map((r) => r.status);
  expect(statuses.sort()).toEqual(['fulfilled', 'rejected']);
});`,
  dua: `import { it, expect } from 'vitest';
import { bookLab, createMemoryRepo } from '../src/booking/service.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it.fails('two students book the same slot at the same moment: only one wins', async () => {
  const repo = createMemoryRepo();
  const results = await Promise.allSettled([bookLab(repo, input), bookLab(repo, input)]);
  const statuses = results.map((r) => r.status);
  expect(statuses.sort()).toEqual(['fulfilled', 'rejected']);
});`,
  treo: `import { it, expect } from 'vitest';

it('waits for a confirmation e-mail that never comes', async () => {
  const sent = await new Promise(() => {}); // never resolves
  expect(sent).toBe(true);
});`,
  daysSai: `// A first attempt that looks fine on a laptop in Viet Nam.
export function daysAheadNaive(dateText, now = new Date()) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(dateText) - today) / 86400000);
}`,
  muiGio: `import { it, expect } from 'vitest';
import { daysAheadNaive } from './days-sai.js';
import { daysAheadVN } from '../src/rules/days.js';

// 06:30 on 2 November in Viet Nam = 23:30 on 1 November in UTC
const now = new Date('2026-11-02T06:30:00+07:00');

it('naive: 16 November is 14 days ahead', () => {
  expect(daysAheadNaive('2026-11-16', now)).toBe(14);
});

it('VN calendar: 16 November is 14 days ahead', () => {
  expect(daysAheadVN('2026-11-16', now)).toBe(14);
});`,
  dongHo: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { canCancel } from '../src/rules/cancel.js';
import { createLoginGuard } from '../src/auth/login-guard.js';

describe('canCancel (Lite-3: until 60 minutes before)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-16T07:00:00+07:00'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('“now” is frozen: new Date() returns the time we set', () => {
    expect(new Date().toISOString()).toBe('2026-11-16T00:00:00.000Z');
  });

  it.each([
    ['07:59', true],  // 61 minutes before 09:00
    ['08:00', true],  // exactly 60 minutes before 09:00
    ['08:01', false], // 59 minutes before
  ])('at %s a 09:00 booking can be cancelled: %s', (clock, expected) => {
    vi.setSystemTime(new Date('2026-11-16T' + clock + ':00+07:00'));
    expect(canCancel(new Date('2026-11-16T09:00:00+07:00'))).toBe(expected);
  });
});

describe('login guard (BR-02) with fake timers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-16T07:00:00+07:00'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('unlocks exactly 15 minutes after the 5th failure', () => {
    const guard = createLoginGuard();
    for (let i = 0; i < 5; i++) guard.recordFailure('an@fpt.edu.vn');
    expect(guard.isLocked('an@fpt.edu.vn')).toBe(true);

    vi.advanceTimersByTime(15 * 60 * 1000 - 1); // 14:59.999 later
    expect(guard.isLocked('an@fpt.edu.vn')).toBe(true);

    vi.advanceTimersByTime(1); // exactly 15:00 later
    expect(guard.isLocked('an@fpt.edu.vn')).toBe(false);
  });
});`,
  retryThat: `import { it, expect } from 'vitest';
import { retry } from '../src/lib/retry.js';

it('real timers: succeeds on the 3rd attempt (and really waits)', async () => {
  let calls = 0;
  const flakyMailer = async () => {
    calls++;
    if (calls < 3) throw new Error('SMTP timeout');
    return 'sent';
  };
  await expect(retry(flakyMailer)).resolves.toBe('sent');
  expect(calls).toBe(3);
});`,
  retryGia: `import { it, expect, vi, afterEach } from 'vitest';
import { retry } from '../src/lib/retry.js';

afterEach(() => {
  vi.useRealTimers();
});

it('fake timers: waits 1 s, then 2 s, between attempts', async () => {
  vi.useFakeTimers();
  const mailer = vi.fn()
    .mockRejectedValueOnce(new Error('SMTP timeout'))
    .mockRejectedValueOnce(new Error('SMTP timeout'))
    .mockResolvedValue('sent');

  const result = retry(mailer);              // start — do not await yet
  await vi.advanceTimersByTimeAsync(0);
  expect(mailer).toHaveBeenCalledTimes(1);   // first attempt, immediately

  await vi.advanceTimersByTimeAsync(999);
  expect(mailer).toHaveBeenCalledTimes(1);   // 1 s not over yet
  await vi.advanceTimersByTimeAsync(1);
  expect(mailer).toHaveBeenCalledTimes(2);   // second attempt at 1 000 ms

  await vi.advanceTimersByTimeAsync(2000);
  expect(mailer).toHaveBeenCalledTimes(3);   // third attempt 2 000 ms later
  await expect(result).resolves.toBe('sent');
});

it('fake timers: gives up after 3 attempts with the last error', async () => {
  vi.useFakeTimers();
  const mailer = vi.fn().mockRejectedValue(new Error('SMTP down'));
  const result = retry(mailer);
  const check = expect(result).rejects.toThrow('SMTP down');
  await vi.runAllTimersAsync();
  await check;
  expect(mailer).toHaveBeenCalledTimes(3);
});`,
  loi: `import { describe, it, expect } from 'vitest';
import { bookLab, createMemoryRepo, BookingError } from '../src/booking/service.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

describe('bookLab — failure paths', () => {
  it('a rule violation is a BookingError with the rule code', async () => {
    const error = await bookLab(createMemoryRepo(), { ...input, start: '06:00' }).catch((e) => e);
    expect(error).toBeInstanceOf(BookingError);
    expect(error).toMatchObject({ name: 'BookingError', code: 'OUTSIDE_HOURS', message: 'OUTSIDE_HOURS' });
  });

  it('a database failure becomes STORAGE_DOWN and keeps the original cause', async () => {
    const brokenRepo = {
      findOverlap: async () => { throw new Error('connect ECONNREFUSED 127.0.0.1:5432'); },
      insert: async () => { throw new Error('should not be called'); },
    };
    const error = await bookLab(brokenRepo, input).catch((e) => e);
    expect(error.code).toBe('STORAGE_DOWN');
    expect(error.cause.message).toBe('connect ECONNREFUSED 127.0.0.1:5432');
  });

  it('a failure while saving is also STORAGE_DOWN', async () => {
    const repo = { findOverlap: async () => null, insert: async () => { throw new Error('disk full'); } };
    await expect(bookLab(repo, input)).rejects.toMatchObject({ code: 'STORAGE_DOWN' });
  });
});`,
  tryBay: `import { it, expect } from 'vitest';
import { bookLab, createMemoryRepo } from '../src/booking/service.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it('rejects 06:00 (try/catch style — but the input is valid!)', async () => {
  try {
    await bookLab(createMemoryRepo(), input); // oops: 08:00, not 06:00 — no error is thrown
  } catch (err) {
    expect(err.code).toBe('OUTSIDE_HOURS');
  }
});`,
  chapChon: `import { it, expect } from 'vitest';
import { makeBookingCode } from '../src/rules/code.js';

it('20 short codes are all different', () => {
  const codes = Array.from({ length: 20 }, () => makeBookingCode(Math.random, 2));
  expect(new Set(codes).size).toBe(20);
});`,
  ngauNhien: `import { describe, it, expect, vi, afterEach } from 'vitest';
import { makeBookingCode, seededRandom, newBookingRecord, ALPHABET } from '../src/rules/code.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('makeBookingCode', () => {
  it('inject the randomness: first and last letter of the alphabet', () => {
    expect(makeBookingCode(() => 0)).toBe('LF-AAAAAA');
    expect(makeBookingCode(() => 0.999999)).toBe('LF-999999');
  });

  it('a seeded generator gives the same codes on every run', () => {
    const random = seededRandom(42);
    expect([makeBookingCode(random), makeBookingCode(random)]).toEqual(['LF-VQ5XFS', 'LF-JV5RH6']);
  });

  it('spy on Math.random when the code does not take a parameter', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(makeBookingCode()).toBe('LF-' + ALPHABET[16].repeat(6));
  });

  it('assert the shape when the value is truly random', () => {
    expect(makeBookingCode()).toMatch(/^LF-[A-HJ-NP-Z2-9]{6}$/);
  });
});

describe('newBookingRecord', () => {
  it('fixed id and clock make the whole record predictable', () => {
    const record = newBookingRecord(
      { lab: 'BE-201', start: '08:00' },
      { newId: () => 'id-1', now: () => new Date('2026-11-16T01:00:00Z') },
    );
    expect(record).toEqual({
      id: 'id-1',
      code: expect.stringMatching(/^LF-/),
      createdAt: '2026-11-16T01:00:00.000Z',
      lab: 'BE-201',
      start: '08:00',
    });
  });
});`,
  roRi: `import { it, expect, vi } from 'vitest';
import { makeBookingCode } from '../src/rules/code.js';

it('A: Math.random mocked to 0 (and never restored)', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0);
  expect(makeBookingCode()).toBe('LF-AAAAAA');
});

it('B: two fresh codes are different', () => {
  expect(makeBookingCode()).not.toBe(makeBookingCode());
});`,
  cancelTest: `import { describe, it, expect } from 'vitest';
import { canCancel } from './cancel.js';

const at = (clock) => new Date('2026-11-16T' + clock + ':00+07:00');

describe('canCancel (Lite-3: until 60 minutes before the start)', () => {
  it.each([
    ['07:00', true],  // 2 hours before
    ['08:00', true],  // exactly 60 minutes before — still allowed
    ['08:01', false], // 59 minutes before
    ['09:30', false], // after the start
  ])('at %s, a 09:00 booking can be cancelled → %s', (clock, expected) => {
    expect(canCancel(at('09:00'), at(clock))).toBe(expected);
  });
});`,
  daysTest: `import { describe, it, expect } from 'vitest';
import { daysAheadVN } from './days.js';

describe('daysAheadVN (BR-05 counted in Viet Nam time)', () => {
  it.each([
    ['2026-11-02T06:30:00+07:00', '2026-11-16', 14], // early morning in VN = previous day in UTC
    ['2026-11-02T23:59:00+07:00', '2026-11-16', 14],
    ['2026-11-03T00:00:00+07:00', '2026-11-16', 13], // midnight in VN starts a new day
    ['2026-11-02T06:30:00+07:00', '2026-11-02', 0],
  ])('now %s → %s is %i days ahead', (now, date, expected) => {
    expect(daysAheadVN(date, new Date(now))).toBe(expected);
  });
});`,
  guardTest: `import { describe, it, expect, beforeEach } from 'vitest';
import { createLoginGuard } from './login-guard.js';

describe('createLoginGuard (BR-02: 5 failures → locked 15 minutes)', () => {
  let clock;
  let guard;
  beforeEach(() => {
    clock = 1_000_000;                  // a fake clock we move by hand
    guard = createLoginGuard(() => clock);
  });
  const fail = (n) => { for (let i = 0; i < n; i++) guard.recordFailure('an@fpt.edu.vn'); };

  it('4 failures do not lock', () => {
    fail(4);
    expect(guard.isLocked('an@fpt.edu.vn')).toBe(false);
  });

  it('the 5th failure locks', () => {
    fail(5);
    expect(guard.isLocked('an@fpt.edu.vn')).toBe(true);
  });

  it('still locked at 14:59.999, unlocked at exactly 15:00', () => {
    fail(5);
    clock += 15 * 60 * 1000 - 1;
    expect(guard.isLocked('an@fpt.edu.vn')).toBe(true);
    clock += 1;
    expect(guard.isLocked('an@fpt.edu.vn')).toBe(false);
  });

  it('a successful login resets the counter', () => {
    fail(4);
    guard.recordSuccess('an@fpt.edu.vn');
    fail(1);
    expect(guard.isLocked('an@fpt.edu.vn')).toBe(false);
  });

  it('locks only the account that failed', () => {
    fail(5);
    expect(guard.isLocked('binh@fpt.edu.vn')).toBe(false);
  });
});`,
  retryTest: `import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { retry } from './retry.js';

describe('retry', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('returns at once when the first attempt works', async () => {
    const fn = vi.fn().mockResolvedValue('sent');
    await expect(retry(fn)).resolves.toBe('sent');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('waits 1 s then 2 s between attempts', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('timeout'))
      .mockRejectedValueOnce(new Error('timeout'))
      .mockResolvedValue('sent');
    const result = retry(fn);
    await vi.advanceTimersByTimeAsync(999);
    expect(fn).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(fn).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(1999);
    expect(fn).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(1);
    expect(fn).toHaveBeenCalledTimes(3);
    await expect(result).resolves.toBe('sent');
  });

  it('gives up after 3 attempts and rethrows the last error', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('SMTP down'));
    const check = expect(retry(fn)).rejects.toThrow('SMTP down');
    await vi.runAllTimersAsync();
    await check;
    expect(fn).toHaveBeenCalledTimes(3);
  });
});`,
  serviceTest: `import { describe, it, expect } from 'vitest';
import { bookLab, createMemoryRepo, BookingError } from './service.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

describe('bookLab', () => {
  it('stores a confirmed booking', async () => {
    await expect(bookLab(createMemoryRepo(), input)).resolves.toMatchObject({ id: 1, status: 'CONFIRMED', minutes: 120 });
  });

  it('rejects a rule violation with its code before touching the database', async () => {
    const repo = { findOverlap: async () => { throw new Error('must not be called'); }, insert: async () => null };
    await expect(bookLab(repo, { ...input, start: '06:00' })).rejects.toMatchObject({ name: 'BookingError', code: 'OUTSIDE_HOURS' });
  });

  it('rejects an overlapping booking with OVERLAP', async () => {
    const repo = createMemoryRepo();
    await bookLab(repo, input);
    await expect(bookLab(repo, { ...input, start: '09:00', end: '11:00' })).rejects.toMatchObject({ code: 'OVERLAP' });
  });

  it('accepts the slot that starts when the previous one ends', async () => {
    const repo = createMemoryRepo();
    await bookLab(repo, input);
    await expect(bookLab(repo, { ...input, start: '10:00', end: '12:00' })).resolves.toMatchObject({ id: 2 });
  });

  it('turns a failing lookup into STORAGE_DOWN and keeps the cause', async () => {
    const repo = { findOverlap: async () => { throw new Error('ECONNREFUSED'); }, insert: async () => null };
    const error = await bookLab(repo, input).catch((e) => e);
    expect(error).toBeInstanceOf(BookingError);
    expect(error.code).toBe('STORAGE_DOWN');
    expect(error.cause.message).toBe('ECONNREFUSED');
  });

  it('turns a failing insert into STORAGE_DOWN', async () => {
    const repo = { findOverlap: async () => null, insert: async () => { throw new Error('disk full'); } };
    await expect(bookLab(repo, input)).rejects.toMatchObject({ code: 'STORAGE_DOWN' });
  });
});`,
  weak2: `import { it, expect } from 'vitest';
import { canCancel } from './rules/cancel.js';
import { daysAheadVN } from './rules/days.js';
import { createLoginGuard } from './auth/login-guard.js';
import { retry } from './lib/retry.js';
import { bookLab, createMemoryRepo } from './booking/service.js';

it('cancel two hours before is allowed', () => {
  expect(canCancel(new Date('2026-11-16T09:00:00+07:00'), new Date('2026-11-16T07:00:00+07:00'))).toBe(true);
});

it('16 November is 14 days after 2 November (midday)', () => {
  expect(daysAheadVN('2026-11-16', new Date('2026-11-02T12:00:00+07:00'))).toBe(14);
});

it('ten failures lock the account', () => {
  const guard = createLoginGuard();
  for (let i = 0; i < 10; i++) guard.recordFailure('an@fpt.edu.vn');
  expect(guard.isLocked('an@fpt.edu.vn')).toBe(true);
});

it('retry returns the result', async () => {
  await expect(retry(async () => 'sent')).resolves.toBe('sent');
});

it('bookLab stores a booking', async () => {
  await expect(bookLab(createMemoryRepo(), { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' })).resolves.toMatchObject({ status: 'CONFIRMED' });
});`,
  dotBien2: `// Lab 2 mutants (Chapter 2: async, time, errors). Plant one bug at a time, run your tests, then restore the code.
// A good suite goes RED for every mutant ("killed"); a mutant that stays green ("survived") is a gap.
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const MUTANTS = [
  ['src/rules/cancel.js', 'minutesLeft >= CANCEL_LIMIT_MINUTES', 'minutesLeft > CANCEL_LIMIT_MINUTES', 'Lite-3: cancel exactly 60 min before refused'],
  ['src/auth/login-guard.js', 's.failures >= MAX_FAILURES', 's.failures > MAX_FAILURES', 'BR-02: locks after 6 failures, not 5'],
  ['src/auth/login-guard.js', 's.lockedUntil > now()', 's.lockedUntil >= now()', 'BR-02: still locked at exactly 15:00'],
  ['src/auth/login-guard.js', 'state.delete(email);', 'void email;', 'success does not reset the counter'],
  ['src/lib/retry.js', 'delayMs * i', 'delayMs', 'retry waits 1 s every time (no back-off)'],
  ['src/lib/retry.js', 'i <= attempts', 'i < attempts', 'retry makes one attempt too few'],
  ['src/booking/service.js', "throw new BookingError('STORAGE_DOWN', { cause: err });", 'throw err;', 'lookup failure leaks the raw error'],
  ['src/rules/days.js', 'now.getTime() + VN_OFFSET_MS', 'now.getTime()', 'days counted in UTC, not Viet Nam time'],
];

let killed = 0;
for (const [i, [file, from, to, label]] of MUTANTS.entries()) {
  const original = readFileSync(file, 'utf8');
  if (!original.includes(from)) throw new Error('Mutant ' + (i + 1) + ': not found in ' + file);
  writeFileSync(file, original.replace(from, to));
  try {
    const run = spawnSync('npx', ['vitest', 'run', 'src/'], { encoding: 'utf8', shell: process.platform === 'win32' });
    const dead = run.status !== 0;
    if (dead) killed++;
    console.log((dead ? '✔ killed  ' : '✘ SURVIVED') + '  #' + (i + 1) + ' ' + label);
  } finally {
    writeFileSync(file, original);
  }
}
console.log();
console.log(killed + '/' + MUTANTS.length + ' mutants killed');
process.exitCode = killed === MUTANTS.length ? 0 : 1;`,
  th21: `import { describe, it, expect } from 'vitest';
import { bookLab, createMemoryRepo } from '../src/booking/service.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

describe('practice 2.1', () => {
  it('awaits the booking before asserting', async () => {
    const booking = await bookLab(createMemoryRepo(), input);
    expect(booking.status).toBe('CONFIRMED');
  });

  it('awaits rejects for an invalid slot', async () => {
    await expect(bookLab(createMemoryRepo(), { ...input, start: '06:00' })).rejects.toThrow('OUTSIDE_HOURS');
  });

  it('a 31-seat student booking is stored as PENDING', async () => {
    await expect(bookLab(createMemoryRepo(), { ...input, seats: 31 })).resolves.toMatchObject({ status: 'PENDING' });
  });

  it('a booking in another lab at the same time is fine', async () => {
    const repo = createMemoryRepo();
    await bookLab(repo, input);
    await expect(bookLab(repo, { ...input, lab: 'BE-305' })).resolves.toMatchObject({ id: 2 });
  });
});`,
  th22: `import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { canCancel } from '../src/rules/cancel.js';
import { createLoginGuard } from '../src/auth/login-guard.js';

describe('practice 2.2', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-16T08:00:00+07:00'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it.each([
    [59, false],
    [60, true],
    [61, true],
  ])('a booking %i minutes from now can be cancelled → %s', (minutes, expected) => {
    const startsAt = new Date(Date.now() + minutes * 60000);
    expect(canCancel(startsAt)).toBe(expected);
  });

  it('after the lock expires, 5 new failures lock the account again', () => {
    const guard = createLoginGuard();
    for (let i = 0; i < 5; i++) guard.recordFailure('an@fpt.edu.vn');
    vi.advanceTimersByTime(15 * 60 * 1000);
    expect(guard.isLocked('an@fpt.edu.vn')).toBe(false);
    for (let i = 0; i < 4; i++) guard.recordFailure('an@fpt.edu.vn');
    expect(guard.isLocked('an@fpt.edu.vn')).toBe(false);
    guard.recordFailure('an@fpt.edu.vn');
    expect(guard.isLocked('an@fpt.edu.vn')).toBe(true);
  });
});`,
  th23: `import { describe, it, expect } from 'vitest';
import { bookLab, BookingError } from '../src/booking/service.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

describe('practice 2.3', () => {
  it('a failing insert becomes STORAGE_DOWN and keeps "disk full" as the cause', async () => {
    const repo = { findOverlap: async () => null, insert: async () => { throw new Error('disk full'); } };
    const error = await bookLab(repo, input).catch((e) => e);
    expect(error).toBeInstanceOf(BookingError);
    expect(error).toMatchObject({ code: 'STORAGE_DOWN', cause: { message: 'disk full' } });
  });

  it('an invalid slot never reaches the database', async () => {
    let called = false;
    const repo = { findOverlap: async () => { called = true; return null; }, insert: async () => null };
    await expect(bookLab(repo, { ...input, end: '12:30' })).rejects.toMatchObject({ code: 'TOO_LONG' });
    expect(called).toBe(false);
  });
});`,
  th24: `import { describe, it, expect } from 'vitest';
import { makeBookingCode, seededRandom } from '../src/rules/code.js';

describe('practice 2.4', () => {
  it('20 short codes from seed 7 are all different — the same 20 on every run', () => {
    const random = seededRandom(7);
    const codes = Array.from({ length: 20 }, () => makeBookingCode(random, 2));
    expect(new Set(codes).size).toBe(20);
  });

  it('the same seed gives the same first code', () => {
    expect(makeBookingCode(seededRandom(7))).toBe(makeBookingCode(seededRandom(7)));
  });
});`,
  do100: `pass=0; fail=0
for i in $(seq 1 100); do
  if npx vitest run demo2/chap-chon.test.js > /dev/null 2>&1; then pass=$((pass+1)); else fail=$((fail+1)); fi
done
echo "100 runs: $pass passed, $fail failed"`,
  trySua: `import { it, expect } from 'vitest';
import { bookLab, createMemoryRepo } from '../src/booking/service.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it('rejects 06:00 with OUTSIDE_HOURS', async () => {
  await expect(bookLab(createMemoryRepo(), { ...input, start: '06:00' }))
    .rejects.toMatchObject({ code: 'OUTSIDE_HOURS' });
});

it('the same mistake as the trap (valid input) now fails loudly', async () => {
  await expect(bookLab(createMemoryRepo(), input))
    .rejects.toMatchObject({ code: 'OUTSIDE_HOURS' });
});`,
  dongHoRoRi: `import { it, expect, vi } from 'vitest';

it('A: freezes the clock in 2020 (and forgets useRealTimers)', () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2020-01-01T00:00:00Z'));
  expect(new Date().getFullYear()).toBe(2020);
});

it('B: today is in 2026 or later', () => {
  expect(new Date().getFullYear()).toBeGreaterThanOrEqual(2026);
});`,
  restoreConfig: `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: ['tree'],
    expect: { requireAssertions: true },
    restoreMocks: true, // restore every vi.spyOn before each test
  },
});`,
};
export const OUT = {
  '21-dua-fails': `$ npx vitest run demo2/dua.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo2/dua.test.js (1 test) 18ms
   ✓ two students book the same slot at the same moment: only one wins 17ms

 Test Files  1 passed (1)
      Tests  1 expected fail (1)
   Start at  01:00:03
   Duration  119ms (tests 45%, transform 26%, import 22%, worker 7%)`,
  '21-dua': `$ npx vitest run demo2/dua.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo2/dua.test.js (1 test | 1 failed) 18ms
   × two students book the same slot at the same moment: only one wins 17ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo2/dua.test.js > two students book the same slot at the same moment: only one wins
AssertionError: expected [ 'fulfilled', 'fulfilled' ] to deeply equal [ 'fulfilled', 'rejected' ]

- Expected
+ Received

  [
    "fulfilled",
-   "rejected",
+   "fulfilled",
  ]

 ❯ demo2/dua.test.js:10:27
      8|   const results = await Promise.allSettled([bookLab(repo, input), book…
      9|   const statuses = results.map((r) => r.status);
     10|   expect(statuses.sort()).toEqual(['fulfilled', 'rejected']);
       |                           ^
     11| });
     12|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  01:00:02
   Duration  110ms (tests 54%, import 22%, transform 17%, worker 7%)`,
  '21-dung': `$ npx vitest run demo2/async-dung.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo2/async-dung.test.js (4 tests) 76ms
   ✓ bookLab (async) (4)
     ✓ stores a confirmed booking — await the result, then assert 13ms
     ✓ resolves: assert on the promise itself 13ms
     ✓ rejects a second booking of the same slot with OVERLAP 23ms
     ✓ allows the next slot right after (10:00–12:00) 26ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  01:00:02
   Duration  165ms (tests 82%, import 9%, transform 7%, worker 2%)`,
  '21-quen-loose': `$ npx vitest run demo2/async-quen.test.js --config demo2/vitest.loose.config.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo2/async-quen.test.js (2 tests | 1 failed) 6ms
   ✓ forgot to await: the assertion runs after the test has ended 1ms
   × forgot to await rejects 4ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo2/async-quen.test.js > forgot to await rejects
AssertionError: expected [Function] to throw error including 'THIS IS NOT THE CODE' but got 'OUTSIDE_HOURS'

Expected: "THIS IS NOT THE CODE"
Received: "OUTSIDE_HOURS"

 ❯ demo2/async-quen.test.js:15:54
     13| it('forgot to await rejects', () => {
     14|   const repo = createMemoryRepo();
     15|   expect(bookLab(repo, { ...input, start: '06:00' })).rejects.toThrow(…
       |                                                      ^
     16| });
     17|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  demo2/async-quen.test.js > forgot to await rejects
Error: Promise returned by \`expect(actual).rejects.toThrow(expected)\` was not awaited. This assertion is asynchronous and must be awaited; otherwise, it is not guaranteed to complete before the test finishes:

await expect(actual).rejects.toThrow(expected)

 ❯ demo2/async-quen.test.js:15:54
     13| it('forgot to await rejects', () => {
     14|   const repo = createMemoryRepo();
     15|   expect(bookLab(repo, { ...input, start: '06:00' })).rejects.toThrow(…
       |                                                      ^
     16| });
     17|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯

⎯⎯⎯⎯⎯⎯ Unhandled Errors ⎯⎯⎯⎯⎯⎯

Vitest caught 1 unhandled error during the test run.
This might cause false positive tests. Resolve unhandled errors to make sure your tests are not affected.

⎯⎯⎯⎯ Unhandled Rejection ⎯⎯⎯⎯⎯
AssertionError: expected 'CONFIRMED' to be 'WRONG ON PURPOSE' // Object.is equality
 ❯ demo2/async-quen.test.js:9:28
      7|   const repo = createMemoryRepo();
      8|   bookLab(repo, input).then((booking) => {
      9|     expect(booking.status).toBe('WRONG ON PURPOSE');
       |                            ^
     10|   });
     11| });

This error originated in "demo2/async-quen.test.js" test file. It doesn't mean the error was thrown inside the file itself, but while it was running.
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯


 Test Files  1 failed (1)
      Tests  1 failed | 1 passed (2)
     Errors  1 error
   Start at  01:00:01
   Duration  108ms (import 33%, transform 30%, tests 27%, worker 10%)`,
  '21-quen-strict': `$ npx vitest run demo2/async-quen.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo2/async-quen.test.js (2 tests | 2 failed) 6ms
   × forgot to await: the assertion runs after the test has ended 3ms
   × forgot to await rejects 3ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo2/async-quen.test.js > forgot to await: the assertion runs after the test has ended
Error: expected any number of assertion, but got none
 ❯ demo2/async-quen.test.js:6:1
      4| const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'S…
      5|
      6| it('forgot to await: the assertion runs after the test has ended', () …
       | ^
      7|   const repo = createMemoryRepo();
      8|   bookLab(repo, input).then((booking) => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯

 FAIL  demo2/async-quen.test.js > forgot to await rejects
AssertionError: expected [Function] to throw error including 'THIS IS NOT THE CODE' but got 'OUTSIDE_HOURS'

Expected: "THIS IS NOT THE CODE"
Received: "OUTSIDE_HOURS"

 ❯ demo2/async-quen.test.js:15:54
     13| it('forgot to await rejects', () => {
     14|   const repo = createMemoryRepo();
     15|   expect(bookLab(repo, { ...input, start: '06:00' })).rejects.toThrow(…
       |                                                      ^
     16| });
     17|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯

 FAIL  demo2/async-quen.test.js > forgot to await rejects
Error: Promise returned by \`expect(actual).rejects.toThrow(expected)\` was not awaited. This assertion is asynchronous and must be awaited; otherwise, it is not guaranteed to complete before the test finishes:

await expect(actual).rejects.toThrow(expected)

 ❯ demo2/async-quen.test.js:15:54
     13| it('forgot to await rejects', () => {
     14|   const repo = createMemoryRepo();
     15|   expect(bookLab(repo, { ...input, start: '06:00' })).rejects.toThrow(…
       |                                                      ^
     16| });
     17|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯

⎯⎯⎯⎯⎯⎯ Unhandled Errors ⎯⎯⎯⎯⎯⎯

Vitest caught 1 unhandled error during the test run.
This might cause false positive tests. Resolve unhandled errors to make sure your tests are not affected.

⎯⎯⎯⎯ Unhandled Rejection ⎯⎯⎯⎯⎯
AssertionError: expected 'CONFIRMED' to be 'WRONG ON PURPOSE' // Object.is equality
 ❯ demo2/async-quen.test.js:9:28
      7|   const repo = createMemoryRepo();
      8|   bookLab(repo, input).then((booking) => {
      9|     expect(booking.status).toBe('WRONG ON PURPOSE');
       |                            ^
     10|   });
     11| });

This error originated in "demo2/async-quen.test.js" test file. It doesn't mean the error was thrown inside the file itself, but while it was running.
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯


 Test Files  1 failed (1)
      Tests  2 failed (2)
     Errors  1 error
   Start at  01:00:01
   Duration  121ms (import 32%, transform 29%, tests 29%, worker 10%)`,
  '21-th': `$ npx vitest run demo2/th21.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo2/th21.test.js (4 tests) 53ms
   ✓ practice 2.1 (4)
     ✓ awaits the booking before asserting 13ms
     ✓ awaits rejects for an invalid slot 1ms
     ✓ a 31-seat student booking is stored as PENDING 12ms
     ✓ a booking in another lab at the same time is fine 26ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  01:01:34
   Duration  144ms (tests 77%, import 11%, transform 9%, worker 3%)`,
  '21-treo': `$ npx vitest run demo2/treo.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo2/treo.test.js (1 test | 1 failed) 5005ms
   × waits for a confirmation e-mail that never comes 5005ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo2/treo.test.js > waits for a confirmation e-mail that never comes
Error: Test timed out in 5000ms.
If this is a long-running test, pass a timeout value as the last argument or configure it globally with "testTimeout".
 ❯ demo2/treo.test.js:3:1
      1| import { it, expect } from 'vitest';
      2|
      3| it('waits for a confirmation e-mail that never comes', async () => {
       | ^
      4|   const sent = await new Promise(() => {}); // never resolves
      5|   expect(sent).toBe(true);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  01:00:03
   Duration  5.10s (tests 100%)`,
  '22-dong-ho': `$ npx vitest run demo2/dong-ho.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo2/dong-ho.test.js (5 tests) 5ms
   ✓ canCancel (Lite-3: until 60 minutes before) (4)
     ✓ “now” is frozen: new Date() returns the time we set 3ms
     ✓ at 07:59 a 09:00 booking can be cancelled: true 1ms
     ✓ at 08:00 a 09:00 booking can be cancelled: true 0ms
     ✓ at 08:01 a 09:00 booking can be cancelled: false 0ms
   ✓ login guard (BR-02) with fake timers (1)
     ✓ unlocks exactly 15 minutes after the 5th failure 0ms

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  01:00:10
   Duration  104ms (transform 48%, import 25%, tests 18%, worker 8%)`,
  '22-retry': `$ npx vitest run demo2/retry-that.test.js demo2/retry-gia.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo2/retry-gia.test.js (2 tests) 6ms
   ✓ fake timers: waits 1 s, then 2 s, between attempts 4ms
   ✓ fake timers: gives up after 3 attempts with the last error 1ms
 ✓ demo2/retry-that.test.js (1 test) 3007ms
   ✓ real timers: succeeds on the 3rd attempt (and really waits) 3006ms

 Test Files  2 passed (2)
      Tests  3 passed (3)
   Start at  01:00:10
   Duration  3.10s (tests 99%)`,
  '22-ro-ri-B': `$ npx vitest run demo2/dong-ho-ro-ri.test.js -t B

 RUN  v5.0.5 …/labflow-lite

 ✓ demo2/dong-ho-ro-ri.test.js (2 tests | 1 skipped) 3ms
   ↓ A: freezes the clock in 2020 (and forgets useRealTimers)
   ✓ B: today is in 2026 or later 2ms

 Test Files  1 passed (1)
      Tests  1 passed | 1 skipped (2)
   Start at  01:12:22
   Duration  93ms (import 41%, transform 21%, worker 20%, tests 17%, environment 1%)`,
  '22-ro-ri': `$ npx vitest run demo2/dong-ho-ro-ri.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo2/dong-ho-ro-ri.test.js (2 tests | 1 failed) 4ms
   ✓ A: freezes the clock in 2020 (and forgets useRealTimers) 2ms
   × B: today is in 2026 or later 2ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo2/dong-ho-ro-ri.test.js > B: today is in 2026 or later
AssertionError: expected 2020 to be greater than or equal to 2026
 ❯ demo2/dong-ho-ro-ri.test.js:10:36
      8|
      9| it('B: today is in 2026 or later', () => {
     10|   expect(new Date().getFullYear()).toBeGreaterThanOrEqual(2026);
       |                                    ^
     11| });
     12|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 1 passed (2)
   Start at  01:12:21
   Duration  97ms (transform 41%, import 27%, tests 21%, worker 10%)`,
  '22-th': `$ npx vitest run demo2/th22.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo2/th22.test.js (4 tests) 5ms
   ✓ practice 2.2 (4)
     ✓ a booking 59 minutes from now can be cancelled → false 2ms
     ✓ a booking 60 minutes from now can be cancelled → true 1ms
     ✓ a booking 61 minutes from now can be cancelled → true 0ms
     ✓ after the lock expires, 5 new failures lock the account again 1ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  01:01:34
   Duration  99ms (import 39%, transform 26%, tests 23%, worker 12%)`,
  '22-tz-utc': `$ TZ=UTC npx vitest run demo2/mui-gio.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo2/mui-gio.test.js (2 tests | 1 failed) 5ms
   × naive: 16 November is 14 days ahead 4ms
   ✓ VN calendar: 16 November is 14 days ahead 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo2/mui-gio.test.js > naive: 16 November is 14 days ahead
AssertionError: expected 15 to be 14 // Object.is equality

- Expected
+ Received

- 14
+ 15

 ❯ demo2/mui-gio.test.js:9:45
      7|
      8| it('naive: 16 November is 14 days ahead', () => {
      9|   expect(daysAheadNaive('2026-11-16', now)).toBe(14);
       |                                             ^
     10| });
     11|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 1 passed (2)
   Start at  18:00:09
   Duration  99ms (import 35%, tests 29%, transform 23%, worker 12%)`,
  '22-tz-vn': `$ TZ=Asia/Ho_Chi_Minh npx vitest run demo2/mui-gio.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo2/mui-gio.test.js (2 tests) 3ms
   ✓ naive: 16 November is 14 days ahead 2ms
   ✓ VN calendar: 16 November is 14 days ahead 0ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  01:00:09
   Duration  103ms (import 39%, transform 36%, tests 12%, worker 12%)`,
  '23-loi': `$ npx vitest run demo2/loi.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo2/loi.test.js (3 tests) 3ms
   ✓ bookLab — failure paths (3)
     ✓ a rule violation is a BookingError with the rule code 2ms
     ✓ a database failure becomes STORAGE_DOWN and keeps the original cause 0ms
     ✓ a failure while saving is also STORAGE_DOWN 0ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  01:00:14
   Duration  106ms (transform 38%, import 37%, tests 14%, worker 10%)`,
  '23-no-catch': `$ npx vitest run demo2/loi.test.js demo2/th23.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo2/th23.test.js (2 tests) 3ms
   ✓ practice 2.3 (2)
     ✓ a failing insert becomes STORAGE_DOWN and keeps "disk full" as the cause 2ms
     ✓ an invalid slot never reaches the database 1ms
 ❯ demo2/loi.test.js (3 tests | 1 failed) 6ms
   ❯ bookLab — failure paths (3)
     ✓ a rule violation is a BookingError with the rule code 2ms
     × a database failure becomes STORAGE_DOWN and keeps the original cause 3ms
     ✓ a failure while saving is also STORAGE_DOWN 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo2/loi.test.js > bookLab — failure paths > a database failure becomes STORAGE_DOWN and keeps the original cause
AssertionError: expected undefined to be 'STORAGE_DOWN' // Object.is equality

- Expected:
"STORAGE_DOWN"

+ Received:
undefined

 ❯ demo2/loi.test.js:19:24
     17|     };
     18|     const error = await bookLab(brokenRepo, input).catch((e) => e);
     19|     expect(error.code).toBe('STORAGE_DOWN');
       |                        ^
     20|     expect(error.cause.message).toBe('connect ECONNREFUSED 127.0.0.1:5…
     21|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 4 passed (5)
   Start at  01:04:23
   Duration  116ms (transform 51%, import 25%, tests 15%, worker 8%)`,
  '23-th': `$ npx vitest run demo2/th23.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo2/th23.test.js (2 tests) 3ms
   ✓ practice 2.3 (2)
     ✓ a failing insert becomes STORAGE_DOWN and keeps "disk full" as the cause 2ms
     ✓ an invalid slot never reaches the database 1ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  01:01:35
   Duration  92ms (import 41%, transform 29%, tests 16%, worker 13%)`,
  '23-try-loose': `$ npx vitest run demo2/try-catch-bay.test.js --config demo2/vitest.loose.config.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo2/try-catch-bay.test.js (1 test) 14ms
   ✓ rejects 06:00 (try/catch style — but the input is valid!) 14ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  01:00:15
   Duration  103ms (tests 49%, import 23%, transform 20%, worker 7%)`,
  '23-try-strict': `$ npx vitest run demo2/try-catch-bay.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo2/try-catch-bay.test.js (1 test | 1 failed) 17ms
   × rejects 06:00 (try/catch style — but the input is valid!) 16ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo2/try-catch-bay.test.js > rejects 06:00 (try/catch style — but the input is valid!)
Error: expected any number of assertion, but got none
 ❯ demo2/try-catch-bay.test.js:6:1
      4| const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'S…
      5|
      6| it('rejects 06:00 (try/catch style — but the input is valid!)', async …
       | ^
      7|   try {
      8|     await bookLab(createMemoryRepo(), input); // oops: 08:00, not 06:0…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  01:00:15
   Duration  117ms (tests 49%, import 22%, transform 21%, worker 7%)`,
  '23-try-sua': `$ npx vitest run demo2/try-sua.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo2/try-sua.test.js (2 tests | 1 failed) 19ms
   ✓ rejects 06:00 with OUTSIDE_HOURS 2ms
   × the same mistake as the trap (valid input) now fails loudly 16ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo2/try-sua.test.js > the same mistake as the trap (valid input) now fails loudly
AssertionError: promise resolved "{ id: 1, lab: 'BE-201', …(7) }" instead of rejecting

- Expected
+ Received

- Error {
-   "message": "rejected promise",
+ {
+   "date": "2026-11-16",
+   "end": "10:00",
+   "id": 1,
+   "lab": "BE-201",
+   "minutes": 120,
+   "role": "STUDENT",
+   "seats": 20,
+   "start": "08:00",
+   "status": "CONFIRMED",
  }

 ❯ demo2/try-sua.test.js:13:5
     11| it('the same mistake as the trap (valid input) now fails loudly', asyn…
     12|   await expect(bookLab(createMemoryRepo(), input))
     13|     .rejects.toMatchObject({ code: 'OUTSIDE_HOURS' });
       |     ^
     14| });
     15|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 1 passed (2)
   Start at  01:19:57
   Duration  165ms (tests 38%, transform 32%, import 20%, worker 10%)`,
  '24-chap-chon-100': `100 runs: 86 passed, 14 failed`,
  '24-chap-chon-100b': `100 runs: 82 passed, 18 failed`,
  '24-chap-chon-fail': `$ npx vitest run demo2/chap-chon.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo2/chap-chon.test.js (1 test | 1 failed) 5ms
   × 20 short codes are all different 4ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo2/chap-chon.test.js > 20 short codes are all different
AssertionError: expected 19 to be 20 // Object.is equality

- Expected
+ Received

- 20
+ 19

 ❯ demo2/chap-chon.test.js:6:31
      4| it('20 short codes are all different', () => {
      5|   const codes = Array.from({ length: 20 }, () => makeBookingCode(Math.…
      6|   expect(new Set(codes).size).toBe(20);
       |                               ^
      7| });
      8|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  00:57:25
   Duration  102ms (import 37%, tests 26%, transform 24%, worker 13%)`,
  '24-ngau-nhien': `$ npx vitest run demo2/ngau-nhien.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo2/ngau-nhien.test.js (5 tests) 5ms
   ✓ makeBookingCode (4)
     ✓ inject the randomness: first and last letter of the alphabet 1ms
     ✓ a seeded generator gives the same codes on every run 1ms
     ✓ spy on Math.random when the code does not take a parameter 1ms
     ✓ assert the shape when the value is truly random 0ms
   ✓ newBookingRecord (1)
     ✓ fixed id and clock make the whole record predictable 1ms

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  01:00:16
   Duration  107ms (import 38%, transform 25%, tests 24%, worker 12%)`,
  '24-ro-ri-B': `$ npx vitest run demo2/ro-ri.test.js -t B

 RUN  v5.0.5 …/labflow-lite

 ✓ demo2/ro-ri.test.js (2 tests | 1 skipped) 2ms
   ↓ A: Math.random mocked to 0 (and never restored)
   ✓ B: two fresh codes are different 1ms

 Test Files  1 passed (1)
      Tests  1 passed | 1 skipped (2)
   Start at  00:58:42
   Duration  87ms (import 44%, transform 28%, worker 16%, tests 12%, environment 1%)`,
  '24-ro-ri-restore': `$ npx vitest run demo2/ro-ri.test.js --config demo2/vitest.restore.config.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo2/ro-ri.test.js (2 tests) 3ms
   ✓ A: Math.random mocked to 0 (and never restored) 1ms
   ✓ B: two fresh codes are different 0ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  01:06:58
   Duration  110ms (transform 53%, import 26%, worker 10%, tests 10%)`,
  '24-ro-ri': `$ npx vitest run demo2/ro-ri.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo2/ro-ri.test.js (2 tests | 1 failed) 4ms
   ✓ A: Math.random mocked to 0 (and never restored) 1ms
   × B: two fresh codes are different 2ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo2/ro-ri.test.js > B: two fresh codes are different
AssertionError: expected 'LF-AAAAAA' not to be 'LF-AAAAAA' // Object.is equality
 ❯ demo2/ro-ri.test.js:10:33
      8|
      9| it('B: two fresh codes are different', () => {
     10|   expect(makeBookingCode()).not.toBe(makeBookingCode());
       |                                 ^
     11| });
     12|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 1 passed (2)
   Start at  00:58:41
   Duration  105ms (transform 45%, import 28%, tests 17%, worker 10%)`,
  '24-th-100': `100 runs: 100 passed, 0 failed`,
  '24-th': `$ npx vitest run demo2/th24.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo2/th24.test.js (2 tests) 2ms
   ✓ practice 2.4 (2)
     ✓ 20 short codes from seed 7 are all different — the same 20 on every run 1ms
     ✓ the same seed gives the same first code 0ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  01:01:35
   Duration  91ms (import 43%, transform 28%, worker 15%, tests 14%, environment 1%)`,
  'lab2-ch2': `$ npx vitest run src/rules/cancel src/rules/days src/auth src/lib src/booking

 RUN  v5.0.5 …/labflow-lite

 ✓ src/rules/cancel.test.js (4 tests) 2ms
   ✓ canCancel (Lite-3: until 60 minutes before the start) (4)
     ✓ at 07:00, a 09:00 booking can be cancelled → true 1ms
     ✓ at 08:00, a 09:00 booking can be cancelled → true 0ms
     ✓ at 08:01, a 09:00 booking can be cancelled → false 0ms
     ✓ at 09:30, a 09:00 booking can be cancelled → false 0ms
 ✓ src/auth/login-guard.test.js (5 tests) 3ms
   ✓ createLoginGuard (BR-02: 5 failures → locked 15 minutes) (5)
     ✓ 4 failures do not lock 1ms
     ✓ the 5th failure locks 0ms
     ✓ still locked at 14:59.999, unlocked at exactly 15:00 0ms
     ✓ a successful login resets the counter 0ms
     ✓ locks only the account that failed 0ms
 ✓ src/rules/days.test.js (4 tests) 3ms
   ✓ daysAheadVN (BR-05 counted in Viet Nam time) (4)
     ✓ now 2026-11-02T06:30:00+07:00 → 2026-11-16 is 14 days ahead 2ms
     ✓ now 2026-11-02T23:59:00+07:00 → 2026-11-16 is 14 days ahead 0ms
     ✓ now 2026-11-03T00:00:00+07:00 → 2026-11-16 is 13 days ahead 0ms
     ✓ now 2026-11-02T06:30:00+07:00 → 2026-11-02 is 0 days ahead 0ms
 ✓ src/lib/retry.test.js (3 tests) 6ms
   ✓ retry (3)
     ✓ returns at once when the first attempt works 3ms
     ✓ waits 1 s then 2 s between attempts 2ms
     ✓ gives up after 3 attempts and rethrows the last error 1ms
 ✓ src/booking/service.test.js (6 tests) 60ms
   ✓ bookLab (6)
     ✓ stores a confirmed booking 13ms
     ✓ rejects a rule violation with its code before touching the database 1ms
     ✓ rejects an overlapping booking with OVERLAP 19ms
     ✓ accepts the slot that starts when the previous one ends 25ms
     ✓ turns a failing lookup into STORAGE_DOWN and keeps the cause 0ms
     ✓ turns a failing insert into STORAGE_DOWN 0ms

 Test Files  5 passed (5)
      Tests  22 passed (22)
   Start at  01:00:39
   Duration  160ms (tests 47%, import 24%, transform 20%, worker 8%)`,
  'lab2-full': `$ npx vitest run src/

 RUN  v5.0.5 …/labflow-lite

 ✓ src/auth/login-guard.test.js (5 tests) 3ms
   ✓ createLoginGuard (BR-02: 5 failures → locked 15 minutes) (5)
     ✓ 4 failures do not lock 1ms
     ✓ the 5th failure locks 0ms
     ✓ still locked at 14:59.999, unlocked at exactly 15:00 0ms
     ✓ a successful login resets the counter 0ms
     ✓ locks only the account that failed 0ms
 ✓ src/rules/cancel.test.js (4 tests) 3ms
   ✓ canCancel (Lite-3: until 60 minutes before the start) (4)
     ✓ at 07:00, a 09:00 booking can be cancelled → true 1ms
     ✓ at 08:00, a 09:00 booking can be cancelled → true 0ms
     ✓ at 08:01, a 09:00 booking can be cancelled → false 0ms
     ✓ at 09:30, a 09:00 booking can be cancelled → false 0ms
 ✓ src/rules/days.test.js (4 tests) 5ms
   ✓ daysAheadVN (BR-05 counted in Viet Nam time) (4)
     ✓ now 2026-11-02T06:30:00+07:00 → 2026-11-16 is 14 days ahead 2ms
     ✓ now 2026-11-02T23:59:00+07:00 → 2026-11-16 is 14 days ahead 0ms
     ✓ now 2026-11-03T00:00:00+07:00 → 2026-11-16 is 13 days ahead 0ms
     ✓ now 2026-11-02T06:30:00+07:00 → 2026-11-02 is 0 days ahead 1ms
 ✓ src/lib/retry.test.js (3 tests) 7ms
   ✓ retry (3)
     ✓ returns at once when the first attempt works 3ms
     ✓ waits 1 s then 2 s between attempts 2ms
     ✓ gives up after 3 attempts and rethrows the last error 1ms
 ✓ src/rules/booking.test.js (28 tests) 5ms
   ✓ checkSlot (11)
     ✓ accepts (4)
       ✓ 07:00–08:00 (60 min) 1ms
       ✓ 20:00–21:00 (60 min) 0ms
       ✓ 08:00–08:30 (30 min) 0ms
       ✓ 08:00–12:00 (240 min) 0ms
     ✓ rejects (7)
       ✓ 06:30–08:00 with OUTSIDE_HOURS 0ms
       ✓ 20:00–21:30 with OUTSIDE_HOURS 0ms
       ✓ 08:15–09:00 with OFF_GRID 0ms
       ✓ 08:00–09:10 with OFF_GRID 0ms
       ✓ 10:00–09:00 with END_BEFORE_START 1ms
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
     ✓ throws RangeError for 2.5 seats 0ms
   ✓ createBooking (2)
     ✓ builds a PENDING booking for 31 seats 0ms
     ✓ throws the rule code for a bad slot 0ms
 ✓ src/rules/time.test.js (12 tests) 7ms
   ✓ parseTime (10)
     ✓ 00:00 → 0 1ms
     ✓ 07:00 → 420 0ms
     ✓ 21:30 → 1290 0ms
     ✓ 23:59 → 1439 0ms
     ✓ throws TypeError for "7:00" 0ms
     ✓ throws TypeError for "07-00" 0ms
     ✓ throws TypeError for "" 0ms
     ✓ throws TypeError for "abc" 0ms
     ✓ throws RangeError for 24:00 0ms
     ✓ throws RangeError for 07:60 0ms
   ✓ formatTime (2)
     ✓ pads to HH:MM 0ms
     ✓ round-trips with parseTime for every minute of the day 3ms
 ✓ src/booking/service.test.js (6 tests) 56ms
   ✓ bookLab (6)
     ✓ stores a confirmed booking 14ms
     ✓ rejects a rule violation with its code before touching the database 1ms
     ✓ rejects an overlapping booking with OVERLAP 19ms
     ✓ accepts the slot that starts when the previous one ends 21ms
     ✓ turns a failing lookup into STORAGE_DOWN and keeps the cause 0ms
     ✓ turns a failing insert into STORAGE_DOWN 0ms

 Test Files  7 passed (7)
      Tests  62 passed (62)
   Start at  01:00:16
   Duration  175ms (tests 40%, import 32%, transform 20%, worker 8%)`,
  'lab2-mut-strong': `$ node scripts/dot-bien-2.mjs
✔ killed    #1 Lite-3: cancel exactly 60 min before refused
✔ killed    #2 BR-02: locks after 6 failures, not 5
✔ killed    #3 BR-02: still locked at exactly 15:00
✔ killed    #4 success does not reset the counter
✔ killed    #5 retry waits 1 s every time (no back-off)
✔ killed    #6 retry makes one attempt too few
✔ killed    #7 lookup failure leaks the raw error
✔ killed    #8 days counted in UTC, not Viet Nam time

8/8 mutants killed`,
  'lab2-mut-weak': `$ node scripts/dot-bien-2.mjs
✘ SURVIVED  #1 Lite-3: cancel exactly 60 min before refused
✘ SURVIVED  #2 BR-02: locks after 6 failures, not 5
✘ SURVIVED  #3 BR-02: still locked at exactly 15:00
✘ SURVIVED  #4 success does not reset the counter
✘ SURVIVED  #5 retry waits 1 s every time (no back-off)
✘ SURVIVED  #6 retry makes one attempt too few
✘ SURVIVED  #7 lookup failure leaks the raw error
✘ SURVIVED  #8 days counted in UTC, not Viet Nam time

0/8 mutants killed`,
  'lab2-weak-run': `$ npx vitest run src/weak2.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ src/weak2.test.js (5 tests) 16ms
   ✓ cancel two hours before is allowed 1ms
   ✓ 16 November is 14 days after 2 November (midday) 1ms
   ✓ ten failures lock the account 0ms
   ✓ retry returns the result 1ms
   ✓ bookLab stores a booking 12ms

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  00:59:44
   Duration  136ms (transform 49%, tests 27%, import 19%, worker 5%)`,
};
