/**
 * _ma.mjs (Chương 3) — SINH TỰ ĐỘNG bằng scripts/tst/sinh-ma.mjs từ dự án chạy thật. Đừng sửa tay.
 */
export const CODE = {
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
  reminder: `// Written the "quick" way: it builds its own mailer from environment variables at import time.
// Lesson 3.2 tests it with vi.mock; lesson 3.4 shows why the injected version is easier.
import { createHttpMailer } from '../lib/mailer.js';

const mailer = createHttpMailer({ baseUrl: process.env.MAIL_API_URL, apiKey: process.env.MAIL_API_KEY });

export async function sendReminder(booking) {
  return mailer.send({ to: booking.email, subject: 'Reminder: ' + booking.lab + ' at ' + booking.start + ' tomorrow' });
}`,
  fakes: `// A FAKE mailer: a small working implementation that keeps sent mail in memory instead of calling a provider.
export function createFakeMailer() {
  const outbox = [];
  return {
    outbox,
    async send(mail) {
      outbox.push(mail);
      return 'msg-' + outbox.length;
    },
  };
}`,
  config: `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: ['tree'],                 // print the describe → it tree
    expect: { requireAssertions: true }, // a test without any expect fails (lesson 1.1)
    restoreMocks: true,                  // undo every vi.spyOn before each test (lesson 2.4)
  },
});`,
  doubles: `import { describe, it, expect, vi } from 'vitest';
import { bookAndNotify, APPROVER } from '../src/notify/notify.js';
import { createMemoryRepo } from '../src/booking/service.js';
import { createFakeMailer } from '../test/support/fakes.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00', email: 'an@fpt.edu.vn' };

describe('five kinds of test double around bookAndNotify', () => {
  it('dummy: the log is required but never used on this path', async () => {
    const dummyLog = {};                                   // would crash if touched
    const booking = await bookAndNotify({ repo: createMemoryRepo(), mailer: { send: async () => 'x' }, log: dummyLog }, input);
    expect(booking.notified).toBe(true);
  });

  it('stub: a mailer that always fails, to reach the catch branch', async () => {
    const stubMailer = { send: async () => { throw new Error('SMTP down'); } };
    const booking = await bookAndNotify({ repo: createMemoryRepo(), mailer: stubMailer, log: { warn() {} } }, input);
    expect(booking).toMatchObject({ status: 'CONFIRMED', notified: false });
  });

  it('spy: vi.fn records how it was called', async () => {
    const send = vi.fn().mockResolvedValue('msg-1');
    await bookAndNotify({ repo: createMemoryRepo(), mailer: { send } }, input);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith({ to: 'an@fpt.edu.vn', subject: 'Booking confirmed: BE-201 on 2026-11-16 at 08:00' });
  });

  it('mock: the expectation IS the test — a warning must be logged', async () => {
    const log = { warn: vi.fn() };
    await bookAndNotify({ repo: createMemoryRepo(), mailer: { send: vi.fn().mockRejectedValue(new Error('SMTP down')) }, log }, input);
    expect(log.warn).toHaveBeenCalledWith('mail failed for booking 1: SMTP down');
  });

  it('fake: a working in-memory mailer — assert on its state', async () => {
    const mailer = createFakeMailer();
    await bookAndNotify({ repo: createMemoryRepo(), mailer }, { ...input, seats: 31 });
    expect(mailer.outbox).toEqual([{ to: APPROVER, subject: 'Approval needed: 31 seats, BE-201 on 2026-11-16 at 08:00' }]);
  });

  it('vi.spyOn: watch a real object without replacing what it does', async () => {
    const mailer = createFakeMailer();
    const send = vi.spyOn(mailer, 'send');
    await bookAndNotify({ repo: createMemoryRepo(), mailer }, input);
    expect(send).toHaveBeenCalledOnce();
    expect(mailer.outbox).toHaveLength(1);                 // the real fake still ran
  });
});`,
  th31: `import { describe, it, expect, vi } from 'vitest';
import { bookAndNotify, APPROVER } from '../src/notify/notify.js';
import { createMemoryRepo } from '../src/booking/service.js';
import { createFakeMailer } from '../test/support/fakes.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00', email: 'an@fpt.edu.vn' };

describe('practice 3.1', () => {
  it('a PENDING booking e-mails the approver, not the student (fake mailer)', async () => {
    const mailer = createFakeMailer();
    await bookAndNotify({ repo: createMemoryRepo(), mailer }, input);
    expect(mailer.outbox).toHaveLength(1);
    expect(mailer.outbox[0].to).toBe(APPROVER);
  });

  it('when the mailer fails, the booking is still stored and marked notified: false (stub)', async () => {
    const repo = createMemoryRepo();
    const failing = { send: async () => { throw new Error('SMTP down'); } };
    const booking = await bookAndNotify({ repo, mailer: failing, log: { warn() {} } }, input);
    expect(booking.notified).toBe(false);
    expect(repo.count()).toBe(1);
  });

  it('the approver mail mentions the number of seats (spy)', async () => {
    const send = vi.fn().mockResolvedValue('m');
    await bookAndNotify({ repo: createMemoryRepo(), mailer: { send } }, input);
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: APPROVER, subject: expect.stringContaining('31 seats') }));
  });
});`,
  viMock: `import { it, expect, vi } from 'vitest';
import { sendReminder } from '../src/notify/reminder.js';

// vi.mock is hoisted to the top of the file, above the imports, so the factory runs first.
// Anything the factory uses must be created with vi.hoisted.
const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock('../src/lib/mailer.js', () => ({
  createHttpMailer: () => ({ send }),
}));

it('sends a reminder through the (mocked) mailer module', async () => {
  send.mockResolvedValue('msg-7');
  const id = await sendReminder({ email: 'an@fpt.edu.vn', lab: 'BE-201', start: '08:00' });
  expect(id).toBe('msg-7');
  expect(send).toHaveBeenCalledWith({ to: 'an@fpt.edu.vn', subject: 'Reminder: BE-201 at 08:00 tomorrow' });
});`,
  viMockSai: `import { it, expect, vi } from 'vitest';
import { sendReminder } from '../src/notify/reminder.js';

const send = vi.fn();                    // a normal variable…
vi.mock('../src/lib/mailer.js', () => ({
  createHttpMailer: () => ({ send }),    // …used inside the hoisted factory
}));

it('sends a reminder', async () => {
  send.mockResolvedValue('msg-7');
  expect(await sendReminder({ email: 'an@fpt.edu.vn', lab: 'BE-201', start: '08:00' })).toBe('msg-7');
});`,
  msw: `import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw/http';
import { createHttpMailer } from '../src/lib/mailer.js';

const API = 'https://mail.provider.example';
const sent = [];
const server = setupServer(
  http.post(API + '/v1/messages', async ({ request }) => {
    sent.push({ auth: request.headers.get('authorization'), body: await request.json() });
    return HttpResponse.json({ id: 'msg-42' }, { status: 202 });
  }),
);

beforeAll(() => server.listen({ onUnhandledFrame: 'error' })); // any other request fails the test
afterEach(() => { server.resetHandlers(); sent.length = 0; });
afterAll(() => server.close());

describe('createHttpMailer (real fetch, fake network)', () => {
  const mailer = createHttpMailer({ baseUrl: API, apiKey: 'test-key' });

  it('posts JSON with the API key and returns the message id', async () => {
    await expect(mailer.send({ to: 'an@fpt.edu.vn', subject: 'Hi' })).resolves.toBe('msg-42');
    expect(sent).toEqual([{ auth: 'Bearer test-key', body: { to: 'an@fpt.edu.vn', subject: 'Hi' } }]);
  });

  it('429 from the provider becomes RATE_LIMITED', async () => {
    server.use(http.post(API + '/v1/messages', () => new HttpResponse(null, { status: 429 })));
    await expect(mailer.send({ to: 'an@fpt.edu.vn', subject: 'Hi' })).rejects.toMatchObject({ code: 'RATE_LIMITED' });
  });

  it('500 becomes MAIL_FAILED and keeps the status as the cause', async () => {
    server.use(http.post(API + '/v1/messages', () => new HttpResponse(null, { status: 500 })));
    const error = await mailer.send({ to: 'an@fpt.edu.vn', subject: 'Hi' }).catch((e) => e);
    expect(error).toMatchObject({ code: 'MAIL_FAILED', cause: { message: 'HTTP 500' } });
  });
});`,
  mswLot: `import { it, expect, beforeAll, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw/http';
import { createHttpMailer } from '../src/lib/mailer.js';

const server = setupServer(http.post('https://mail.provider.example/v1/messages', () => HttpResponse.json({ id: 'm-1' })));
beforeAll(() => server.listen({ onUnhandledFrame: 'error' })); // MSW 3 name
afterAll(() => server.close());

it('a typo in the base URL is caught instead of calling the real internet', async () => {
  const mailer = createHttpMailer({ baseUrl: 'https://mail.provider.example/api', apiKey: 'k' }); // extra "/api"
  await expect(mailer.send({ to: 'an@fpt.edu.vn', subject: 'Hi' })).resolves.toBe('m-1');
});`,
  mswLotCu: `import { it, expect, beforeAll, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw/http';
import { createHttpMailer } from '../src/lib/mailer.js';

const server = setupServer(http.post('https://mail.provider.example/v1/messages', () => HttpResponse.json({ id: 'm-1' })));
beforeAll(() => server.listen({ onUnhandledRequest: 'error' })); // the MSW 2 name — MSW 3 silently ignores it
afterAll(() => server.close());

it('a typo in the base URL is caught instead of calling the real internet', async () => {
  const mailer = createHttpMailer({ baseUrl: 'https://mail.provider.example/api', apiKey: 'k' }); // extra "/api"
  await expect(mailer.send({ to: 'an@fpt.edu.vn', subject: 'Hi' })).resolves.toBe('m-1');
});`,
  th32: `import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw/http';
import { createHttpMailer } from '../src/lib/mailer.js';

const API = 'https://mail.provider.example';
const server = setupServer();
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
const mailer = createHttpMailer({ baseUrl: API, apiKey: 'test-key' });

describe('practice 3.2', () => {
  it('400 from the provider is MAIL_FAILED with "HTTP 400" as the cause', async () => {
    server.use(http.post(API + '/v1/messages', () => HttpResponse.json({ error: 'bad address' }, { status: 400 })));
    await expect(mailer.send({ to: 'not-an-email', subject: 'Hi' }))
      .rejects.toMatchObject({ code: 'MAIL_FAILED', cause: { message: 'HTTP 400' } });
  });

  it('sends the subject in the JSON body', async () => {
    let body;
    server.use(http.post(API + '/v1/messages', async ({ request }) => {
      body = await request.json();
      return HttpResponse.json({ id: 'm-9' }, { status: 202 });
    }));
    await mailer.send({ to: 'an@fpt.edu.vn', subject: 'Booking confirmed: BE-201' });
    expect(body).toEqual({ to: 'an@fpt.edu.vn', subject: 'Booking confirmed: BE-201' });
  });
});`,
  quaDaMock: `// Mock-heavy: bookLab and the repository are replaced, so the business rules never run.
import { describe, it, expect, vi } from 'vitest';
import { bookAndNotify } from '../src/notify/notify.js';
import { bookLab } from '../src/booking/service.js';

vi.mock('../src/booking/service.js', () => ({ bookLab: vi.fn() }));
const input = { lab: 'BE-201', date: '2026-11-16', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00', email: 'an@fpt.edu.vn' };

describe('bookAndNotify — mock-heavy', () => {
  it('a 31-seat student booking e-mails the student', async () => {
    vi.mocked(bookLab).mockResolvedValue({ id: 1, lab: 'BE-201', date: '2026-11-16', start: '08:00', status: 'CONFIRMED' });
    const send = vi.fn().mockResolvedValue('m');
    await bookAndNotify({ repo: {}, mailer: { send } }, input);
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: 'an@fpt.edu.vn' }));
  });

  it('passes the input to bookLab unchanged', async () => {
    vi.mocked(bookLab).mockResolvedValue({ id: 1, status: 'CONFIRMED' });
    await bookAndNotify({ repo: {}, mailer: { send: vi.fn() } }, input);
    expect(bookLab).toHaveBeenCalledWith({}, input);
  });
});`,
  quaDaFake: `// Fake-based: real bookLab + in-memory repository + fake mailer. Assert what a user would see.
import { describe, it, expect } from 'vitest';
import { bookAndNotify, APPROVER } from '../src/notify/notify.js';
import { createMemoryRepo } from '../src/booking/service.js';
import { createFakeMailer } from '../test/support/fakes.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00', email: 'an@fpt.edu.vn' };

describe('bookAndNotify — with fakes', () => {
  it('a 31-seat student booking is PENDING and goes to the approver', async () => {
    const mailer = createFakeMailer();
    const booking = await bookAndNotify({ repo: createMemoryRepo(), mailer }, input);
    expect(booking).toMatchObject({ status: 'PENDING', notified: true });
    expect(mailer.outbox.map((m) => m.to)).toEqual([APPROVER]);
  });

  it('the booking is really stored', async () => {
    const repo = createMemoryRepo();
    await bookAndNotify({ repo, mailer: createFakeMailer() }, input);
    expect(repo.count()).toBe(1);
  });
});`,
  quaChiTiet: `// Over-specified: asserts HOW bookLab talks to the repository, call by call.
import { it, expect, vi } from 'vitest';
import { bookLab } from '../src/booking/service.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it('checks for an overlap, then inserts exactly this row', async () => {
  const repo = { findOverlap: vi.fn().mockResolvedValue(null), insert: vi.fn().mockResolvedValue({ id: 1 }) };
  await bookLab(repo, input);
  expect(repo.findOverlap).toHaveBeenCalledWith('BE-201', '2026-11-16', '08:00', '10:00');
  expect(repo.insert).toHaveBeenCalledWith({ ...input, minutes: 120, status: 'CONFIRMED' });
});`,
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
  th33: `// Practice 3.3: both bad tests rewritten — real rules, fake infrastructure, assert outcomes.
import { it, expect } from 'vitest';
import { bookAndNotify, APPROVER } from '../src/notify/notify.js';
import { bookLab, createMemoryRepo } from '../src/booking/service.js';
import { createFakeMailer } from '../test/support/fakes.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00', email: 'an@fpt.edu.vn' };

it('a 31-seat student booking does NOT e-mail the student — it asks the approver', async () => {
  const mailer = createFakeMailer();
  await bookAndNotify({ repo: createMemoryRepo(), mailer }, input);
  expect(mailer.outbox).toEqual([expect.objectContaining({ to: APPROVER })]);
});

it('bookLab stores one booking with its length and status (outcome, not calls)', async () => {
  const repo = createMemoryRepo();
  const booking = await bookLab(repo, { ...input, seats: 20 });
  expect(booking).toMatchObject({ id: 1, minutes: 120, status: 'CONFIRMED' });
  expect(repo.count()).toBe(1);
});`,
  db: `import pg from 'pg';
// One pool for the whole app, created when the module is imported.
export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });`,
  smtp: `export async function sendMail(to, subject) {
  const res = await fetch(process.env.MAIL_API_URL + '/v1/messages', { method: 'POST', body: JSON.stringify({ to, subject }) });
  if (!res.ok) throw new Error('MAIL_FAILED');
}`,
  bookHard: `// The same feature written "quickly": it reaches for the database, the mailer and the clock by itself.
import { pool } from './db.js';
import { sendMail } from './smtp.js';
import { checkSlot, needsApproval } from '../../src/rules/booking.js';

export async function bookHard(input) {
  const today = new Date().toISOString().slice(0, 10);
  if (input.date < today) throw new Error('PAST_DATE');
  const slot = checkSlot(input.start, input.end);
  if (!slot.ok) throw new Error(slot.code);
  const clash = await pool.query(
    'SELECT id FROM bookings WHERE lab = $1 AND date = $2 AND start_time < $4 AND $3 < end_time',
    [input.lab, input.date, input.start, input.end]);
  if (clash.rows.length > 0) throw new Error('OVERLAP');
  const status = needsApproval(input) ? 'PENDING' : 'CONFIRMED';
  const { rows } = await pool.query(
    'INSERT INTO bookings (lab, date, start_time, end_time, seats, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
    [input.lab, input.date, input.start, input.end, input.seats, status]);
  await sendMail(input.email, 'Booking ' + status.toLowerCase());
  return { id: rows[0].id, status };
}`,
  khoThat: `import { it, expect } from 'vitest';
import { bookHard } from './kho/book-hard.js';

it('books BE-201 (no doubles at all)', async () => {
  const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00', email: 'an@fpt.edu.vn' };
  await expect(bookHard(input)).resolves.toMatchObject({ status: 'CONFIRMED' });
});`,
  kho: `import { it, expect, vi, beforeEach, afterEach } from 'vitest';
import { bookHard } from './kho/book-hard.js';
import { pool } from './kho/db.js';
import { sendMail } from './kho/smtp.js';

vi.mock('./kho/db.js', () => ({ pool: { query: vi.fn() } }));
vi.mock('./kho/smtp.js', () => ({ sendMail: vi.fn() }));
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-11-02T09:00:00+07:00'));
});
afterEach(() => vi.useRealTimers());

it('books BE-201 (two module mocks, a frozen clock, queries in order)', async () => {
  vi.mocked(pool.query)
    .mockResolvedValueOnce({ rows: [] })            // 1st call must be the overlap SELECT
    .mockResolvedValueOnce({ rows: [{ id: 7 }] });  // 2nd call must be the INSERT
  const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00', email: 'an@fpt.edu.vn' };
  await expect(bookHard(input)).resolves.toEqual({ id: 7, status: 'CONFIRMED' });
  expect(sendMail).toHaveBeenCalledWith('an@fpt.edu.vn', 'Booking confirmed');
});`,
  deTest: `import { it, expect } from 'vitest';
import { bookAndNotify } from '../src/notify/notify.js';
import { createMemoryRepo } from '../src/booking/service.js';
import { createFakeMailer } from '../test/support/fakes.js';

it('books BE-201 (dependencies passed in)', async () => {
  const mailer = createFakeMailer();
  const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00', email: 'an@fpt.edu.vn' };
  await expect(bookAndNotify({ repo: createMemoryRepo(), mailer }, input)).resolves.toMatchObject({ id: 1, status: 'CONFIRMED' });
  expect(mailer.outbox[0].to).toBe('an@fpt.edu.vn');
});`,
  reminderDi: `// Practice 3.4: the reminder rewritten so the mailer is passed in.
export function createReminder({ mailer }) {
  return (booking) => mailer.send({ to: booking.email, subject: 'Reminder: ' + booking.lab + ' at ' + booking.start + ' tomorrow' });
}`,
  th34: `import { describe, it, expect } from 'vitest';
import { buildMail, APPROVER } from '../src/notify/notify.js';
import { createReminder } from './reminder-di.js';
import { createFakeMailer } from '../test/support/fakes.js';

const base = { lab: 'BE-201', date: '2026-11-16', start: '08:00' };

describe('practice 3.4', () => {
  it.each([
    [{ ...base, status: 'CONFIRMED', seats: 20 }, 'an@fpt.edu.vn', 'Booking confirmed: BE-201 on 2026-11-16 at 08:00'],
    [{ ...base, status: 'PENDING', seats: 31 }, APPROVER, 'Approval needed: 31 seats, BE-201 on 2026-11-16 at 08:00'],
    [{ ...base, status: 'PENDING', seats: 60, start: '13:30' }, APPROVER, 'Approval needed: 60 seats, BE-201 on 2026-11-16 at 13:30'],
  ])('buildMail(%o) → %s', (booking, to, subject) => {
    expect(buildMail(booking, 'an@fpt.edu.vn')).toEqual({ to, subject });
  });

  it('the injected reminder needs no vi.mock', async () => {
    const mailer = createFakeMailer();
    await createReminder({ mailer })({ email: 'an@fpt.edu.vn', lab: 'BE-201', start: '08:00' });
    expect(mailer.outbox).toEqual([{ to: 'an@fpt.edu.vn', subject: 'Reminder: BE-201 at 08:00 tomorrow' }]);
  });
});`,
  notifyTest: `import { describe, it, expect, vi } from 'vitest';
import { bookAndNotify, buildMail, APPROVER } from './notify.js';
import { createMemoryRepo } from '../booking/service.js';
import { createFakeMailer } from '../../test/support/fakes.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00', email: 'an@fpt.edu.vn' };
const failing = () => ({ send: async () => { throw new Error('SMTP down'); } });

describe('buildMail (pure)', () => {
  it.each([
    ['CONFIRMED', 20, 'an@fpt.edu.vn', 'Booking confirmed: BE-201 on 2026-11-16 at 08:00'],
    ['PENDING', 31, APPROVER, 'Approval needed: 31 seats, BE-201 on 2026-11-16 at 08:00'],
  ])('%s booking with %i seats → mail to %s', (status, seats, to, subject) => {
    expect(buildMail({ lab: 'BE-201', date: '2026-11-16', start: '08:00', status, seats }, 'an@fpt.edu.vn')).toEqual({ to, subject });
  });
});

describe('bookAndNotify', () => {
  it('a confirmed booking e-mails the student once', async () => {
    const mailer = createFakeMailer();
    const booking = await bookAndNotify({ repo: createMemoryRepo(), mailer }, input);
    expect(booking).toMatchObject({ id: 1, status: 'CONFIRMED', notified: true });
    expect(mailer.outbox).toEqual([buildMail(booking, 'an@fpt.edu.vn')]);
  });

  it('a 31-seat student booking e-mails only the approver', async () => {
    const mailer = createFakeMailer();
    await bookAndNotify({ repo: createMemoryRepo(), mailer }, { ...input, seats: 31 });
    expect(mailer.outbox.map((m) => m.to)).toEqual([APPROVER]);
  });

  it('a failed e-mail keeps the booking and reports notified: false', async () => {
    const repo = createMemoryRepo();
    const booking = await bookAndNotify({ repo, mailer: failing(), log: { warn() {} } }, input);
    expect(booking).toMatchObject({ status: 'CONFIRMED', notified: false });
    expect(repo.count()).toBe(1);
  });

  it('a failed e-mail is logged with the booking id and the reason', async () => {
    const log = { warn: vi.fn() };
    await bookAndNotify({ repo: createMemoryRepo(), mailer: failing(), log }, input);
    expect(log.warn).toHaveBeenCalledWith('mail failed for booking 1: SMTP down');
  });

  it('a rejected booking sends no e-mail', async () => {
    const mailer = createFakeMailer();
    await expect(bookAndNotify({ repo: createMemoryRepo(), mailer }, { ...input, start: '06:00' }))
      .rejects.toMatchObject({ code: 'OUTSIDE_HOURS' });
    expect(mailer.outbox).toEqual([]);
  });
});`,
  mailerTest: `import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw/http';
import { createHttpMailer } from './mailer.js';

const API = 'https://mail.provider.example';
const requests = [];
const ok = http.post(API + '/v1/messages', async ({ request }) => {
  requests.push({ auth: request.headers.get('authorization'), body: await request.json() });
  return HttpResponse.json({ id: 'msg-42' }, { status: 202 });
});
const server = setupServer(ok);
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => { server.resetHandlers(); requests.length = 0; });
afterAll(() => server.close());
const mailer = createHttpMailer({ baseUrl: API, apiKey: 'test-key' });
const reply = (status) => server.use(http.post(API + '/v1/messages', () => new HttpResponse(null, { status })));

describe('createHttpMailer', () => {
  it('posts { to, subject } with a Bearer key and returns the id', async () => {
    await expect(mailer.send({ to: 'an@fpt.edu.vn', subject: 'Hi' })).resolves.toBe('msg-42');
    expect(requests).toEqual([{ auth: 'Bearer test-key', body: { to: 'an@fpt.edu.vn', subject: 'Hi' } }]);
  });

  it('429 → RATE_LIMITED', async () => {
    reply(429);
    await expect(mailer.send({ to: 'a@b.c', subject: 'Hi' })).rejects.toMatchObject({ code: 'RATE_LIMITED' });
  });

  it.each([400, 503])('%i → MAIL_FAILED with the status as the cause', async (status) => {
    reply(status);
    await expect(mailer.send({ to: 'a@b.c', subject: 'Hi' }))
      .rejects.toMatchObject({ code: 'MAIL_FAILED', cause: { message: 'HTTP ' + status } });
  });
});`,
  weak3: `import { it, expect, vi, beforeAll, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw/http';
import { bookAndNotify } from './notify/notify.js';
import { createMemoryRepo } from './booking/service.js';
import { createHttpMailer } from './lib/mailer.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00', email: 'an@fpt.edu.vn' };
const server = setupServer(http.post('https://mail.provider.example/v1/messages', () => HttpResponse.json({ id: 'msg-42' })));
beforeAll(() => server.listen());
afterAll(() => server.close());

it('bookAndNotify sends a mail', async () => {
  const send = vi.fn().mockResolvedValue('m');
  await bookAndNotify({ repo: createMemoryRepo(), mailer: { send } }, input);
  expect(send).toHaveBeenCalled();
});

it('bookAndNotify returns the booking', async () => {
  const booking = await bookAndNotify({ repo: createMemoryRepo(), mailer: { send: vi.fn() } }, input);
  expect(booking.status).toBe('CONFIRMED');
});

it('the mailer returns the message id', async () => {
  const mailer = createHttpMailer({ baseUrl: 'https://mail.provider.example', apiKey: 'k' });
  await expect(mailer.send({ to: 'an@fpt.edu.vn', subject: 'Hi' })).resolves.toBe('msg-42');
});`,
  dotBien3: `// Lab 3 mutants (Chapter 3: test doubles). Plant one bug at a time, run your tests, then restore the code.
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const MUTANTS = [
  ['src/notify/notify.js', 'return { to: studentEmail,', 'return { to: APPROVER,', 'confirmation goes to the approver'],
  ['src/notify/notify.js', "booking.lab + ' on ' + booking.date + ' at '", "booking.lab + ' at '", 'e-mail subject without the date'],
  ['src/notify/notify.js', "booking.seats + ' seats, ' + ", '', 'approver mail without the seat count'],
  ['src/notify/notify.js', 'return { ...booking, notified: false };', 'throw err;', 'a failed e-mail fails the booking request'],
  ['src/notify/notify.js', "log.warn('mail failed", "void ('mail failed", 'a failed e-mail is not logged'],
  ['src/lib/mailer.js', 'res.status === 429', 'res.status === 503', 'rate limit not recognised'],
  ['src/lib/mailer.js', "'Bearer ' + apiKey", 'apiKey', 'API key sent without "Bearer "'],
  ['src/lib/mailer.js', 'if (!res.ok)', 'if (res.status >= 500)', '4xx answers treated as success'],
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
};
export const OUT = {
  '31-doubles': `$ npx vitest run demo3/doubles.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo3/doubles.test.js (6 tests) 83ms
   ✓ five kinds of test double around bookAndNotify (6)
     ✓ dummy: the log is required but never used on this path 14ms
     ✓ stub: a mailer that always fails, to reach the catch branch 14ms
     ✓ spy: vi.fn records how it was called 14ms
     ✓ mock: the expectation IS the test — a warning must be logged 13ms
     ✓ fake: a working in-memory mailer — assert on its state 13ms
     ✓ vi.spyOn: watch a real object without replacing what it does 14ms

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  01:54:02
   Duration  193ms (tests 80%, import 9%, transform 8%, worker 3%)`,
  '31-th': `$ npx vitest run demo3/th31.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo3/th31.test.js (3 tests) 43ms
   ✓ practice 3.1 (3)
     ✓ a PENDING booking e-mails the approver, not the student (fake mailer) 15ms
     ✓ when the mailer fails, the booking is still stored and marked notified: false (stub) 13ms
     ✓ the approver mail mentions the number of seats (spy) 14ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  01:54:03
   Duration  148ms (tests 68%, import 15%, transform 14%, worker 3%)`,
  '32-msw-lot-cu': `$ npx vitest run demo3/msw-lot-cu.test.js

 RUN  v5.0.5 …/labflow-lite

stderr | demo3/msw-lot-cu.test.js > a typo in the base URL is caught instead of calling the real internet
[MSW] Warning: intercepted a request without a matching request handler:

  • POST https://mail.provider.example/api/v1/messages

  • Request body: {"to":"an@fpt.edu.vn","subject":"Hi"}

If you still wish to intercept this unhandled request, please create a request handler for it.
Read more: https://mswjs.io/docs/http/intercepting-requests

 ❯ demo3/msw-lot-cu.test.js (1 test | 1 failed) 39ms
   × a typo in the base URL is caught instead of calling the real internet 34ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo3/msw-lot-cu.test.js > a typo in the base URL is caught instead of calling the real internet
AssertionError: promise rejected "TypeError: fetch failed" instead of resolving
 ❯ demo3/msw-lot-cu.test.js:12:68
     10| it('a typo in the base URL is caught instead of calling the real inter…
     11|   const mailer = createHttpMailer({ baseUrl: 'https://mail.provider.ex…
     12|   await expect(mailer.send({ to: 'an@fpt.edu.vn', subject: 'Hi' })).re…
       |                                                                    ^
     13| });
     14|

Caused by: TypeError: fetch failed
 ❯ Object.send src/lib/mailer.js:13:19
 ❯ demo3/msw-lot-cu.test.js:12:3

Caused by: Error: getaddrinfo ENOTFOUND mail.provider.example
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -3008, code: 'ENOTFOUND', syscall: 'getaddrinfo', hostname: 'mail.provider.example' }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  01:54:24
   Duration  189ms (import 48%, tests 36%, transform 13%, worker 2%)`,
  '32-msw-lot': `$ npx vitest run demo3/msw-lot.test.js

 RUN  v5.0.5 …/labflow-lite

stderr | demo3/msw-lot.test.js > a typo in the base URL is caught instead of calling the real internet
[MSW] Error: intercepted a request without a matching request handler:

  • POST https://mail.provider.example/api/v1/messages

  • Request body: {"to":"an@fpt.edu.vn","subject":"Hi"}

If you still wish to intercept this unhandled request, please create a request handler for it.
Read more: https://mswjs.io/docs/http/intercepting-requests

 ❯ demo3/msw-lot.test.js (1 test | 1 failed) 34ms
   × a typo in the base URL is caught instead of calling the real internet 28ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo3/msw-lot.test.js > a typo in the base URL is caught instead of calling the real internet
AssertionError: promise rejected "TypeError: fetch failed" instead of resolving
 ❯ demo3/msw-lot.test.js:12:68
     10| it('a typo in the base URL is caught instead of calling the real inter…
     11|   const mailer = createHttpMailer({ baseUrl: 'https://mail.provider.ex…
     12|   await expect(mailer.send({ to: 'an@fpt.edu.vn', subject: 'Hi' })).re…
       |                                                                    ^
     13| });
     14|

Caused by: TypeError: fetch failed
 ❯ Object.send src/lib/mailer.js:13:19
 ❯ demo3/msw-lot.test.js:12:3

Caused by: InternalError: [MSW] Cannot bypass a request when using the "error" strategy for the "onUnhandledFrame" option.
 ❯ applyStrategy node_modules/msw/lib/_chunks/interceptor-source.js:361:51
 ❯ InterceptorHttpNetworkFrame.resolve node_modules/msw/lib/_chunks/interceptor-source.js:497:4
 ❯ Emitter.<anonymous> node_modules/msw/lib/_chunks/interceptor-source.js:264:6
 ❯ Emitter.emitAsPromise node_modules/rettime/build/index.mjs:182:24
 ❯ InterceptorSource.queue node_modules/msw/lib/_chunks/interceptor-source.js:24:3
 ❯ #handleRequest node_modules/msw/lib/_chunks/interceptor-source.js:695:3
 ❯ Emitter.emitAsPromise node_modules/rettime/build/index.mjs:182:24
 ❯ Emitter.forwardEvent node_modules/@mswjs/interceptors/lib/node/batch-interceptor-C3czWxt2.js:72:4
 ❯ Emitter.emitAsPromise node_modules/rettime/build/index.mjs:182:24

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  01:54:05
   Duration  198ms (import 53%, tests 31%, transform 14%, worker 2%)`,
  '32-msw': `$ npx vitest run demo3/msw.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo3/msw.test.js (3 tests) 40ms
   ✓ createHttpMailer (real fetch, fake network) (3)
     ✓ posts JSON with the API key and returns the message id 27ms
     ✓ 429 from the provider becomes RATE_LIMITED 4ms
     ✓ 500 becomes MAIL_FAILED and keeps the status as the cause 5ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  01:54:04
   Duration  196ms (import 51%, tests 34%, transform 13%, worker 2%)`,
  '32-th': `$ npx vitest run demo3/th32.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo3/th32.test.js (2 tests) 39ms
   ✓ practice 3.2 (2)
     ✓ 400 from the provider is MAIL_FAILED with "HTTP 400" as the cause 30ms
     ✓ sends the subject in the JSON body 5ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  01:54:06
   Duration  186ms (import 48%, tests 37%, transform 13%, worker 2%)`,
  '32-vi-mock-sai': `$ npx vitest run demo3/vi-mock-sai.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo3/vi-mock-sai.test.js (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo3/vi-mock-sai.test.js [ demo3/vi-mock-sai.test.js ]
ReferenceError: Cannot access 'send' before initialization
 ❯ createHttpMailer demo3/vi-mock-sai.test.js:6:30
      4| const send = vi.fn();                    // a normal variable…
      5| vi.mock('../src/lib/mailer.js', () => ({
      6|   createHttpMailer: () => ({ send }),    // …used inside the hoisted f…
       |                              ^
      7| }));
      8|
 ❯ src/notify/reminder.js:5:16
 ❯ demo3/vi-mock-sai.test.js:2:1

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  no tests
   Start at  01:54:04
   Duration  101ms (worker 97%, environment 3%)`,
  '32-vi-mock': `$ npx vitest run demo3/vi-mock.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo3/vi-mock.test.js (1 test) 2ms
   ✓ sends a reminder through the (mocked) mailer module 2ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  01:54:03
   Duration  105ms (import 48%, transform 27%, worker 14%, tests 12%)`,
  '33-bug': `$ node scripts/thu-loi.mjs src/booking/service.js "needsApproval(input) ? 'PENDING' : 'CONFIRMED'" "'CONFIRMED'" demo3/qua-da-mock.test.js demo3/qua-da-fake.test.js
planted in src/booking/service.js:  needsApproval(input) ? 'PENDING' : 'CONFIRMED'  →  'CONFIRMED'


 RUN  v5.0.5 …/labflow-lite

 ✓ demo3/qua-da-mock.test.js (2 tests) 3ms
   ✓ bookAndNotify — mock-heavy (2)
     ✓ a 31-seat student booking e-mails the student 1ms
     ✓ passes the input to bookLab unchanged 0ms
 ❯ demo3/qua-da-fake.test.js (2 tests | 1 failed) 33ms
   ❯ bookAndNotify — with fakes (2)
     × a 31-seat student booking is PENDING and goes to the approver 18ms
     ✓ the booking is really stored 14ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo3/qua-da-fake.test.js > bookAndNotify — with fakes > a 31-seat student booking is PENDING and goes to the approver
AssertionError: expected { id: 1, lab: 'BE-201', …(9) } to match object { status: 'PENDING', notified: true }
(9 matching properties omitted from actual)

- Expected
+ Received

  {
    "notified": true,
-   "status": "PENDING",
+   "status": "CONFIRMED",
  }

 ❯ demo3/qua-da-fake.test.js:13:21
     11|     const mailer = createFakeMailer();
     12|     const booking = await bookAndNotify({ repo: createMemoryRepo(), ma…
     13|     expect(booking).toMatchObject({ status: 'PENDING', notified: true …
       |                     ^
     14|     expect(mailer.outbox.map((m) => m.to)).toEqual([APPROVER]);
     15|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 3 passed (4)
   Start at  01:54:07
   Duration  150ms (tests 51%, import 25%, transform 17%, worker 7%)`,
  '33-refactor': `$ node scripts/thu-loi.mjs src/booking/service.js "minutes: slot.minutes, status });" "minutes: slot.minutes, status, source: 'web' });" demo3/qua-chi-tiet.test.js demo3/qua-da-fake.test.js
planted in src/booking/service.js:  minutes: slot.minutes, status });  →  minutes: slot.minutes, status, source: 'web' });


 RUN  v5.0.5 …/labflow-lite

 ❯ demo3/qua-chi-tiet.test.js (1 test | 1 failed) 6ms
   × checks for an overlap, then inserts exactly this row 5ms
 ✓ demo3/qua-da-fake.test.js (2 tests) 28ms
   ✓ bookAndNotify — with fakes (2)
     ✓ a 31-seat student booking is PENDING and goes to the approver 14ms
     ✓ the booking is really stored 13ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo3/qua-chi-tiet.test.js > checks for an overlap, then inserts exactly this row
AssertionError: expected "vi.fn()" to be called with arguments: [ { lab: 'BE-201', …(7) } ]

Received:

  1st vi.fn() call:

@@ -4,9 +4,10 @@
      "end": "10:00",
      "lab": "BE-201",
      "minutes": 120,
      "role": "STUDENT",
      "seats": 20,
+     "source": "web",
      "start": "08:00",
      "status": "CONFIRMED",
    },
  ]


Number of calls: 1

 ❯ demo3/qua-chi-tiet.test.js:11:23
      9|   await bookLab(repo, input);
     10|   expect(repo.findOverlap).toHaveBeenCalledWith('BE-201', '2026-11-16'…
     11|   expect(repo.insert).toHaveBeenCalledWith({ ...input, minutes: 120, s…
       |                       ^
     12| });
     13|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 2 passed (3)
   Start at  01:54:07
   Duration  122ms (tests 51%, import 24%, transform 17%, worker 7%)`,
  '33-th-bug': `$ node scripts/thu-loi.mjs src/booking/service.js "needsApproval(input) ? 'PENDING' : 'CONFIRMED'" "'CONFIRMED'" demo3/th33.test.js
planted in src/booking/service.js:  needsApproval(input) ? 'PENDING' : 'CONFIRMED'  →  'CONFIRMED'


 RUN  v5.0.5 …/labflow-lite

 ❯ demo3/th33.test.js (2 tests | 1 failed) 35ms
   × a 31-seat student booking does NOT e-mail the student — it asks the approver 20ms
   ✓ bookLab stores one booking with its length and status (outcome, not calls) 14ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo3/th33.test.js > a 31-seat student booking does NOT e-mail the student — it asks the approver
AssertionError: expected [ { to: 'an@fpt.edu.vn', …(1) } ] to deeply equal [ ObjectContaining{…} ]

- Expected
+ Received

  [
    {
-     "to": "approvals@labflow.example",
+     "subject": "Booking confirmed: BE-201 on 2026-11-16 at 08:00",
+     "to": "an@fpt.edu.vn",
    },
  ]

 ❯ demo3/th33.test.js:12:25
     10|   const mailer = createFakeMailer();
     11|   await bookAndNotify({ repo: createMemoryRepo(), mailer }, input);
     12|   expect(mailer.outbox).toEqual([expect.objectContaining({ to: APPROVE…
       |                         ^
     13| });
     14|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 1 passed (2)
   Start at  02:04:41
   Duration  190ms (tests 50%, transform 24%, import 21%, worker 5%)`,
  '33-th-refactor': `$ node scripts/thu-loi.mjs src/booking/service.js "minutes: slot.minutes, status });" "minutes: slot.minutes, status, source: 'web' });" demo3/th33.test.js
planted in src/booking/service.js:  minutes: slot.minutes, status });  →  minutes: slot.minutes, status, source: 'web' });


 RUN  v5.0.5 …/labflow-lite

 ✓ demo3/th33.test.js (2 tests) 29ms
   ✓ a 31-seat student booking does NOT e-mail the student — it asks the approver 15ms
   ✓ bookLab stores one booking with its length and status (outcome, not calls) 14ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  02:04:42
   Duration  143ms (tests 57%, transform 20%, import 19%, worker 5%)`,
  '33-th': `$ npx vitest run demo3/th33.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo3/th33.test.js (2 tests) 29ms
   ✓ a 31-seat student booking does NOT e-mail the student — it asks the approver 15ms
   ✓ bookLab stores one booking with its length and status (outcome, not calls) 13ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  02:04:40
   Duration  165ms (tests 43%, transform 33%, import 17%, worker 7%)`,
  '33-xanh': `$ npx vitest run demo3/qua-da-mock.test.js demo3/qua-da-fake.test.js demo3/qua-chi-tiet.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo3/qua-da-mock.test.js (2 tests) 2ms
   ✓ bookAndNotify — mock-heavy (2)
     ✓ a 31-seat student booking e-mails the student 1ms
     ✓ passes the input to bookLab unchanged 0ms
 ✓ demo3/qua-chi-tiet.test.js (1 test) 2ms
   ✓ checks for an overlap, then inserts exactly this row 2ms
 ✓ demo3/qua-da-fake.test.js (2 tests) 28ms
   ✓ bookAndNotify — with fakes (2)
     ✓ a 31-seat student booking is PENDING and goes to the approver 14ms
     ✓ the booking is really stored 13ms

 Test Files  3 passed (3)
      Tests  5 passed (5)
   Start at  01:54:06
   Duration  135ms (tests 33%, import 30%, transform 28%, worker 8%)`,
  '34-kho-that': `$ DATABASE_URL=postgres://labflow@127.0.0.1:1/labflow npx vitest run demo3/kho-that.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo3/kho-that.test.js (1 test | 1 failed) 8ms
   × books BE-201 (no doubles at all) 7ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo3/kho-that.test.js > books BE-201 (no doubles at all)
AssertionError: promise rejected "Error: connect ECONNREFUSED 127.0.0.1:1 { …(5) }" instead of resolving
 ❯ demo3/kho-that.test.js:6:32
      4| it('books BE-201 (no doubles at all)', async () => {
      5|   const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: …
      6|   await expect(bookHard(input)).resolves.toMatchObject({ status: 'CONF…
       |                                ^
      7| });
      8|

Caused by: Error: connect ECONNREFUSED 127.0.0.1:1
 ❯ node_modules/pg-pool/index.js:45:11
 ❯ bookHard demo3/kho/book-hard.js:11:17
 ❯ demo3/kho-that.test.js:6:3

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -61, code: 'ECONNREFUSED', syscall: 'connect', address: '127.0.0.1', port: 1 }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  01:54:09
   Duration  128ms (import 55%, transform 21%, tests 18%, worker 6%)`,
  '34-kho': `$ npx vitest run demo3/kho.test.js demo3/de-test.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo3/kho.test.js (1 test) 5ms
   ✓ books BE-201 (two module mocks, a frozen clock, queries in order) 4ms
 ✓ demo3/de-test.test.js (1 test) 14ms
   ✓ books BE-201 (dependencies passed in) 13ms

 Test Files  2 passed (2)
      Tests  2 passed (2)
   Start at  01:54:10
   Duration  113ms (import 33%, tests 30%, transform 29%, worker 7%)`,
  '34-th': `$ npx vitest run demo3/th34.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo3/th34.test.js (4 tests) 3ms
   ✓ practice 3.4 (4)
     ✓ buildMail({ lab: 'BE-201', …(4) }) → an@fpt.edu.vn 1ms
     ✓ buildMail({ lab: 'BE-201', …(4) }) → approvals@labflow.example 0ms
     ✓ buildMail({ lab: 'BE-201', …(4) }) → approvals@labflow.example 0ms
     ✓ the injected reminder needs no vi.mock 0ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  01:54:10
   Duration  139ms (transform 45%, import 42%, worker 7%, tests 5%)`,
  'lab3-ch3': `$ npx vitest run src/notify src/lib/mailer.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ src/notify/notify.test.js (7 tests) 56ms
   ✓ buildMail (pure) (2)
     ✓ CONFIRMED booking with 20 seats → mail to an@fpt.edu.vn 1ms
     ✓ PENDING booking with 31 seats → mail to approvals@labflow.example 0ms
   ✓ bookAndNotify (5)
     ✓ a confirmed booking e-mails the student once 14ms
     ✓ a 31-seat student booking e-mails only the approver 13ms
     ✓ a failed e-mail keeps the booking and reports notified: false 13ms
     ✓ a failed e-mail is logged with the booking id and the reason 13ms
     ✓ a rejected booking sends no e-mail 1ms
 ✓ src/lib/mailer.test.js (4 tests) 49ms
   ✓ createHttpMailer (4)
     ✓ posts { to, subject } with a Bearer key and returns the id 31ms
     ✓ 429 → RATE_LIMITED 4ms
     ✓ 400 → MAIL_FAILED with the status as the cause 5ms
     ✓ 503 → MAIL_FAILED with the status as the cause 3ms

 Test Files  2 passed (2)
      Tests  11 passed (11)
   Start at  01:54:17
   Duration  204ms (tests 52%, import 30%, transform 15%, worker 3%)`,
  'lab3-full': `$ npx vitest run src/

 RUN  v5.0.5 …/labflow-lite

 ✓ src/auth/login-guard.test.js (5 tests) 3ms
   ✓ createLoginGuard (BR-02: 5 failures → locked 15 minutes) (5)
     ✓ 4 failures do not lock 1ms
     ✓ the 5th failure locks 0ms
     ✓ still locked at 14:59.999, unlocked at exactly 15:00 0ms
     ✓ a successful login resets the counter 0ms
     ✓ locks only the account that failed 0ms
 ✓ src/rules/cancel.test.js (4 tests) 2ms
   ✓ canCancel (Lite-3: until 60 minutes before the start) (4)
     ✓ at 07:00, a 09:00 booking can be cancelled → true 1ms
     ✓ at 08:00, a 09:00 booking can be cancelled → true 0ms
     ✓ at 08:01, a 09:00 booking can be cancelled → false 0ms
     ✓ at 09:30, a 09:00 booking can be cancelled → false 0ms
 ✓ src/rules/days.test.js (4 tests) 4ms
   ✓ daysAheadVN (BR-05 counted in Viet Nam time) (4)
     ✓ now 2026-11-02T06:30:00+07:00 → 2026-11-16 is 14 days ahead 2ms
     ✓ now 2026-11-02T23:59:00+07:00 → 2026-11-16 is 14 days ahead 0ms
     ✓ now 2026-11-03T00:00:00+07:00 → 2026-11-16 is 13 days ahead 0ms
     ✓ now 2026-11-02T06:30:00+07:00 → 2026-11-02 is 0 days ahead 0ms
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
     ✓ round-trips with parseTime for every minute of the day 4ms
 ✓ src/rules/booking.test.js (28 tests) 6ms
   ✓ checkSlot (11)
     ✓ accepts (4)
       ✓ 07:00–08:00 (60 min) 2ms
       ✓ 20:00–21:00 (60 min) 0ms
       ✓ 08:00–08:30 (30 min) 0ms
       ✓ 08:00–12:00 (240 min) 0ms
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
     ✓ throws RangeError for 2.5 seats 0ms
   ✓ createBooking (2)
     ✓ builds a PENDING booking for 31 seats 0ms
     ✓ throws the rule code for a bad slot 0ms
 ✓ src/lib/retry.test.js (3 tests) 7ms
   ✓ retry (3)
     ✓ returns at once when the first attempt works 3ms
     ✓ waits 1 s then 2 s between attempts 2ms
     ✓ gives up after 3 attempts and rethrows the last error 1ms
 ✓ src/booking/service.test.js (6 tests) 56ms
   ✓ bookLab (6)
     ✓ stores a confirmed booking 14ms
     ✓ rejects a rule violation with its code before touching the database 1ms
     ✓ rejects an overlapping booking with OVERLAP 17ms
     ✓ accepts the slot that starts when the previous one ends 23ms
     ✓ turns a failing lookup into STORAGE_DOWN and keeps the cause 0ms
     ✓ turns a failing insert into STORAGE_DOWN 0ms
 ✓ src/notify/notify.test.js (7 tests) 55ms
   ✓ buildMail (pure) (2)
     ✓ CONFIRMED booking with 20 seats → mail to an@fpt.edu.vn 1ms
     ✓ PENDING booking with 31 seats → mail to approvals@labflow.example 0ms
   ✓ bookAndNotify (5)
     ✓ a confirmed booking e-mails the student once 13ms
     ✓ a 31-seat student booking e-mails only the approver 13ms
     ✓ a failed e-mail keeps the booking and reports notified: false 13ms
     ✓ a failed e-mail is logged with the booking id and the reason 13ms
     ✓ a rejected booking sends no e-mail 1ms
 ✓ src/lib/mailer.test.js (4 tests) 48ms
   ✓ createHttpMailer (4)
     ✓ posts { to, subject } with a Bearer key and returns the id 29ms
     ✓ 429 → RATE_LIMITED 5ms
     ✓ 400 → MAIL_FAILED with the status as the cause 5ms
     ✓ 503 → MAIL_FAILED with the status as the cause 4ms

 Test Files  9 passed (9)
      Tests  73 passed (73)
   Start at  01:54:18
   Duration  231ms (tests 43%, import 32%, transform 19%, worker 6%)`,
  'lab3-mut-strong': `$ node scripts/dot-bien-3.mjs
✔ killed    #1 confirmation goes to the approver
✔ killed    #2 e-mail subject without the date
✔ killed    #3 approver mail without the seat count
✔ killed    #4 a failed e-mail fails the booking request
✔ killed    #5 a failed e-mail is not logged
✔ killed    #6 rate limit not recognised
✔ killed    #7 API key sent without "Bearer "
✔ killed    #8 4xx answers treated as success

8/8 mutants killed`,
  'lab3-mut-weak': `$ node scripts/dot-bien-3.mjs
✘ SURVIVED  #1 confirmation goes to the approver
✘ SURVIVED  #2 e-mail subject without the date
✘ SURVIVED  #3 approver mail without the seat count
✘ SURVIVED  #4 a failed e-mail fails the booking request
✘ SURVIVED  #5 a failed e-mail is not logged
✘ SURVIVED  #6 rate limit not recognised
✘ SURVIVED  #7 API key sent without "Bearer "
✘ SURVIVED  #8 4xx answers treated as success

0/8 mutants killed`,
  'lab3-weak-run': `$ npx vitest run src/weak3.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ src/weak3.test.js (3 tests) 58ms
   ✓ bookAndNotify sends a mail 13ms
   ✓ bookAndNotify returns the booking 13ms
   ✓ the mailer returns the message id 27ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  01:54:11
   Duration  212ms (import 44%, tests 44%, transform 9%, worker 2%)`,
};
