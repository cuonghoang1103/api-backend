/**
 * _ma.mjs (Chương 11) — SINH TỰ ĐỘNG bằng scripts/tst/sinh-ma.mjs từ dự án chạy thật. Đừng sửa tay.
 */
export const CODE = {
  cancelRule: `// Lite-3: a booking can be cancelled until 60 minutes before it starts.
export const CANCEL_LIMIT_MINUTES = 60;

export function canCancel(startsAt, now = new Date()) {
  const minutesLeft = (startsAt.getTime() - now.getTime()) / 60000;
  return minutesLeft >= CANCEL_LIMIT_MINUTES;
}

// Chapter 11 (US-11 "My bookings"): when does a booking start, and may this user cancel it now?
// A booking's date and start are Viet Nam wall-clock time (UTC+7), whatever the server's time zone.
export function startsAtVN(date, start) {
  return new Date(date + 'T' + start + ':00+07:00');
}

// booking: { userId, status, date, start } or null · user: { id, role } · now: a Date.
export function cancelDecision(booking, user, now) {
  const isAdmin = user.role === 'ADMIN';
  if (!booking || (booking.userId !== user.id && !isAdmin)) return { ok: false, code: 'NOT_FOUND' };
  if (booking.status === 'CANCELLED') return { ok: false, code: 'ALREADY_CANCELLED' };
  if (!isAdmin && !canCancel(startsAtVN(booking.date, booking.start), now)) return { ok: false, code: 'TOO_LATE_TO_CANCEL' };
  return { ok: true };
}`,
  cancelTest: `import { describe, it, expect } from 'vitest';
import { canCancel, cancelDecision, startsAtVN } from './cancel.js';

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
});

// US-11 "My bookings" (Chapter 11). Decision table: who asks × booking status × time left before the start.
describe('cancelDecision — who may cancel, and until when (US-11)', () => {
  const booking = { id: 7, userId: 'an', status: 'CONFIRMED', date: '2026-11-16', start: '09:00' };
  const an = { id: 'an', role: 'STUDENT' };
  const binh = { id: 'binh', role: 'STUDENT' };
  const thay = { id: 'thay', role: 'LECTURER' };
  const boss = { id: 'boss', role: 'ADMIN' };

  it.each([
    ['the owner, 2 hours before (AC2)', booking, an, '07:00', { ok: true }],
    ['the owner, exactly 60 minutes before (Lite-3, AC2)', booking, an, '08:00', { ok: true }],
    ['the owner, 59 minutes before (Lite-3, AC2)', booking, an, '08:01', { ok: false, code: 'TOO_LATE_TO_CANCEL' }],
    ['the owner, PENDING booking', { ...booking, status: 'PENDING' }, an, '07:00', { ok: true }],
    ['another student (AC3)', booking, binh, '07:00', { ok: false, code: 'NOT_FOUND' }],
    ['a lecturer who does not own it (AC3)', booking, thay, '07:00', { ok: false, code: 'NOT_FOUND' }],
    ['an admin, 2 hours before (AC6)', booking, boss, '07:00', { ok: true }],
    ['an admin, 30 minutes before — admins are not bound by Lite-3 (AC6)', booking, boss, '08:30', { ok: true }],
    ['the owner, already cancelled (AC4)', { ...booking, status: 'CANCELLED' }, an, '07:00', { ok: false, code: 'ALREADY_CANCELLED' }],
    ['the owner, already cancelled AND too late → ALREADY_CANCELLED', { ...booking, status: 'CANCELLED' }, an, '08:30', { ok: false, code: 'ALREADY_CANCELLED' }],
    ['an admin, already cancelled', { ...booking, status: 'CANCELLED' }, boss, '07:00', { ok: false, code: 'ALREADY_CANCELLED' }],
    ['anyone, a booking that does not exist', null, an, '07:00', { ok: false, code: 'NOT_FOUND' }],
    ['another student, a cancelled booking → NOT_FOUND, no leak (AC3)', { ...booking, status: 'CANCELLED' }, binh, '07:00', { ok: false, code: 'NOT_FOUND' }],
  ])('%s', (_, b, user, clock, expected) => {
    expect(cancelDecision(b, user, at(clock))).toEqual(expected);
  });
});

describe('startsAtVN', () => {
  it('reads date and start as Viet Nam time: 09:00 in Ha Noi is 02:00 UTC', () => {
    expect(startsAtVN('2026-11-16', '09:00').toISOString()).toBe('2026-11-16T02:00:00.000Z');
  });
});`,
  svc: `// My bookings (Chapter 11, US-11): a student lists their own bookings and cancels one.
// The rule (who may cancel, until when) is a pure function in rules/cancel.js; this file only talks to the repository.
import { cancelDecision } from '../rules/cancel.js';

export const listMyBookings = (repo, userId) => repo.listByUser(userId);

// → { ok: true, booking } or { ok: false, code: NOT_FOUND | ALREADY_CANCELLED | TOO_LATE_TO_CANCEL }
export async function cancelMyBooking(repo, { id, user, now }) {
  const decision = cancelDecision(await repo.findById(id), user, now);
  if (!decision.ok) return decision;
  const booking = await repo.cancel(id);   // one atomic step: of two cancels at the same moment, only one wins
  return booking ? { ok: true, booking } : { ok: false, code: 'ALREADY_CANCELLED' };
}`,
  svcTest: `// US-11 "My bookings" — the service on the in-memory repository (Chapter 11). The clock is a parameter.
import { describe, it, expect } from 'vitest';
import { bookLab, createMemoryRepo } from './service.js';
import { listMyBookings, cancelMyBooking } from './myBookings.js';

const at = (clock) => new Date('2026-11-16T' + clock + ':00+07:00');
const an = { id: 'an', role: 'STUDENT' };
const input = (overrides = {}) => ({ lab: 'BE-201', date: '2026-11-16', start: '09:00', end: '11:00', seats: 20, role: 'STUDENT', userId: 'an', ...overrides });

describe('listMyBookings (US-11)', () => {
  it('only my bookings, by date then start (AC1)', async () => {
    const repo = createMemoryRepo();
    await bookLab(repo, input({ date: '2026-11-17', start: '08:00', end: '09:00' }));
    await bookLab(repo, input({ lab: 'BE-305', userId: 'binh' }));
    await bookLab(repo, input({ start: '13:00', end: '14:00' }));
    await bookLab(repo, input());
    const mine = await listMyBookings(repo, 'an');
    expect(mine.map((b) => b.date + ' ' + b.start)).toEqual(['2026-11-16 09:00', '2026-11-16 13:00', '2026-11-17 08:00']);
  });
});

describe('cancelMyBooking (US-11)', () => {
  it('cancels: the booking comes back CANCELLED and stays in my list (AC1, AC2)', async () => {
    const repo = createMemoryRepo();
    const { id } = await bookLab(repo, input());
    const result = await cancelMyBooking(repo, { id, user: an, now: at('07:00') });
    expect(result).toMatchObject({ ok: true, booking: { id, status: 'CANCELLED' } });
    expect((await listMyBookings(repo, 'an')).map((b) => b.status)).toEqual(['CANCELLED']);
  });

  it('a cancelled slot can be booked again (AC5)', async () => {
    const repo = createMemoryRepo();
    const { id } = await bookLab(repo, input());
    await cancelMyBooking(repo, { id, user: an, now: at('07:00') });
    await expect(bookLab(repo, input({ userId: 'binh' }))).resolves.toMatchObject({ status: 'CONFIRMED' });
  });

  it('refuses inside the last hour and changes nothing (AC2)', async () => {
    const repo = createMemoryRepo();
    const { id } = await bookLab(repo, input());
    expect(await cancelMyBooking(repo, { id, user: an, now: at('08:01') })).toEqual({ ok: false, code: 'TOO_LATE_TO_CANCEL' });
    expect((await repo.findById(id)).status).toBe('CONFIRMED');
  });

  it("someone else's booking looks missing, and stays booked (AC3)", async () => {
    const repo = createMemoryRepo();
    const { id } = await bookLab(repo, input());
    expect(await cancelMyBooking(repo, { id, user: { id: 'binh', role: 'STUDENT' }, now: at('07:00') })).toEqual({ ok: false, code: 'NOT_FOUND' });
    expect((await repo.findById(id)).status).toBe('CONFIRMED');
  });

  it('twice → ALREADY_CANCELLED the second time (AC4)', async () => {
    const repo = createMemoryRepo();
    const { id } = await bookLab(repo, input());
    await cancelMyBooking(repo, { id, user: an, now: at('07:00') });
    expect(await cancelMyBooking(repo, { id, user: an, now: at('07:00') })).toEqual({ ok: false, code: 'ALREADY_CANCELLED' });
  });

  it('two cancels at the same moment: exactly one wins (AC4)', async () => {
    const repo = createMemoryRepo();
    const { id } = await bookLab(repo, input());
    const results = await Promise.all([1, 2].map(() => cancelMyBooking(repo, { id, user: an, now: at('07:00') })));
    expect(results.map((r) => r.ok).sort()).toEqual([false, true]);
    expect(results.find((r) => !r.ok)).toEqual({ ok: false, code: 'ALREADY_CANCELLED' });
  });
});`,
  memRepo: `import { checkSlot, needsApproval } from '../rules/booking.js';

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
      return rows.find((b) => b.status !== 'CANCELLED' && b.lab === lab && b.date === date && b.start < end && start < b.end) ?? null; // a cancelled booking frees its slot (Chapter 11)
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
    async remove(id) { // Chapter 10: cancelling deletes the row and returns it (null if there was none)
      await latency();
      const i = rows.findIndex((b) => b.id === id);
      return i === -1 ? null : rows.splice(i, 1)[0];
    },
    count: () => rows.length,
    async listByUser(userId) { // Chapter 11: My bookings — one student's bookings, by date and start
      await latency();
      return rows.filter((b) => b.userId === userId).sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start)).map((b) => ({ ...b }));
    },
    async cancel(id) { // Chapter 11: CONFIRMED or PENDING → CANCELLED in one step; null if missing or already cancelled
      await latency();
      const row = rows.find((b) => b.id === id && b.status !== 'CANCELLED');
      if (!row) return null;
      row.status = 'CANCELLED';
      return { ...row };
    },
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
  pgRepo: `// The PostgreSQL adapter for the repository port (Chapter 4; Chapter 11 adds findById, listByUser, cancel). Same methods as createMemoryRepo.
import { BookingError } from './service.js';

// Chapter 11: read rows back in the API's own shape. node-postgres turns a "date" column into a JS Date at LOCAL midnight
// and a "time" column into "08:00:00" — so format them in SQL, where the value is still exactly what was stored.
const COLUMNS = "id, lab, to_char(date, 'YYYY-MM-DD') AS date, to_char(start_time, 'HH24:MI') AS start, " +
  "to_char(end_time, 'HH24:MI') AS \\"end\\", seats, role, status, minutes, email, user_id AS \\"userId\\"";

export function createPgRepo(db) {   // db: a pg Pool or a single Client — anything with .query()
  return {
    async findOverlap(lab, date, start, end) {
      const { rows } = await db.query(
        'SELECT id FROM bookings WHERE lab = $1 AND date = $2 AND start_time < $4 AND $3 < end_time' +
        " AND status <> 'CANCELLED' LIMIT 1",   // a cancelled booking frees its slot (Chapter 11)
        [lab, date, start, end]);
      return rows[0] ?? null;
    },
    async insert(b) {
      try {
        const { rows } = await db.query(
          'INSERT INTO bookings (lab, date, start_time, end_time, seats, role, status, minutes, email, user_id) ' +
          'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
          [b.lab, b.date, b.start, b.end, b.seats, b.role, b.status, b.minutes, b.email ?? null, b.userId ?? null]);
        return { id: rows[0].id, ...b };
      } catch (err) {
        if (err.code === '23P01') throw new BookingError('OVERLAP', { cause: err }); // exclusion_violation
        throw err;
      }
    },
    async findById(id) {
      const { rows } = await db.query('SELECT ' + COLUMNS + ' FROM bookings WHERE id = $1', [id]);
      return rows[0] ?? null;
    },
    async listByUser(userId) {
      const { rows } = await db.query('SELECT ' + COLUMNS + ' FROM bookings WHERE user_id = $1 ORDER BY date, start_time', [userId]);
      return rows;
    },
    async list() {
      const { rows } = await db.query('SELECT ' + COLUMNS + ' FROM bookings ORDER BY date, start_time, id');
      return rows;
    },
    async cancel(id) {   // "AND status <> 'CANCELLED'" makes check-and-change ONE statement: two cancels at once, one wins
      const { rows } = await db.query(
        "UPDATE bookings SET status = 'CANCELLED' WHERE id = $1 AND status <> 'CANCELLED' RETURNING " + COLUMNS, [id]);
      return rows[0] ?? null;
    },
  };
}`,
  schema: `-- LabFlow Lite — PostgreSQL schema (Chapter 4). Applied fresh before every integration run.
CREATE EXTENSION IF NOT EXISTS btree_gist;   -- lets "lab WITH =" join a GiST exclusion constraint

CREATE TABLE bookings (
  id         serial PRIMARY KEY,
  lab        text    NOT NULL,
  date       date    NOT NULL,
  start_time time    NOT NULL,
  end_time   time    NOT NULL,
  seats      int     NOT NULL CHECK (seats > 0),
  role       text    NOT NULL,
  status     text    NOT NULL,
  minutes    int     NOT NULL,
  email      text,
  user_id    text,              -- Chapter 11: who booked it (My bookings)
  -- BR-04 in the database: no two bookings of one lab may overlap. Bounds [) = the end minute is free.
  CONSTRAINT no_overlap EXCLUDE USING gist (
    lab WITH =,
    tsrange(date + start_time, date + end_time, '[)') WITH &&
  ) WHERE (status <> 'CANCELLED')   -- Chapter 11: a cancelled booking frees its slot
);

CREATE INDEX bookings_by_user ON bookings (user_id, date, start_time);   -- Chapter 11: GET /api/bookings`,
  apiRouter: `// My bookings over HTTP (Chapter 11, US-11). Mounted by createApp() in server.js.
//   GET  /api/bookings             → 200, my own bookings (cancelled ones too), by date and start
//   POST /api/bookings/:id/cancel  → 200 the cancelled booking · 404 missing or not mine · 409 already cancelled · 422 too late
import { listMyBookings, cancelMyBooking } from '../booking/myBookings.js';

const CANCEL_STATUS = { NOT_FOUND: 404, ALREADY_CANCELLED: 409, TOO_LATE_TO_CANCEL: 422 };
const MAX_ID = 2147483647;   // PostgreSQL "serial" is a 4-byte int: a bigger id is not a booking, it is a 500 waiting to happen

export function mountMyBookings(app, { repo, requireUser, now, fail, toPublic }) {
  app.get('/api/bookings', requireUser, async (req, res) => {
    res.json((await listMyBookings(repo, req.user.id)).map(toPublic));
  });

  app.post('/api/bookings/:id/cancel', requireUser, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1 || id > MAX_ID) return fail(res, 404, 'NOT_FOUND');
    const result = await cancelMyBooking(repo, { id, user: req.user, now: now() });
    if (!result.ok) return fail(res, CANCEL_STATUS[result.code], result.code);
    res.json(toPublic(result.booking));
  });
}`,
  apiTest: `// US-11 "My bookings" over HTTP (Chapter 11): status codes, privacy, and every response checked against openapi.json.
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { makeApi, body } from '../../test/support/api.js';
import { contractErrors } from '../../test/support/contract.js';

const at = (clock) => new Date('2026-11-16T' + clock + ':00+07:00');

// A fresh API whose clock reads \`clock\` (Viet Nam time on 16/11/2026); an has one booking, 08:00–10:00 BE-201.
async function setup(clock = '06:00') {
  const api = makeApi({ now: () => at(clock) });
  const an = await api.bearer('an');
  const created = await request(api.app).post('/api/bookings').set('Authorization', an).send(body());
  return { api, an, id: created.body.id };
}
const cancel = (api, id, auth) => request(api.app).post('/api/bookings/' + id + '/cancel').set('Authorization', auth);

describe('GET /api/bookings (US-11)', () => {
  it('200: only my bookings, cancelled ones too, as in the contract (AC1)', async () => {
    const { api, an, id } = await setup();
    await request(api.app).post('/api/bookings').set('Authorization', await api.bearer('binh')).send(body({ lab: 'BE-305' }));
    await cancel(api, id, an);
    const res = await request(api.app).get('/api/bookings').set('Authorization', an);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id, lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00', seats: 20, status: 'CANCELLED', minutes: 120 }]);
    expect(contractErrors('get', '/api/bookings', res)).toEqual([]);
  });

  it('401 without a token', async () => {
    const res = await request(makeApi().app).get('/api/bookings');
    expect(res.status).toBe(401);
    expect(contractErrors('get', '/api/bookings', res)).toEqual([]);
  });
});

describe('POST /api/bookings/:id/cancel (US-11)', () => {
  it('200 with the booking, now CANCELLED (AC2)', async () => {
    const { api, an, id } = await setup();
    const res = await cancel(api, id, an);
    expect([res.status, res.body.status]).toEqual([200, 'CANCELLED']);
    expect(contractErrors('post', '/api/bookings/{id}/cancel', res)).toEqual([]);
  });

  it.each([
    ['07:00 (60 minutes before)', 200, 'CANCELLED', '07:00'],
    ['07:01 (59 minutes before)', 422, 'TOO_LATE_TO_CANCEL', '07:01'],
  ])('Lite-3: at %s → %i %s (AC2)', async (_, status, code, clock) => {
    const { api, an, id } = await setup(clock);
    const res = await cancel(api, id, an);
    expect([res.status, res.body.status ?? res.body.error.code]).toEqual([status, code]);
    expect(contractErrors('post', '/api/bookings/{id}/cancel', res)).toEqual([]);
  });

  it.each([
    { who: 'binh', role: 'STUDENT', status: 404, ac: 'AC3' },
    { who: 'thay', role: 'LECTURER', status: 404, ac: 'AC3' },
    { who: 'boss', role: 'ADMIN', status: 200, ac: 'AC6' },
  ])('$who ($role) cancelling an’s booking → $status ($ac)', async ({ who, role, status }) => {
    const { api, id } = await setup();
    const res = await cancel(api, id, await api.bearer(who, role));
    expect(res.status).toBe(status);
    expect(contractErrors('post', '/api/bookings/{id}/cancel', res)).toEqual([]);
  });

  it('an admin may cancel inside the last hour (AC6)', async () => {
    const { api, id } = await setup('07:30');
    expect((await cancel(api, id, await api.bearer('boss', 'ADMIN'))).status).toBe(200);
  });

  it('409 ALREADY_CANCELLED the second time (AC4)', async () => {
    const { api, an, id } = await setup();
    await cancel(api, id, an);
    const res = await cancel(api, id, an);
    expect([res.status, res.body.error.code]).toEqual([409, 'ALREADY_CANCELLED']);
    expect(contractErrors('post', '/api/bookings/{id}/cancel', res)).toEqual([]);
  });

  it.each(['999', 'abc', '0', '-1', '1.5', '2147483648'])('id %s → 404, never 500', async (raw) => {
    const { api, an } = await setup();
    const res = await cancel(api, raw, an);
    expect([res.status, res.body.error.code]).toEqual([404, 'NOT_FOUND']);
  });

  it('401 without a token, and the booking is untouched', async () => {
    const { api, an, id } = await setup();
    const res = await request(api.app).post('/api/bookings/' + id + '/cancel');
    expect(res.status).toBe(401);
    expect((await request(api.app).get('/api/bookings/' + id).set('Authorization', an)).body.status).toBe('CONFIRMED');
  });

  it('after cancelling, the same slot can be booked again: 201 (AC5)', async () => {
    const { api, an, id } = await setup();
    await cancel(api, id, an);
    const again = await request(api.app).post('/api/bookings').set('Authorization', await api.bearer('binh')).send(body());
    expect(again.status).toBe(201);
  });
});`,
  server: `// LabFlow Lite HTTP API (Chapter 5). Express 5: errors thrown in async handlers reach the error middleware.
import express from 'express';
import { bookLab, BookingError } from '../booking/service.js';
import { BookingInput } from './schemas.js';
import { mountMyBookings } from './myBookings.js';

const RULE_CODES = ['OFF_GRID', 'END_BEFORE_START', 'OUTSIDE_HOURS', 'TOO_LONG'];
const fail = (res, status, code, extra = {}) => res.status(status).json({ error: { code, ...extra } });
const toPublic = (b) => ({ id: b.id, lab: b.lab, date: b.date, start: b.start, end: b.end, seats: b.seats, status: b.status, minutes: b.minutes });

export function createApp({ repo, auth, now = () => new Date() }) {   // now: the clock, for cancelling (Chapter 11)
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

  mountMyBookings(app, { repo, requireUser, now, fail, toPublic });   // Chapter 11: GET /api/bookings, POST /api/bookings/:id/cancel

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
  openapi: `{
  "openapi": "3.1.0",
  "info": { "title": "LabFlow Lite API", "version": "1.1.0" },
  "paths": {
    "/api/bookings": {
      "post": {
        "summary": "Book a lab",
        "responses": {
          "201": { "description": "Created", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Booking" } } } },
          "400": { "description": "Malformed request", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Error" } } } },
          "401": { "description": "No valid token", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Error" } } } },
          "409": { "description": "Slot taken", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Error" } } } },
          "422": { "description": "Against a booking rule", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Error" } } } }
        }
      },
      "get": {
        "summary": "My bookings, by date and start — cancelled ones too (US-11)",
        "responses": {
          "200": { "description": "OK", "content": { "application/json": { "schema": { "type": "array", "items": { "$ref": "#/components/schemas/Booking" } } } } },
          "401": { "description": "No valid token", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Error" } } } }
        }
      }
    },
    "/api/bookings/{id}": {
      "get": {
        "summary": "One of my bookings",
        "responses": {
          "200": { "description": "OK", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Booking" } } } },
          "401": { "description": "No valid token", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Error" } } } },
          "404": { "description": "Missing, or not mine", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Error" } } } }
        }
      }
    },
    "/api/bookings/{id}/cancel": {
      "post": {
        "summary": "Cancel one of my bookings (US-11, Lite-3)",
        "responses": {
          "200": { "description": "Cancelled", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Booking" } } } },
          "401": { "description": "No valid token", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Error" } } } },
          "404": { "description": "Missing, or not mine", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Error" } } } },
          "409": { "description": "Already cancelled", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Error" } } } },
          "422": { "description": "Less than 60 minutes before the start", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Error" } } } }
        }
      }
    },
    "/api/admin/bookings": {
      "get": {
        "summary": "All bookings (ADMIN)",
        "responses": {
          "200": { "description": "OK", "content": { "application/json": { "schema": { "type": "array", "items": { "$ref": "#/components/schemas/Booking" } } } } },
          "401": { "description": "No valid token", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Error" } } } },
          "403": { "description": "Not an admin", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Error" } } } }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Booking": {
        "type": "object",
        "additionalProperties": false,
        "required": ["id", "lab", "date", "start", "end", "seats", "status", "minutes"],
        "properties": {
          "id": { "type": "integer", "minimum": 1 },
          "lab": { "type": "string", "pattern": "^[A-Z]{2}-[0-9]{3}$" },
          "date": { "type": "string", "format": "date" },
          "start": { "type": "string", "pattern": "^[0-2][0-9]:[0-5][0-9]$" },
          "end": { "type": "string", "pattern": "^[0-2][0-9]:[0-5][0-9]$" },
          "seats": { "type": "integer", "minimum": 1 },
          "status": { "enum": ["CONFIRMED", "PENDING", "CANCELLED"] },
          "minutes": { "type": "integer", "minimum": 30 }
        }
      },
      "Error": {
        "type": "object",
        "additionalProperties": false,
        "required": ["error"],
        "properties": {
          "error": {
            "type": "object",
            "required": ["code"],
            "properties": {
              "code": { "type": "string", "pattern": "^[A-Z_]+$" },
              "details": { "type": "array", "items": { "type": "object", "required": ["path", "message"] } }
            }
          }
        }
      }
    }
  }
}`,
  intTest: `// US-11 "My bookings" on a real PostgreSQL (Chapter 11). Three things only the real database can show:
// how node-postgres hands back "date" and "time" columns, whether "cancel" is one atomic step, and the exclusion constraint.
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { bookLab } from '../../src/booking/service.js';
import { createPgRepo } from '../../src/booking/pgRepo.js';
import { cancelMyBooking } from '../../src/booking/myBookings.js';
import { createApp } from '../../src/api/server.js';
import { createAuth } from '../../src/api/auth.js';
import { contractErrors } from '../support/contract.js';
import { openPool } from '../support/db.js';

let pool;
let repo;
beforeAll(async () => {
  pool = openPool();
  repo = createPgRepo(pool);
  await pool.query('TRUNCATE bookings RESTART IDENTITY');   // rows of other test files are committed: clear once (lesson 4.4)
});
beforeEach(() => pool.query('TRUNCATE bookings RESTART IDENTITY'));
afterAll(() => pool.end());

const at = (clock) => new Date('2026-11-16T' + clock + ':00+07:00');
const an = { id: 'an', role: 'STUDENT' };
const input = (overrides = {}) => ({ lab: 'BE-201', date: '2026-11-16', start: '09:00', end: '11:00', seats: 20, role: 'STUDENT', userId: 'an', ...overrides });

describe('pgRepo — reading bookings back (US-11)', () => {
  it('listByUser: my rows only, in the API shape, by date and start (AC1)', async () => {
    await bookLab(repo, input({ date: '2026-11-17', start: '08:00', end: '09:00' }));
    await bookLab(repo, input({ lab: 'BE-305', userId: 'binh' }));
    await bookLab(repo, input());
    const mine = await repo.listByUser('an');
    expect(mine).toEqual([
      expect.objectContaining({ lab: 'BE-201', date: '2026-11-16', start: '09:00', end: '11:00', userId: 'an', status: 'CONFIRMED' }),
      expect.objectContaining({ date: '2026-11-17', start: '08:00', end: '09:00' }),
    ]);
  });
});

describe('cancelling in PostgreSQL (US-11)', () => {
  it('two cancels at the same moment: one wins, one ALREADY_CANCELLED (AC4)', async () => {
    const { id } = await bookLab(repo, input());
    await Promise.all([pool.query('SELECT 1'), pool.query('SELECT 1')]);   // two warm connections, so the race really happens (lesson 4.4)
    const results = await Promise.all([1, 2].map(() => cancelMyBooking(repo, { id, user: an, now: at('07:00') })));
    expect(results.map((r) => (r.ok ? 'ok' : r.code)).sort()).toEqual(['ALREADY_CANCELLED', 'ok']);
  });

  it('a cancelled slot can be booked again — the exclusion constraint ignores CANCELLED rows (AC5)', async () => {
    const { id } = await bookLab(repo, input());
    await cancelMyBooking(repo, { id, user: an, now: at('07:00') });
    await expect(bookLab(repo, input({ userId: 'binh' }))).resolves.toMatchObject({ status: 'CONFIRMED' });
  });

  it('the constraint still refuses an overlap with a live booking (BR-04)', async () => {
    await bookLab(repo, input());
    const blindRepo = { ...repo, findOverlap: async () => null };   // skip the check: only the database is left
    await expect(bookLab(blindRepo, input({ userId: 'binh', start: '10:00', end: '12:00' }))).rejects.toMatchObject({ code: 'OVERLAP' });
  });
});

describe('the API on PostgreSQL, checked against openapi.json (US-11)', () => {
  let app;
  let auth;
  beforeAll(() => {
    auth = createAuth({ secret: 'int-test-secret', now: () => at('06:00') });
    app = createApp({ repo, auth, now: () => at('06:00') });
  });
  const bearer = async (id, role = 'STUDENT') => 'Bearer ' + (await auth.sign({ id, role }));

  it('book → list → cancel → list: every response is in the contract (AC1, AC2)', async () => {
    const token = await bearer('an');
    const booking = { lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00', seats: 20 };
    const created = await request(app).post('/api/bookings').set('Authorization', token).send(booking);
    const list = await request(app).get('/api/bookings').set('Authorization', token);
    const cancelled = await request(app).post('/api/bookings/' + created.body.id + '/cancel').set('Authorization', token);
    const after = await request(app).get('/api/bookings').set('Authorization', token);
    expect([created.status, list.status, cancelled.status, after.status]).toEqual([201, 200, 200, 200]);
    expect(list.body).toEqual([{ id: 1, ...booking, status: 'CONFIRMED', minutes: 120 }]);
    expect(after.body[0].status).toBe('CANCELLED');
    expect([
      ...contractErrors('get', '/api/bookings', list),
      ...contractErrors('post', '/api/bookings/{id}/cancel', cancelled),
    ]).toEqual([]);
  });

  it.each(['2147483647', '2147483648', 'abc'])('cancel id %s → 404, not a database error', async (raw) => {
    const res = await request(app).post('/api/bookings/' + raw + '/cancel').set('Authorization', await bearer('an'));
    expect(res.status).toBe(404);
  });
});`,
  web: `'use client';
// My bookings (Chapter 11, US-11): the student's own bookings, with a Cancel button on each one that is still active.
// The server decides who may cancel and until when (Lite-3); this screen shows what it answered.
import { useCallback, useEffect, useState } from 'react';

export const CANCEL_MESSAGES = {
  TOO_LATE_TO_CANCEL: 'Too late to cancel: the booking starts in less than 1 hour.',
  ALREADY_CANCELLED: 'This booking was already cancelled.',
  NOT_FOUND: 'This booking no longer exists.',
};

export function MyBookings({ client }) {
  const [state, setState] = useState({ phase: 'loading' });
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState(null);

  const load = useCallback(async () => {
    setState({ phase: 'loading' });
    try {
      const res = await client.listMine();
      setState(res.status === 200 ? { phase: 'done', bookings: res.data } : { phase: 'failed' });
    } catch {
      setState({ phase: 'failed' });
    }
  }, [client]);

  useEffect(() => { load(); }, [load]);

  const replace = (row) => setState((s) => ({ ...s, bookings: s.bookings.map((b) => (b.id === row.id ? row : b)) }));

  async function cancel(booking) {
    setBusyId(booking.id);
    setNotice(null);
    try {
      const res = await client.cancelBooking(booking.id);
      if (res.status === 200) {
        replace(res.data);
        setNotice({ ok: true, text: 'Cancelled ' + booking.lab + ' on ' + booking.date + ', ' + booking.start + '–' + booking.end + '.' });
      } else {
        const code = res.data.error.code;
        if (code === 'ALREADY_CANCELLED') replace({ ...booking, status: 'CANCELLED' });   // the server knows better: show it
        setNotice({ ok: false, text: CANCEL_MESSAGES[code] ?? 'Could not cancel. Try again.' });
      }
    } catch {
      setNotice({ ok: false, text: 'Cannot reach the server. Check your connection.' });
    } finally {
      setBusyId(null);
    }
  }

  if (state.phase === 'loading') return <p role="status">Loading your bookings…</p>;
  if (state.phase === 'failed') {
    return (
      <div role="alert">
        <p>Could not load your bookings.</p>
        <button type="button" onClick={load}>Try again</button>
      </div>
    );
  }
  if (state.bookings.length === 0) return <p>You have no bookings yet.</p>;
  return (
    <>
      <table aria-label="My bookings">
        <thead><tr><th>Lab</th><th>Date</th><th>Time</th><th>Seats</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {state.bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.lab}</td><td>{b.date}</td><td>{b.start}–{b.end}</td><td>{b.seats}</td><td>{b.status}</td>
              <td>
                {b.status !== 'CANCELLED' && (
                  <button type="button" disabled={busyId !== null} aria-label={'Cancel ' + b.lab + ' on ' + b.date + ' at ' + b.start}
                    onClick={() => cancel(b)}>
                    {busyId === b.id ? 'Cancelling…' : 'Cancel'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {notice && <p role={notice.ok ? 'status' : 'alert'}>{notice.text}</p>}
    </>
  );
}`,
  webTest: `// US-11 "My bookings" — the screen (Chapter 11). A stub client, like AdminBookings.test.jsx: no server, no network.
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyBookings } from './MyBookings.jsx';
import { ROW, deferred } from './support.jsx';

const LATER = { ...ROW, id: 2, lab: 'BE-305', start: '13:00', end: '15:00' };
const GONE = { ...ROW, id: 3, lab: 'AL-101', status: 'CANCELLED' };
const cancelButton = (b) => screen.getByRole('button', { name: 'Cancel ' + b.lab + ' on ' + b.date + ' at ' + b.start });

// listMine answers once with these rows; cancelBooking answers with \`answer\` (a value, or a function of the id).
function client(rows, answer) {
  return {
    listMine: vi.fn(async () => ({ status: 200, data: rows })),
    cancelBooking: vi.fn(async (id) => (typeof answer === 'function' ? answer(id) : answer)),
  };
}

describe('MyBookings screen (US-11)', () => {
  it('one row per booking; a cancelled one has no Cancel button (AC1)', async () => {
    render(<MyBookings client={client([ROW, LATER, GONE])} />);
    const table = await screen.findByRole('table', { name: 'My bookings' });
    expect(within(table).getAllByRole('row')).toHaveLength(4);
    expect(within(table).getAllByRole('button')).toHaveLength(2);
    expect(within(table).getByRole('row', { name: /AL-101/ })).toHaveTextContent('CANCELLED');
  });

  it('Cancel → the row says CANCELLED, the button is gone, and the user is told (AC2)', async () => {
    const user = userEvent.setup();
    const api = client([ROW, LATER], (id) => ({ status: 200, data: { ...ROW, id, status: 'CANCELLED' } }));
    render(<MyBookings client={api} />);
    await user.click(await screen.findByRole('button', { name: 'Cancel BE-201 on 2026-11-16 at 08:00' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Cancelled BE-201 on 2026-11-16, 08:00–10:00.');
    expect(screen.getByRole('row', { name: /BE-201/ })).toHaveTextContent('CANCELLED');
    expect(screen.queryByRole('button', { name: /^Cancel BE-201/ })).not.toBeInTheDocument();
    expect(api.cancelBooking).toHaveBeenCalledWith(1);
  });

  it('while cancelling: “Cancelling…”, every Cancel disabled, one request for a double click', async () => {
    const user = userEvent.setup();
    const answer = deferred();
    const api = client([ROW, LATER], () => answer.promise);
    render(<MyBookings client={api} />);
    const button = await screen.findByRole('button', { name: /^Cancel BE-201/ });
    await user.dblClick(button);
    expect(button).toHaveTextContent('Cancelling…');
    expect(button).toBeDisabled();
    expect(cancelButton(LATER)).toBeDisabled();
    answer.resolve({ status: 200, data: { ...ROW, status: 'CANCELLED' } });
    expect(await screen.findByRole('status')).toBeInTheDocument();
    expect(cancelButton(LATER)).toBeEnabled();
    expect(api.cancelBooking).toHaveBeenCalledTimes(1);
  });

  it('422 TOO_LATE_TO_CANCEL → an alert, and the booking stays as it was (AC2)', async () => {
    const user = userEvent.setup();
    render(<MyBookings client={client([ROW], { status: 422, data: { error: { code: 'TOO_LATE_TO_CANCEL' } } })} />);
    await user.click(await screen.findByRole('button', { name: /^Cancel BE-201/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Too late to cancel: the booking starts in less than 1 hour.');
    expect(screen.getByRole('row', { name: /BE-201/ })).toHaveTextContent('CONFIRMED');
    expect(cancelButton(ROW)).toBeEnabled();
  });

  it('409 ALREADY_CANCELLED → the row shows what the server knows (AC4)', async () => {
    const user = userEvent.setup();
    render(<MyBookings client={client([ROW], { status: 409, data: { error: { code: 'ALREADY_CANCELLED' } } })} />);
    await user.click(await screen.findByRole('button', { name: /^Cancel BE-201/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('This booking was already cancelled.');
    expect(screen.getByRole('row', { name: /BE-201/ })).toHaveTextContent('CANCELLED');
  });

  it('no network → “Cannot reach the server”', async () => {
    const user = userEvent.setup();
    const api = client([ROW]);
    api.cancelBooking = vi.fn(async () => { throw new TypeError('Failed to fetch'); });
    render(<MyBookings client={api} />);
    await user.click(await screen.findByRole('button', { name: /^Cancel BE-201/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Cannot reach the server. Check your connection.');
  });

  it('an empty list says so', async () => {
    render(<MyBookings client={client([])} />);
    expect(await screen.findByText('You have no bookings yet.')).toBeInTheDocument();
  });

  it('a failed load offers Try again, and it works', async () => {
    const user = userEvent.setup();
    const api = client([ROW]);
    api.listMine = vi.fn().mockResolvedValueOnce({ status: 500, data: {} }).mockResolvedValueOnce({ status: 200, data: [ROW] });
    render(<MyBookings client={api} />);
    await user.click(await screen.findByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('table', { name: 'My bookings' })).toBeInTheDocument();
  });
});`,
  webApi: `// The browser side of the LabFlow Lite API (Chapter 6). fetch is a parameter, like the clock in Chapter 2.
export function createClient({ token, baseUrl = '', fetch: send = (...args) => globalThis.fetch(...args) }) {
  async function call(method, path, body) {
    const headers = { Authorization: 'Bearer ' + token };
    if (body) headers['Content-Type'] = 'application/json';
    const res = await send(baseUrl + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
    return { status: res.status, data: await res.json() };
  }
  return {
    createBooking: (input) => call('POST', '/api/bookings', input),
    getBooking: (id) => call('GET', '/api/bookings/' + id),
    listAll: () => call('GET', '/api/admin/bookings'),
    listMine: () => call('GET', '/api/bookings'),                          // Chapter 11: My bookings
    cancelBooking: (id) => call('POST', '/api/bookings/' + id + '/cancel'),
  };
}`,
  app: `// The LabFlow Lite web app (Chapter 7): sign in, then book a lab — or, as an admin, see every booking.
import { useState } from 'react';
import { createClient } from '../api.js';
import { BookingForm } from '../BookingForm.jsx';
import { AdminBookings } from '../AdminBookings.jsx';
import { MyBookings } from '../MyBookings.jsx';
import { LoginForm } from './LoginForm.jsx';

const KEY = 'labflow.session';

function loadSession() {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
}

// Chapter 11: a student has two pages — book a lab (/) and My bookings (/my-bookings). Plain links: no router needed.
function StudentPages({ client }) {
  const mine = window.location.pathname === '/my-bookings';
  return (
    <>
      <nav aria-label="Pages">
        <a href="/" aria-current={mine ? undefined : 'page'}>Book a lab</a> · <a href="/my-bookings" aria-current={mine ? 'page' : undefined}>My bookings</a>
      </nav>
      {mine
        ? (<><h2>My bookings</h2><MyBookings client={client} /></>)
        : (<><h2>Book a lab</h2><BookingForm onSubmit={client.createBooking} /></>)}
    </>
  );
}

export function App() {
  const [session, setSession] = useState(loadSession);

  function signIn(next) {
    localStorage.setItem(KEY, JSON.stringify(next));
    setSession(next);
  }
  function signOut() {
    localStorage.removeItem(KEY);
    setSession(null);
  }

  if (!session) {
    return (<><header><h1>LabFlow Lite</h1></header><main><LoginForm onLogin={signIn} /></main></>);
  }
  const client = createClient({ token: session.token });
  return (
    <>
      <header>
        <h1>LabFlow Lite</h1>
        <span>Signed in as {session.user.id} ({session.user.role}) <button type="button" onClick={signOut}>Sign out</button></span>
      </header>
      <main>
        {session.user.role === 'ADMIN'
          ? (<><h2>All bookings</h2><AdminBookings client={client} /></>)
          : (<StudentPages client={client} />)}
      </main>
    </>
  );
}`,
  e2e: `// US-11 "My bookings", end to end (Chapter 11): book → see it in My bookings → cancel → the slot is free again.
// The server runs on the real clock, so the booking is a few days ahead of TODAY (Lite-3 needs ≥ 60 minutes).
import { test, expect } from '@playwright/test';
import { book, freshLab } from './helpers.js';

// "YYYY-MM-DD" n days from now, in Viet Nam time (UTC+7), like daysAheadVN in Chapter 2.
const daysFromNow = (n) => new Date(Date.now() + 7 * 3600e3 + n * 86400e3).toISOString().slice(0, 10);

test.use({ storageState: 'playwright/.auth/an.json' });

test('cancel a booking from My bookings, then book the same slot again (US-11 AC1, AC2, AC5)', async ({ page }, testInfo) => {
  const lab = freshLab(testInfo);
  const date = daysFromNow(3);
  await page.goto('/');
  await book(page, { lab, date, start: '13:00', end: '15:00' });
  await expect(page.getByRole('status')).toHaveText('Booked. See you in ' + lab + '.');

  await page.getByRole('link', { name: 'My bookings' }).click();
  const row = page.getByRole('row', { name: new RegExp(lab) });
  await expect(row).toContainText('CONFIRMED');
  await row.getByRole('button', { name: 'Cancel ' + lab + ' on ' + date + ' at 13:00' }).click();
  await expect(page.getByRole('status')).toHaveText('Cancelled ' + lab + ' on ' + date + ', 13:00–15:00.');
  await expect(row).toContainText('CANCELLED');

  await page.reload();   // what the server stored, not what the screen remembers
  await expect(page.getByRole('row', { name: new RegExp(lab) })).toContainText('CANCELLED');

  await page.getByRole('link', { name: 'Book a lab' }).click();
  await book(page, { lab, date, start: '13:00', end: '15:00' });
  await expect(page.getByRole('status')).toHaveText('Booked. See you in ' + lab + '.');
});`,
  helpers: `// Helpers shared by the end-to-end tests (Chapter 7).
import { createHash } from 'node:crypto';

export const PASSWORD = 'labflow-demo';

export async function signIn(page, username) {
  await page.goto('/');
  await page.getByLabel('Username', { exact: true }).fill(username);
  await page.getByLabel('Password', { exact: true }).fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
}

export async function book(page, { lab = 'BE-201', date = '2026-11-16', start = '08:00', end = '10:00', seats = '20' } = {}) {
  await page.getByLabel('Lab', { exact: true }).fill(lab);
  await page.getByLabel('Date', { exact: true }).fill(date);
  await page.getByLabel('Start', { exact: true }).fill(start);
  await page.getByLabel('End', { exact: true }).fill(end);
  await page.getByLabel('Seats', { exact: true }).fill(seats);
  await page.getByRole('button', { name: 'Book' }).click();
}

// A lab code of its own for every test, every repeat and every retry: tests running in parallel never share a slot (lesson 7.3).
// Lesson 11.3: "QA-100…999" was only 900 codes — 25 tests had a 28% chance that two of them share one (the birthday problem),
// and renaming a test changed its testId, its code, and made an old test flaky. Two letters × 900 numbers = 608,400 codes.
const SPACE = 26 * 26 * 900;
export function freshLab(testInfo) {
  const key = [testInfo.testId, testInfo.repeatEachIndex, testInfo.retry].join('/');
  const n = parseInt(createHash('sha256').update(key).digest('hex').slice(0, 12), 16) % SPACE;
  const letters = String.fromCharCode(65 + Math.floor(n / 900 / 26), 65 + (Math.floor(n / 900) % 26));
  const lab = letters + '-' + String(100 + (n % 900));
  testInfo.annotations.push({ type: 'lab', description: lab });   // lesson 11.3: the report says which lab each test used
  return lab;
}`,
  req: `{
  "release": "LabFlow Lite 1.1 — My bookings and cancel (US-11)",
  "requirements": [
    { "id": "BR-04", "risk": "High", "inScope": true, "text": "30-minute grid inside 07:00–21:00; two bookings of one lab never overlap" },
    { "id": "BR-05", "risk": "Medium", "inScope": true, "text": "At most 14 days ahead, counted in Viet Nam's calendar" },
    { "id": "BR-06", "risk": "High", "inScope": true, "text": "A student's booking for more than 30 seats waits for approval" },
    { "id": "Lite-1", "risk": "Low", "inScope": true, "text": "A booking lasts at most 4 hours" },
    { "id": "Lite-2", "risk": "Medium", "inScope": true, "text": "Lecturers and admins never need approval" },
    { "id": "Lite-3", "risk": "High", "inScope": true, "text": "A booking can be cancelled until 60 minutes before it starts (Viet Nam time)" },
    { "id": "US-11 AC1", "risk": "High", "inScope": true, "text": "My bookings lists only my own bookings, by date and start, cancelled ones too" },
    { "id": "US-11 AC2", "risk": "High", "inScope": true, "text": "I can cancel my own booking until 60 minutes before it starts; at 59 minutes: TOO_LATE_TO_CANCEL" },
    { "id": "US-11 AC3", "risk": "High", "inScope": true, "text": "Someone else's booking looks missing (404): nobody learns it exists" },
    { "id": "US-11 AC4", "risk": "Medium", "inScope": true, "text": "Cancelling twice — even at the same moment — succeeds once: ALREADY_CANCELLED" },
    { "id": "US-11 AC5", "risk": "High", "inScope": true, "text": "A cancelled slot can be booked again" },
    { "id": "US-11 AC6", "risk": "Low", "inScope": true, "text": "An admin may cancel any booking, at any time" },
    { "id": "BR-02", "risk": "High", "inScope": false, "text": "5 wrong passwords in a row lock the account for 15 minutes (library only; the demo login does not use it)" },
    { "id": "BR-07", "risk": "Medium", "inScope": false, "text": "Check-in window (library only, no endpoint yet)" },
    { "id": "BR-08", "risk": "Medium", "inScope": false, "text": "No-show ban (library only, no endpoint yet)" },
    { "id": "BR-09", "risk": "Medium", "inScope": false, "text": "Waitlist (library only, no endpoint yet)" },
    { "id": "BR-10", "risk": "Low", "inScope": false, "text": "Weekly series for lecturers (library only, no endpoint yet)" }
  ]
}`,
  plan: `# Test plan — LabFlow Lite 1.1: My bookings and cancel (US-11)

Owner: the LabFlow Lite team · Lesson 11.1 of the Testing course · Every number below was measured on this repository.

## 1. Scope

**In scope (release 1.1).** US-11 "My bookings": a student lists their own bookings and cancels one —
\`GET /api/bookings\`, \`POST /api/bookings/:id/cancel\`, the PostgreSQL adapter (\`findById\`, \`listByUser\`, \`cancel\`, the exclusion
constraint that now ignores cancelled rows), the \`MyBookings\` screen and the \`/my-bookings\` page. Regression of what US-11 touches:
booking a lab (BR-04, BR-05, BR-06, Lite-1, Lite-2) and the existing API.

**Out of scope.** BR-02 (account lock-out — the demo login does not use it), BR-07/BR-08 (check-in, no-show ban), BR-09 (waitlist),
BR-10 (weekly series): they exist as tested library code, but no endpoint calls them in 1.1. Load and security testing beyond
authorisation. Browsers other than Chromium on pull requests (the five run every night).

| Requirement | Risk | What it says |
|---|---|---|
| BR-04 | High | 30-minute grid inside 07:00–21:00; two bookings of one lab never overlap |
| BR-05 | Medium | At most 14 days ahead, counted in Viet Nam's calendar |
| BR-06 | High | A student's booking for more than 30 seats waits for approval |
| Lite-1 | Low | A booking lasts at most 4 hours |
| Lite-2 | Medium | Lecturers and admins never need approval |
| Lite-3 | High | A booking can be cancelled until 60 minutes before it starts (Viet Nam time) |
| US-11 AC1 | High | My bookings lists only my own bookings, by date and start, cancelled ones too |
| US-11 AC2 | High | I can cancel my own booking until 60 minutes before it starts; at 59 minutes: TOO_LATE_TO_CANCEL |
| US-11 AC3 | High | Someone else's booking looks missing (404): nobody learns it exists |
| US-11 AC4 | Medium | Cancelling twice — even at the same moment — succeeds once: ALREADY_CANCELLED |
| US-11 AC5 | High | A cancelled slot can be booked again |
| US-11 AC6 | Low | An admin may cancel any booking, at any time |

## 2. Risks

Score = likelihood × impact (1 low … 3 high). High = 6 or more: it needs a test above the Unit layer.

| # | Risk | L | I | Score | Where we test it |
|---|---|---:|---:|---:|---|
| R1 | Cancelling at the wrong minute: Lite-3 read in the server's time zone, not Viet Nam's | 3 | 3 | 9 | Unit decision table (60 / 59 minutes), Stryker in UTC, nightly unit run in Asia/Ho_Chi_Minh |
| R2 | A student sees or cancels someone else's booking (AC1, AC3) | 2 | 3 | 6 | API tests per role, contract test, E2E |
| R3 | PostgreSQL keeps a cancelled slot blocked (AC5) — the in-memory repository cannot show it | 3 | 2 | 6 | DB integration on PostgreSQL 17 |
| R4 | PostgreSQL hands dates back as JS Dates: the API breaks its contract (AC1) | 3 | 2 | 6 | DB integration + openapi.json check on the PostgreSQL-backed API |
| R5 | Changing the overlap query breaks booking (BR-04, BR-06) | 2 | 3 | 6 | Existing unit/DB suites, mutation testing, E2E |
| R6 | Two cancels at the same moment both succeed (AC4) | 2 | 2 | 4 | DB race test with two warm connections |
| R7 | The screen calls the wrong URL — every component test uses a stub client | 1 | 3 | 3 | One E2E journey |
| R8 | The user is not told what happened, or clicks twice (AC2) | 2 | 1 | 2 | Component tests (Testing Library) |

## 3. Approach — the test pyramid and its budget

| Layer | Tests | One run (median of 3) | Proves |
|---|---:|---:|---|
| Unit + API (\`npm run test:unit\`) | 299 | 1.6 s | rules, services, HTTP status codes, roles, the contract |
| UI components (\`npm run test:web\`) | 24 | 2.3 s | what the user sees in every state |
| DB integration (\`npm run test:int\`) | 19 | 1.5 s (database already running; Testcontainers adds its start-up) | SQL, constraints, races, data shapes |
| E2E, Chromium (\`npm run test:e2e\`) | 8 | 4.2 s | the wiring: screen → API → storage |
| E2E, 5 browsers/devices (nightly) | 40 | 24.1 s | browser and device differences |
| Mutation, \`src/rules\` (\`npm run test:mutation\`) | 433 mutants | 28.7 s | that the tests would notice a bug |

Budget: everything a developer runs before pushing (unit, UI, DB) stays **under 15 s**; the pull-request pipeline stays
**under 10 minutes** (rehearsed with act on a laptop: 8 min 48 s with a warm npm cache, 11 min cold — installing Chromium with its
system libraries is 6½ of those minutes); anything slower goes to the nightly run. New E2E tests only for journeys no lower layer
can see.

## 4. Environments and test data

Node 22.12+, Vitest 5, Testing Library (jsdom), Playwright 1.64 (Chromium on pull requests), PostgreSQL 17 (Testcontainers,
or \`TEST_DATABASE_URL\`), GitHub Actions (rehearsed locally with act). Data: every test builds its own — a fresh in-memory
repository, \`TRUNCATE\` per integration test, a lab code of its own per E2E test (\`freshLab\`). Clocks are injected (\`now\`);
E2E bookings are a few days after today, never a fixed date.

## 5. Entry criteria

- US-11's six acceptance criteria are agreed and written in \`test-plan/requirements.json\`.
- The feature branch builds, \`npm ci\` succeeds from the lockfile, the existing suites are green on \`main\`.
- Docker (or a PostgreSQL 17 URL) and Chromium are available to whoever runs the tests.

## 6. Exit criteria

- \`ci-ok\` is green: unit (Node 22 and 24), UI, DB, E2E (Chromium), mutation and the quality report.
- Coverage at least 97% lines, 91% branches, 96% functions, 97% statements; mutation score at least 95% on \`src/rules\`.
- Traceability: every in-scope requirement has a passing test; every High-risk one has one above the Unit layer.
- No open defect of High severity. A Medium one may ship with an owner and a date (see section 9).
- The last nightly run (5 browsers, shuffled order, Viet Nam time zone) is green.

## 7. Traceability

A test proves a requirement when its name carries the id — \`(BR-04)\`, \`(Lite-3, AC2)\`, or \`(US-11)\` on the describe and
\`(AC4)\` on the test. Tag the narrowest test, never a whole describe. \`node scripts/rtm.mjs --run\` prints the matrix from the
reports of the tests that really ran; the \`report\` job of the pipeline turns any gap into a red \`ci-ok\`.

## 8. Definition of done

A story is done when: every acceptance criterion has a passing test tagged with its id; the tests were reviewed with the
checklist of lesson 10.3; \`openapi.json\` describes every new status code; \`ci-ok\` is green; no \`.only\` or skipped test was
added; this plan is updated (scope, risks, numbers).

## 9. Known defects and accepted risks

| Id | Found | Severity | Description | Decision |
|---|---|---|---|---|
| LF-301 | While building the traceability matrix | Medium | BR-05 is tested only as a pure function: \`POST /api/bookings\` never calls it, so a booking 30 days ahead is accepted (201) | Accepted for 1.1 — owner: backend, fix in 1.2 with an API test first |`,
  rtm: `// Requirements traceability matrix (lesson 11.1): which passing tests prove which requirement, at which layer.
// The convention: a test proves a requirement when its full name (describe titles + test title) carries the requirement's id —
// "BR-04", "Lite-3", or "US-11" followed by acceptance criteria ("AC2", "AC2–AC5", "AC4, AC5").
export const LAYERS = ['Unit', 'API', 'DB', 'UI', 'E2E'];

export function layerOf(file) {
  if (/(^|\\/)src\\/ci\\//.test(file)) return null;   // tests of the CI tooling itself — their names quote ids as DATA (lesson 11.4)
  if (/(^|\\/)src\\/api\\//.test(file)) return 'API';
  if (/(^|\\/)test\\/integration\\//.test(file)) return 'DB';
  if (/(^|\\/)web\\//.test(file)) return 'UI';
  if (/(^|\\/)e2e\\//.test(file)) return 'E2E';
  return 'Unit';
}

export function tagsOf(name) {
  const tags = new Set(name.match(/\\b(BR-\\d{2}|Lite-\\d+)\\b/g) ?? []);
  const story = /\\bUS-11\\b(.*)/.exec(name);
  if (story) {
    for (const [, from, to] of story[1].matchAll(/\\bAC(\\d+)(?:\\s*[–-]\\s*AC(\\d+))?/g)) {
      for (let n = Number(from); n <= Number(to ?? from); n++) tags.add('US-11 AC' + n);
    }
  }
  return [...tags];
}

// Vitest --reporter=json → [{ file, name, passed }]; root is cut from absolute paths.
export function testsFromVitest(report, root = '') {
  return report.testResults.flatMap((f) => f.assertionResults.map((t) => ({
    file: f.name.startsWith(root) ? f.name.slice(root.length).replace(/^\\//, '') : f.name,
    name: t.fullName,
    passed: t.status === 'passed',
  })));
}

// Playwright --reporter=json → the same shape (the "setup" project is not a test of the product).
export function testsFromPlaywright(report) {
  const out = [];
  const walk = (suite, titles) => {
    for (const spec of suite.specs ?? []) {
      for (const t of spec.tests.filter((x) => x.projectName !== 'setup')) {
        out.push({ file: spec.file, name: [...titles, spec.title].join(' '), passed: t.status === 'expected' || t.status === 'flaky' });
      }
    }
    for (const child of suite.suites ?? []) walk(child, [...titles, child.title]);
  };
  for (const fileSuite of report.suites) walk(fileSuite, []);   // the top-level suites are the files
  return out;
}

export function buildMatrix(requirements, tests) {
  return requirements.map((r) => {
    const counts = Object.fromEntries(LAYERS.map((l) => [l, 0]));
    for (const t of tests) if (t.passed && layerOf(t.file) && tagsOf(t.name).includes(r.id)) counts[layerOf(t.file)]++;
    return { ...r, counts, total: LAYERS.reduce((n, l) => n + counts[l], 0) };
  });
}

// The gate: every in-scope requirement has a passing test; a High-risk one has one above the Unit layer.
export function traceGaps(rows) {
  const gaps = [];
  for (const r of rows.filter((x) => x.inScope)) {
    if (r.total === 0) gaps.push(r.id + ': no passing test');
    else if (r.risk === 'High' && r.total === r.counts.Unit) gaps.push(r.id + ': High risk, tested only at the Unit layer');
  }
  return gaps;
}

export function rtmMarkdown(rows, gaps) {
  const head = ['| Requirement | Risk | ' + LAYERS.join(' | ') + ' | |', '|---|---|' + LAYERS.map(() => '---:|').join('') + '---|'];
  const body = rows.map((r) => '| ' + r.id + (r.inScope ? '' : ' (out of scope)') + ' | ' + r.risk + ' | ' +
    LAYERS.map((l) => (r.counts[l] || '·')).join(' | ') + ' | ' + (!r.inScope ? '—' : gaps.some((g) => g.startsWith(r.id + ':')) ? '❌' : '✅') + ' |');
  const tail = gaps.length ? ['', '**Gaps:**', ...gaps.map((g) => '- ' + g)] : ['', 'Every in-scope requirement is traced to a passing test.'];
  return [...head, ...body, ...tail].join('\\n') + '\\n';
}`,
  rtmScript: `// The traceability matrix of LabFlow Lite (lesson 11.1), from the reports of the tests that really ran.
//   node scripts/rtm.mjs          → reads reports/{unit,web,int,e2e}.json (written by CI, or by --run)
//   node scripts/rtm.mjs --run    → runs the four suites first (integration: TEST_DATABASE_URL, or Docker for Testcontainers)
// Exit code 1 when an in-scope requirement has no passing test, or a High-risk one has none above the Unit layer.
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { testsFromVitest, testsFromPlaywright, buildMatrix, traceGaps, rtmMarkdown } from '../src/ci/rtm.js';

const SUITES = [
  ['unit', 'reports/unit.json', ['vitest', 'run', 'src/', '--reporter=json', '--outputFile=reports/unit.json']],
  ['web', 'reports/web.json', ['vitest', 'run', '--config', 'vitest.web.config.js', 'web/', '--reporter=json', '--outputFile=reports/web.json']],
  ['int', 'reports/int.json', ['vitest', 'run', '--config', 'vitest.integration.config.js', 'test/integration', '--reporter=json', '--outputFile=reports/int.json']],
  ['e2e', 'reports/e2e.json', ['playwright', 'test', 'e2e/', '--project=chromium', '--reporter=json']],
];

if (process.argv.includes('--run')) {
  mkdirSync('reports', { recursive: true });
  for (const [name, , args] of SUITES) {
    const env = { ...process.env, PLAYWRIGHT_JSON_OUTPUT_NAME: 'reports/e2e.json' };
    const run = spawnSync('npx', args, { encoding: 'utf8', env, shell: process.platform === 'win32' });
    console.log((run.status === 0 ? '✔ ' : '✘ ') + name + ' suite ran (exit ' + run.status + ')');
  }
  console.log();
}

const { release, requirements } = JSON.parse(readFileSync('test-plan/requirements.json', 'utf8'));
const tests = [];
for (const [name, file] of SUITES) {
  if (!existsSync(file)) { console.log('⚠️  ' + file + ' missing — the ' + name + ' layer counts as empty'); continue; }
  const report = JSON.parse(readFileSync(file, 'utf8'));
  tests.push(...(name === 'e2e' ? testsFromPlaywright(report) : testsFromVitest(report, process.cwd())));
}
const rows = buildMatrix(requirements, tests);
const gaps = traceGaps(rows);
console.log('## Traceability — ' + release + '\\n\\n' + tests.length + ' tests read, ' + tests.filter((t) => t.passed).length + ' passed.\\n');
process.stdout.write(rtmMarkdown(rows, gaps));
process.exitCode = gaps.length ? 1 : 0;`,
  quality: `// The one quality report of a pull request (lesson 11.4): every layer's tests, coverage, mutation score and traceability
// on one page — and the list of problems that make the "report" job (and so ci-ok) red.
import { coverageTable } from './summary.js';
import { rtmMarkdown } from './rtm.js';

// Stryker's JSON report → score in %, the way Stryker counts it: (killed + timeout) / every mutant that could run.
export function mutationScore(report) {
  let detected = 0;
  let valid = 0;
  for (const file of Object.values(report.files)) {
    for (const m of file.mutants) {
      if (['CompileError', 'RuntimeError', 'Ignored'].includes(m.status)) continue;
      valid++;
      if (m.status === 'Killed' || m.status === 'Timeout') detected++;
    }
  }
  return valid === 0 ? 0 : Math.round((detected / valid) * 10000) / 100;
}

// suites: [{ label, tests: [{ passed }] | null }] — null means the report is missing (the job did not run or crashed).
export function qualityReport({ title, suites, coverage, thresholds, mutation, mutationBreak, rtm }) {
  const problems = [];
  const rows = suites.map(({ label, tests }) => {
    if (!tests) { problems.push(label + ': no report'); return '| ' + label + ' | — | — | ⚠️ no report |'; }
    const failed = tests.filter((t) => !t.passed).length;
    if (failed) problems.push(label + ': ' + failed + ' failed');
    if (tests.length === 0) problems.push(label + ': 0 tests');
    return '| ' + label + ' | ' + tests.length + ' | ' + failed + ' | ' + (failed || tests.length === 0 ? '❌' : '✅') + ' |';
  });
  for (const m of Object.keys(thresholds)) {
    if (coverage && coverage.total[m].pct < thresholds[m]) problems.push('coverage ' + m + ' ' + coverage.total[m].pct + '% < ' + thresholds[m] + '%');
  }
  if (!coverage) problems.push('coverage: no report');
  if (mutation === null) problems.push('mutation: no report');
  else if (mutation < mutationBreak) problems.push('mutation score ' + mutation + '% < ' + mutationBreak + '%');
  problems.push(...rtm.gaps.map((g) => 'traceability — ' + g));

  const parts = [
    '## ' + title,
    problems.length ? '### ❌ Do not merge\\n\\n' + problems.map((p) => '- ' + p).join('\\n') : '### ✅ Every check passed',
    ['| Layer | Tests | Failed | |', '|---|---:|---:|---|', ...rows].join('\\n'),
    coverage ? coverageTable(coverage, thresholds) : '',
    '**Mutation score:** ' + (mutation === null ? '—' : mutation + '%') + ' (minimum ' + mutationBreak + '%)',
    '### Traceability\\n\\n' + rtmMarkdown(rtm.rows, rtm.gaps).trim(),
  ];
  return { markdown: parts.filter(Boolean).join('\\n\\n') + '\\n', problems };
}`,
  ciReport: `// The "report" job of .github/workflows/test.yml (lesson 11.4): reads the reports every other job uploaded and writes
// ONE page — tests per layer, coverage, mutation score, traceability. Exit code 1 lists why the pull request must not merge.
//   node scripts/ci-report.mjs | tee -a "$GITHUB_STEP_SUMMARY"
import { readFileSync, existsSync } from 'node:fs';
import config from '../vitest.config.js';
import stryker from '../stryker.config.mjs';
import { testsFromVitest, testsFromPlaywright, buildMatrix, traceGaps } from '../src/ci/rtm.js';
import { mutationScore, qualityReport } from '../src/ci/quality.js';

const read = (file) => (existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null);
const vitest = (file) => { const r = read(file); return r ? testsFromVitest(r, process.cwd()) : null; };
const pw = (file) => { const r = read(file); return r ? testsFromPlaywright(r) : null; };

const suites = [
  { label: 'Unit + API (src/)', tests: vitest('reports/unit.json') },
  { label: 'UI components (web/)', tests: vitest('reports/web.json') },
  { label: 'DB integration (PostgreSQL 17)', tests: vitest('reports/int.json') },
  { label: 'End to end (Chromium)', tests: pw('reports/e2e.json') },
];
const { release, requirements } = JSON.parse(readFileSync('test-plan/requirements.json', 'utf8'));
const rows = buildMatrix(requirements, suites.flatMap((s) => s.tests ?? []));
const mutationReport = read('reports/mutation/mutation.json');
const { markdown, problems } = qualityReport({
  title: 'Quality report — ' + release,
  suites,
  coverage: read('coverage/coverage-summary.json'),
  thresholds: config.test.coverage.thresholds,
  mutation: mutationReport ? mutationScore(mutationReport) : null,
  mutationBreak: stryker.thresholds.break,
  rtm: { rows, gaps: traceGaps(rows) },
});
process.stdout.write(markdown);
for (const p of problems) console.log('::error title=report::' + p);
process.exitCode = problems.length ? 1 : 0;`,
  testYml: `# LabFlow Lite — tests on every pull request and on main (Chapter 9; Chapter 11 adds mutation + one quality report).
# Branch protection requires ONE status check: ci-ok (lesson 9.3). Run it on your machine with act (lesson 9.1).
name: tests

on:
  push:
    branches: [main]
  pull_request:
  workflow_dispatch:

permissions:
  contents: read

concurrency:                                  # a new push to the same pull request cancels the old run (lesson 9.4)
  group: tests-\${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: \${{ github.event_name == 'pull_request' }}

jobs:
  unit:
    name: unit (Node \${{ matrix.node }})
    runs-on: ubuntu-latest
    timeout-minutes: 10
    strategy:
      fail-fast: false                        # see every version's result, not only the first red one
      matrix:
        node: [22, 24]                        # package.json engines: >=22.12 (Node 20 fails 4 tests, lesson 9.4)
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node }}
          cache: npm                          # ~/.npm, keyed by package-lock.json
      - run: npm ci
      - name: unit tests + coverage
        run: >-
          npx vitest run src/ --coverage
          --reporter=tree --reporter=github-actions
          --reporter=junit --outputFile.junit=reports/junit-unit.xml
          --reporter=json --outputFile.json=reports/unit.json
      - name: web tests
        run: npm run test:web -- --reporter=tree --reporter=github-actions --reporter=json --outputFile.json=reports/web.json
      - name: summary
        if: \${{ !cancelled() }}
        run: node scripts/ci-summary.mjs "unit (Node \${{ matrix.node }})" reports/unit.json,reports/web.json coverage/coverage-summary.json | tee -a "$GITHUB_STEP_SUMMARY"
      - name: upload reports
        if: \${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: unit-reports-node\${{ matrix.node }}   # artifact names must be unique in a run
          path: |
            reports/
            coverage/
          retention-days: 7

  integration:
    name: integration (PostgreSQL 17)
    runs-on: ubuntu-latest
    timeout-minutes: 10
    services:
      postgres:
        image: postgres:17
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: labflow_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd "pg_isready -U postgres -d labflow_test"
          --health-interval 2s --health-timeout 3s --health-retries 30
    env:
      TEST_DATABASE_URL: postgres://postgres:test@localhost:5432/labflow_test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run test:int -- test/integration --reporter=tree --reporter=github-actions --reporter=json --outputFile.json=reports/int.json
      - name: upload report
        if: \${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: int-reports
          path: reports/
          retention-days: 7

  e2e:
    name: e2e (Chromium)
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - name: upload Playwright reports
        if: \${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: e2e-reports                     # playwright-report/ (HTML + traces) and reports/e2e.json (lesson 11.4)
          path: |
            playwright-report/
            reports/
          retention-days: 7

  mutation:
    name: mutation (Stryker, src/rules)
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run test:mutation              # fails below thresholds.break (95) in stryker.config.mjs — lesson 11.4
      - name: upload mutation report
        if: \${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: mutation-report
          path: reports/mutation/
          retention-days: 7

  quarantine:
    name: quarantine (report only)
    runs-on: ubuntu-latest
    timeout-minutes: 10
    continue-on-error: true                   # known flaky tests: reported, never block (lesson 9.3)
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run test:quarantine -- --repeats=9

  report:
    name: quality report + traceability
    if: \${{ !cancelled() }}                   # also when a test job failed: the report says what is missing
    needs: [unit, integration, e2e, mutation]
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - uses: actions/download-artifact@v4
        continue-on-error: true               # a missing report is listed by the script, not a crash here
        with:
          name: unit-reports-node22
          path: .
      - uses: actions/download-artifact@v4
        continue-on-error: true
        with:
          name: int-reports
          path: reports/
      - uses: actions/download-artifact@v4
        continue-on-error: true
        with:
          name: e2e-reports
          path: .
      - uses: actions/download-artifact@v4
        continue-on-error: true
        with:
          name: mutation-report
          path: reports/mutation/
      - name: one page for the whole pull request
        shell: bash                           # bash -eo pipefail: "| tee" must not swallow the exit code (lesson 9.3)
        run: node scripts/ci-report.mjs | tee -a "$GITHUB_STEP_SUMMARY"

  ci-ok:
    name: ci-ok
    if: always()                              # must run (and fail) when a job it needs failed or was skipped
    needs: [unit, integration, e2e, mutation, report]
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v4
      - name: every required job passed?
        env:
          NEEDS: \${{ toJSON(needs) }}
          REQUIRED: unit,integration,e2e,mutation,report
        run: node scripts/ci-gate.mjs`,
  nightly: `# LabFlow Lite — the slow checks, once a night (lesson 9.3). Not a required check: it opens no pull request,
# it tells the team in the morning. Lesson 11.4: mutation moved to every pull request (23 s); Viet Nam time zone added. Cron is in UTC: 20:00 UTC = 03:00 in Viet Nam (before 07:00 — lesson 8.3's clock bug hour).
name: nightly

on:
  schedule:
    - cron: '0 20 * * *'
  workflow_dispatch:

permissions:
  contents: read

jobs:
  unit-hanoi:
    name: unit, in Viet Nam time (Asia/Ho_Chi_Minh)
    runs-on: ubuntu-latest
    timeout-minutes: 10
    env:
      TZ: Asia/Ho_Chi_Minh                    # pull requests run in UTC; this catches the opposite time-zone bugs (lessons 2.2, 11.2)
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run test:unit

  shuffled:
    name: unit, shuffled ×5 (flaky hunt)
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx vitest run src/ --sequence.shuffle --repeats=4 --reporter=dot

  e2e-all:
    name: e2e (5 browsers and devices)
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium firefox webkit
      - run: npm run test:e2e:all
      - name: upload Playwright report
        if: \${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-nightly
          path: playwright-report/
          retention-days: 14`,
  workflowTest: `// Tests for the CI configuration itself (lesson 9.1): the real .github/workflows/test.yml must keep its promises.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { checkWorkflow } from './policy.js';

const TEXT = readFileSync(new URL('../../.github/workflows/test.yml', import.meta.url), 'utf8');
const { on, jobs } = parse(TEXT);
const PKG = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));
const runs = (id) => jobs[id].steps.filter((s) => s.run).map((s) => s.run);

describe('.github/workflows/test.yml', () => {
  it.each(checkWorkflow(TEXT).map((r) => [r.id + ' ' + r.title, r]))('%s', (_, r) => {
    expect(r.why).toBe('');
  });

  it('runs on pull requests and on pushes to main', () => {
    expect(on.pull_request).toBeDefined();
    expect(on.push.branches).toEqual(['main']);
  });

  it('the unit job tests every Node version that package.json supports, and only those', () => {
    expect(PKG.engines.node).toBe('>=22.12');
    expect(jobs.unit.strategy.matrix.node).toEqual([22, 24]);
    expect(jobs.unit.strategy['fail-fast']).toBe(false);
  });

  it('the integration job uses the same PostgreSQL major version as production (17) and waits for it', () => {
    const pg = jobs.integration.services.postgres;
    expect(pg.image).toBe('postgres:17');
    expect(pg.options).toMatch(/--health-cmd "pg_isready -U postgres -d labflow_test"/);
    expect(jobs.integration.env.TEST_DATABASE_URL).toBe('postgres://postgres:test@localhost:5432/labflow_test');
  });

  it('e2e installs Chromium with its system libraries before running Playwright', () => {
    expect(runs('e2e')).toEqual(['npm ci', 'npx playwright install --with-deps chromium', 'npm run test:e2e']);
  });

  it('every test job uploads its reports, even when the tests are red', () => {
    const uploaders = Object.entries(jobs).filter(([, j]) => j.steps.some((s) => String(s.uses).startsWith('actions/upload-artifact@')));
    expect(uploaders.map(([id]) => id)).toEqual(['unit', 'integration', 'e2e', 'mutation']);
    const uploads = uploaders.flatMap(([, j]) => j.steps.filter((s) => String(s.uses).startsWith('actions/upload-artifact@')));
    expect(uploads.every((s) => s.if === '\${{ !cancelled() }}')).toBe(true);
  });

  it('the gate requires exactly unit, integration, e2e, mutation and report (lesson 11.4)', () => {
    expect(jobs['ci-ok'].needs).toEqual(['unit', 'integration', 'e2e', 'mutation', 'report']);
    expect(jobs['ci-ok'].steps.at(-1).env.REQUIRED).toBe('unit,integration,e2e,mutation,report');
  });

  it('the report job reads every report, runs even after a red job, and keeps the exit code through tee', () => {
    const report = jobs.report;
    expect(report.if).toBe('\${{ !cancelled() }}');
    expect(report.needs).toEqual(['unit', 'integration', 'e2e', 'mutation']);
    const names = report.steps.filter((s) => String(s.uses).startsWith('actions/download-artifact@')).map((s) => s.with.name);
    expect(names).toEqual(['unit-reports-node22', 'int-reports', 'e2e-reports', 'mutation-report']);
    const last = report.steps.at(-1);
    expect([last.shell, last.run]).toEqual(['bash', 'node scripts/ci-report.mjs | tee -a "$GITHUB_STEP_SUMMARY"']);
  });
});`,
  stryker: `// Mutation testing with StrykerJS (lesson 8.2): npm run test:mutation  (= npx stryker run)
// Lesson 11.2: run the mutants in UTC — the time zone of CI and of the servers. On a laptop in Viet Nam a mutant that drops
// "+07:00" from a date string changes nothing (local time IS +07:00) and survives; in UTC it is a real bug and the tests kill it.
process.env.TZ ??= 'UTC';
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  testRunner: 'vitest',
  vitest: { configFile: 'vitest.config.js', dir: 'src' },   // the unit suite only: demo*/ holds tests that are red on purpose
  mutate: ['src/rules/**/*.js', '!src/**/*.test.js'],
  coverageAnalysis: 'perTest',                              // each mutant runs only the tests that reach its code
  reporters: ['clear-text', 'progress', 'html', 'json'],     // json: read by the CI quality report (lesson 11.4)
  jsonReporter: { fileName: 'reports/mutation/mutation.json' },
  clearTextReporter: { allowEmojis: false, logTests: false },
  htmlReporter: { fileName: 'reports/mutation/index.html' },
  thresholds: { high: 98, low: 95, break: 95 },            // lesson 11.4: the ratchet — 80 in Ch8, 95 now (measured 99.08%); below 95% the command fails
  tempDirName: '.stryker-tmp',                              // excluded in vitest.config.js (a crashed run leaves a copy of src/ here)
};`,
  vitestCfg: `import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: ['tree'],                 // print the describe → it tree
    expect: { requireAssertions: true }, // a test without any expect fails (lesson 1.1)
    restoreMocks: true,                  // undo every vi.spyOn before each test (lesson 2.4)
    exclude: [...configDefaults.exclude, 'test/integration/**', 'demo4/**', 'web/**', 'demo6/**', 'e2e/**', 'demo7/**', '.stryker-tmp/**', 'demo11/ui/**', 'demo11/pw/**', 'demo11/th112/**'], // database: test:int · React: test:web · browser: test:e2e · Stryker sandboxes (8.2)
    coverage: {                          // lesson 8.1: npm run test:cov
      provider: 'v8',
      include: ['src/**/*.js'],          // count every source file, also the ones no test imports
      exclude: ['src/**/*.test.js', 'src/api/main.js', 'src/booking/pgRepo.js', 'src/app.js', 'src/legacy/db.js'], // main.js only calls listen · pgRepo.js: test:int · app.js: lesson 0.2, tested by test/pyramid.* · legacy/db.js: the real connection, replaced by a seam (10.2)
      reporter: [['text', { skipFull: false }], 'html', 'json-summary'],
      thresholds: { lines: 97, branches: 91, functions: 96, statements: 97 },   // lesson 11.4: ratchet — 85/80/80/85 in Ch8, now just under what we measured
    },
    tags: [{ name: 'quarantine', description: 'known flaky: has an issue and an owner, not run in the main suite (lesson 8.3)' }],
  },
});`,
  cham: `// The final project grader (Chapter 11): US-11 "My bookings", 100 points.
//   node scripts/cham-cuoi-khoa.mjs                  → grades the files in place (yours)
//   node scripts/cham-cuoi-khoa.mjs --from <dir>     → first copies the deliverables found in <dir> into place
//                                                      (e.g. --from capstone/yeu: the weak first attempt of lesson 11.5)
// Needs Docker or TEST_DATABASE_URL (integration) and Chromium for Playwright. Every file is put back in \`finally\`.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { parse } from 'yaml';
import { MUTANTS } from '../capstone/mutants.mjs';
import { checkWorkflow } from '../src/ci/policy.js';
import { testsFromVitest, testsFromPlaywright, buildMatrix, traceGaps } from '../src/ci/rtm.js';

// Your deliverables: where they live → the file name looked for in --from <dir>.
const DELIVERABLES = {
  'src/rules/cancel.test.js': 'cancel.test.js',
  'src/booking/myBookings.test.js': 'myBookings.test.js',
  'src/api/myBookings.test.js': 'myBookings.api.test.js',
  'test/integration/myBookings.int.test.js': 'myBookings.int.test.js',
  'web/MyBookings.test.jsx': 'MyBookings.test.jsx',
  'e2e/huy-phong.spec.js': 'huy-phong.spec.js',
  'test-plan/TEST-PLAN.md': 'TEST-PLAN.md',
  '.github/workflows/test.yml': 'test.yml',
};
const LAYERS = [
  ['unit + API', ['vitest', 'run', 'src/rules/cancel.test.js', 'src/booking/myBookings.test.js', 'src/api/myBookings.test.js', '--reporter=json', '--outputFile=reports/cham-unit.json'], 'reports/cham-unit.json'],
  ['UI', ['vitest', 'run', '--config', 'vitest.web.config.js', 'web/MyBookings.test.jsx', '--reporter=json', '--outputFile=reports/cham-web.json'], 'reports/cham-web.json'],
  ['DB', ['vitest', 'run', '--config', 'vitest.integration.config.js', 'test/integration/myBookings.int.test.js', '--reporter=json', '--outputFile=reports/cham-int.json'], 'reports/cham-int.json'],
  ['E2E', ['playwright', 'test', 'e2e/huy-phong.spec.js', '--project=chromium', '--reporter=json'], 'reports/cham-e2e.json'],
];
const npx = (args) => spawnSync('npx', args, { encoding: 'utf8', env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_NAME: 'reports/cham-e2e.json' }, shell: process.platform === 'win32' });
const green = ([, args]) => npx(args).status === 0;

const fromDir = process.argv.includes('--from') ? process.argv[process.argv.indexOf('--from') + 1] : null;
const saved = new Map();
const score = [];
const add = (part, got, max, note) => { score.push([part, got, max]); console.log(String(got).padStart(3) + '/' + String(max).padEnd(3) + ' ' + part + (note ? ' — ' + note : '')); };

function swapIn() {
  if (!fromDir) return;
  for (const [target, name] of Object.entries(DELIVERABLES)) {
    const source = path.join(fromDir, name);
    if (!existsSync(source)) continue;
    saved.set(target, existsSync(target) ? readFileSync(target, 'utf8') : null);
    writeFileSync(target, readFileSync(source, 'utf8'));
  }
  console.log('Graded: the deliverables of ' + fromDir + ' (' + saved.size + ' files)\\n');
}
function swapBack() { for (const [target, text] of saved) if (text !== null) writeFileSync(target, text); }

try {
  swapIn();

  // A. Your tests are green on the correct code: 5 points per layer.
  const reports = {};
  for (const layer of LAYERS) {
    const ok = green(layer);
    reports[layer[0]] = existsSync(layer[2]) ? JSON.parse(readFileSync(layer[2], 'utf8')) : null;
    add('A. green on the correct code: ' + layer[0], ok ? 5 : 0, 5);
  }

  // B. Twelve real bugs, one at a time: 3 points for each one your tests turn red (cheap layers first).
  let killed = 0;
  for (const [i, [file, from, to, label]] of MUTANTS.entries()) {
    const original = readFileSync(file, 'utf8');
    if (original.split(from).length !== 2) throw new Error('Mutant ' + (i + 1) + ': must appear exactly once in ' + file);
    writeFileSync(file, original.replace(from, to));
    let by = null;
    try {
      for (const layer of LAYERS) if (!green(layer)) { by = layer[0]; break; }
    } finally {
      writeFileSync(file, original);
    }
    if (by) killed++;
    console.log('      ' + (by ? '✔ killed by ' + by.padEnd(10) : '✘ SURVIVED          ') + ' #' + (i + 1) + ' ' + label);
  }
  add('B. bugs your tests catch', killed * 3, 36, killed + '/' + MUTANTS.length);

  // C. The suite's own quality bars: coverage thresholds, mutation score.
  add('C. coverage thresholds (npm run test:cov)', npx(['vitest', 'run', 'src/', '--coverage']).status === 0 ? 6 : 0, 6);
  add('C. mutation score ≥ break (npm run test:mutation)', npx(['stryker', 'run']).status === 0 ? 8 : 0, 8);

  // D. Traceability: US-11 AC1–AC6 and Lite-3, each proven by one of YOUR passing tests (High risk: above the Unit layer).
  const tests = [
    ...['unit + API', 'UI', 'DB'].flatMap((k) => (reports[k] ? testsFromVitest(reports[k], process.cwd()) : [])),
    ...(reports.E2E ? testsFromPlaywright(reports.E2E) : []),
  ];
  const all = JSON.parse(readFileSync('test-plan/requirements.json', 'utf8')).requirements;
  const story = all.filter((r) => r.id.startsWith('US-11') || r.id === 'Lite-3');
  const gaps = traceGaps(buildMatrix(story, tests));
  add('D. traceability of US-11 and Lite-3', Math.round((10 * (story.length - gaps.length)) / story.length), 10, gaps.length ? gaps.join('; ') : 'all ' + story.length + ' traced');

  // E. The test plan has the sections a reviewer looks for, and names every High-risk requirement in scope.
  const plan = existsSync('test-plan/TEST-PLAN.md') ? readFileSync('test-plan/TEST-PLAN.md', 'utf8') : '';
  const SECTIONS = ['Scope', 'Risks', 'Approach', 'Entry criteria', 'Exit criteria', 'Traceability', 'Definition of done'];
  const missing = SECTIONS.filter((s) => !new RegExp('^#{2,3} .*' + s, 'mi').test(plan));
  const high = all.filter((r) => r.inScope && r.risk === 'High').map((r) => r.id).filter((id) => !plan.includes(id));
  const planOk = SECTIONS.length - missing.length + (high.length ? 0 : 1);
  add('E. test plan', Math.round((10 * planOk) / (SECTIONS.length + 1)), 10,
    [missing.length ? 'missing: ' + missing.join(', ') : '', high.length ? 'High risks not named: ' + high.join(', ') : ''].filter(Boolean).join(' · '));

  // F. The pipeline: valid, safe (Lab 9 rules), and it runs mutation testing and the quality report as required checks.
  const yml = readFileSync('.github/workflows/test.yml', 'utf8');
  const lint = spawnSync('actionlint', ['.github/workflows/test.yml'], { encoding: 'utf8' });
  const lintOk = lint.status === 0;
  const policyOk = checkWorkflow(yml).every((r) => r.ok);
  const jobs = parse(yml).jobs ?? {};
  const gateNeeds = [jobs['ci-ok']?.needs ?? []].flat();
  const runsIn = (needle) => Object.entries(jobs).find(([, j]) => (j.steps ?? []).some((s) => String(s.run ?? '').includes(needle)));
  const mutationJob = runsIn('test:mutation');
  const reportJob = runsIn('ci-report.mjs');
  const reportStep = reportJob?.[1].steps.find((s) => String(s.run ?? '').includes('ci-report.mjs'));
  const f = (lint.error ? 0 : lintOk ? 2 : 0) + (policyOk ? 2 : 0) + (mutationJob && gateNeeds.includes(mutationJob[0]) ? 3 : 0) +
    (reportJob && gateNeeds.includes(reportJob[0]) && reportStep.shell === 'bash' ? 3 : 0);
  add('F. CI pipeline', f, 10, lint.error ? 'actionlint not installed (brew install actionlint)' : '');
} finally {
  swapBack();
}

const total = score.reduce((n, [, got]) => n + got, 0);
console.log('\\nTotal: ' + total + '/100 — ' + (total >= 85 ? 'excellent' : total >= 70 ? 'pass' : 'not yet: read the lines with fewer points'));
process.exitCode = total >= 70 ? 0 : 1;`,
  mutants: `// Twelve real bugs for US-11 "My bookings" (Chapter 11): used by scripts/cham-cuoi-khoa.mjs (the final grader)
// and scripts/ma-tran-bat-loi.mjs (which layer catches which bug). Each \`from\` appears exactly once in its file.
export const MUTANTS = [
  ['src/rules/cancel.js', 'if (!isAdmin && !canCancel(', 'if (!canCancel(', 'admins are refused inside the last hour too (AC6)'],
  ['src/rules/cancel.js', 'booking.userId !== user.id && !isAdmin', "booking.userId !== user.id && user.role === 'STUDENT'", "a lecturer can cancel anyone's booking (AC3)"],
  ['src/rules/cancel.js', "':00+07:00'", "':00Z'", 'start read as UTC: cancelling stays open 7 hours too long (Lite-3)'],
  ['src/booking/service.js', "b.status !== 'CANCELLED' && ", '', 'a cancelled slot stays blocked (AC5)'],
  ['src/booking/myBookings.js', 'const booking = await repo.cancel(id);', 'await repo.cancel(id);\\n  const booking = await repo.findById(id);', 'two cancels at the same moment both succeed (AC4)'],
  ['db/schema.sql', "  ) WHERE (status <> 'CANCELLED')", '  )', 'PostgreSQL still blocks a cancelled slot (AC5)'],
  ['src/booking/pgRepo.js', "to_char(date, 'YYYY-MM-DD') AS date", 'date', 'dates come back from PostgreSQL as JS Dates (AC1)'],
  ['src/booking/pgRepo.js', "WHERE id = $1 AND status <> 'CANCELLED' RETURNING", 'WHERE id = $1 RETURNING', 'the cancel UPDATE is not atomic: both win (AC4)'],
  ['src/api/myBookings.js', 'listMyBookings(repo, req.user.id)', 'repo.list()', 'My bookings shows everyone’s bookings (AC1)'],
  ['src/api/myBookings.js', 'TOO_LATE_TO_CANCEL: 422', 'TOO_LATE_TO_CANCEL: 409', 'too late answered as 409, not 422 (AC2)'],
  ['web/MyBookings.jsx', 'disabled={busyId !== null}', 'disabled={busyId === b.id}', 'other rows stay clickable during a cancel'],
  ['web/api.js', "'/cancel')", "'/cancellation')", 'the screen calls a URL the API does not have'],
];`,
  yeuWeb: `import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyBookings } from './MyBookings.jsx';
import { ROW } from './support.jsx';

describe('MyBookings', () => {
  it('shows my bookings', async () => {
    render(<MyBookings client={{ listMine: async () => ({ status: 200, data: [ROW] }) }} />);
    expect(await screen.findByText('BE-201')).toBeInTheDocument();
  });
  it('calls cancelBooking', async () => {
    const user = userEvent.setup();
    const client = { listMine: async () => ({ status: 200, data: [ROW] }), cancelBooking: vi.fn(async () => ({ status: 200, data: { ...ROW, status: 'CANCELLED' } })) };
    render(<MyBookings client={client} />);
    await user.click(await screen.findByRole('button', { name: /Cancel/ }));
    expect(client.cancelBooking).toHaveBeenCalledWith(1);
  });
});`,
  yeuApi: `import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { makeApi, body } from '../../test/support/api.js';

describe('my bookings API', () => {
  it('GET /api/bookings works', async () => {
    const api = makeApi();
    const res = await request(api.app).get('/api/bookings').set('Authorization', await api.bearer('an'));
    expect(res.status).toBe(200);
  });
  it('cancel works', async () => {
    const api = makeApi({ now: () => new Date('2026-11-16T06:00:00+07:00') });
    const auth = await api.bearer('an');
    const created = await request(api.app).post('/api/bookings').set('Authorization', auth).send(body());
    const res = await request(api.app).post('/api/bookings/' + created.body.id + '/cancel').set('Authorization', auth);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('CANCELLED');
  });
  it('needs a token', async () => {
    expect((await request(makeApi().app).get('/api/bookings')).status).toBe(401);
  });
});`,
  yeuInt: `import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { bookLab } from '../../src/booking/service.js';
import { createPgRepo } from '../../src/booking/pgRepo.js';
import { openPool } from '../support/db.js';

let pool;
let repo;
beforeAll(async () => { pool = openPool(); repo = createPgRepo(pool); await pool.query('TRUNCATE bookings RESTART IDENTITY'); });
afterAll(() => pool.end());

describe('pgRepo', () => {
  it('listByUser works', async () => {
    await bookLab(repo, { lab: 'BE-201', date: '2026-11-16', start: '09:00', end: '11:00', seats: 20, role: 'STUDENT', userId: 'an' });
    const mine = await repo.listByUser('an');
    expect(mine).toHaveLength(1);
    expect(mine[0]).toMatchObject({ lab: 'BE-201' });
  });
});`,
  yeuPlan: `# Test plan — My bookings

## Scope
Test the My bookings page and the cancel button.

## Risks
- Cancelling might not work.
- The page might be slow.

## Approach
We write unit tests and some end-to-end tests. We test manually before the demo.`,
  maTran: `// Which layer catches which bug? (lessons 11.1–11.3) Plants each of the 12 US-11 bugs of capstone/mutants.mjs, one at a time,
// and runs EVERY layer's US-11 tests against it — not stopping at the first red, so the table shows each layer's blind spots.
//   node scripts/ma-tran-bat-loi.mjs        (needs Docker or TEST_DATABASE_URL, and Chromium)
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { MUTANTS } from '../capstone/mutants.mjs';

const LAYERS = [
  ['Unit', ['vitest', 'run', 'src/rules/cancel.test.js', 'src/booking/myBookings.test.js']],
  ['API', ['vitest', 'run', 'src/api/myBookings.test.js']],
  ['UI', ['vitest', 'run', '--config', 'vitest.web.config.js', 'web/MyBookings.test.jsx']],
  ['DB', ['vitest', 'run', '--config', 'vitest.integration.config.js', 'test/integration/myBookings.int.test.js']],
  ['E2E', ['playwright', 'test', 'e2e/huy-phong.spec.js', '--project=chromium']],
];
const red = (args) => spawnSync('npx', args, { encoding: 'utf8', shell: process.platform === 'win32' }).status !== 0;

console.log('| # | Bug | ' + LAYERS.map(([l]) => l).join(' | ') + ' |');
console.log('|---|---|' + LAYERS.map(() => ':---:|').join(''));
const caught = Object.fromEntries(LAYERS.map(([l]) => [l, 0]));
for (const [i, [file, from, to, label]] of MUTANTS.entries()) {
  const original = readFileSync(file, 'utf8');
  if (original.split(from).length !== 2) throw new Error('Mutant ' + (i + 1) + ': must appear exactly once in ' + file);
  writeFileSync(file, original.replace(from, to));
  const cells = [];
  try {
    for (const [layer, args] of LAYERS) {
      const hit = red(args);
      if (hit) caught[layer]++;
      cells.push(hit ? '🔴' : '·');
    }
  } finally {
    writeFileSync(file, original);
  }
  console.log('| ' + (i + 1) + ' | ' + label + ' | ' + cells.join(' | ') + ' |');
}
console.log('| | **caught** | ' + LAYERS.map(([l]) => caught[l] + '/' + MUTANTS.length).join(' | ') + ' |');`,
  nganSach: `// The test pyramid of LabFlow Lite, measured (lesson 11.1): how many tests each layer has and what one run costs.
//   node scripts/ngan-sach.mjs [runs=3]      (integration: TEST_DATABASE_URL, or Docker for Testcontainers)
// Each command runs \`runs\` times in a fresh process; the table shows the median wall-clock time.
import { spawnSync } from 'node:child_process';
import { readFileSync, mkdirSync } from 'node:fs';

const RUNS = Number(process.argv[2] ?? 3);
const LAYERS = [
  ['Unit + API (src/)', ['vitest', 'run', 'src/', '--reporter=json', '--outputFile=reports/b-unit.json'], 'reports/b-unit.json'],
  ['UI components (web/)', ['vitest', 'run', '--config', 'vitest.web.config.js', 'web/', '--reporter=json', '--outputFile=reports/b-web.json'], 'reports/b-web.json'],
  ['DB integration', ['vitest', 'run', '--config', 'vitest.integration.config.js', 'test/integration', '--reporter=json', '--outputFile=reports/b-int.json'], 'reports/b-int.json'],
  ['E2E, Chromium', ['playwright', 'test', 'e2e/', '--project=chromium', '--reporter=json'], 'reports/b-e2e.json'],
  ['E2E, 5 browsers/devices', ['playwright', 'test', 'e2e/', '--reporter=json'], 'reports/b-e2e-all.json'],
  ['Mutation (Stryker, src/rules)', ['stryker', 'run'], null],
];

const count = (file) => {
  const r = JSON.parse(readFileSync(file, 'utf8'));
  if (r.numTotalTests !== undefined) return r.numTotalTests;
  return (r.stats.expected ?? 0) + (r.stats.unexpected ?? 0) + (r.stats.flaky ?? 0) - 2;   // minus the 2 sign-in setup tests
};
const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

mkdirSync('reports', { recursive: true });
console.log('| Layer | Tests | Median of ' + RUNS + ' runs | Per test |');
console.log('|---|---:|---:|---:|');
for (const [name, args, report] of LAYERS) {
  const times = [];
  let ok = true;
  for (let i = 0; i < RUNS; i++) {
    const t0 = performance.now();
    const run = spawnSync('npx', args, { encoding: 'utf8', env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_NAME: report ?? '' }, shell: process.platform === 'win32' });
    times.push((performance.now() - t0) / 1000);
    ok &&= run.status === 0;
  }
  const n = report ? count(report) : Object.values(JSON.parse(readFileSync('reports/mutation/mutation.json', 'utf8')).files).reduce((k, f) => k + f.mutants.length, 0);
  const m = median(times);
  const unit = report ? '' : ' mutants';
  console.log('| ' + name + (ok ? '' : ' ❌') + ' | ' + n + unit + ' | ' + m.toFixed(1) + ' s | ' + (m * 1000 / n).toFixed(0) + ' ms |');
}`,
  vaCham: `// Did two end-to-end tests book the same lab code? (lesson 11.3) Reads a Playwright JSON report in which
// freshLab() left a "lab" annotation on every test, and prints each code used by more than one test.
//   PLAYWRIGHT_JSON_OUTPUT_NAME=reports/e2e-all.json npx playwright test e2e/ --reporter=json ; node scripts/va-cham-lab.mjs reports/e2e-all.json
import { readFileSync } from 'node:fs';

const report = JSON.parse(readFileSync(process.argv[2] ?? 'reports/e2e-all.json', 'utf8'));
const users = new Map();
const walk = (suite, titles) => {
  for (const spec of suite.specs ?? []) {
    for (const t of spec.tests) {
      for (const a of t.annotations.filter((x) => x.type === 'lab')) {
        users.set(a.description, [...(users.get(a.description) ?? []), '[' + t.projectName + '] ' + [...titles, spec.title].join(' › ')]);
      }
    }
  }
  for (const child of suite.suites ?? []) walk(child, [...titles, child.title]);
};
for (const file of report.suites) walk(file, []);
const shared = [...users].filter(([, list]) => list.length > 1);
console.log(users.size + ' lab codes used by ' + [...users.values()].flat().length + ' tests');
for (const [lab, list] of shared) console.log('⚠️  ' + lab + ' is used by ' + list.length + ' tests:\\n    ' + list.join('\\n    '));
if (!shared.length) console.log('✔ no two tests share a lab code');
process.exitCode = shared.length ? 1 : 0;`,
  lf301: `// LF-301 (lesson 11.1): BR-05 says "at most 14 days ahead". The rule is a tested pure function — but does the API use it?
// This test asks the API. It is RED on purpose: it documents the defect found while building the traceability matrix.
import { it, expect } from 'vitest';
import request from 'supertest';
import { makeApi, body } from '../../test/support/api.js';

it('BR-05 at the API: a booking 30 days ahead is refused with 422', async () => {
  const api = makeApi({ now: () => new Date('2026-11-01T09:00:00+07:00') });
  const res = await request(api.app).post('/api/bookings').set('Authorization', await api.bearer('an')).send(body({ date: '2026-12-01' }));
  expect(res.status).toBe(422);
});`,
  th111: `// Booking rules asked through the API (practices of lessons 11.1 and 11.4): rules tested only at the Unit layer get an API test too.
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { makeApi, body } from '../../test/support/api.js';

describe('approval through the API', () => {
  it.each([
    { role: 'LECTURER', status: 'CONFIRMED', rule: 'Lite-2' },
    { role: 'ADMIN', status: 'CONFIRMED', rule: 'Lite-2' },
    { role: 'STUDENT', status: 'PENDING', rule: 'BR-06' },
  ])('$role books 40 seats → $status ($rule)', async ({ role, status }) => {
    const api = makeApi();
    const res = await request(api.app).post('/api/bookings').set('Authorization', await api.bearer('x', role)).send(body({ seats: 40 }));
    expect([res.status, res.body.status]).toEqual([201, status]);
  });
});

describe('opening hours and length through the API', () => {
  it('08:00–12:30 is too long: 422 TOO_LONG (Lite-1)', async () => {
    const api = makeApi();
    const res = await request(api.app).post('/api/bookings').set('Authorization', await api.bearer('an')).send(body({ start: '08:00', end: '12:30' }));
    expect([res.status, res.body.error.code]).toEqual([422, 'TOO_LONG']);
  });
});`,
  th112: `// Practice 11.2: the 409 path of POST /api/bookings/:id/cancel, on PostgreSQL, checked against openapi.json.
import { it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createPgRepo } from '../../src/booking/pgRepo.js';
import { createApp } from '../../src/api/server.js';
import { createAuth } from '../../src/api/auth.js';
import { contractErrors } from '../../test/support/contract.js';
import { openPool } from '../../test/support/db.js';

let pool;
beforeAll(async () => { pool = openPool(); await pool.query('TRUNCATE bookings RESTART IDENTITY'); });
afterAll(() => pool.end());

it('cancelling twice on PostgreSQL → 409 ALREADY_CANCELLED, as documented (US-11 AC4)', async () => {
  const now = () => new Date('2026-11-16T06:00:00+07:00');
  const auth = createAuth({ secret: 'practice-secret', now });
  const app = createApp({ repo: createPgRepo(pool), auth, now });
  const token = 'Bearer ' + (await auth.sign({ id: 'an', role: 'STUDENT' }));
  const { body } = await request(app).post('/api/bookings').set('Authorization', token)
    .send({ lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00', seats: 20 });
  await request(app).post('/api/bookings/' + body.id + '/cancel').set('Authorization', token);
  const again = await request(app).post('/api/bookings/' + body.id + '/cancel').set('Authorization', token);
  expect([again.status, again.body.error?.code]).toEqual([409, 'ALREADY_CANCELLED']);
  expect(contractErrors('post', '/api/bookings/{id}/cancel', again)).toEqual([]);
});`,
  th113: `// Practice 11.3: privacy at the E2E layer — Binh never sees An's booking in My bookings (US-11 AC1).
import { test, expect } from '@playwright/test';
import { book, freshLab, signIn } from '../../e2e/helpers.js';

const daysFromNow = (n) => new Date(Date.now() + 7 * 3600e3 + n * 86400e3).toISOString().slice(0, 10);

test("Binh's My bookings does not show An's booking (US-11 AC1)", async ({ browser }, testInfo) => {
  const lab = freshLab(testInfo);
  const an = await browser.newContext({ storageState: 'playwright/.auth/an.json' });
  const anPage = await an.newPage();
  await anPage.goto('/');
  await book(anPage, { lab, date: daysFromNow(4), start: '09:00', end: '10:00' });
  await expect(anPage.getByRole('status')).toHaveText('Booked. See you in ' + lab + '.');

  const binh = await browser.newContext();
  const binhPage = await binh.newPage();
  await signIn(binhPage, 'binh');
  await binhPage.getByRole('link', { name: 'My bookings' }).click();
  await expect(binhPage.getByRole('heading', { name: 'My bookings' })).toBeVisible();
  await expect(binhPage.getByRole('status')).toHaveCount(0);   // the list has finished loading
  await expect(binhPage.getByRole('row', { name: new RegExp(lab) })).toHaveCount(0);
  await an.close();
  await binh.close();
});`,
  nutChung: `// Lesson 11.3, a trap: "the Cancel button" — when My bookings has two rows, which one? (RED on purpose: strict mode)
import { test, expect } from '@playwright/test';
import { book, freshLab } from '../../e2e/helpers.js';

const daysFromNow = (n) => new Date(Date.now() + 7 * 3600e3 + n * 86400e3).toISOString().slice(0, 10);
test.use({ storageState: 'playwright/.auth/an.json' });

test('cancel "the" booking', async ({ page }, testInfo) => {
  const lab = freshLab(testInfo);
  await page.goto('/');
  await book(page, { lab, date: daysFromNow(5), start: '08:00', end: '09:00' });
  await expect(page.getByRole('status')).toBeVisible();
  await book(page, { lab, date: daysFromNow(5), start: '10:00', end: '11:00' });
  await expect(page.getByRole('status')).toBeVisible();
  await page.goto('/my-bookings');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('status')).toContainText('Cancelled');
});`,
  quaGio: `// Lesson 11.3, a time bomb: a fixed time of day. Green before 06:00 in Viet Nam, red after it (RED on purpose when run in the day).
import { test, expect } from '@playwright/test';
import { book, freshLab } from '../../e2e/helpers.js';

const today = new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
test.use({ storageState: 'playwright/.auth/an.json' });

test('cancel a booking for today at 07:00', async ({ page }, testInfo) => {
  const lab = freshLab(testInfo);
  await page.goto('/');
  await book(page, { lab, date: today, start: '07:00', end: '08:00' });
  await page.goto('/my-bookings');
  await page.getByRole('row', { name: new RegExp(lab) }).getByRole('button').click();
  await expect(page.getByRole('status')).toContainText('Cancelled');
});`,
  kiemMock: `// Lesson 11.3: a component test that only checks the mock was called. Green — and it stays green when the screen is broken.
import { it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyBookings } from '../../web/MyBookings.jsx';
import { ROW } from '../../web/support.jsx';

it('calls cancelBooking when Cancel is clicked', async () => {
  const user = userEvent.setup();
  const client = { listMine: async () => ({ status: 200, data: [ROW] }), cancelBooking: vi.fn(async () => ({ status: 200, data: { ...ROW, status: 'CANCELLED' } })) };
  render(<MyBookings client={client} />);
  await user.click(await screen.findByRole('button', { name: /Cancel/ }));
  expect(client.cancelBooking).toHaveBeenCalledWith(1);
});`,
};
export const OUT = {
  '111-lf-301': `$ npx vitest run demo11/ke-hoach/lf-301.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo11/ke-hoach/lf-301.test.js (1 test | 1 failed) 43ms
   × BR-05 at the API: a booking 30 days ahead is refused with 422 42ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo11/ke-hoach/lf-301.test.js > BR-05 at the API: a booking 30 days ahead is refused with 422
AssertionError: expected 201 to be 422 // Object.is equality

- Expected
+ Received

- 422
+ 201

 ❯ demo11/ke-hoach/lf-301.test.js:10:22
      8|   const api = makeApi({ now: () => new Date('2026-11-01T09:00:00+07:00…
      9|   const res = await request(api.app).post('/api/bookings').set('Author…
     10|   expect(res.status).toBe(422);
       |                      ^
     11| });
     12|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  11:47:26
   Duration  407ms (import 66%, transform 19%, tests 14%, worker 1%)`,
  '111-ma-tran': `$ node scripts/ma-tran-bat-loi.mjs
| # | Bug | Unit | API | UI | DB | E2E |
|---|---|:---:|:---:|:---:|:---:|:---:|
| 1 | admins are refused inside the last hour too (AC6) | 🔴 | 🔴 | · | · | · |
| 2 | a lecturer can cancel anyone's booking (AC3) | 🔴 | 🔴 | · | · | · |
| 3 | start read as UTC: cancelling stays open 7 hours too long (Lite-3) | 🔴 | 🔴 | · | · | · |
| 4 | a cancelled slot stays blocked (AC5) | 🔴 | 🔴 | · | · | 🔴 |
| 5 | two cancels at the same moment both succeed (AC4) | 🔴 | · | · | 🔴 | · |
| 6 | PostgreSQL still blocks a cancelled slot (AC5) | · | · | · | 🔴 | · |
| 7 | dates come back from PostgreSQL as JS Dates (AC1) | · | · | · | 🔴 | · |
| 8 | the cancel UPDATE is not atomic: both win (AC4) | · | · | · | 🔴 | · |
| 9 | My bookings shows everyone’s bookings (AC1) | · | 🔴 | · | · | · |
| 10 | too late answered as 409, not 422 (AC2) | · | 🔴 | · | · | · |
| 11 | other rows stay clickable during a cancel | · | · | 🔴 | · | · |
| 12 | the screen calls a URL the API does not have | · | · | · | · | 🔴 |
| | **caught** | 5/12 | 6/12 | 1/12 | 4/12 | 2/12 |`,
  '111-ngan-sach': `$ node scripts/ngan-sach.mjs 3
| Layer | Tests | Median of 3 runs | Per test |
|---|---:|---:|---:|
| Unit + API (src/) | 299 | 1.6 s | 5 ms |
| UI components (web/) | 24 | 2.3 s | 95 ms |
| DB integration | 19 | 1.5 s | 80 ms |
| E2E, Chromium | 8 | 4.2 s | 521 ms |
| E2E, 5 browsers/devices | 40 | 24.1 s | 602 ms |
| Mutation (Stryker, src/rules) | 433 mutants | 28.7 s | 66 ms |`,
  '111-rtm-lan-1': `$ node scripts/rtm.mjs
## Traceability — LabFlow Lite 1.1 — My bookings and cancel (US-11)

319 tests read, 319 passed.

| Requirement | Risk | Unit | API | DB | UI | E2E | |
|---|---|---:|---:|---:|---:|---:|---|
| BR-04 | High | · | · | 1 | · | · | ✅ |
| BR-05 | Medium | 12 | · | · | · | · | ✅ |
| BR-06 | High | 7 | · | · | · | · | ❌ |
| Lite-1 | Low | · | · | · | · | · | ❌ |
| Lite-2 | Medium | · | · | · | · | · | ❌ |
| Lite-3 | High | 7 | 2 | · | · | · | ✅ |
| US-11 AC1 | High | 1 | 2 | 1 | · | · | ✅ |
| US-11 AC2 | High | 6 | 16 | · | · | · | ✅ |
| US-11 AC3 | High | 6 | 16 | · | · | · | ✅ |
| US-11 AC4 | Medium | 6 | 16 | 3 | · | · | ✅ |
| US-11 AC5 | High | 6 | 16 | 3 | · | · | ✅ |
| US-11 AC6 | Low | · | 16 | · | · | · | ✅ |
| BR-02 (out of scope) | High | 5 | · | · | · | · | — |
| BR-07 (out of scope) | Medium | 8 | · | · | · | · | — |
| BR-08 (out of scope) | Medium | 7 | · | · | · | · | — |
| BR-09 (out of scope) | Medium | · | · | · | · | · | — |
| BR-10 (out of scope) | Low | · | · | · | · | · | — |

**Gaps:**
- BR-06: High risk, tested only at the Unit layer
- Lite-1: no passing test
- Lite-2: no passing test`,
  '111-rtm': `$ node scripts/rtm.mjs --run
✔ unit suite ran (exit 0)
✔ web suite ran (exit 0)
✔ int suite ran (exit 0)
✔ e2e suite ran (exit 0)

## Traceability — LabFlow Lite 1.1 — My bookings and cancel (US-11)

350 tests read, 350 passed.

| Requirement | Risk | Unit | API | DB | UI | E2E | |
|---|---|---:|---:|---:|---:|---:|---|
| BR-04 | High | 11 | 1 | 7 | · | 1 | ✅ |
| BR-05 | Medium | 12 | · | · | · | · | ✅ |
| BR-06 | High | 7 | 1 | · | · | 1 | ✅ |
| Lite-1 | Low | 2 | 1 | · | · | · | ✅ |
| Lite-2 | Medium | 2 | 2 | · | · | · | ✅ |
| Lite-3 | High | 7 | 2 | · | · | · | ✅ |
| US-11 AC1 | High | 2 | 1 | 2 | 1 | 1 | ✅ |
| US-11 AC2 | High | 5 | 3 | 1 | 2 | 1 | ✅ |
| US-11 AC3 | High | 4 | 2 | · | · | · | ✅ |
| US-11 AC4 | Medium | 3 | 1 | 1 | 1 | · | ✅ |
| US-11 AC5 | High | 1 | 1 | 1 | · | 1 | ✅ |
| US-11 AC6 | Low | 2 | 2 | · | · | · | ✅ |
| BR-02 (out of scope) | High | 5 | · | · | · | · | — |
| BR-07 (out of scope) | Medium | 8 | · | · | · | · | — |
| BR-08 (out of scope) | Medium | 7 | · | · | · | · | — |
| BR-09 (out of scope) | Medium | · | · | · | · | · | — |
| BR-10 (out of scope) | Low | · | · | · | · | · | — |

Every in-scope requirement is traced to a passing test.`,
  '111-th-sau': `$ npx vitest run src/ --reporter=json --outputFile=reports/unit.json > /dev/null; node scripts/rtm.mjs | grep -E "^\\| (Requirement|Lite-2|BR-06) "
| Requirement | Risk | Unit | API | DB | UI | E2E | |
| BR-06 | High | 7 | 1 | · | · | 1 | ✅ |
| Lite-2 | Medium | 2 | 2 | · | · | · | ✅ |`,
  '111-th-test': `$ npx vitest run src/api/rules.api.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ src/api/rules.api.test.js (3 tests) 76ms
   ✓ approval through the API (3)
     ✓ LECTURER books 40 seats → CONFIRMED (Lite-2) 36ms
     ✓ ADMIN books 40 seats → CONFIRMED (Lite-2) 19ms
     ✓ STUDENT books 40 seats → PENDING (BR-06) 20ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  11:47:14
   Duration  308ms (import 51%, tests 35%, transform 12%, worker 1%)`,
  '111-th-truoc': `$ npx vitest run src/ --reporter=json --outputFile=reports/unit.json > /dev/null; node scripts/rtm.mjs | grep -E "^\\| (Requirement|Lite-2) "
| Requirement | Risk | Unit | API | DB | UI | E2E | |
| Lite-2 | Medium | 2 | · | · | · | · | ✅ |`,
  '112-api': `$ npx vitest run src/api/myBookings.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ src/api/myBookings.test.js (18 tests) 524ms
   ✓ GET /api/bookings (US-11) (2)
     ✓ 200: only my bookings, cancelled ones too, as in the contract (AC1) 132ms
     ✓ 401 without a token 6ms
   ✓ POST /api/bookings/:id/cancel (US-11) (16)
     ✓ 200 with the booking, now CANCELLED (AC2) 30ms
     ✓ Lite-3: at 07:00 (60 minutes before) → 200 CANCELLED (AC2) 31ms
     ✓ Lite-3: at 07:01 (59 minutes before) → 422 TOO_LATE_TO_CANCEL (AC2) 22ms
     ✓ binh (STUDENT) cancelling an’s booking → 404 (AC3) 22ms
     ✓ thay (LECTURER) cancelling an’s booking → 404 (AC3) 23ms
     ✓ boss (ADMIN) cancelling an’s booking → 200 (AC6) 29ms
     ✓ an admin may cancel inside the last hour (AC6) 30ms
     ✓ 409 ALREADY_CANCELLED the second time (AC4) 35ms
     ✓ id 999 → 404, never 500 20ms
     ✓ id abc → 404, never 500 15ms
     ✓ id 0 → 404, never 500 16ms
     ✓ id -1 → 404, never 500 15ms
     ✓ id 1.5 → 404, never 500 18ms
     ✓ id 2147483648 → 404, never 500 15ms
     ✓ 401 without a token, and the booking is untouched 22ms
     ✓ after cancelling, the same slot can be booked again: 201 (AC5) 42ms

 Test Files  1 passed (1)
      Tests  18 passed (18)
   Start at  11:47:51
   Duration  891ms (tests 66%, import 25%, transform 8%, worker 1%)`,
  '112-cov': `$ npm run test:cov

> labflow-lite@1.0.0 test:cov
> vitest run src/ --coverage


 RUN  v5.0.5 …/labflow-lite
      Coverage enabled with v8

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
 ✓ src/rules/booking.test.js (28 tests) 5ms
   ✓ checkSlot (11)
     ✓ accepts (4)
       ✓ 07:00–08:00 (60 min) BR-04 1ms
       ✓ 20:00–21:00 (60 min) BR-04 0ms
       ✓ 08:00–08:30 (30 min) BR-04 0ms
       ✓ 08:00–12:00 (240 min) Lite-1 0ms
     ✓ rejects (7)
       ✓ 06:30–08:00 with OUTSIDE_HOURS BR-04 0ms
       ✓ 20:00–21:30 with OUTSIDE_HOURS BR-04 0ms
       ✓ 08:15–09:00 with OFF_GRID BR-04 0ms
       ✓ 08:00–09:10 with OFF_GRID BR-04 0ms
       ✓ 10:00–09:00 with END_BEFORE_START BR-04 0ms
       ✓ 09:00–09:00 with END_BEFORE_START BR-04 0ms
       ✓ 08:00–12:30 with TOO_LONG Lite-1 0ms
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
     ✓ STUDENT, 30 seats → false  0ms
     ✓ STUDENT, 31 seats → true  0ms
     ✓ LECTURER, 31 seats → false Lite-2 0ms
     ✓ ADMIN, 31 seats → false Lite-2 0ms
     ✓ throws RangeError for 0 seats 0ms
     ✓ throws RangeError for -5 seats 0ms
     ✓ throws RangeError for 2.5 seats 0ms
   ✓ createBooking (2)
     ✓ builds a PENDING booking for 31 seats 0ms
     ✓ throws the rule code for a bad slot 0ms
 ✓ src/rules/checkin.test.js (16 tests) 6ms
   ✓ checkIn (BR-07) (8)
     ✓ at 07:49 → { ok: false, code: 'TOO_EARLY' } 2ms
     ✓ at 07:50 → { ok: true, late: false } 0ms
     ✓ at 08:00 → { ok: true, late: false } 0ms
     ✓ at 08:01 → { ok: true, late: true } 0ms
     ✓ at 08:15 → { ok: true, late: true } 0ms
     ✓ at 08:16 → { ok: false, code: 'NO_SHOW' } 0ms
     ✓ refuses a PENDING booking 0ms
     ✓ refuses a CANCELLED booking 0ms
   ✓ bannedUntil (BR-08) (7)
     ✓ bans for 7 days after the third no-show 2ms
     ✓ counts from the latest no-show, whatever the order 0ms
     ✓ two no-shows are not enough 0ms
     ✓ the ban still holds on its last day, and is over the day after 0ms
     ✓ a no-show 30 days ago no longer counts; 29 days ago still does 0ms
     ✓ a no-show today already counts 0ms
     ✓ ignores no-shows dated after today 0ms
   ✓ createNoShowLog (1)
     ✓ keeps each student separate, in order 0ms
 ✓ src/rules/recurring.test.js (11 tests) 5ms
   ✓ weeklyDates (11)
     ✓ books the first date and the same weekday in each following week 3ms
     ✓ skips a holiday without adding an extra week 0ms
     ✓ keeps a class on the last day of term and drops the weeks after it 0ms
     ✓ reports HOLIDAY inside the term, but AFTER_TERM for a holiday after it 0ms
     ✓ crosses a month and a year correctly 0ms
     ✓ accepts 1 week(s) 1ms
     ✓ accepts 15 week(s) 0ms
     ✓ refuses 0 weeks with BAD_WEEKS 0ms
     ✓ refuses 16 weeks with BAD_WEEKS 0ms
     ✓ refuses 2.5 weeks with BAD_WEEKS 0ms
     ✓ refuses a series that starts after the term, and accepts one that starts on its last day 0ms
 ✓ src/rules/mutation-gaps.test.js (9 tests) 5ms
   ✓ booking rules: the cases nobody wrote (4)
     ✓ one seat is a valid booking 1ms
     ✓ the error says what was wrong 1ms
     ✓ a small student booking is CONFIRMED 0ms
     ✓ usageRate adds up the booked share of the 14 opening hours 0ms
   ✓ parseTime: only exactly HH:MM (4)
     ✓ refuses 08:000 0ms
     ✓ refuses 108:00 0ms
     ✓ the TypeError is ours, not a crash on null 0ms
     ✓ says which time is out of range 0ms
   ✓ newBookingRecord without injected helpers (1)
     ✓ makes a UUID and stamps the current time 2ms
 ✓ src/rules/busy.test.js (8 tests) 3ms
   ✓ mergeBusy (8)
     ✓ returns no blocks for a day without bookings 1ms
     ✓ keeps separate bookings apart, sorted by start 0ms
     ✓ merges overlapping bookings into one block 0ms
     ✓ merges touching (10:00 ends, 10:00 starts) bookings into one block 0ms
     ✓ merges one inside the other bookings into one block 0ms
     ✓ merges inside, listed first bookings into one block 0ms
     ✓ does not change the array it was given 0ms
     ✓ rejects a time that is not HH:MM 0ms
 ✓ src/rules/waitlist.test.js (11 tests) 13ms
   ✓ joinWaitlist (7)
     ✓ puts the first student at position 1 9ms
     ✓ puts the next student behind the ones already waiting 0ms
     ✓ refuses a student who is already waiting 0ms
     ✓ refuses a fourth student: at most 3 wait for one slot 0ms
     ✓ refuses the student who already holds the slot 0ms
     ✓ says ALREADY_WAITING, not WAITLIST_FULL, to a student already in a full line 0ms
     ✓ never changes the queue it was given 0ms
   ✓ offerNext (2)
     ✓ offers the slot to the first student in line for 30 minutes 0ms
     ✓ offers nothing when nobody is waiting 0ms
   ✓ acceptOffer (2)
     ✓ accepts at 10:29, one minute before the offer expires 0ms
     ✓ refuses at 10:30: the offer has expired 0ms
 ✓ src/legacy/clubFee.test.js (14 tests) 8ms
   ✓ clubFee (characterization of v0) (14)
     ✓ quoted on WED: member false, BE-201 08:00–10:00, 30 seats ⇒ 400000 VND 5ms
     ✓ quoted on WED: member true, BE-201 08:00–10:00, 30 seats ⇒ 320000 VND 0ms
     ✓ quoted on WED: member false, BE-201 08:00–10:00, 40 seats ⇒ 400000 VND 0ms
     ✓ quoted on WED: member false, BE-201 08:00–10:00, 41 seats ⇒ 500000 VND 0ms
     ✓ quoted on WED: member false, BE-201 08:00–11:30, 30 seats ⇒ 700000 VND 0ms
     ✓ quoted on WED: member false, BE-201 08:00–12:00, 30 seats ⇒ 750000 VND 0ms
     ✓ quoted on WED: member true, AL-105 08:00–08:30, 30 seats ⇒ 140000 VND 0ms
     ✓ quoted on SAT: member true, AL-105 08:00–08:30, 30 seats ⇒ 210000 VND 0ms
     ✓ quoted on SUN: member false, AL-105 08:00–08:30, 30 seats ⇒ 263000 VND 0ms
     ✓ quoted on WED: member false, BE-201 10:00–08:00, 30 seats ⇒ 0 VND 0ms
     ✓ quoted on WED: member 1, BE-201 08:00–10:00, 30 seats ⇒ 320000 VND 0ms
     ✓ quoted on WED: member yes, BE-201 08:00–10:00, 30 seats ⇒ 400000 VND 0ms
     ✓ charges the weekend rate when the QUOTE is made on a weekend, whatever the event date (LF-212, pinned) 0ms
     ✓ returns NaN for a building it has no price for 0ms
 ✓ src/rules/code.test.js (4 tests) 15ms
   ✓ makeBookingCode (3)
     ✓ is "LF-" and 6 characters from the readable alphabet 1ms
     ✓ the same seed gives the same code; 20 codes from one seed are all different 0ms
     ✓ can produce the first and the last character of the alphabet 0ms
   ✓ newBookingRecord (1)
     ✓ takes its id and clock from the caller 13ms
 ✓ src/rules/days.test.js (4 tests) 5ms
   ✓ daysAheadVN (BR-05 counted in Viet Nam time) (4)
     ✓ now 2026-11-02T06:30:00+07:00 → 2026-11-16 is 14 days ahead 3ms
     ✓ now 2026-11-02T23:59:00+07:00 → 2026-11-16 is 14 days ahead 0ms
     ✓ now 2026-11-03T00:00:00+07:00 → 2026-11-16 is 13 days ahead 0ms
     ✓ now 2026-11-02T06:30:00+07:00 → 2026-11-02 is 0 days ahead 0ms
 ✓ src/rules/cancel.test.js (18 tests) 13ms
   ✓ canCancel (Lite-3: until 60 minutes before the start) (4)
     ✓ at 07:00, a 09:00 booking can be cancelled → true 1ms
     ✓ at 08:00, a 09:00 booking can be cancelled → true 0ms
     ✓ at 08:01, a 09:00 booking can be cancelled → false 0ms
     ✓ at 09:30, a 09:00 booking can be cancelled → false 0ms
   ✓ cancelDecision — who may cancel, and until when (US-11) (13)
     ✓ the owner, 2 hours before (AC2) 1ms
     ✓ the owner, exactly 60 minutes before (Lite-3, AC2) 0ms
     ✓ the owner, 59 minutes before (Lite-3, AC2) 0ms
     ✓ the owner, PENDING booking 0ms
     ✓ another student (AC3) 0ms
     ✓ a lecturer who does not own it (AC3) 0ms
     ✓ an admin, 2 hours before (AC6) 0ms
     ✓ an admin, 30 minutes before — admins are not bound by Lite-3 (AC6) 0ms
     ✓ the owner, already cancelled (AC4) 0ms
     ✓ the owner, already cancelled AND too late → ALREADY_CANCELLED 0ms
     ✓ an admin, already cancelled 0ms
     ✓ anyone, a booking that does not exist 0ms
     ✓ another student, a cancelled booking → NOT_FOUND, no leak (AC3) 0ms
   ✓ startsAtVN (1)
     ✓ reads date and start as Viet Nam time: 09:00 in Ha Noi is 02:00 UTC 9ms
 ✓ src/ci/policy.test.js (15 tests) 71ms
   ✓ checkWorkflow (15)
     ✓ a workflow that follows every rule passes all 8 18ms
     ✓ R1: npm install instead of npm ci 6ms
     ✓ R2: a setup-node step without cache: npm 3ms
     ✓ R3: no PostgreSQL service 12ms
     ✓ R3: a service without a health check 6ms
     ✓ R3: the URL points at a port nobody published 3ms
     ✓ R4: browsers without their system libraries 2ms
     ✓ R5: the gate name changes with the event 2ms
     ✓ R6: a gate without if: always() is skipped when a job fails 2ms
     ✓ R6: a gate that never reads the results 2ms
     ✓ R7: the gate forgot a blocking job 2ms
     ✓ R7: the gate needs the report-only quarantine job 2ms
     ✓ R7: quarantined tests inside a blocking job 5ms
     ✓ R8: continue-on-error on a matrix job hides red legs 2ms
     ✓ R8: a Node version below engines 2ms
 ✓ src/lib/mailer.test.js (4 tests) 73ms
   ✓ createHttpMailer (4)
     ✓ posts { to, subject } with a Bearer key and returns the id 53ms
     ✓ 429 → RATE_LIMITED 4ms
     ✓ 400 → MAIL_FAILED with the status as the cause 4ms
     ✓ 503 → MAIL_FAILED with the status as the cause 2ms
 ✓ src/booking/service.test.js (6 tests) 61ms
   ✓ bookLab (6)
     ✓ stores a confirmed booking 15ms
     ✓ rejects a rule violation with its code before touching the database 1ms
     ✓ rejects an overlapping booking with OVERLAP (BR-04) 18ms
     ✓ accepts the slot that starts when the previous one ends (BR-04) 23ms
     ✓ turns a failing lookup into STORAGE_DOWN and keeps the cause 0ms
     ✓ turns a failing insert into STORAGE_DOWN 0ms
 ✓ src/booking/waitlistService.test.js (3 tests) 68ms
   ✓ cancelBooking (3)
     ✓ deletes the booking and offers the slot to the first student waiting 31ms
     ✓ sends no e-mail when nobody is waiting 18ms
     ✓ refuses an unknown booking with NOT_FOUND 18ms
 ✓ src/notify/notify.test.js (7 tests) 55ms
   ✓ buildMail (pure) (2)
     ✓ CONFIRMED booking with 20 seats → mail to an@fpt.edu.vn 1ms
     ✓ PENDING booking with 31 seats → mail to approvals@labflow.example 0ms
   ✓ bookAndNotify (5)
     ✓ a confirmed booking e-mails the student once 14ms
     ✓ a 31-seat student booking e-mails only the approver 13ms
     ✓ a failed e-mail keeps the booking and reports notified: false 12ms
     ✓ a failed e-mail is logged with the booking id and the reason 13ms
     ✓ a rejected booking sends no e-mail 1ms
 ✓ src/ci/shard.test.js (13 tests) 11ms
   ✓ splitIntoShards (8)
     ✓ longest first, each into the lightest shard → 4 + 3 + 3 seconds 8ms
     ✓ every file exactly once, whatever the number of shards 0ms
     ✓ more shards than files → the extra shards are empty, not an error 0ms
     ✓ the input order does not matter: every CI machine computes the same split 0ms
     ✓ a file without a timing counts as UNKNOWN_MS 0ms
     ✓ total 0 is refused 0ms
     ✓ total -1 is refused 0ms
     ✓ total 1.5 is refused 0ms
   ✓ pickShard (4)
     ✓ "1/3" is the first shard, "3/3" the last (1-based, like --shard) 0ms
     ✓ 0/3 does not exist 0ms
     ✓ 4/3 does not exist 0ms
     ✓ a malformed spec is a SyntaxError 0ms
   ✓ durationsFromReport (1)
     ✓ relative file → milliseconds, from a Vitest JSON report 0ms
 ✓ src/api/rules.api.test.js (3 tests) 72ms
   ✓ approval through the API (3)
     ✓ LECTURER books 40 seats → CONFIRMED (Lite-2) 39ms
     ✓ ADMIN books 40 seats → CONFIRMED (Lite-2) 17ms
     ✓ STUDENT books 40 seats → PENDING (BR-06) 15ms
 ✓ src/booking/myBookings.test.js (7 tests) 264ms
   ✓ listMyBookings (US-11) (1)
     ✓ only my bookings, by date then start (AC1) 76ms
   ✓ cancelMyBooking (US-11) (6)
     ✓ cancels: the booking comes back CANCELLED and stays in my list (AC1, AC2) 33ms
     ✓ a cancelled slot can be booked again (AC5) 41ms
     ✓ refuses inside the last hour and changes nothing (AC2) 26ms
     ✓ someone else's booking looks missing, and stays booked (AC3) 24ms
     ✓ twice → ALREADY_CANCELLED the second time (AC4) 32ms
     ✓ two cancels at the same moment: exactly one wins (AC4) 24ms
 ✓ src/lib/retry.test.js (3 tests) 10ms
   ✓ retry (3)
     ✓ returns at once when the first attempt works 3ms
     ✓ waits 1 s then 2 s between attempts 2ms
     ✓ gives up after 3 attempts and rethrows the last error 3ms
 ✓ src/ci/rtm.test.js (19 tests) 5ms
   ✓ tagsOf (7)
     ✓ checkSlot accepts 08:00–12:00 (240 min) Lite-1 → ["Lite-1"] 2ms
     ✓ needsApproval (BR-06 decision table) LECTURER, 31 seats → false Lite-2 → ["BR-06","Lite-2"] 0ms
     ✓ cancelMyBooking (US-11) twice (AC4) → ["US-11 AC4"] 0ms
     ✓ the API on PostgreSQL (US-11) book → cancel (AC1, AC2) → ["US-11 AC1","US-11 AC2"] 0ms
     ✓ old style (US-11 AC2–AC4) → ["US-11 AC2","US-11 AC3","US-11 AC4"] 0ms
     ✓ AC2 without the story id → [] 0ms
     ✓ BR-4 is not an id, BR-045 neither → [] 0ms
   ✓ layerOf (7)
     ✓ src/rules/cancel.test.js → Unit 0ms
     ✓ src/api/myBookings.test.js → API 0ms
     ✓ test/integration/myBookings.int.test.js → DB 0ms
     ✓ web/MyBookings.test.jsx → UI 0ms
     ✓ e2e/huy-phong.spec.js → E2E 0ms
     ✓ /home/runner/work/x/src/api/server.test.js → API 0ms
     ✓ src/ci/rtm.test.js → null 0ms
   ✓ reading the reports (2)
     ✓ Vitest: one entry per test, path relative to the project 0ms
     ✓ Playwright: describe titles join the name, the setup project is ignored, flaky counts as passed 0ms
   ✓ buildMatrix and traceGaps (3)
     ✓ counts passing tests only, per layer 0ms
     ✓ a High-risk requirement needs a test above Unit; an untested in-scope one is a gap; out of scope never is 0ms
     ✓ renders a Markdown table with the verdict per row 0ms
 ✓ src/ci/summary.test.js (11 tests) 4ms
   ✓ testHeadline (4)
     ✓ green: how many passed out of how many 1ms
     ✓ red: the number of failures comes first 0ms
     ✓ a single failure is enough to be red 0ms
     ✓ skipped tests are said out loud, not hidden in the total 0ms
   ✓ failedTests (2)
     ✓ one line per failed test: relative file, full name, first line of the error 0ms
     ✓ nothing failed → empty 0ms
   ✓ coverageTable (2)
     ✓ two decimals, the minimum, and a mark per metric 0ms
     ✓ exactly at the minimum passes; just under fails 0ms
   ✓ mergeReports (1)
     ✓ unit + web: the counts add up and every file is kept 0ms
   ✓ stepSummary (2)
     ✓ title, headline, failures, then coverage — separated by blank lines 0ms
     ✓ without coverage there is no table 0ms
 ✓ src/lib/retry-last.test.js (1 test) 5ms
   ✓ gives up right after the 3rd attempt: no wait after the last one 4ms
 ✓ src/notify/reminder.test.js (1 test) 3ms
   ✓ sends "Reminder: <lab> at <start> tomorrow" to the student 2ms
 ✓ src/api/server.test.js (12 tests) 262ms
   ✓ POST /api/bookings (4)
     ✓ 201 with Location and the public booking 41ms
     ✓ 401 without a token 3ms
     ✓ 400 VALIDATION for seats 0, and for a role in the body 4ms
     ✓ 422 for a rule, 409 for a taken slot (BR-04) 28ms
   ✓ who may read what (8)
     ✓ the owner reading booking 1 → 200 28ms
     ✓ another student reading booking 1 → 404 41ms
     ✓ a lecturer reading booking 1 → 404 57ms
     ✓ an admin reading booking 1 → 200 36ms
     ✓ STUDENT on the admin list → 403 2ms
     ✓ LECTURER on the admin list → 403 3ms
     ✓ ADMIN on the admin list → 200 11ms
     ✓ an expired token → 401 (clock fixed in 2030) 6ms
 ✓ src/ci/quality.test.js (7 tests) 7ms
   ✓ mutationScore (3)
     ✓ counts killed and timed-out mutants as detected, the way Stryker does 2ms
     ✓ leaves out mutants that could not run; nothing to run → 0 0ms
     ✓ rounds to two decimals: 427 + 2 of 433 → 99.08 0ms
   ✓ qualityReport (4)
     ✓ all good → no problems, a green headline and every section 2ms
     ✓ lists every reason not to merge 1ms
     ✓ a missing coverage or mutation report is a problem, not a pass 0ms
     ✓ exactly at a minimum is enough 0ms
 ✓ src/legacy/monthlyReport.test.js (2 tests) 11ms
   ✓ monthlyReport (characterization) (2)
     ✓ prints the same reports as v0, for every lab and month we keep 10ms
     ✓ counts no holiday when the holiday service cannot be reached, as v0 did 0ms
 ✓ src/ci/workflow.test.js (15 tests) 4ms
   ✓ .github/workflows/test.yml (15)
     ✓ R1 npm ci, never npm install 1ms
     ✓ R2 setup-node caches the npm downloads 0ms
     ✓ R3 integration tests get a healthy PostgreSQL service 0ms
     ✓ R4 Playwright browsers come with their system libraries 0ms
     ✓ R5 one gate job named exactly ci-ok 0ms
     ✓ R6 the gate runs even when a job it needs failed 0ms
     ✓ R7 every blocking job is required; report-only jobs never block 0ms
     ✓ R8 a red matrix leg makes the job red 0ms
     ✓ runs on pull requests and on pushes to main 0ms
     ✓ the unit job tests every Node version that package.json supports, and only those 0ms
     ✓ the integration job uses the same PostgreSQL major version as production (17) and waits for it 0ms
     ✓ e2e installs Chromium with its system libraries before running Playwright 0ms
     ✓ every test job uploads its reports, even when the tests are red 0ms
     ✓ the gate requires exactly unit, integration, e2e, mutation and report (lesson 11.4) 0ms
     ✓ the report job reads every report, runs even after a red job, and keeps the exit code through tee 0ms
 ✓ src/auth/login-guard.test.js (5 tests) 3ms
   ✓ createLoginGuard (BR-02: 5 failures → locked 15 minutes) (5)
     ✓ 4 failures do not lock 1ms
     ✓ the 5th failure locks 0ms
     ✓ still locked at 14:59.999, unlocked at exactly 15:00 0ms
     ✓ a successful login resets the counter 0ms
     ✓ locks only the account that failed 0ms
 ✓ src/ci/gate.test.js (7 tests) 3ms
   ✓ decideMerge — the ci-ok gate (7)
     ✓ every required job succeeded → may merge 1ms
     ✓ a required job that is failure blocks the merge 0ms
     ✓ a required job that is cancelled blocks the merge 0ms
     ✓ a required job that is skipped blocks the merge 0ms
     ✓ a required job missing from needs blocks (someone deleted it from the workflow) 0ms
     ✓ every problem is listed, not only the first 0ms
     ✓ a job that is not required never blocks (report-only, e.g. quarantine) 0ms
 ✓ src/report/monthly.test.js (3 tests) 4ms
   ✓ buildMonthlyReport (2)
     ✓ prints one line per kept booking and the four totals 1ms
     ✓ counts Saturday and Sunday by the calendar date, whatever the time zone of the machine 0ms
   ✓ monthlyReport with injected dependencies (object seams) (1)
     ✓ reads the bookings, the holidays and today from what it is given 1ms
 ✓ src/rules/clubFee.test.js (1 test) 3ms
   ✓ quoteClubFee (1)
     ✓ charges 1.5 times on a Sunday and the plain price on a Monday 2ms
 ✓ src/api/myBookings.test.js (18 tests) 565ms
   ✓ GET /api/bookings (US-11) (2)
     ✓ 200: only my bookings, cancelled ones too, as in the contract (AC1) 88ms
     ✓ 401 without a token 4ms
   ✓ POST /api/bookings/:id/cancel (US-11) (16)
     ✓ 200 with the booking, now CANCELLED (AC2) 40ms
     ✓ Lite-3: at 07:00 (60 minutes before) → 200 CANCELLED (AC2) 76ms
     ✓ Lite-3: at 07:01 (59 minutes before) → 422 TOO_LATE_TO_CANCEL (AC2) 32ms
     ✓ binh (STUDENT) cancelling an’s booking → 404 (AC3) 43ms
     ✓ thay (LECTURER) cancelling an’s booking → 404 (AC3) 26ms
     ✓ boss (ADMIN) cancelling an’s booking → 200 (AC6) 27ms
     ✓ an admin may cancel inside the last hour (AC6) 28ms
     ✓ 409 ALREADY_CANCELLED the second time (AC4) 39ms
     ✓ id 999 → 404, never 500 19ms
     ✓ id abc → 404, never 500 16ms
     ✓ id 0 → 404, never 500 15ms
     ✓ id -1 → 404, never 500 15ms
     ✓ id 1.5 → 404, never 500 15ms
     ✓ id 2147483648 → 404, never 500 15ms
     ✓ 401 without a token, and the booking is untouched 22ms
     ✓ after cancelling, the same slot can be booked again: 201 (AC5) 40ms

 Test Files  33 passed (33)
      Tests  298 passed (298)
   Start at  11:48:59
   Duration  1.20s (tests 39%, import 27%, transform 24%, worker 9%)

    Isolate  33 workers spawned · ~98ms startup each (spawn + environment, per file)
             at least ~263ms faster with isolate: false — reuses workers across files instead of one per file

 % Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   98.32 |     93.3 |   97.47 |   98.93 |                   
 api               |   91.54 |    82.35 |      90 |   94.73 |                   
  auth.js          |     100 |      100 |     100 |     100 |                   
  myBookings.js    |     100 |      100 |     100 |     100 |                   
  schemas.js       |     100 |      100 |     100 |     100 |                   
  server.js        |      88 |       76 |   84.61 |    92.1 | 11,57-59          
 auth              |   92.85 |    85.71 |      80 |   92.85 |                   
  login-guard.js   |   92.85 |    85.71 |      80 |   92.85 | 5                 
 booking           |   97.14 |    91.66 |      96 |   98.11 |                   
  myBookings.js    |     100 |      100 |     100 |     100 |                   
  service.js       |   98.03 |    95.65 |     100 |     100 | 68                
  ...istService.js |   91.66 |    77.77 |   66.66 |      90 | 8                 
 ci                |   99.23 |    91.41 |   98.85 |     100 |                   
  gate.js          |     100 |      100 |     100 |     100 |                   
  policy.js        |      98 |    85.33 |   97.72 |     100 | ...29-31,43,69,77 
  quality.js       |     100 |      100 |     100 |     100 |                   
  rtm.js           |     100 |    95.65 |     100 |     100 | 29-39             
  shard.js         |     100 |       95 |     100 |     100 | 32                
  summary.js       |     100 |    84.21 |     100 |     100 | 17-29             
 legacy            |     100 |      100 |     100 |     100 |                   
  club-prices.js   |     100 |      100 |     100 |     100 |                   
  clubFee.js       |     100 |      100 |     100 |     100 |                   
  monthlyReport.js |     100 |      100 |     100 |     100 |                   
 lib               |     100 |      100 |     100 |     100 |                   
  mailer.js        |     100 |      100 |     100 |     100 |                   
  retry.js         |     100 |      100 |     100 |     100 |                   
 notify            |     100 |      100 |     100 |     100 |                   
  notify.js        |     100 |      100 |     100 |     100 |                   
  reminder.js      |     100 |      100 |     100 |     100 |                   
 report            |     100 |      100 |     100 |     100 |                   
  monthly.js       |     100 |      100 |     100 |     100 |                   
 rules             |     100 |      100 |     100 |     100 |                   
  booking.js       |     100 |      100 |     100 |     100 |                   
  busy.js          |     100 |      100 |     100 |     100 |                   
  cancel.js        |     100 |      100 |     100 |     100 |                   
  checkin.js       |     100 |      100 |     100 |     100 |                   
  clubFee.js       |     100 |      100 |     100 |     100 |                   
  code.js          |     100 |      100 |     100 |     100 |                   
  days.js          |     100 |      100 |     100 |     100 |                   
  recurring.js     |     100 |      100 |     100 |     100 |                   
  time.js          |     100 |      100 |     100 |     100 |                   
  waitlist.js      |     100 |      100 |     100 |     100 |                   
-------------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 98.32% ( 645/656 )
Branches     : 93.3% ( 376/403 )
Functions    : 97.47% ( 193/198 )
Lines        : 98.93% ( 463/468 )
================================================================================`,
  '112-int': `$ npm run test:int -- test/integration/myBookings.int.test.js

> labflow-lite@1.0.0 test:int
> vitest run --config vitest.integration.config.js test/integration/myBookings.int.test.js


 RUN  v5.0.5 …/labflow-lite

 ✓ test/integration/myBookings.int.test.js (8 tests) 321ms
   ✓ pgRepo — reading bookings back (US-11) (1)
     ✓ listByUser: my rows only, in the API shape, by date and start (AC1) 25ms
   ✓ cancelling in PostgreSQL (US-11) (3)
     ✓ two cancels at the same moment: one wins, one ALREADY_CANCELLED (AC4) 46ms
     ✓ a cancelled slot can be booked again — the exclusion constraint ignores CANCELLED rows (AC5) 46ms
     ✓ the constraint still refuses an overlap with a live booking (BR-04) 14ms
   ✓ the API on PostgreSQL, checked against openapi.json (US-11) (4)
     ✓ book → list → cancel → list: every response is in the contract (AC1, AC2) 106ms
     ✓ cancel id 2147483647 → 404, not a database error 22ms
     ✓ cancel id 2147483648 → 404, not a database error 5ms
     ✓ cancel id abc → 404, not a database error 7ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  11:47:53
   Duration  1.72s (tests 38%, import 34%, transform 28%)`,
  '112-mutation': `$ npm run test:mutation

> labflow-lite@1.0.0 test:mutation
> stryker run

04:48:34 (11164) INFO ProjectReader Found 10 of 408 file(s) to be mutated.
04:48:34 (11164) INFO Instrumenter Instrumented 10 source file(s) with 433 mutant(s)
04:48:34 (11164) INFO ConcurrencyTokenProvider Creating 9 test runner process(es).
04:48:35 (11164) INFO BroadcastReporter Detected that current console does not support the "progress" reporter, downgrading to "progress-append-only" reporter
04:48:35 (11164) INFO DryRunExecutor Starting initial test run (vitest test runner with "perTest" coverage analysis). This may take a while.
04:48:39 (11164) INFO DryRunExecutor Initial test run succeeded. Ran 197 tests in 3 seconds (net 1246.6001169999995 ms, overhead 2377.3998830000005 ms).
Mutation testing 55% (elapsed: <1m, remaining: <1m) 141/433 tested (0 survived, 0 timed out)

All tests
  api
    myBookings.test.js
      ✓ GET /api/bookings (US-11) > 200: only my bookings, cancelled ones too, as in the contract (AC1) [line 19] (killed 50)
      ✘ GET /api/bookings (US-11) > 401 without a token [line 29] (covered 0)
      ~ POST /api/bookings/:id/cancel (US-11) > 200 with the booking, now CANCELLED (AC2) [line 37] (covered 107)
      ✓ POST /api/bookings/:id/cancel (US-11) > Lite-3: at 07:00 (60 minutes before) → 200 CANCELLED (AC2) [line 47] (killed 1)
      ✓ POST /api/bookings/:id/cancel (US-11) > Lite-3: at 07:01 (59 minutes before) → 422 TOO_LATE_TO_CANCEL (AC2) [line 47] (killed 11)
      ✓ POST /api/bookings/:id/cancel (US-11) > binh (STUDENT) cancelling an’s booking → 404 (AC3) [line 58] (killed 7)
      ~ POST /api/bookings/:id/cancel (US-11) > thay (LECTURER) cancelling an’s booking → 404 (AC3) [line 58] (covered 90)
      ✓ POST /api/bookings/:id/cancel (US-11) > boss (ADMIN) cancelling an’s booking → 200 (AC6) [line 58] (killed 2)
      ~ POST /api/bookings/:id/cancel (US-11) > an admin may cancel inside the last hour (AC6) [line 65] (covered 97)
      ✓ POST /api/bookings/:id/cancel (US-11) > 409 ALREADY_CANCELLED the second time (AC4) [line 70] (killed 2)
      ~ POST /api/bookings/:id/cancel (US-11) > id 999 → 404, never 500 [line 78] (covered 85)
      ~ POST /api/bookings/:id/cancel (US-11) > id abc → 404, never 500 [line 78] (covered 73)
      ~ POST /api/bookings/:id/cancel (US-11) > id 0 → 404, never 500 [line 78] (covered 73)
      ~ POST /api/bookings/:id/cancel (US-11) > id -1 → 404, never 500 [line 78] (covered 73)
      ~ POST /api/bookings/:id/cancel (US-11) > id 1.5 → 404, never 500 [line 78] (covered 73)
      ~ POST /api/bookings/:id/cancel (US-11) > id 2147483648 → 404, never 500 [line 78] (covered 73)
      ✓ POST /api/bookings/:id/cancel (US-11) > 401 without a token, and the booking is untouched [line 84] (killed 2)
      ~ POST /api/bookings/:id/cancel (US-11) > after cancelling, the same slot can be booked again: 201 (AC5) [line 91] (covered 107)
    rules.api.test.js
      ~ approval through the API > LECTURER books 40 seats → CONFIRMED (Lite-2) [line 11] (covered 67)
      ~ approval through the API > ADMIN books 40 seats → CONFIRMED (Lite-2) [line 11] (covered 70)
      ~ approval through the API > STUDENT books 40 seats → PENDING (BR-06) [line 11] (covered 73)
    server.test.js
      ~ POST /api/bookings > 201 with Location and the public booking [line 8] (covered 73)
      ✘ POST /api/bookings > 401 without a token [line 16] (covered 0)
      ✘ POST /api/bookings > 400 VALIDATION for seats 0, and for a role in the body [line 21] (covered 0)
      ~ POST /api/bookings > 422 for a rule, 409 for a taken slot (BR-04) [line 30] (covered 76)
      ~ who may read what > the owner reading booking 1 → 200 [line 47] (covered 73)
      ~ who may read what > another student reading booking 1 → 404 [line 47] (covered 73)
      ~ who may read what > a lecturer reading booking 1 → 404 [line 47] (covered 73)
      ~ who may read what > an admin reading booking 1 → 200 [line 47] (covered 73)
      ✘ who may read what > STUDENT on the admin list → 403 [line 53] (covered 0)
      ✘ who may read what > LECTURER on the admin list → 403 [line 53] (covered 0)
      ✘ who may read what > ADMIN on the admin list → 200 [line 53] (covered 0)
      ✘ who may read what > an expired token → 401 (clock fixed in 2030) [line 58] (covered 0)
  booking
    myBookings.test.js
      ~ listMyBookings (US-11) > only my bookings, by date then start (AC1) [line 11] (covered 73)
      ~ cancelMyBooking (US-11) > cancels: the booking comes back CANCELLED and stays in my list (AC1, AC2) [line 23] (covered 107)
      ~ cancelMyBooking (US-11) > a cancelled slot can be booked again (AC5) [line 31] (covered 107)
      ~ cancelMyBooking (US-11) > refuses inside the last hour and changes nothing (AC2) [line 38] (covered 108)
      ~ cancelMyBooking (US-11) > someone else's booking looks missing, and stays booked (AC3) [line 45] (covered 90)
      ~ cancelMyBooking (US-11) > twice → ALREADY_CANCELLED the second time (AC4) [line 52] (covered 110)
      ~ cancelMyBooking (US-11) > two cancels at the same moment: exactly one wins (AC4) [line 59] (covered 107)
    service.test.js
      ~ bookLab > stores a confirmed booking [line 7] (covered 73)
      ~ bookLab > rejects a rule violation with its code before touching the database [line 11] (covered 44)
      ~ bookLab > rejects an overlapping booking with OVERLAP (BR-04) [line 16] (covered 73)
      ~ bookLab > accepts the slot that starts when the previous one ends (BR-04) [line 22] (covered 73)
      ~ bookLab > turns a failing lookup into STORAGE_DOWN and keeps the cause [line 28] (covered 52)
      ~ bookLab > turns a failing insert into STORAGE_DOWN [line 36] (covered 73)
    waitlistService.test.js
      ~ cancelBooking > deletes the booking and offers the slot to the first student waiting [line 18] (covered 82)
      ~ cancelBooking > sends no e-mail when nobody is waiting [line 31] (covered 79)
      ~ cancelBooking > refuses an unknown booking with NOT_FOUND [line 37] (covered 73)
  legacy
    clubFee.test.js
      ✓ clubFee (characterization of v0) > quoted on WED: member false, BE-201 08:00–10:00, 30 seats ⇒ 400000 VND [line 33] (killed 21)
      ✓ clubFee (characterization of v0) > quoted on WED: member true, BE-201 08:00–10:00, 30 seats ⇒ 320000 VND [line 33] (killed 2)
      ✓ clubFee (characterization of v0) > quoted on WED: member false, BE-201 08:00–10:00, 40 seats ⇒ 400000 VND [line 33] (killed 1)
      ✓ clubFee (characterization of v0) > quoted on WED: member false, BE-201 08:00–10:00, 41 seats ⇒ 500000 VND [line 33] (killed 2)
      ✓ clubFee (characterization of v0) > quoted on WED: member false, BE-201 08:00–11:30, 30 seats ⇒ 700000 VND [line 33] (killed 1)
      ✓ clubFee (characterization of v0) > quoted on WED: member false, BE-201 08:00–12:00, 30 seats ⇒ 750000 VND [line 33] (killed 3)
      ~ clubFee (characterization of v0) > quoted on WED: member true, AL-105 08:00–08:30, 30 seats ⇒ 140000 VND [line 33] (covered 32)
      ✓ clubFee (characterization of v0) > quoted on SAT: member true, AL-105 08:00–08:30, 30 seats ⇒ 210000 VND [line 33] (killed 6)
      ✓ clubFee (characterization of v0) > quoted on SUN: member false, AL-105 08:00–08:30, 30 seats ⇒ 263000 VND [line 33] (killed 1)
      ~ clubFee (characterization of v0) > quoted on WED: member false, BE-201 10:00–08:00, 30 seats ⇒ 0 VND [line 33] (covered 31)
      ~ clubFee (characterization of v0) > quoted on WED: member 1, BE-201 08:00–10:00, 30 seats ⇒ 320000 VND [line 33] (covered 32)
      ~ clubFee (characterization of v0) > quoted on WED: member yes, BE-201 08:00–10:00, 30 seats ⇒ 400000 VND [line 33] (covered 31)
      ~ clubFee (characterization of v0) > charges the weekend rate when the QUOTE is made on a weekend, whatever the event date (LF-212, pinned) [line 37] (covered 32)
      ~ clubFee (characterization of v0) > returns NaN for a building it has no price for [line 41] (covered 31)
    monthlyReport.test.js
      ~ monthlyReport (characterization) > prints the same reports as v0, for every lab and month we keep [line 16] (covered 21)
      ~ monthlyReport (characterization) > counts no holiday when the holiday service cannot be reached, as v0 did [line 25] (covered 21)
  notify/notify.test.js
    ✘ buildMail (pure) > CONFIRMED booking with 20 seats → mail to an@fpt.edu.vn [line 13] (covered 0)
    ✘ buildMail (pure) > PENDING booking with 31 seats → mail to approvals@labflow.example [line 13] (covered 0)
    ~ bookAndNotify > a confirmed booking e-mails the student once [line 19] (covered 73)
    ~ bookAndNotify > a 31-seat student booking e-mails only the approver [line 26] (covered 73)
    ~ bookAndNotify > a failed e-mail keeps the booking and reports notified: false [line 32] (covered 73)
    ~ bookAndNotify > a failed e-mail is logged with the booking id and the reason [line 39] (covered 73)
    ~ bookAndNotify > a rejected booking sends no e-mail [line 45] (covered 44)
  report/monthly.test.js
    ~ buildMonthlyReport > prints one line per kept booking and the four totals [line 8] (covered 21)
    ~ buildMonthlyReport > counts Saturday and Sunday by the calendar date, whatever the time zone of the machine [line 14] (covered 21)
    ~ monthlyReport with injected dependencies (object seams) > reads the bookings, the holidays and today from what it is given [line 21] (covered 21)
  rules
    booking.test.js
      ✓ checkSlot > accepts > 07:00–08:00 (60 min) BR-04 [line 11] (killed 1)
      ✓ checkSlot > accepts > 20:00–21:00 (60 min) BR-04 [line 11] (killed 1)
      ✓ checkSlot > accepts > 08:00–08:30 (30 min) BR-04 [line 11] (killed 1)
      ✓ checkSlot > accepts > 08:00–12:00 (240 min) Lite-1 [line 11] (killed 1)
      ✓ checkSlot > rejects > 06:30–08:00 with OUTSIDE_HOURS BR-04 [line 25] (killed 6)
      ✓ checkSlot > rejects > 20:00–21:30 with OUTSIDE_HOURS BR-04 [line 25] (killed 1)
      ✓ checkSlot > rejects > 08:15–09:00 with OFF_GRID BR-04 [line 25] (killed 6)
      ✓ checkSlot > rejects > 08:00–09:10 with OFF_GRID BR-04 [line 25] (killed 1)
      ✓ checkSlot > rejects > 10:00–09:00 with END_BEFORE_START BR-04 [line 25] (killed 4)
      ✓ checkSlot > rejects > 09:00–09:00 with END_BEFORE_START BR-04 [line 25] (killed 1)
      ✓ checkSlot > rejects > 08:00–12:30 with TOO_LONG Lite-1 [line 25] (killed 4)
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
      ✓ needsApproval (BR-06 decision table) > LECTURER, 31 seats → false Lite-2 [line 46] (killed 5)
      ✓ needsApproval (BR-06 decision table) > ADMIN, 31 seats → false Lite-2 [line 46] (killed 2)
      ✓ needsApproval (BR-06 decision table) > throws RangeError for 0 seats [line 49] (killed 4)
      ~ needsApproval (BR-06 decision table) > throws RangeError for -5 seats [line 49] (covered 10)
      ~ needsApproval (BR-06 decision table) > throws RangeError for 2.5 seats [line 49] (covered 7)
      ✓ createBooking > builds a PENDING booking for 31 seats [line 55] (killed 1)
      ✓ createBooking > throws the rule code for a bad slot [line 59] (killed 2)
    busy.test.js
      ✓ mergeBusy > returns no blocks for a day without bookings [line 8] (killed 2)
      ✓ mergeBusy > keeps separate bookings apart, sorted by start [line 12] (killed 19)
      ✓ mergeBusy > merges overlapping bookings into one block [line 21] (killed 3)
      ✓ mergeBusy > merges touching (10:00 ends, 10:00 starts) bookings into one block [line 21] (killed 1)
      ~ mergeBusy > merges one inside the other bookings into one block [line 21] (covered 46)
      ~ mergeBusy > merges inside, listed first bookings into one block [line 21] (covered 46)
      ~ mergeBusy > does not change the array it was given [line 25] (covered 45)
      ~ mergeBusy > rejects a time that is not HH:MM [line 31] (covered 16)
    cancel.test.js
      ~ canCancel (Lite-3: until 60 minutes before the start) > at 07:00, a 09:00 booking can be cancelled → true [line 12] (covered 7)
      ~ canCancel (Lite-3: until 60 minutes before the start) > at 08:00, a 09:00 booking can be cancelled → true [line 12] (covered 7)
      ~ canCancel (Lite-3: until 60 minutes before the start) > at 08:01, a 09:00 booking can be cancelled → false [line 12] (covered 7)
      ~ canCancel (Lite-3: until 60 minutes before the start) > at 09:30, a 09:00 booking can be cancelled → false [line 12] (covered 7)
      ~ cancelDecision — who may cancel, and until when (US-11) > the owner, 2 hours before (AC2) [line 39] (covered 34)
      ~ cancelDecision — who may cancel, and until when (US-11) > the owner, exactly 60 minutes before (Lite-3, AC2) [line 39] (covered 34)
      ~ cancelDecision — who may cancel, and until when (US-11) > the owner, 59 minutes before (Lite-3, AC2) [line 39] (covered 35)
      ~ cancelDecision — who may cancel, and until when (US-11) > the owner, PENDING booking [line 39] (covered 34)
      ~ cancelDecision — who may cancel, and until when (US-11) > another student (AC3) [line 39] (covered 17)
      ~ cancelDecision — who may cancel, and until when (US-11) > a lecturer who does not own it (AC3) [line 39] (covered 17)
      ~ cancelDecision — who may cancel, and until when (US-11) > an admin, 2 hours before (AC6) [line 39] (covered 24)
      ~ cancelDecision — who may cancel, and until when (US-11) > an admin, 30 minutes before — admins are not bound by Lite-3 (AC6) [line 39] (covered 24)
      ✓ cancelDecision — who may cancel, and until when (US-11) > the owner, already cancelled (AC4) [line 39] (killed 3)
      ~ cancelDecision — who may cancel, and until when (US-11) > the owner, already cancelled AND too late → ALREADY_CANCELLED [line 39] (covered 20)
      ~ cancelDecision — who may cancel, and until when (US-11) > an admin, already cancelled [line 39] (covered 21)
      ~ cancelDecision — who may cancel, and until when (US-11) > anyone, a booking that does not exist [line 39] (covered 12)
      ~ cancelDecision — who may cancel, and until when (US-11) > another student, a cancelled booking → NOT_FOUND, no leak (AC3) [line 39] (covered 17)
      ~ startsAtVN > reads date and start as Viet Nam time: 09:00 in Ha Noi is 02:00 UTC [line 45] (covered 3)
    checkin.test.js
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
    clubFee.test.js
      ~ quoteClubFee > charges 1.5 times on a Sunday and the plain price on a Monday [line 8] (covered 32)
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
      ✓ booking rules: the cases nobody wrote > a small student booking is CONFIRMED [line 14] (killed 6)
      ✓ booking rules: the cases nobody wrote > usageRate adds up the booked share of the 14 opening hours [line 17] (killed 5)
      ✓ parseTime: only exactly HH:MM > refuses 08:000 [line 23] (killed 4)
      ✓ parseTime: only exactly HH:MM > refuses 108:00 [line 23] (killed 1)
      ~ parseTime: only exactly HH:MM > the TypeError is ours, not a crash on null [line 26] (covered 12)
      ✓ parseTime: only exactly HH:MM > says which time is out of range [line 29] (killed 4)
      ✓ newBookingRecord without injected helpers > makes a UUID and stamps the current time [line 35] (killed 4)
    recurring.test.js
      ✓ weeklyDates > books the first date and the same weekday in each following week [line 8] (killed 33)
      ✓ weeklyDates > skips a holiday without adding an extra week [line 14] (killed 3)
      ✓ weeklyDates > keeps a class on the last day of term and drops the weeks after it [line 20] (killed 4)
      ✓ weeklyDates > reports HOLIDAY inside the term, but AFTER_TERM for a holiday after it [line 27] (killed 1)
      ~ weeklyDates > crosses a month and a year correctly [line 32] (covered 43)
      ✓ weeklyDates > accepts 1 week(s) [line 36] (killed 1)
      ✓ weeklyDates > accepts 15 week(s) [line 36] (killed 1)
      ✓ weeklyDates > refuses 0 weeks with BAD_WEEKS [line 40] (killed 8)
      ✓ weeklyDates > refuses 16 weeks with BAD_WEEKS [line 40] (killed 1)
      ~ weeklyDates > refuses 2.5 weeks with BAD_WEEKS [line 40] (covered 11)
      ✓ weeklyDates > refuses a series that starts after the term, and accepts one that starts on its last day [line 44] (killed 4)
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
      ~ formatTime > pads to HH:MM [line 18] (covered 6)
      ~ formatTime > round-trips with parseTime for every minute of the day [line 21] (covered 27)
    waitlist.test.js
      ✓ joinWaitlist > puts the first student at position 1 [line 8] (killed 11)
      ✓ joinWaitlist > puts the next student behind the ones already waiting [line 12] (killed 2)
      ✓ joinWaitlist > refuses a student who is already waiting [line 15] (killed 7)
      ✓ joinWaitlist > refuses a fourth student: at most 3 wait for one slot [line 19] (killed 3)
      ✓ joinWaitlist > refuses the student who already holds the slot [line 23] (killed 2)
      ~ joinWaitlist > says ALREADY_WAITING, not WAITLIST_FULL, to a student already in a full line [line 27] (covered 14)
      ~ joinWaitlist > never changes the queue it was given [line 31] (covered 19)
      ✓ offerNext > offers the slot to the first student in line for 30 minutes [line 41] (killed 9)
      ✓ offerNext > offers nothing when nobody is waiting [line 48] (killed 3)
      ✓ acceptOffer > accepts at 10:29, one minute before the offer expires [line 56] (killed 5)
      ✓ acceptOffer > refuses at 10:30: the offer has expired [line 60] (killed 3)

[Survived] ArithmeticOperator
src/rules/code.js:16:10
-       t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
+       t ^= t - Math.imul(t ^ t >>> 7, t | 61);

[Survived] StringLiteral
src/rules/days.js:7:44
-     return Math.round((Date.parse(dateText + 'T00:00:00Z') - Date.parse(todayVN + 'T00:00:00Z')) / DAY_MS);
+     return Math.round((Date.parse(dateText + "") - Date.parse(todayVN + 'T00:00:00Z')) / DAY_MS);

[Survived] StringLiteral
src/rules/days.js:7:81
-     return Math.round((Date.parse(dateText + 'T00:00:00Z') - Date.parse(todayVN + 'T00:00:00Z')) / DAY_MS);
+     return Math.round((Date.parse(dateText + 'T00:00:00Z') - Date.parse(todayVN + "")) / DAY_MS);

[Survived] ArrayDeclaration
src/rules/recurring.js:9:67
-   export function weeklyDates({ firstDate, weeks, until, holidays = [] }) {
+   export function weeklyDates({ firstDate, weeks, until, holidays = ["Stryker was here"] }) {

Ran 4.64 tests per mutant on average.
--------------|------------------|----------|-----------|------------|----------|----------|
              | % Mutation score |          |           |            |          |          |
File          |  total | covered | # killed | # timeout | # survived | # no cov | # errors |
--------------|--------|---------|----------|-----------|------------|----------|----------|
All files     |  99.08 |   99.08 |      427 |         2 |          4 |        0 |        0 |
 booking.js   | 100.00 |  100.00 |       94 |         0 |          0 |        0 |        0 |
 busy.js      | 100.00 |  100.00 |       19 |         0 |          0 |        0 |        0 |
 cancel.js    | 100.00 |  100.00 |       44 |         0 |          0 |        0 |        0 |
 checkin.js   | 100.00 |  100.00 |       74 |         0 |          0 |        0 |        0 |
 clubFee.js   | 100.00 |  100.00 |       37 |         0 |          0 |        0 |        0 |
 code.js      |  94.74 |   94.74 |       17 |         1 |          1 |        0 |        0 |
 days.js      |  84.62 |   84.62 |       11 |         0 |          2 |        0 |        0 |
 recurring.js |  98.28 |   98.28 |       56 |         1 |          1 |        0 |        0 |
 time.js      | 100.00 |  100.00 |       30 |         0 |          0 |        0 |        0 |
 waitlist.js  | 100.00 |  100.00 |       45 |         0 |          0 |        0 |        0 |
--------------|--------|---------|----------|-----------|------------|----------|----------|
04:48:58 (11164) INFO MutationTestReportHelper Final mutation score of 99.08 is greater than or equal to break threshold 95
04:48:58 (11164) INFO JsonReporter Your report can be found at: file://…/labflow-lite/reports/mutation/mutation.json
04:48:58 (11164) INFO HtmlReporter Your report can be found at: file://…/labflow-lite/reports/mutation/index.html
04:48:58 (11164) INFO MutationTestExecutor Done in 24 seconds.`,
  '112-pg-id-unit': `$ node scripts/thu-loi.mjs src/api/myBookings.js " || id > MAX_ID" "" src/ --reporter=dot
planted in src/api/myBookings.js:   || id > MAX_ID  →  


 RUN  v5.0.5 …/labflow-lite

··········································································································································································································································································································

 Test Files  33 passed (33)
      Tests  298 passed (298)
   Start at  11:48:19
   Duration  2.41s (tests 37%, import 34%, transform 26%, worker 4%)

    Isolate  33 workers spawned · ~244ms startup each (spawn + environment, per file)
             at least ~651ms faster with isolate: false — reuses workers across files instead of one per file`,
  '112-pg-id': `$ node scripts/thu-loi.mjs src/api/myBookings.js " || id > MAX_ID" "" --config vitest.integration.config.js test/integration/myBookings.int.test.js
planted in src/api/myBookings.js:   || id > MAX_ID  →  


 RUN  v5.0.5 …/labflow-lite

 ❯ test/integration/myBookings.int.test.js (8 tests | 1 failed) 284ms
   ✓ pgRepo — reading bookings back (US-11) (1)
     ✓ listByUser: my rows only, in the API shape, by date and start (AC1) 46ms
   ✓ cancelling in PostgreSQL (US-11) (3)
     ✓ two cancels at the same moment: one wins, one ALREADY_CANCELLED (AC4) 58ms
     ✓ a cancelled slot can be booked again — the exclusion constraint ignores CANCELLED rows (AC5) 28ms
     ✓ the constraint still refuses an overlap with a live booking (BR-04) 15ms
   ❯ the API on PostgreSQL, checked against openapi.json (US-11) (4)
     ✓ book → list → cancel → list: every response is in the contract (AC1, AC2) 50ms
     ✓ cancel id 2147483647 → 404, not a database error 14ms
     × cancel id 2147483648 → 404, not a database error 15ms
     ✓ cancel id abc → 404, not a database error 26ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  test/integration/myBookings.int.test.js > the API on PostgreSQL, checked against openapi.json (US-11) > cancel id 2147483648 → 404, not a database error
AssertionError: expected 500 to be 404 // Object.is equality

- Expected
+ Received

- 404
+ 500

 ❯ test/integration/myBookings.int.test.js:88:24
     86|   it.each(['2147483647', '2147483648', 'abc'])('cancel id %s → 404, no…
     87|     const res = await request(app).post('/api/bookings/' + raw + '/can…
     88|     expect(res.status).toBe(404);
       |                        ^
     89|   });
     90| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 7 passed (8)
   Start at  11:48:17
   Duration  1.15s (tests 44%, import 35%, transform 20%, worker 1%)`,
  '112-pg-ngay-unit': `$ node scripts/thu-loi.mjs src/booking/pgRepo.js "to_char(date, 'YYYY-MM-DD') AS date" "date" src/ --reporter=dot
planted in src/booking/pgRepo.js:  to_char(date, 'YYYY-MM-DD') AS date  →  date


 RUN  v5.0.5 …/labflow-lite

··········································································································································································································································································································

 Test Files  33 passed (33)
      Tests  298 passed (298)
   Start at  11:48:09
   Duration  2.06s (tests 42%, import 31%, transform 24%, worker 2%)

    Isolate  33 workers spawned · ~172ms startup each (spawn + environment, per file)
             at least ~458ms faster with isolate: false — reuses workers across files instead of one per file`,
  '112-pg-ngay': `$ node scripts/thu-loi.mjs src/booking/pgRepo.js "to_char(date, 'YYYY-MM-DD') AS date" "date" --config vitest.integration.config.js test/integration/myBookings.int.test.js
planted in src/booking/pgRepo.js:  to_char(date, 'YYYY-MM-DD') AS date  →  date


 RUN  v5.0.5 …/labflow-lite

 ❯ test/integration/myBookings.int.test.js (8 tests | 4 failed) 281ms
   ❯ pgRepo — reading bookings back (US-11) (1)
     × listByUser: my rows only, in the API shape, by date and start (AC1) 38ms
   ❯ cancelling in PostgreSQL (US-11) (3)
     × two cancels at the same moment: one wins, one ALREADY_CANCELLED (AC4) 34ms
     × a cancelled slot can be booked again — the exclusion constraint ignores CANCELLED rows (AC5) 46ms
     ✓ the constraint still refuses an overlap with a live booking (BR-04) 25ms
   ❯ the API on PostgreSQL, checked against openapi.json (US-11) (4)
     × book → list → cancel → list: every response is in the contract (AC1, AC2) 61ms
     ✓ cancel id 2147483647 → 404, not a database error 19ms
     ✓ cancel id 2147483648 → 404, not a database error 17ms
     ✓ cancel id abc → 404, not a database error 7ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  test/integration/myBookings.int.test.js > pgRepo — reading bookings back (US-11) > listByUser: my rows only, in the API shape, by date and start (AC1)
AssertionError: expected [ Array(2) ] to deeply equal [ ObjectContaining{…}, …(1) ]

- Expected
+ Received

  [
    {
-     "date": "2026-11-16",
+     "date": 2026-11-15T17:00:00.000Z,
+     "email": null,
      "end": "11:00",
+     "id": 3,
      "lab": "BE-201",
+     "minutes": 120,
+     "role": "STUDENT",
+     "seats": 20,
      "start": "09:00",
      "status": "CONFIRMED",
      "userId": "an",
    },
    {
-     "date": "2026-11-17",
+     "date": 2026-11-16T17:00:00.000Z,
+     "email": null,
      "end": "09:00",
+     "id": 1,
+     "lab": "BE-201",
+     "minutes": 60,
+     "role": "STUDENT",
+     "seats": 20,
      "start": "08:00",
+     "status": "CONFIRMED",
+     "userId": "an",
    },
  ]

 ❯ test/integration/myBookings.int.test.js:33:18
     31|     await bookLab(repo, input());
     32|     const mine = await repo.listByUser('an');
     33|     expect(mine).toEqual([
       |                  ^
     34|       expect.objectContaining({ lab: 'BE-201', date: '2026-11-16', sta…
     35|       expect.objectContaining({ date: '2026-11-17', start: '08:00', en…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯

 FAIL  test/integration/myBookings.int.test.js > cancelling in PostgreSQL (US-11) > two cancels at the same moment: one wins, one ALREADY_CANCELLED (AC4)
AssertionError: expected [ 'TOO_LATE_TO_CANCEL', …(1) ] to deeply equal [ 'ALREADY_CANCELLED', 'ok' ]

- Expected
+ Received

  [
-   "ALREADY_CANCELLED",
-   "ok",
+   "TOO_LATE_TO_CANCEL",
+   "TOO_LATE_TO_CANCEL",
  ]

 ❯ test/integration/myBookings.int.test.js:45:63
     43|     await Promise.all([pool.query('SELECT 1'), pool.query('SELECT 1')]…
     44|     const results = await Promise.all([1, 2].map(() => cancelMyBooking…
     45|     expect(results.map((r) => (r.ok ? 'ok' : r.code)).sort()).toEqual(…
       |                                                               ^
     46|   });
     47|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯

 FAIL  test/integration/myBookings.int.test.js > cancelling in PostgreSQL (US-11) > a cancelled slot can be booked again — the exclusion constraint ignores CANCELLED rows (AC5)
AssertionError: promise rejected "BookingError: OVERLAP { code: 'OVERL…' }" instead of resolving
 ❯ test/integration/myBookings.int.test.js:51:59
     49|     const { id } = await bookLab(repo, input());
     50|     await cancelMyBooking(repo, { id, user: an, now: at('07:00') });
     51|     await expect(bookLab(repo, input({ userId: 'binh' }))).resolves.to…
       |                                                           ^
     52|   });
     53|

Caused by: BookingError: OVERLAP
 ❯ bookLab src/booking/service.js:63:20
 ❯ test/integration/myBookings.int.test.js:51:5

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { code: 'OVERLAP' }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯

 FAIL  test/integration/myBookings.int.test.js > the API on PostgreSQL, checked against openapi.json (US-11) > book → list → cancel → list: every response is in the contract (AC1, AC2)
AssertionError: expected [ 201, 200, 422, 200 ] to deeply equal [ 201, 200, 200, 200 ]

- Expected
+ Received

  [
    201,
    200,
-   200,
+   422,
    200,
  ]

 ❯ test/integration/myBookings.int.test.js:77:75
     75|     const cancelled = await request(app).post('/api/bookings/' + creat…
     76|     const after = await request(app).get('/api/bookings').set('Authori…
     77|     expect([created.status, list.status, cancelled.status, after.statu…
       |                                                                           ^
     78|     expect(list.body).toEqual([{ id: 1, ...booking, status: 'CONFIRMED…
     79|     expect(after.body[0].status).toBe('CANCELLED');

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯


 Test Files  1 failed (1)
      Tests  4 failed | 4 passed (8)
   Start at  11:48:07
   Duration  1.27s (tests 40%, import 35%, transform 25%)`,
  '112-pg-race': `$ node scripts/thu-loi.mjs src/booking/pgRepo.js "WHERE id = \\$1 AND status <> 'CANCELLED' RETURNING" "WHERE id = \\$1 RETURNING" --config vitest.integration.config.js test/integration/myBookings.int.test.js
planted in src/booking/pgRepo.js:  WHERE id = $1 AND status <> 'CANCELLED' RETURNING  →  WHERE id = $1 RETURNING


 RUN  v5.0.5 …/labflow-lite

 ❯ test/integration/myBookings.int.test.js (8 tests | 1 failed) 329ms
   ✓ pgRepo — reading bookings back (US-11) (1)
     ✓ listByUser: my rows only, in the API shape, by date and start (AC1) 31ms
   ❯ cancelling in PostgreSQL (US-11) (3)
     × two cancels at the same moment: one wins, one ALREADY_CANCELLED (AC4) 40ms
     ✓ a cancelled slot can be booked again — the exclusion constraint ignores CANCELLED rows (AC5) 28ms
     ✓ the constraint still refuses an overlap with a live booking (BR-04) 40ms
   ✓ the API on PostgreSQL, checked against openapi.json (US-11) (4)
     ✓ book → list → cancel → list: every response is in the contract (AC1, AC2) 82ms
     ✓ cancel id 2147483647 → 404, not a database error 32ms
     ✓ cancel id 2147483648 → 404, not a database error 17ms
     ✓ cancel id abc → 404, not a database error 13ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  test/integration/myBookings.int.test.js > cancelling in PostgreSQL (US-11) > two cancels at the same moment: one wins, one ALREADY_CANCELLED (AC4)
AssertionError: expected [ 'ok', 'ok' ] to deeply equal [ 'ALREADY_CANCELLED', 'ok' ]

- Expected
+ Received

  [
-   "ALREADY_CANCELLED",
+   "ok",
    "ok",
  ]

 ❯ test/integration/myBookings.int.test.js:45:63
     43|     await Promise.all([pool.query('SELECT 1'), pool.query('SELECT 1')]…
     44|     const results = await Promise.all([1, 2].map(() => cancelMyBooking…
     45|     expect(results.map((r) => (r.ok ? 'ok' : r.code)).sort()).toEqual(…
       |                                                               ^
     46|   });
     47|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 7 passed (8)
   Start at  11:48:15
   Duration  1.35s (tests 41%, import 33%, transform 25%)`,
  '112-pg-where': `$ node scripts/thu-loi.mjs db/schema.sql "  ) WHERE (status <> 'CANCELLED')" "  )" --config vitest.integration.config.js test/integration/myBookings.int.test.js
planted in db/schema.sql:    ) WHERE (status <> 'CANCELLED')  →    )


 RUN  v5.0.5 …/labflow-lite

 ❯ test/integration/myBookings.int.test.js (8 tests | 1 failed) 383ms
   ✓ pgRepo — reading bookings back (US-11) (1)
     ✓ listByUser: my rows only, in the API shape, by date and start (AC1) 54ms
   ❯ cancelling in PostgreSQL (US-11) (3)
     ✓ two cancels at the same moment: one wins, one ALREADY_CANCELLED (AC4) 108ms
     × a cancelled slot can be booked again — the exclusion constraint ignores CANCELLED rows (AC5) 47ms
     ✓ the constraint still refuses an overlap with a live booking (BR-04) 11ms
   ✓ the API on PostgreSQL, checked against openapi.json (US-11) (4)
     ✓ book → list → cancel → list: every response is in the contract (AC1, AC2) 69ms
     ✓ cancel id 2147483647 → 404, not a database error 30ms
     ✓ cancel id 2147483648 → 404, not a database error 25ms
     ✓ cancel id abc → 404, not a database error 7ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  test/integration/myBookings.int.test.js > cancelling in PostgreSQL (US-11) > a cancelled slot can be booked again — the exclusion constraint ignores CANCELLED rows (AC5)
AssertionError: promise rejected "BookingError: OVERLAP { code: 'OVERL…' }" instead of resolving
 ❯ test/integration/myBookings.int.test.js:51:59
     49|     const { id } = await bookLab(repo, input());
     50|     await cancelMyBooking(repo, { id, user: an, now: at('07:00') });
     51|     await expect(bookLab(repo, input({ userId: 'binh' }))).resolves.to…
       |                                                           ^
     52|   });
     53|

Caused by: BookingError: OVERLAP
 ❯ Object.insert src/booking/pgRepo.js:26:41
 ❯ bookLab src/booking/service.js:66:12
 ❯ test/integration/myBookings.int.test.js:51:5

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { code: 'OVERLAP' }
Caused by: error: conflicting key value violates exclusion constraint "no_overlap"
 ❯ node_modules/pg-pool/index.js:45:11
 ❯ Object.insert src/booking/pgRepo.js:20:26
 ❯ bookLab src/booking/service.js:66:12
 ❯ test/integration/myBookings.int.test.js:51:5

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { length: 453, severity: 'ERROR', code: '23P01', detail: 'Key (lab, tsrange(date + start_time, date + end_time, '[)'::text))=(BE-201, ["2026-11-16 09:00:00","2026-11-16 11:00:00")) conflicts with existing key (lab, tsrange(date + start_time, date + end_time, '[)'::text))=(BE-201, ["2026-11-16 09:00:00","2026-11-16 11:00:00")).', hint: undefined, position: undefined, internalPosition: undefined, internalQuery: undefined, where: undefined, schema: 'public', table: 'bookings', dataType: undefined, constraint: 'no_overlap', file: 'execIndexing.c', routine: 'check_exclusion_or_unique_constraint' }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 7 passed (8)
   Start at  11:48:12
   Duration  1.33s (tests 44%, import 32%, transform 23%, worker 1%)`,
  '112-rule': `$ npx vitest run src/rules/cancel.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ src/rules/cancel.test.js (18 tests) 7ms
   ✓ canCancel (Lite-3: until 60 minutes before the start) (4)
     ✓ at 07:00, a 09:00 booking can be cancelled → true 1ms
     ✓ at 08:00, a 09:00 booking can be cancelled → true 0ms
     ✓ at 08:01, a 09:00 booking can be cancelled → false 0ms
     ✓ at 09:30, a 09:00 booking can be cancelled → false 0ms
   ✓ cancelDecision — who may cancel, and until when (US-11) (13)
     ✓ the owner, 2 hours before (AC2) 1ms
     ✓ the owner, exactly 60 minutes before (Lite-3, AC2) 0ms
     ✓ the owner, 59 minutes before (Lite-3, AC2) 0ms
     ✓ the owner, PENDING booking 0ms
     ✓ another student (AC3) 1ms
     ✓ a lecturer who does not own it (AC3) 0ms
     ✓ an admin, 2 hours before (AC6) 0ms
     ✓ an admin, 30 minutes before — admins are not bound by Lite-3 (AC6) 0ms
     ✓ the owner, already cancelled (AC4) 0ms
     ✓ the owner, already cancelled AND too late → ALREADY_CANCELLED 0ms
     ✓ an admin, already cancelled 0ms
     ✓ anyone, a booking that does not exist 0ms
     ✓ another student, a cancelled booking → NOT_FOUND, no leak (AC3) 0ms
   ✓ startsAtVN (1)
     ✓ reads date and start as Viet Nam time: 09:00 in Ha Noi is 02:00 UTC 1ms

 Test Files  1 passed (1)
      Tests  18 passed (18)
   Start at  11:47:27
   Duration  152ms (import 37%, transform 31%, tests 23%, worker 9%)`,
  '112-service': `$ npx vitest run src/booking/myBookings.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ src/booking/myBookings.test.js (7 tests) 272ms
   ✓ listMyBookings (US-11) (1)
     ✓ only my bookings, by date then start (AC1) 99ms
   ✓ cancelMyBooking (US-11) (6)
     ✓ cancels: the booking comes back CANCELLED and stays in my list (AC1, AC2) 32ms
     ✓ a cancelled slot can be booked again (AC5) 34ms
     ✓ refuses inside the last hour and changes nothing (AC2) 26ms
     ✓ someone else's booking looks missing, and stays booked (AC3) 26ms
     ✓ twice → ALREADY_CANCELLED the second time (AC4) 29ms
     ✓ two cancels at the same moment: exactly one wins (AC4) 23ms

 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  11:47:50
   Duration  403ms (tests 89%, transform 5%, import 5%, worker 1%)`,
  '112-stryker-utc': `$ npx stryker run --mutate src/rules/cancel.js
04:47:40 (8341) INFO ProjectReader Found 1 of 404 file(s) to be mutated.
04:47:40 (8341) INFO Instrumenter Instrumented 1 source file(s) with 44 mutant(s)
04:47:40 (8341) INFO ConcurrencyTokenProvider Creating 9 test runner process(es).
04:47:41 (8341) INFO BroadcastReporter Detected that current console does not support the "progress" reporter, downgrading to "progress-append-only" reporter
04:47:41 (8341) INFO DryRunExecutor Starting initial test run (vitest test runner with "perTest" coverage analysis). This may take a while.
04:47:44 (8341) INFO DryRunExecutor Initial test run succeeded. Ran 58 tests in 3 seconds (net 1354.1217550000006 ms, overhead 1640.8782449999994 ms).

All tests
  api
    myBookings.test.js
      ✓ GET /api/bookings (US-11) > 200: only my bookings, cancelled ones too, as in the contract (AC1) [line 19] (killed 18)
      ✘ GET /api/bookings (US-11) > 401 without a token [line 29] (covered 0)
      ~ POST /api/bookings/:id/cancel (US-11) > 200 with the booking, now CANCELLED (AC2) [line 37] (covered 34)
      ✓ POST /api/bookings/:id/cancel (US-11) > Lite-3: at 07:00 (60 minutes before) → 200 CANCELLED (AC2) [line 47] (killed 1)
      ✓ POST /api/bookings/:id/cancel (US-11) > Lite-3: at 07:01 (59 minutes before) → 422 TOO_LATE_TO_CANCEL (AC2) [line 47] (killed 11)
      ✓ POST /api/bookings/:id/cancel (US-11) > binh (STUDENT) cancelling an’s booking → 404 (AC3) [line 58] (killed 7)
      ~ POST /api/bookings/:id/cancel (US-11) > thay (LECTURER) cancelling an’s booking → 404 (AC3) [line 58] (covered 17)
      ✓ POST /api/bookings/:id/cancel (US-11) > boss (ADMIN) cancelling an’s booking → 200 (AC6) [line 58] (killed 2)
      ~ POST /api/bookings/:id/cancel (US-11) > an admin may cancel inside the last hour (AC6) [line 65] (covered 24)
      ✓ POST /api/bookings/:id/cancel (US-11) > 409 ALREADY_CANCELLED the second time (AC4) [line 70] (killed 2)
      ~ POST /api/bookings/:id/cancel (US-11) > id 999 → 404, never 500 [line 78] (covered 12)
      ✘ POST /api/bookings/:id/cancel (US-11) > id abc → 404, never 500 [line 78] (covered 0)
      ✘ POST /api/bookings/:id/cancel (US-11) > id 0 → 404, never 500 [line 78] (covered 0)
      ✘ POST /api/bookings/:id/cancel (US-11) > id -1 → 404, never 500 [line 78] (covered 0)
      ✘ POST /api/bookings/:id/cancel (US-11) > id 1.5 → 404, never 500 [line 78] (covered 0)
      ✘ POST /api/bookings/:id/cancel (US-11) > id 2147483648 → 404, never 500 [line 78] (covered 0)
      ✘ POST /api/bookings/:id/cancel (US-11) > 401 without a token, and the booking is untouched [line 84] (covered 0)
      ~ POST /api/bookings/:id/cancel (US-11) > after cancelling, the same slot can be booked again: 201 (AC5) [line 91] (covered 34)
    rules.api.test.js
      ✘ approval through the API > LECTURER books 40 seats → CONFIRMED (Lite-2) [line 11] (covered 0)
      ✘ approval through the API > ADMIN books 40 seats → CONFIRMED (Lite-2) [line 11] (covered 0)
      ✘ approval through the API > STUDENT books 40 seats → PENDING (BR-06) [line 11] (covered 0)
    server.test.js
      ✘ POST /api/bookings > 201 with Location and the public booking [line 8] (covered 0)
      ✘ POST /api/bookings > 401 without a token [line 16] (covered 0)
      ✘ POST /api/bookings > 400 VALIDATION for seats 0, and for a role in the body [line 21] (covered 0)
      ✘ POST /api/bookings > 422 for a rule, 409 for a taken slot (BR-04) [line 30] (covered 0)
      ✘ who may read what > the owner reading booking 1 → 200 [line 47] (covered 0)
      ✘ who may read what > another student reading booking 1 → 404 [line 47] (covered 0)
      ✘ who may read what > a lecturer reading booking 1 → 404 [line 47] (covered 0)
      ✘ who may read what > an admin reading booking 1 → 200 [line 47] (covered 0)
      ✘ who may read what > STUDENT on the admin list → 403 [line 53] (covered 0)
      ✘ who may read what > LECTURER on the admin list → 403 [line 53] (covered 0)
      ✘ who may read what > ADMIN on the admin list → 200 [line 53] (covered 0)
      ✘ who may read what > an expired token → 401 (clock fixed in 2030) [line 58] (covered 0)
  booking/myBookings.test.js
    ✘ listMyBookings (US-11) > only my bookings, by date then start (AC1) [line 11] (covered 0)
    ~ cancelMyBooking (US-11) > cancels: the booking comes back CANCELLED and stays in my list (AC1, AC2) [line 23] (covered 34)
    ~ cancelMyBooking (US-11) > a cancelled slot can be booked again (AC5) [line 31] (covered 34)
    ~ cancelMyBooking (US-11) > refuses inside the last hour and changes nothing (AC2) [line 38] (covered 35)
    ~ cancelMyBooking (US-11) > someone else's booking looks missing, and stays booked (AC3) [line 45] (covered 17)
    ~ cancelMyBooking (US-11) > twice → ALREADY_CANCELLED the second time (AC4) [line 52] (covered 37)
    ~ cancelMyBooking (US-11) > two cancels at the same moment: exactly one wins (AC4) [line 59] (covered 34)
  rules/cancel.test.js
    ~ canCancel (Lite-3: until 60 minutes before the start) > at 07:00, a 09:00 booking can be cancelled → true [line 12] (covered 7)
    ~ canCancel (Lite-3: until 60 minutes before the start) > at 08:00, a 09:00 booking can be cancelled → true [line 12] (covered 7)
    ~ canCancel (Lite-3: until 60 minutes before the start) > at 08:01, a 09:00 booking can be cancelled → false [line 12] (covered 7)
    ~ canCancel (Lite-3: until 60 minutes before the start) > at 09:30, a 09:00 booking can be cancelled → false [line 12] (covered 7)
    ~ cancelDecision — who may cancel, and until when (US-11) > the owner, 2 hours before (AC2) [line 39] (covered 34)
    ~ cancelDecision — who may cancel, and until when (US-11) > the owner, exactly 60 minutes before (Lite-3, AC2) [line 39] (covered 34)
    ~ cancelDecision — who may cancel, and until when (US-11) > the owner, 59 minutes before (Lite-3, AC2) [line 39] (covered 35)
    ~ cancelDecision — who may cancel, and until when (US-11) > the owner, PENDING booking [line 39] (covered 34)
    ~ cancelDecision — who may cancel, and until when (US-11) > another student (AC3) [line 39] (covered 17)
    ~ cancelDecision — who may cancel, and until when (US-11) > a lecturer who does not own it (AC3) [line 39] (covered 17)
    ~ cancelDecision — who may cancel, and until when (US-11) > an admin, 2 hours before (AC6) [line 39] (covered 24)
    ~ cancelDecision — who may cancel, and until when (US-11) > an admin, 30 minutes before — admins are not bound by Lite-3 (AC6) [line 39] (covered 24)
    ✓ cancelDecision — who may cancel, and until when (US-11) > the owner, already cancelled (AC4) [line 39] (killed 3)
    ~ cancelDecision — who may cancel, and until when (US-11) > the owner, already cancelled AND too late → ALREADY_CANCELLED [line 39] (covered 20)
    ~ cancelDecision — who may cancel, and until when (US-11) > an admin, already cancelled [line 39] (covered 21)
    ~ cancelDecision — who may cancel, and until when (US-11) > anyone, a booking that does not exist [line 39] (covered 12)
    ~ cancelDecision — who may cancel, and until when (US-11) > another student, a cancelled booking → NOT_FOUND, no leak (AC3) [line 39] (covered 17)
    ~ startsAtVN > reads date and start as Viet Nam time: 09:00 in Ha Noi is 02:00 UTC [line 45] (covered 3)

Ran 3.05 tests per mutant on average.
-----------|------------------|----------|-----------|------------|----------|----------|
           | % Mutation score |          |           |            |          |          |
File       |  total | covered | # killed | # timeout | # survived | # no cov | # errors |
-----------|--------|---------|----------|-----------|------------|----------|----------|
All files  | 100.00 |  100.00 |       44 |         0 |          0 |        0 |        0 |
 cancel.js | 100.00 |  100.00 |       44 |         0 |          0 |        0 |        0 |
-----------|--------|---------|----------|-----------|------------|----------|----------|
04:47:49 (8341) INFO MutationTestReportHelper Final mutation score of 100.00 is greater than or equal to break threshold 95
04:47:49 (8341) INFO JsonReporter Your report can be found at: file://…/labflow-lite/reports/mutation/mutation.json
04:47:49 (8341) INFO HtmlReporter Your report can be found at: file://…/labflow-lite/reports/mutation/index.html
04:47:49 (8341) INFO MutationTestExecutor Done in 9 seconds.`,
  '112-stryker-vn': `$ TZ=Asia/Ho_Chi_Minh npx stryker run --mutate src/rules/cancel.js
11:47:28 (7515) INFO ProjectReader Found 1 of 404 file(s) to be mutated.
11:47:28 (7515) INFO Instrumenter Instrumented 1 source file(s) with 44 mutant(s)
11:47:28 (7515) INFO ConcurrencyTokenProvider Creating 9 test runner process(es).
11:47:29 (7515) INFO BroadcastReporter Detected that current console does not support the "progress" reporter, downgrading to "progress-append-only" reporter
11:47:29 (7515) INFO DryRunExecutor Starting initial test run (vitest test runner with "perTest" coverage analysis). This may take a while.
11:47:33 (7515) INFO DryRunExecutor Initial test run succeeded. Ran 58 tests in 3 seconds (net 1386.261833000003 ms, overhead 2076.738166999997 ms).

All tests
  api
    myBookings.test.js
      ✓ GET /api/bookings (US-11) > 200: only my bookings, cancelled ones too, as in the contract (AC1) [line 19] (killed 18)
      ✘ GET /api/bookings (US-11) > 401 without a token [line 29] (covered 0)
      ~ POST /api/bookings/:id/cancel (US-11) > 200 with the booking, now CANCELLED (AC2) [line 37] (covered 34)
      ✓ POST /api/bookings/:id/cancel (US-11) > Lite-3: at 07:00 (60 minutes before) → 200 CANCELLED (AC2) [line 47] (killed 1)
      ✓ POST /api/bookings/:id/cancel (US-11) > Lite-3: at 07:01 (59 minutes before) → 422 TOO_LATE_TO_CANCEL (AC2) [line 47] (killed 10)
      ✓ POST /api/bookings/:id/cancel (US-11) > binh (STUDENT) cancelling an’s booking → 404 (AC3) [line 58] (killed 7)
      ~ POST /api/bookings/:id/cancel (US-11) > thay (LECTURER) cancelling an’s booking → 404 (AC3) [line 58] (covered 17)
      ✓ POST /api/bookings/:id/cancel (US-11) > boss (ADMIN) cancelling an’s booking → 200 (AC6) [line 58] (killed 2)
      ~ POST /api/bookings/:id/cancel (US-11) > an admin may cancel inside the last hour (AC6) [line 65] (covered 24)
      ✓ POST /api/bookings/:id/cancel (US-11) > 409 ALREADY_CANCELLED the second time (AC4) [line 70] (killed 2)
      ~ POST /api/bookings/:id/cancel (US-11) > id 999 → 404, never 500 [line 78] (covered 12)
      ✘ POST /api/bookings/:id/cancel (US-11) > id abc → 404, never 500 [line 78] (covered 0)
      ✘ POST /api/bookings/:id/cancel (US-11) > id 0 → 404, never 500 [line 78] (covered 0)
      ✘ POST /api/bookings/:id/cancel (US-11) > id -1 → 404, never 500 [line 78] (covered 0)
      ✘ POST /api/bookings/:id/cancel (US-11) > id 1.5 → 404, never 500 [line 78] (covered 0)
      ✘ POST /api/bookings/:id/cancel (US-11) > id 2147483648 → 404, never 500 [line 78] (covered 0)
      ✘ POST /api/bookings/:id/cancel (US-11) > 401 without a token, and the booking is untouched [line 84] (covered 0)
      ~ POST /api/bookings/:id/cancel (US-11) > after cancelling, the same slot can be booked again: 201 (AC5) [line 91] (covered 34)
    rules.api.test.js
      ✘ approval through the API > LECTURER books 40 seats → CONFIRMED (Lite-2) [line 11] (covered 0)
      ✘ approval through the API > ADMIN books 40 seats → CONFIRMED (Lite-2) [line 11] (covered 0)
      ✘ approval through the API > STUDENT books 40 seats → PENDING (BR-06) [line 11] (covered 0)
    server.test.js
      ✘ POST /api/bookings > 201 with Location and the public booking [line 8] (covered 0)
      ✘ POST /api/bookings > 401 without a token [line 16] (covered 0)
      ✘ POST /api/bookings > 400 VALIDATION for seats 0, and for a role in the body [line 21] (covered 0)
      ✘ POST /api/bookings > 422 for a rule, 409 for a taken slot (BR-04) [line 30] (covered 0)
      ✘ who may read what > the owner reading booking 1 → 200 [line 47] (covered 0)
      ✘ who may read what > another student reading booking 1 → 404 [line 47] (covered 0)
      ✘ who may read what > a lecturer reading booking 1 → 404 [line 47] (covered 0)
      ✘ who may read what > an admin reading booking 1 → 200 [line 47] (covered 0)
      ✘ who may read what > STUDENT on the admin list → 403 [line 53] (covered 0)
      ✘ who may read what > LECTURER on the admin list → 403 [line 53] (covered 0)
      ✘ who may read what > ADMIN on the admin list → 200 [line 53] (covered 0)
      ✘ who may read what > an expired token → 401 (clock fixed in 2030) [line 58] (covered 0)
  booking/myBookings.test.js
    ✘ listMyBookings (US-11) > only my bookings, by date then start (AC1) [line 11] (covered 0)
    ~ cancelMyBooking (US-11) > cancels: the booking comes back CANCELLED and stays in my list (AC1, AC2) [line 23] (covered 34)
    ~ cancelMyBooking (US-11) > a cancelled slot can be booked again (AC5) [line 31] (covered 34)
    ~ cancelMyBooking (US-11) > refuses inside the last hour and changes nothing (AC2) [line 38] (covered 35)
    ~ cancelMyBooking (US-11) > someone else's booking looks missing, and stays booked (AC3) [line 45] (covered 17)
    ~ cancelMyBooking (US-11) > twice → ALREADY_CANCELLED the second time (AC4) [line 52] (covered 37)
    ~ cancelMyBooking (US-11) > two cancels at the same moment: exactly one wins (AC4) [line 59] (covered 34)
  rules/cancel.test.js
    ~ canCancel (Lite-3: until 60 minutes before the start) > at 07:00, a 09:00 booking can be cancelled → true [line 12] (covered 7)
    ~ canCancel (Lite-3: until 60 minutes before the start) > at 08:00, a 09:00 booking can be cancelled → true [line 12] (covered 7)
    ~ canCancel (Lite-3: until 60 minutes before the start) > at 08:01, a 09:00 booking can be cancelled → false [line 12] (covered 7)
    ~ canCancel (Lite-3: until 60 minutes before the start) > at 09:30, a 09:00 booking can be cancelled → false [line 12] (covered 7)
    ~ cancelDecision — who may cancel, and until when (US-11) > the owner, 2 hours before (AC2) [line 39] (covered 34)
    ~ cancelDecision — who may cancel, and until when (US-11) > the owner, exactly 60 minutes before (Lite-3, AC2) [line 39] (covered 34)
    ~ cancelDecision — who may cancel, and until when (US-11) > the owner, 59 minutes before (Lite-3, AC2) [line 39] (covered 35)
    ~ cancelDecision — who may cancel, and until when (US-11) > the owner, PENDING booking [line 39] (covered 34)
    ~ cancelDecision — who may cancel, and until when (US-11) > another student (AC3) [line 39] (covered 17)
    ~ cancelDecision — who may cancel, and until when (US-11) > a lecturer who does not own it (AC3) [line 39] (covered 17)
    ~ cancelDecision — who may cancel, and until when (US-11) > an admin, 2 hours before (AC6) [line 39] (covered 24)
    ~ cancelDecision — who may cancel, and until when (US-11) > an admin, 30 minutes before — admins are not bound by Lite-3 (AC6) [line 39] (covered 24)
    ✓ cancelDecision — who may cancel, and until when (US-11) > the owner, already cancelled (AC4) [line 39] (killed 3)
    ~ cancelDecision — who may cancel, and until when (US-11) > the owner, already cancelled AND too late → ALREADY_CANCELLED [line 39] (covered 20)
    ~ cancelDecision — who may cancel, and until when (US-11) > an admin, already cancelled [line 39] (covered 21)
    ~ cancelDecision — who may cancel, and until when (US-11) > anyone, a booking that does not exist [line 39] (covered 12)
    ~ cancelDecision — who may cancel, and until when (US-11) > another student, a cancelled booking → NOT_FOUND, no leak (AC3) [line 39] (covered 17)
    ~ startsAtVN > reads date and start as Viet Nam time: 09:00 in Ha Noi is 02:00 UTC [line 45] (covered 3)

[Survived] StringLiteral
src/rules/cancel.js:12:40
-     return new Date(date + 'T' + start + ':00+07:00');
+     return new Date(date + 'T' + start + "");

Ran 3.32 tests per mutant on average.
-----------|------------------|----------|-----------|------------|----------|----------|
           | % Mutation score |          |           |            |          |          |
File       |  total | covered | # killed | # timeout | # survived | # no cov | # errors |
-----------|--------|---------|----------|-----------|------------|----------|----------|
All files  |  97.73 |   97.73 |       43 |         0 |          1 |        0 |        0 |
 cancel.js |  97.73 |   97.73 |       43 |         0 |          1 |        0 |        0 |
-----------|--------|---------|----------|-----------|------------|----------|----------|
11:47:38 (7515) INFO MutationTestReportHelper Final mutation score of 97.73 is greater than or equal to break threshold 95
11:47:38 (7515) INFO JsonReporter Your report can be found at: file://…/labflow-lite/reports/mutation/mutation.json
11:47:38 (7515) INFO HtmlReporter Your report can be found at: file://…/labflow-lite/reports/mutation/index.html
11:47:38 (7515) INFO MutationTestExecutor Done in 10 seconds.`,
  '112-th-do': `$ node scripts/thu-loi.mjs src/api/myBookings.js "ALREADY_CANCELLED: 409" "ALREADY_CANCELLED: 400" --config vitest.integration.config.js demo11/th112
planted in src/api/myBookings.js:  ALREADY_CANCELLED: 409  →  ALREADY_CANCELLED: 400


 RUN  v5.0.5 …/labflow-lite

 ❯ demo11/th112/huy-hai-lan.int.test.js (1 test | 1 failed) 51ms
   × cancelling twice on PostgreSQL → 409 ALREADY_CANCELLED, as documented (US-11 AC4) 37ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo11/th112/huy-hai-lan.int.test.js > cancelling twice on PostgreSQL → 409 ALREADY_CANCELLED, as documented (US-11 AC4)
AssertionError: expected [ 400, 'ALREADY_CANCELLED' ] to deeply equal [ 409, 'ALREADY_CANCELLED' ]

- Expected
+ Received

  [
-   409,
+   400,
    "ALREADY_CANCELLED",
  ]

 ❯ demo11/th112/huy-hai-lan.int.test.js:23:50
     21|   await request(app).post('/api/bookings/' + body.id + '/cancel').set(…
     22|   const again = await request(app).post('/api/bookings/' + body.id + '…
     23|   expect([again.status, again.body.error?.code]).toEqual([409, 'ALREAD…
       |                                                  ^
     24|   expect(contractErrors('post', '/api/bookings/{id}/cancel', again)).t…
     25| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  11:48:33
   Duration  530ms (import 66%, tests 21%, transform 12%, worker 1%)`,
  '112-th-xanh': `$ npm run test:int -- demo11/th112

> labflow-lite@1.0.0 test:int
> vitest run --config vitest.integration.config.js demo11/th112


 RUN  v5.0.5 …/labflow-lite

 ✓ demo11/th112/huy-hai-lan.int.test.js (1 test) 59ms
   ✓ cancelling twice on PostgreSQL → 409 ALREADY_CANCELLED, as documented (US-11 AC4) 40ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  11:48:32
   Duration  540ms (import 67%, tests 23%, transform 10%, worker 1%)`,
  '113-e2e-all': `$ PLAYWRIGHT_JSON_OUTPUT_NAME=reports/e2e-all.json npx playwright test e2e/ --reporter=json > /dev/null; echo "playwright exit $?"; node scripts/va-cham-lab.mjs reports/e2e-all.json
playwright exit 0
25 lab codes used by 25 tests
✔ no two tests share a lab code`,
  '113-e2e': `$ npx playwright test e2e/huy-phong.spec.js --project=chromium

Running 3 tests using 2 workers

  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (530ms)
  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as an (532ms)
  ✓  3 [chromium] › e2e/huy-phong.spec.js:11:1 › cancel a booking from My bookings, then book the same slot again (US-11 AC1, AC2, AC5) (592ms)

  3 passed (3.1s)`,
  '113-flaky': `$ npx playwright test e2e/ --project=firefox

Running 10 tests using 5 workers

  ✓   2 [setup] › e2e/auth.setup.js:6:3 › sign in as an (255ms)
  ✓   1 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (258ms)
  ✓   5 [firefox] › e2e/dat-phong.spec.js:15:3 › as student an › 31 seats waits for approval (BR-06) (1.5s)
  ✓   4 [firefox] › e2e/dang-nhap.spec.js:24:1 › an admin sees the list, not the form (1.5s)
  ✓   8 [firefox] › e2e/dat-phong.spec.js:21:3 › as student an › the same slot twice is refused (BR-04) (1.1s)
  ✓   6 [firefox] › e2e/dang-nhap.spec.js:5:1 › a wrong password is refused with an alert (1.8s)
  ✓   7 [firefox] › e2e/dat-phong.spec.js:8:3 › as student an › books a lab and sees it confirmed (2.2s)
  ✘   9 [firefox] › e2e/dat-phong.spec.js:31:1 › a booking by an shows up in the admin list (1.6s)
  ✓   3 [firefox] › e2e/dang-nhap.spec.js:14:1 › a session survives a reload; signing out ends it (1.8s)
  ✓  10 [firefox] › e2e/huy-phong.spec.js:11:1 › cancel a booking from My bookings, then book the same slot again (US-11 AC1, AC2, AC5) (1.4s)


  1) [firefox] › e2e/dat-phong.spec.js:31:1 › a booking by an shows up in the admin list ───────────

    Error: expect(locator).toContainText(expected) failed

    Locator: getByRole('row', { name: /QA-912/ })
    Expected substring: "2026-11-20"
    Error: strict mode violation: getByRole('row', { name: /QA-912/ }) resolved to 2 elements:
        1) <tr>…</tr> aka getByRole('row', { name: 'QA-912 2026-11-16 08:00–10:00' })
        2) <tr>…</tr> aka getByRole('row', { name: 'QA-912 2026-11-20 13:00–15:00' })

    Call log:
      - Expect "toContainText" getByRole('row', { name: /QA-912/ }) with timeout 5000ms
      - waiting for getByRole('row', { name: /QA-912/ })


      41 |   await adminPage.goto('/');
      42 |   const row = adminPage.getByRole('row', { name: new RegExp(lab) });
    > 43 |   await expect(row).toContainText('2026-11-20');
         |                     ^
      44 |   await expect(row).toContainText('13:00–15:00');
      45 |   await student.close();
      46 |   await admin.close();
        at …/labflow-lite/e2e/dat-phong.spec.js:43:21

    Error Context: test-results/e2e-dat-phong-a-booking-by-an-shows-up-in-the-admin-list-firefox/error-context.md

  1 failed
    [firefox] › e2e/dat-phong.spec.js:31:1 › a booking by an shows up in the admin list ────────────
  9 passed (6.8s)`,
  '113-kiem-mock': `$ node scripts/thu-loi.mjs web/MyBookings.jsx "        replace(res.data);" "" --config vitest.web.config.js demo11/ui/kiem-mock.test.jsx web/MyBookings.test.jsx
planted in web/MyBookings.jsx:          replace(res.data);  →  


 RUN  v5.0.5 …/labflow-lite

 ✓ demo11/ui/kiem-mock.test.jsx (1 test) 107ms
   ✓ calls cancelBooking when Cancel is clicked 107ms
 ❯ web/MyBookings.test.jsx (8 tests | 1 failed) 253ms
   ❯ MyBookings screen (US-11) (8)
     ✓ one row per booking; a cancelled one has no Cancel button (AC1) 118ms
     × Cancel → the row says CANCELLED, the button is gone, and the user is told (AC2) 41ms
     ✓ while cancelling: “Cancelling…”, every Cancel disabled, one request for a double click 23ms
     ✓ 422 TOO_LATE_TO_CANCEL → an alert, and the booking stays as it was (AC2) 19ms
     ✓ 409 ALREADY_CANCELLED → the row shows what the server knows (AC4) 20ms
     ✓ no network → “Cannot reach the server” 15ms
     ✓ an empty list says so 2ms
     ✓ a failed load offers Try again, and it works 14ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  web/MyBookings.test.jsx > MyBookings screen (US-11) > Cancel → the row says CANCELLED, the button is gone, and the user is told (AC2)
Error: expect(element).toHaveTextContent()

Expected element to have text content:
  CANCELLED
Received:
  BE-2012026-11-1608:00–10:0020CONFIRMEDCancel
 ❯ web/MyBookings.test.jsx:35:57
     33|     await user.click(await screen.findByRole('button', { name: 'Cancel…
     34|     expect(await screen.findByRole('status')).toHaveTextContent('Cance…
     35|     expect(screen.getByRole('row', { name: /BE-201/ })).toHaveTextCont…
       |                                                         ^
     36|     expect(screen.queryByRole('button', { name: /^Cancel BE-201/ })).n…
     37|     expect(api.cancelBooking).toHaveBeenCalledWith(1);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 8 passed (9)
   Start at  11:50:08
   Duration  855ms (environment 57%, tests 26%, setup 11%, import 3%, transform 3%)`,
  '113-nut-chung': `$ npx playwright test demo11/pw/nut-chung.spec.js --project=chromium

Running 3 tests using 2 workers

  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as an (296ms)
  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (307ms)
  ✘  3 [chromium] › demo11/pw/nut-chung.spec.js:8:1 › cancel "the" booking (453ms)


  1) [chromium] › demo11/pw/nut-chung.spec.js:8:1 › cancel "the" booking ───────────────────────────

    Error: locator.click: Error: strict mode violation: getByRole('button', { name: 'Cancel' }) resolved to 2 elements:
        1) <button type="button" aria-label="Cancel DS-246 on 2026-11-06 at 08:00">Cancel</button> aka getByRole('button', { name: 'Cancel DS-246 on 2026-11-06 at 08:' })
        2) <button type="button" aria-label="Cancel DS-246 on 2026-11-06 at 10:00">Cancel</button> aka getByRole('button', { name: 'Cancel DS-246 on 2026-11-06 at 10:' })

    Call log:
      - waiting for getByRole('button', { name: 'Cancel' })


      14 |   await expect(page.getByRole('status')).toBeVisible();
      15 |   await page.goto('/my-bookings');
    > 16 |   await page.getByRole('button', { name: 'Cancel' }).click();
         |                                                      ^
      17 |   await expect(page.getByRole('status')).toContainText('Cancelled');
      18 | });
      19 |
        at …/labflow-lite/demo11/pw/nut-chung.spec.js:16:54

    Error Context: test-results/demo11-pw-nut-chung-cancel-the-booking-chromium/error-context.md

  1 failed
    [chromium] › demo11/pw/nut-chung.spec.js:8:1 › cancel "the" booking ────────────────────────────
  2 passed (2.6s)`,
  '113-qua-gio': `$ npx playwright test demo11/pw/qua-gio.spec.js --project=chromium

Running 3 tests using 2 workers

  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (257ms)
  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as an (259ms)
  ✘  3 [chromium] › demo11/pw/qua-gio.spec.js:8:1 › cancel a booking for today at 07:00 (5.3s)


  1) [chromium] › demo11/pw/qua-gio.spec.js:8:1 › cancel a booking for today at 07:00 ──────────────

    Error: expect(locator).toContainText(expected) failed

    Locator: getByRole('status')
    Expected substring: "Cancelled"
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toContainText" getByRole('status') with timeout 5000ms
      - waiting for getByRole('status')


      12 |   await page.goto('/my-bookings');
      13 |   await page.getByRole('row', { name: new RegExp(lab) }).getByRole('button').click();
    > 14 |   await expect(page.getByRole('status')).toContainText('Cancelled');
         |                                          ^
      15 | });
      16 |
        at …/labflow-lite/demo11/pw/qua-gio.spec.js:14:42

    Error Context: test-results/demo11-pw-qua-gio-cancel-a-booking-for-today-at-07-00-chromium/error-context.md

  1 failed
    [chromium] › demo11/pw/qua-gio.spec.js:8:1 › cancel a booking for today at 07:00 ───────────────
  2 passed (7.4s)`,
  '113-stub-e2e': `$ node scripts/thu-loi-pw.mjs web/api.js "'/cancel')" "'/cancellation')" e2e/huy-phong.spec.js --project=chromium
planted in web/api.js:  '/cancel')  →  '/cancellation')


Running 3 tests using 2 workers

  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as an (254ms)
  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (254ms)
  ✘  3 [chromium] › e2e/huy-phong.spec.js:11:1 › cancel a booking from My bookings, then book the same slot again (US-11 AC1, AC2, AC5) (5.4s)


  1) [chromium] › e2e/huy-phong.spec.js:11:1 › cancel a booking from My bookings, then book the same slot again (US-11 AC1, AC2, AC5) 

    Error: expect(locator).toHaveText(expected) failed

    Locator: getByRole('status')
    Expected: "Cancelled NZ-429 on 2026-11-04, 13:00–15:00."
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toHaveText" getByRole('status') with timeout 5000ms
      - waiting for getByRole('status')


      20 |   await expect(row).toContainText('CONFIRMED');
      21 |   await row.getByRole('button', { name: 'Cancel ' + lab + ' on ' + date + ' at 13:00' }).click();
    > 22 |   await expect(page.getByRole('status')).toHaveText('Cancelled ' + lab + ' on ' + date + ', 13:00–15:00.');
         |                                          ^
      23 |   await expect(row).toContainText('CANCELLED');
      24 |
      25 |   await page.reload();   // what the server stored, not what the screen remembers
        at …/labflow-lite/e2e/huy-phong.spec.js:22:42

    Error Context: test-results/e2e-huy-phong-cancel-a-boo-c2279-ot-again-US-11-AC1-AC2-AC5--chromium/error-context.md

  1 failed
    [chromium] › e2e/huy-phong.spec.js:11:1 › cancel a booking from My bookings, then book the same slot again (US-11 AC1, AC2, AC5) 
  2 passed (7.5s)`,
  '113-stub-web': `$ node scripts/thu-loi.mjs web/api.js "'/cancel')" "'/cancellation')" --config vitest.web.config.js web/
planted in web/api.js:  '/cancel')  →  '/cancellation')


 RUN  v5.0.5 …/labflow-lite

 ✓ web/AdminBookings.test.jsx (4 tests) 142ms
   ✓ AdminBookings (4)
     ✓ a table with one row per booking 106ms
     ✓ an empty list says so 5ms
     ✓ 403 → only admins 5ms
     ✓ a failure offers Try again, and it works 25ms
 ✓ web/MyBookings.test.jsx (8 tests) 263ms
   ✓ MyBookings screen (US-11) (8)
     ✓ one row per booking; a cancelled one has no Cancel button (AC1) 117ms
     ✓ Cancel → the row says CANCELLED, the button is gone, and the user is told (AC2) 40ms
     ✓ while cancelling: “Cancelling…”, every Cancel disabled, one request for a double click 29ms
     ✓ 422 TOO_LATE_TO_CANCEL → an alert, and the booking stays as it was (AC2) 21ms
     ✓ 409 ALREADY_CANCELLED → the row shows what the server knows (AC4) 21ms
     ✓ no network → “Cannot reach the server” 16ms
     ✓ an empty list says so 4ms
     ✓ a failed load offers Try again, and it works 14ms
 ✓ web/BookingForm.test.jsx (12 tests) 1050ms
   ✓ BookingForm (12)
     ✓ every field is reachable by its label 30ms
     ✓ sends what the user typed, once, and says it is booked 179ms
     ✓ a PENDING booking says it waits for approval 86ms
     ✓ seats 0 → refused in the browser: true 80ms
     ✓ seats 1 → refused in the browser: false 86ms
     ✓ seats 200 → refused in the browser: false 81ms
     ✓ seats 201 → refused in the browser: true 75ms
     ✓ while waiting, the button is disabled and a second click sends nothing 99ms
     ✓ a 400 from the server is shown on its field 87ms
     ✓ 409 OVERLAP → an alert users hear 88ms
     ✓ 422 TOO_LONG → an alert users hear 81ms
     ✓ 500 INTERNAL → an alert users hear 77ms

 Test Files  3 passed (3)
      Tests  24 passed (24)
   Start at  11:50:05
   Duration  1.73s (tests 45%, environment 41%, setup 9%, import 3%, transform 2%)`,
  '113-th-do': `$ node scripts/thu-loi-pw.mjs src/api/myBookings.js "listMyBookings(repo, req.user.id)" "repo.list()" demo11/pw/rieng-tu.spec.js --project=chromium
planted in src/api/myBookings.js:  listMyBookings(repo, req.user.id)  →  repo.list()


Running 3 tests using 2 workers

  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as an (284ms)
  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (293ms)
  ✘  3 [chromium] › demo11/pw/rieng-tu.spec.js:7:1 › Binh's My bookings does not show An's booking (US-11 AC1) (5.5s)


  1) [chromium] › demo11/pw/rieng-tu.spec.js:7:1 › Binh's My bookings does not show An's booking (US-11 AC1) 

    Error: expect(locator).toHaveCount(expected) failed

    Locator:  getByRole('row', { name: /KJ-988/ })
    Expected: 0
    Received: 1
    Timeout:  5000ms

    Call log:
      - Expect "toHaveCount" getByRole('row', { name: /KJ-988/ }) with timeout 5000ms
      - waiting for getByRole('row', { name: /KJ-988/ })
        14 × locator resolved to 1 element
           - unexpected value "1"


      19 |   await expect(binhPage.getByRole('heading', { name: 'My bookings' })).toBeVisible();
      20 |   await expect(binhPage.getByRole('status')).toHaveCount(0);   // the list has finished loading
    > 21 |   await expect(binhPage.getByRole('row', { name: new RegExp(lab) })).toHaveCount(0);
         |                                                                      ^
      22 |   await an.close();
      23 |   await binh.close();
      24 | });
        at …/labflow-lite/demo11/pw/rieng-tu.spec.js:21:70

    Error Context: test-results/demo11-pw-rieng-tu-Binh-s--7add7-how-An-s-booking-US-11-AC1--chromium/error-context.md

  1 failed
    [chromium] › demo11/pw/rieng-tu.spec.js:7:1 › Binh's My bookings does not show An's booking (US-11 AC1) 
  2 passed (7.7s)`,
  '113-th-xanh': `$ npx playwright test demo11/pw/rieng-tu.spec.js --project=chromium

Running 3 tests using 2 workers

  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (255ms)
  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as an (259ms)
  ✓  3 [chromium] › demo11/pw/rieng-tu.spec.js:7:1 › Binh's My bookings does not show An's booking (US-11 AC1) (558ms)

  3 passed (2.6s)`,
  '113-va-cham-truoc': `$ node scripts/va-cham-lab.mjs reports/e2e-all.json
24 lab codes used by 25 tests
⚠️  QA-912 is used by 2 tests:
    [firefox] a booking by an shows up in the admin list
    [firefox] as student an › 31 seats waits for approval (BR-06)`,
  '113-web': `$ npx vitest run --config vitest.web.config.js web/MyBookings.test.jsx

 RUN  v5.0.5 …/labflow-lite

 ✓ web/MyBookings.test.jsx (8 tests) 260ms
   ✓ MyBookings screen (US-11) (8)
     ✓ one row per booking; a cancelled one has no Cancel button (AC1) 112ms
     ✓ Cancel → the row says CANCELLED, the button is gone, and the user is told (AC2) 50ms
     ✓ while cancelling: “Cancelling…”, every Cancel disabled, one request for a double click 25ms
     ✓ 422 TOO_LATE_TO_CANCEL → an alert, and the booking stays as it was (AC2) 22ms
     ✓ 409 ALREADY_CANCELLED → the row shows what the server knows (AC4) 18ms
     ✓ no network → “Cannot reach the server” 16ms
     ✓ an empty list says so 3ms
     ✓ a failed load offers Try again, and it works 12ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  11:50:04
   Duration  1.14s (environment 57%, tests 25%, setup 11%, transform 4%, import 3%)`,
  '114-act-dem': `$ act workflow_dispatch -W .github/workflows/nightly.yml -j unit-hanoi --cache-server-path .act/cache
[nightly/unit, in Viet Nam time (Asia/Ho_Chi_Minh)]   ✅  Success - Main npm ci [17.631433375s]
[nightly/unit, in Viet Nam time (Asia/Ho_Chi_Minh)]   |  Test Files  33 passed (33)
[nightly/unit, in Viet Nam time (Asia/Ho_Chi_Minh)]   |       Tests  299 passed (299)
[nightly/unit, in Viet Nam time (Asia/Ho_Chi_Minh)]   ✅  Success - Main npm run test:unit [2.333052625s]
[nightly/unit, in Viet Nam time (Asia/Ho_Chi_Minh)] 🏁  Job succeeded
(time: 30.85 s total)`,
  '114-act-do': `$ git log --oneline -1   # pr/ac7-chua-test: the product owner adds AC7 to requirements.json, no test yet
1011cec US-11: the product owner adds AC7 (no test yet)
$ act pull_request -e demo11/ci/pr-event.json --cache-server-path .act/cache --artifact-server-path .act/artifacts
[tests/quarantine (report only)]   ✅  Success - Main npm ci [54.698274542s]
[tests/quarantine (report only)]   ❌  Failure - Main npm run test:quarantine -- --repeats=9 [2.265899166s]
[tests/quarantine (report only)] 🏁  Job failed
[tests/unit (Node 22)-1]   ✅  Success - Main npm ci [53.828260041s]
[tests/e2e (Chromium)]   ✅  Success - Main npm ci [50.312163042s]
[tests/unit (Node 24)-2]   ✅  Success - Main npm ci [1m0.761819041s]
[tests/unit (Node 22)-1]   ✅  Success - Main unit tests + coverage [6.570232791s]
[tests/integration (PostgreSQL 17)]   ✅  Success - Main npm ci [58.419293625s]
[tests/unit (Node 24)-2]   ✅  Success - Main unit tests + coverage [7.515531625s]
[tests/unit (Node 22)-1]   ✅  Success - Main web tests [7.041680292s]
[tests/unit (Node 22)-1]   | ## unit (Node 22)
[tests/unit (Node 22)-1]   | ### ✅ 319 of 319 tests passed
[tests/unit (Node 22)-1]   | | Coverage | Now | Minimum | |
[tests/unit (Node 22)-1]   | | lines | 98.93% | 97% | ✅ |
[tests/unit (Node 22)-1]   | | branches | 93.30% | 91% | ✅ |
[tests/unit (Node 22)-1]   | | functions | 97.47% | 96% | ✅ |
[tests/unit (Node 22)-1]   | | statements | 98.32% | 97% | ✅ |
[tests/unit (Node 22)-1]   ✅  Success - Main summary [632.965625ms]
[tests/mutation (Stryker, src/rules)]   ✅  Success - Main npm ci [1m7.774968708s]
[tests/integration (PostgreSQL 17)]   ✅  Success - Main npm run test:int -- test/integration --reporter=tree --reporter=github-actions --reporter=json --outputFile.json=reports/int.json [5.420662459s]
[tests/unit (Node 24)-2]   ✅  Success - Main web tests [6.784258375s]
[tests/unit (Node 24)-2]   | ## unit (Node 24)
[tests/unit (Node 24)-2]   | ### ✅ 319 of 319 tests passed
[tests/unit (Node 24)-2]   | | Coverage | Now | Minimum | |
[tests/unit (Node 24)-2]   | | lines | 98.93% | 97% | ✅ |
[tests/unit (Node 24)-2]   | | branches | 93.30% | 91% | ✅ |
[tests/unit (Node 24)-2]   | | functions | 97.47% | 96% | ✅ |
[tests/unit (Node 24)-2]   | | statements | 98.32% | 97% | ✅ |
[tests/unit (Node 24)-2]   ✅  Success - Main summary [1.664904542s]
[tests/unit (Node 22)-1] 🏁  Job succeeded
[tests/integration (PostgreSQL 17)] 🏁  Job succeeded
[tests/unit (Node 24)-2] 🏁  Job succeeded
[tests/mutation (Stryker, src/rules)]   ✅  Success - Main npm run test:mutation [37.87922025s]
[tests/mutation (Stryker, src/rules)] 🏁  Job succeeded
[tests/e2e (Chromium)]   ✅  Success - Main npx playwright install --with-deps chromium [6m27.915877625s]
[tests/e2e (Chromium)]   ✅  Success - Main npm run test:e2e [6.892456708s]
[tests/e2e (Chromium)] 🏁  Job succeeded
[tests/quality report + traceability]   ✅  Success - Main npm ci [28.202026833s]
[tests/quality report + traceability]   | ## Quality report — LabFlow Lite 1.1 — My bookings and cancel (US-11)
[tests/quality report + traceability]   | ### ❌ Do not merge
[tests/quality report + traceability]   | - traceability — US-11 AC7: no passing test
[tests/quality report + traceability]   | | Layer | Tests | Failed | |
[tests/quality report + traceability]   | | Unit + API (src/) | 295 | 0 | ✅ |
[tests/quality report + traceability]   | | UI components (web/) | 24 | 0 | ✅ |
[tests/quality report + traceability]   | | DB integration (PostgreSQL 17) | 19 | 0 | ✅ |
[tests/quality report + traceability]   | | End to end (Chromium) | 8 | 0 | ✅ |
[tests/quality report + traceability]   | | Coverage | Now | Minimum | |
[tests/quality report + traceability]   | | lines | 98.93% | 97% | ✅ |
[tests/quality report + traceability]   | | branches | 93.30% | 91% | ✅ |
[tests/quality report + traceability]   | | functions | 97.47% | 96% | ✅ |
[tests/quality report + traceability]   | | statements | 98.32% | 97% | ✅ |
[tests/quality report + traceability]   | **Mutation score:** 99.08% (minimum 95%)
[tests/quality report + traceability]   | ### Traceability
[tests/quality report + traceability]   | | Requirement | Risk | Unit | API | DB | UI | E2E | |
[tests/quality report + traceability]   | | BR-04 | High | 11 | 1 | 7 | · | 1 | ✅ |
[tests/quality report + traceability]   | | BR-05 | Medium | 12 | · | · | · | · | ✅ |
[tests/quality report + traceability]   | | BR-06 | High | 7 | · | · | · | 1 | ✅ |
[tests/quality report + traceability]   | | Lite-1 | Low | 2 | · | · | · | · | ✅ |
[tests/quality report + traceability]   | | Lite-2 | Medium | 2 | · | · | · | · | ✅ |
[tests/quality report + traceability]   | | Lite-3 | High | 7 | 2 | · | · | · | ✅ |
[tests/quality report + traceability]   | | US-11 AC1 | High | 2 | 1 | 2 | 1 | 1 | ✅ |
[tests/quality report + traceability]   | | US-11 AC2 | High | 5 | 3 | 1 | 2 | 1 | ✅ |
[tests/quality report + traceability]   | | US-11 AC3 | High | 4 | 2 | · | · | · | ✅ |
[tests/quality report + traceability]   | | US-11 AC4 | Medium | 3 | 1 | 1 | 1 | · | ✅ |
[tests/quality report + traceability]   | | US-11 AC5 | High | 1 | 1 | 1 | · | 1 | ✅ |
[tests/quality report + traceability]   | | US-11 AC6 | Low | 2 | 2 | · | · | · | ✅ |
[tests/quality report + traceability]   | | US-11 AC7 | High | · | · | · | · | · | ❌ |
[tests/quality report + traceability]   | | BR-02 (out of scope) | High | 5 | · | · | · | · | — |
[tests/quality report + traceability]   | | BR-07 (out of scope) | Medium | 8 | · | · | · | · | — |
[tests/quality report + traceability]   | | BR-08 (out of scope) | Medium | 7 | · | · | · | · | — |
[tests/quality report + traceability]   | | BR-09 (out of scope) | Medium | · | · | · | · | · | — |
[tests/quality report + traceability]   | | BR-10 (out of scope) | Low | · | · | · | · | · | — |
[tests/quality report + traceability]   ❌  Failure - Main one page for the whole pull request [231.003458ms]
[tests/quality report + traceability] 🏁  Job failed
[tests/ci-ok]   | ✔ unit: success
[tests/ci-ok]   | ✔ integration: success
[tests/ci-ok]   | ✔ e2e: success
[tests/ci-ok]   | ✔ mutation: success
[tests/ci-ok]   | ✘ report: failure
[tests/ci-ok]   ❌  Failure - Main every required job passed? [84.05625ms]
[tests/ci-ok] 🏁  Job failed
Error: Job 'quarantine (report only)' failed
exit 1
(time: 8:47.69 total)`,
  '114-act-xanh': `$ act pull_request -e demo11/ci/pr-event.json --cache-server-path .act/cache --artifact-server-path .act/artifacts
[tests/quarantine (report only)]   ✅  Success - Main npm ci [2m55.863150208s]
[tests/quarantine (report only)]   ❌  Failure - Main npm run test:quarantine -- --repeats=9 [1.46898075s]
[tests/quarantine (report only)] 🏁  Job failed
[tests/mutation (Stryker, src/rules)]   ✅  Success - Main npm ci [2m43.686112417s]
[tests/unit (Node 22)-1]   ✅  Success - Main npm ci [3m9.706972542s]
[tests/unit (Node 22)-1]   ✅  Success - Main unit tests + coverage [5.125945667s]
[tests/unit (Node 22)-1]   ✅  Success - Main web tests [7.492323958s]
[tests/unit (Node 22)-1]   | ## unit (Node 22)
[tests/unit (Node 22)-1]   | ### ✅ 319 of 319 tests passed
[tests/unit (Node 22)-1]   | | Coverage | Now | Minimum | |
[tests/unit (Node 22)-1]   | | lines | 98.93% | 97% | ✅ |
[tests/unit (Node 22)-1]   | | branches | 93.30% | 91% | ✅ |
[tests/unit (Node 22)-1]   | | functions | 97.47% | 96% | ✅ |
[tests/unit (Node 22)-1]   | | statements | 98.32% | 97% | ✅ |
[tests/unit (Node 22)-1]   ✅  Success - Main summary [1.404706333s]
[tests/mutation (Stryker, src/rules)]   ✅  Success - Main npm run test:mutation [39.717377125s]
[tests/unit (Node 24)-2]   ✅  Success - Main npm ci [3m3.42067425s]
[tests/unit (Node 22)-1] 🏁  Job succeeded
[tests/mutation (Stryker, src/rules)] 🏁  Job succeeded
[tests/e2e (Chromium)]   ✅  Success - Main npm ci [3m46.152765833s]
[tests/unit (Node 24)-2]   ✅  Success - Main unit tests + coverage [5.532068458s]
[tests/unit (Node 24)-2]   ✅  Success - Main web tests [2.710104834s]
[tests/unit (Node 24)-2]   | ## unit (Node 24)
[tests/unit (Node 24)-2]   | ### ✅ 319 of 319 tests passed
[tests/unit (Node 24)-2]   | | Coverage | Now | Minimum | |
[tests/unit (Node 24)-2]   | | lines | 98.93% | 97% | ✅ |
[tests/unit (Node 24)-2]   | | branches | 93.30% | 91% | ✅ |
[tests/unit (Node 24)-2]   | | functions | 97.47% | 96% | ✅ |
[tests/unit (Node 24)-2]   | | statements | 98.32% | 97% | ✅ |
[tests/unit (Node 24)-2]   ✅  Success - Main summary [230.440875ms]
[tests/unit (Node 24)-2] 🏁  Job succeeded
[tests/integration (PostgreSQL 17)]   ✅  Success - Main npm ci [2m35.7381645s]
[tests/integration (PostgreSQL 17)]   ✅  Success - Main npm run test:int -- test/integration --reporter=tree --reporter=github-actions --reporter=json --outputFile.json=reports/int.json [2.044283792s]
[tests/integration (PostgreSQL 17)] 🏁  Job succeeded
[tests/e2e (Chromium)]   ✅  Success - Main npx playwright install --with-deps chromium [6m11.462213167s]
[tests/e2e (Chromium)]   ✅  Success - Main npm run test:e2e [5.812796625s]
[tests/e2e (Chromium)] 🏁  Job succeeded
[tests/quality report + traceability]   ✅  Success - Main npm ci [16.767031458s]
[tests/quality report + traceability]   | ## Quality report — LabFlow Lite 1.1 — My bookings and cancel (US-11)
[tests/quality report + traceability]   | ### ✅ Every check passed
[tests/quality report + traceability]   | | Layer | Tests | Failed | |
[tests/quality report + traceability]   | | Unit + API (src/) | 295 | 0 | ✅ |
[tests/quality report + traceability]   | | UI components (web/) | 24 | 0 | ✅ |
[tests/quality report + traceability]   | | DB integration (PostgreSQL 17) | 19 | 0 | ✅ |
[tests/quality report + traceability]   | | End to end (Chromium) | 8 | 0 | ✅ |
[tests/quality report + traceability]   | | Coverage | Now | Minimum | |
[tests/quality report + traceability]   | | lines | 98.93% | 97% | ✅ |
[tests/quality report + traceability]   | | branches | 93.30% | 91% | ✅ |
[tests/quality report + traceability]   | | functions | 97.47% | 96% | ✅ |
[tests/quality report + traceability]   | | statements | 98.32% | 97% | ✅ |
[tests/quality report + traceability]   | **Mutation score:** 99.08% (minimum 95%)
[tests/quality report + traceability]   | ### Traceability
[tests/quality report + traceability]   | | Requirement | Risk | Unit | API | DB | UI | E2E | |
[tests/quality report + traceability]   | | BR-04 | High | 11 | 1 | 7 | · | 1 | ✅ |
[tests/quality report + traceability]   | | BR-05 | Medium | 12 | · | · | · | · | ✅ |
[tests/quality report + traceability]   | | BR-06 | High | 7 | · | · | · | 1 | ✅ |
[tests/quality report + traceability]   | | Lite-1 | Low | 2 | · | · | · | · | ✅ |
[tests/quality report + traceability]   | | Lite-2 | Medium | 2 | · | · | · | · | ✅ |
[tests/quality report + traceability]   | | Lite-3 | High | 7 | 2 | · | · | · | ✅ |
[tests/quality report + traceability]   | | US-11 AC1 | High | 2 | 1 | 2 | 1 | 1 | ✅ |
[tests/quality report + traceability]   | | US-11 AC2 | High | 5 | 3 | 1 | 2 | 1 | ✅ |
[tests/quality report + traceability]   | | US-11 AC3 | High | 4 | 2 | · | · | · | ✅ |
[tests/quality report + traceability]   | | US-11 AC4 | Medium | 3 | 1 | 1 | 1 | · | ✅ |
[tests/quality report + traceability]   | | US-11 AC5 | High | 1 | 1 | 1 | · | 1 | ✅ |
[tests/quality report + traceability]   | | US-11 AC6 | Low | 2 | 2 | · | · | · | ✅ |
[tests/quality report + traceability]   | | BR-02 (out of scope) | High | 5 | · | · | · | · | — |
[tests/quality report + traceability]   | | BR-07 (out of scope) | Medium | 8 | · | · | · | · | — |
[tests/quality report + traceability]   | | BR-08 (out of scope) | Medium | 7 | · | · | · | · | — |
[tests/quality report + traceability]   | | BR-09 (out of scope) | Medium | · | · | · | · | · | — |
[tests/quality report + traceability]   | | BR-10 (out of scope) | Low | · | · | · | · | · | — |
[tests/quality report + traceability]   | Every in-scope requirement is traced to a passing test.
[tests/quality report + traceability]   ✅  Success - Main one page for the whole pull request [265.143791ms]
[tests/quality report + traceability] 🏁  Job succeeded
[tests/ci-ok]   | ✔ unit: success
[tests/ci-ok]   | ✔ integration: success
[tests/ci-ok]   | ✔ e2e: success
[tests/ci-ok]   | ✔ mutation: success
[tests/ci-ok]   | ✔ report: success
[tests/ci-ok]   | ci-ok: every required job passed
[tests/ci-ok]   ✅  Success - Main every required job passed? [100.287042ms]
[tests/ci-ok] 🏁  Job succeeded
Error: Job 'quarantine (report only)' failed
exit 1
(time: 11:00.60 total)`,
  '114-actionlint': `$ actionlint .github/workflows/test.yml .github/workflows/nightly.yml && echo "actionlint: no problems in 2 workflows"
actionlint: no problems in 2 workflows`,
  '114-ci-report': `$ node scripts/rtm.mjs --run > /dev/null; npx vitest run src/ --coverage > /dev/null; npx stryker run > /dev/null; node scripts/ci-report.mjs
## Quality report — LabFlow Lite 1.1 — My bookings and cancel (US-11)

### ✅ Every check passed

| Layer | Tests | Failed | |
|---|---:|---:|---|
| Unit + API (src/) | 298 | 0 | ✅ |
| UI components (web/) | 24 | 0 | ✅ |
| DB integration (PostgreSQL 17) | 19 | 0 | ✅ |
| End to end (Chromium) | 8 | 0 | ✅ |

| Coverage | Now | Minimum | |
|---|---:|---:|---|
| lines | 98.93% | 97% | ✅ |
| branches | 93.30% | 91% | ✅ |
| functions | 97.47% | 96% | ✅ |
| statements | 98.32% | 97% | ✅ |

**Mutation score:** 99.08% (minimum 95%)

### Traceability

| Requirement | Risk | Unit | API | DB | UI | E2E | |
|---|---|---:|---:|---:|---:|---:|---|
| BR-04 | High | 11 | 1 | 7 | · | 1 | ✅ |
| BR-05 | Medium | 12 | · | · | · | · | ✅ |
| BR-06 | High | 7 | 1 | · | · | 1 | ✅ |
| Lite-1 | Low | 2 | · | · | · | · | ✅ |
| Lite-2 | Medium | 2 | 2 | · | · | · | ✅ |
| Lite-3 | High | 7 | 2 | · | · | · | ✅ |
| US-11 AC1 | High | 2 | 1 | 2 | 1 | 1 | ✅ |
| US-11 AC2 | High | 5 | 3 | 1 | 2 | 1 | ✅ |
| US-11 AC3 | High | 4 | 2 | · | · | · | ✅ |
| US-11 AC4 | Medium | 3 | 1 | 1 | 1 | · | ✅ |
| US-11 AC5 | High | 1 | 1 | 1 | · | 1 | ✅ |
| US-11 AC6 | Low | 2 | 2 | · | · | · | ✅ |
| BR-02 (out of scope) | High | 5 | · | · | · | · | — |
| BR-07 (out of scope) | Medium | 8 | · | · | · | · | — |
| BR-08 (out of scope) | Medium | 7 | · | · | · | · | — |
| BR-09 (out of scope) | Medium | · | · | · | · | · | — |
| BR-10 (out of scope) | Low | · | · | · | · | · | — |

Every in-scope requirement is traced to a passing test.`,
  '114-cov-ratchet': `$ npx vitest run src/ --coverage --exclude src/ci/quality.test.js

 RUN  v5.0.5 …/labflow-lite
      Coverage enabled with v8

 ✓ src/notify/notify.test.js (7 tests) 57ms
   ✓ buildMail (pure) (2)
     ✓ CONFIRMED booking with 20 seats → mail to an@fpt.edu.vn 2ms
     ✓ PENDING booking with 31 seats → mail to approvals@labflow.example 0ms
   ✓ bookAndNotify (5)
     ✓ a confirmed booking e-mails the student once 15ms
     ✓ a 31-seat student booking e-mails only the approver 13ms
     ✓ a failed e-mail keeps the booking and reports notified: false 13ms
     ✓ a failed e-mail is logged with the booking id and the reason 12ms
     ✓ a rejected booking sends no e-mail 1ms
 ✓ src/booking/service.test.js (6 tests) 65ms
   ✓ bookLab (6)
     ✓ stores a confirmed booking 14ms
     ✓ rejects a rule violation with its code before touching the database 0ms
     ✓ rejects an overlapping booking with OVERLAP (BR-04) 23ms
     ✓ accepts the slot that starts when the previous one ends (BR-04) 25ms
     ✓ turns a failing lookup into STORAGE_DOWN and keeps the cause 0ms
     ✓ turns a failing insert into STORAGE_DOWN 0ms
 ✓ src/booking/waitlistService.test.js (3 tests) 79ms
   ✓ cancelBooking (3)
     ✓ deletes the booking and offers the slot to the first student waiting 38ms
     ✓ sends no e-mail when nobody is waiting 17ms
     ✓ refuses an unknown booking with NOT_FOUND 22ms
 ✓ src/ci/policy.test.js (15 tests) 69ms
   ✓ checkWorkflow (15)
     ✓ a workflow that follows every rule passes all 8 13ms
     ✓ R1: npm install instead of npm ci 10ms
     ✓ R2: a setup-node step without cache: npm 3ms
     ✓ R3: no PostgreSQL service 2ms
     ✓ R3: a service without a health check 4ms
     ✓ R3: the URL points at a port nobody published 3ms
     ✓ R4: browsers without their system libraries 2ms
     ✓ R5: the gate name changes with the event 2ms
     ✓ R6: a gate without if: always() is skipped when a job fails 2ms
     ✓ R6: a gate that never reads the results 7ms
     ✓ R7: the gate forgot a blocking job 3ms
     ✓ R7: the gate needs the report-only quarantine job 4ms
     ✓ R7: quarantined tests inside a blocking job 6ms
     ✓ R8: continue-on-error on a matrix job hides red legs 4ms
     ✓ R8: a Node version below engines 3ms
 ✓ src/lib/mailer.test.js (4 tests) 78ms
   ✓ createHttpMailer (4)
     ✓ posts { to, subject } with a Bearer key and returns the id 50ms
     ✓ 429 → RATE_LIMITED 5ms
     ✓ 400 → MAIL_FAILED with the status as the cause 8ms
     ✓ 503 → MAIL_FAILED with the status as the cause 7ms
 ✓ src/ci/shard.test.js (13 tests) 14ms
   ✓ splitIntoShards (8)
     ✓ longest first, each into the lightest shard → 4 + 3 + 3 seconds 9ms
     ✓ every file exactly once, whatever the number of shards 0ms
     ✓ more shards than files → the extra shards are empty, not an error 0ms
     ✓ the input order does not matter: every CI machine computes the same split 0ms
     ✓ a file without a timing counts as UNKNOWN_MS 0ms
     ✓ total 0 is refused 0ms
     ✓ total -1 is refused 0ms
     ✓ total 1.5 is refused 0ms
   ✓ pickShard (4)
     ✓ "1/3" is the first shard, "3/3" the last (1-based, like --shard) 0ms
     ✓ 0/3 does not exist 0ms
     ✓ 4/3 does not exist 0ms
     ✓ a malformed spec is a SyntaxError 0ms
   ✓ durationsFromReport (1)
     ✓ relative file → milliseconds, from a Vitest JSON report 0ms
 ✓ src/legacy/clubFee.test.js (14 tests) 7ms
   ✓ clubFee (characterization of v0) (14)
     ✓ quoted on WED: member false, BE-201 08:00–10:00, 30 seats ⇒ 400000 VND 4ms
     ✓ quoted on WED: member true, BE-201 08:00–10:00, 30 seats ⇒ 320000 VND 0ms
     ✓ quoted on WED: member false, BE-201 08:00–10:00, 40 seats ⇒ 400000 VND 0ms
     ✓ quoted on WED: member false, BE-201 08:00–10:00, 41 seats ⇒ 500000 VND 0ms
     ✓ quoted on WED: member false, BE-201 08:00–11:30, 30 seats ⇒ 700000 VND 0ms
     ✓ quoted on WED: member false, BE-201 08:00–12:00, 30 seats ⇒ 750000 VND 0ms
     ✓ quoted on WED: member true, AL-105 08:00–08:30, 30 seats ⇒ 140000 VND 0ms
     ✓ quoted on SAT: member true, AL-105 08:00–08:30, 30 seats ⇒ 210000 VND 0ms
     ✓ quoted on SUN: member false, AL-105 08:00–08:30, 30 seats ⇒ 263000 VND 0ms
     ✓ quoted on WED: member false, BE-201 10:00–08:00, 30 seats ⇒ 0 VND 0ms
     ✓ quoted on WED: member 1, BE-201 08:00–10:00, 30 seats ⇒ 320000 VND 0ms
     ✓ quoted on WED: member yes, BE-201 08:00–10:00, 30 seats ⇒ 400000 VND 0ms
     ✓ charges the weekend rate when the QUOTE is made on a weekend, whatever the event date (LF-212, pinned) 0ms
     ✓ returns NaN for a building it has no price for 0ms
 ✓ src/report/monthly.test.js (3 tests) 4ms
   ✓ buildMonthlyReport (2)
     ✓ prints one line per kept booking and the four totals 1ms
     ✓ counts Saturday and Sunday by the calendar date, whatever the time zone of the machine 0ms
   ✓ monthlyReport with injected dependencies (object seams) (1)
     ✓ reads the bookings, the holidays and today from what it is given 1ms
 ✓ src/legacy/monthlyReport.test.js (2 tests) 8ms
   ✓ monthlyReport (characterization) (2)
     ✓ prints the same reports as v0, for every lab and month we keep 6ms
     ✓ counts no holiday when the holiday service cannot be reached, as v0 did 0ms
 ✓ src/booking/myBookings.test.js (7 tests) 270ms
   ✓ listMyBookings (US-11) (1)
     ✓ only my bookings, by date then start (AC1) 68ms
   ✓ cancelMyBooking (US-11) (6)
     ✓ cancels: the booking comes back CANCELLED and stays in my list (AC1, AC2) 34ms
     ✓ a cancelled slot can be booked again (AC5) 46ms
     ✓ refuses inside the last hour and changes nothing (AC2) 32ms
     ✓ someone else's booking looks missing, and stays booked (AC3) 29ms
     ✓ twice → ALREADY_CANCELLED the second time (AC4) 34ms
     ✓ two cancels at the same moment: exactly one wins (AC4) 24ms
 ✓ src/api/rules.api.test.js (3 tests) 94ms
   ✓ approval through the API (3)
     ✓ LECTURER books 40 seats → CONFIRMED (Lite-2) 60ms
     ✓ ADMIN books 40 seats → CONFIRMED (Lite-2) 16ms
     ✓ STUDENT books 40 seats → PENDING (BR-06) 15ms
 ✓ src/lib/retry.test.js (3 tests) 18ms
   ✓ retry (3)
     ✓ returns at once when the first attempt works 3ms
     ✓ waits 1 s then 2 s between attempts 5ms
     ✓ gives up after 3 attempts and rethrows the last error 7ms
 ✓ src/rules/days.test.js (4 tests) 5ms
   ✓ daysAheadVN (BR-05 counted in Viet Nam time) (4)
     ✓ now 2026-11-02T06:30:00+07:00 → 2026-11-16 is 14 days ahead 2ms
     ✓ now 2026-11-02T23:59:00+07:00 → 2026-11-16 is 14 days ahead 0ms
     ✓ now 2026-11-03T00:00:00+07:00 → 2026-11-16 is 13 days ahead 0ms
     ✓ now 2026-11-02T06:30:00+07:00 → 2026-11-02 is 0 days ahead 0ms
 ✓ src/rules/cancel.test.js (18 tests) 9ms
   ✓ canCancel (Lite-3: until 60 minutes before the start) (4)
     ✓ at 07:00, a 09:00 booking can be cancelled → true 2ms
     ✓ at 08:00, a 09:00 booking can be cancelled → true 0ms
     ✓ at 08:01, a 09:00 booking can be cancelled → false 0ms
     ✓ at 09:30, a 09:00 booking can be cancelled → false 0ms
   ✓ cancelDecision — who may cancel, and until when (US-11) (13)
     ✓ the owner, 2 hours before (AC2) 1ms
     ✓ the owner, exactly 60 minutes before (Lite-3, AC2) 0ms
     ✓ the owner, 59 minutes before (Lite-3, AC2) 0ms
     ✓ the owner, PENDING booking 0ms
     ✓ another student (AC3) 0ms
     ✓ a lecturer who does not own it (AC3) 0ms
     ✓ an admin, 2 hours before (AC6) 0ms
     ✓ an admin, 30 minutes before — admins are not bound by Lite-3 (AC6) 0ms
     ✓ the owner, already cancelled (AC4) 0ms
     ✓ the owner, already cancelled AND too late → ALREADY_CANCELLED 0ms
     ✓ an admin, already cancelled 0ms
     ✓ anyone, a booking that does not exist 0ms
     ✓ another student, a cancelled booking → NOT_FOUND, no leak (AC3) 0ms
   ✓ startsAtVN (1)
     ✓ reads date and start as Viet Nam time: 09:00 in Ha Noi is 02:00 UTC 4ms
 ✓ src/api/server.test.js (12 tests) 223ms
   ✓ POST /api/bookings (4)
     ✓ 201 with Location and the public booking 47ms
     ✓ 401 without a token 4ms
     ✓ 400 VALIDATION for seats 0, and for a role in the body 7ms
     ✓ 422 for a rule, 409 for a taken slot (BR-04) 27ms
   ✓ who may read what (8)
     ✓ the owner reading booking 1 → 200 27ms
     ✓ another student reading booking 1 → 404 23ms
     ✓ a lecturer reading booking 1 → 404 36ms
     ✓ an admin reading booking 1 → 200 27ms
     ✓ STUDENT on the admin list → 403 4ms
     ✓ LECTURER on the admin list → 403 5ms
     ✓ ADMIN on the admin list → 200 10ms
     ✓ an expired token → 401 (clock fixed in 2030) 4ms
 ✓ src/rules/checkin.test.js (16 tests) 8ms
   ✓ checkIn (BR-07) (8)
     ✓ at 07:49 → { ok: false, code: 'TOO_EARLY' } 2ms
     ✓ at 07:50 → { ok: true, late: false } 0ms
     ✓ at 08:00 → { ok: true, late: false } 0ms
     ✓ at 08:01 → { ok: true, late: true } 0ms
     ✓ at 08:15 → { ok: true, late: true } 0ms
     ✓ at 08:16 → { ok: false, code: 'NO_SHOW' } 0ms
     ✓ refuses a PENDING booking 0ms
     ✓ refuses a CANCELLED booking 0ms
   ✓ bannedUntil (BR-08) (7)
     ✓ bans for 7 days after the third no-show 3ms
     ✓ counts from the latest no-show, whatever the order 0ms
     ✓ two no-shows are not enough 0ms
     ✓ the ban still holds on its last day, and is over the day after 0ms
     ✓ a no-show 30 days ago no longer counts; 29 days ago still does 0ms
     ✓ a no-show today already counts 0ms
     ✓ ignores no-shows dated after today 0ms
   ✓ createNoShowLog (1)
     ✓ keeps each student separate, in order 0ms
 ✓ src/rules/time.test.js (12 tests) 7ms
   ✓ parseTime (10)
     ✓ 00:00 → 0 1ms
     ✓ 07:00 → 420 0ms
     ✓ 21:30 → 1290 0ms
     ✓ 23:59 → 1439 0ms
     ✓ throws TypeError for "7:00" 1ms
     ✓ throws TypeError for "07-00" 0ms
     ✓ throws TypeError for "" 0ms
     ✓ throws TypeError for "abc" 0ms
     ✓ throws RangeError for 24:00 0ms
     ✓ throws RangeError for 07:60 0ms
   ✓ formatTime (2)
     ✓ pads to HH:MM 0ms
     ✓ round-trips with parseTime for every minute of the day 3ms
 ✓ src/rules/recurring.test.js (11 tests) 9ms
   ✓ weeklyDates (11)
     ✓ books the first date and the same weekday in each following week 6ms
     ✓ skips a holiday without adding an extra week 0ms
     ✓ keeps a class on the last day of term and drops the weeks after it 0ms
     ✓ reports HOLIDAY inside the term, but AFTER_TERM for a holiday after it 0ms
     ✓ crosses a month and a year correctly 0ms
     ✓ accepts 1 week(s) 1ms
     ✓ accepts 15 week(s) 0ms
     ✓ refuses 0 weeks with BAD_WEEKS 0ms
     ✓ refuses 16 weeks with BAD_WEEKS 0ms
     ✓ refuses 2.5 weeks with BAD_WEEKS 0ms
     ✓ refuses a series that starts after the term, and accepts one that starts on its last day 0ms
 ✓ src/ci/rtm.test.js (19 tests) 6ms
   ✓ tagsOf (7)
     ✓ checkSlot accepts 08:00–12:00 (240 min) Lite-1 → ["Lite-1"] 2ms
     ✓ needsApproval (BR-06 decision table) LECTURER, 31 seats → false Lite-2 → ["BR-06","Lite-2"] 0ms
     ✓ cancelMyBooking (US-11) twice (AC4) → ["US-11 AC4"] 0ms
     ✓ the API on PostgreSQL (US-11) book → cancel (AC1, AC2) → ["US-11 AC1","US-11 AC2"] 0ms
     ✓ old style (US-11 AC2–AC4) → ["US-11 AC2","US-11 AC3","US-11 AC4"] 0ms
     ✓ AC2 without the story id → [] 0ms
     ✓ BR-4 is not an id, BR-045 neither → [] 0ms
   ✓ layerOf (7)
     ✓ src/rules/cancel.test.js → Unit 1ms
     ✓ src/api/myBookings.test.js → API 0ms
     ✓ test/integration/myBookings.int.test.js → DB 0ms
     ✓ web/MyBookings.test.jsx → UI 0ms
     ✓ e2e/huy-phong.spec.js → E2E 0ms
     ✓ /home/runner/work/x/src/api/server.test.js → API 0ms
     ✓ src/ci/rtm.test.js → null 0ms
   ✓ reading the reports (2)
     ✓ Vitest: one entry per test, path relative to the project 0ms
     ✓ Playwright: describe titles join the name, the setup project is ignored, flaky counts as passed 0ms
   ✓ buildMatrix and traceGaps (3)
     ✓ counts passing tests only, per layer 0ms
     ✓ a High-risk requirement needs a test above Unit; an untested in-scope one is a gap; out of scope never is 0ms
     ✓ renders a Markdown table with the verdict per row 0ms
 ✓ src/rules/mutation-gaps.test.js (9 tests) 5ms
   ✓ booking rules: the cases nobody wrote (4)
     ✓ one seat is a valid booking 1ms
     ✓ the error says what was wrong 1ms
     ✓ a small student booking is CONFIRMED 0ms
     ✓ usageRate adds up the booked share of the 14 opening hours 0ms
   ✓ parseTime: only exactly HH:MM (4)
     ✓ refuses 08:000 0ms
     ✓ refuses 108:00 0ms
     ✓ the TypeError is ours, not a crash on null 0ms
     ✓ says which time is out of range 0ms
   ✓ newBookingRecord without injected helpers (1)
     ✓ makes a UUID and stamps the current time 2ms
 ✓ src/rules/code.test.js (4 tests) 7ms
   ✓ makeBookingCode (3)
     ✓ is "LF-" and 6 characters from the readable alphabet 2ms
     ✓ the same seed gives the same code; 20 codes from one seed are all different 0ms
     ✓ can produce the first and the last character of the alphabet 0ms
   ✓ newBookingRecord (1)
     ✓ takes its id and clock from the caller 2ms
 ✓ src/rules/booking.test.js (28 tests) 5ms
   ✓ checkSlot (11)
     ✓ accepts (4)
       ✓ 07:00–08:00 (60 min) BR-04 2ms
       ✓ 20:00–21:00 (60 min) BR-04 0ms
       ✓ 08:00–08:30 (30 min) BR-04 0ms
       ✓ 08:00–12:00 (240 min) Lite-1 0ms
     ✓ rejects (7)
       ✓ 06:30–08:00 with OUTSIDE_HOURS BR-04 0ms
       ✓ 20:00–21:30 with OUTSIDE_HOURS BR-04 0ms
       ✓ 08:15–09:00 with OFF_GRID BR-04 0ms
       ✓ 08:00–09:10 with OFF_GRID BR-04 0ms
       ✓ 10:00–09:00 with END_BEFORE_START BR-04 0ms
       ✓ 09:00–09:00 with END_BEFORE_START BR-04 0ms
       ✓ 08:00–12:30 with TOO_LONG Lite-1 0ms
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
     ✓ STUDENT, 30 seats → false  0ms
     ✓ STUDENT, 31 seats → true  0ms
     ✓ LECTURER, 31 seats → false Lite-2 0ms
     ✓ ADMIN, 31 seats → false Lite-2 0ms
     ✓ throws RangeError for 0 seats 0ms
     ✓ throws RangeError for -5 seats 0ms
     ✓ throws RangeError for 2.5 seats 0ms
   ✓ createBooking (2)
     ✓ builds a PENDING booking for 31 seats 0ms
     ✓ throws the rule code for a bad slot 0ms
 ✓ src/lib/retry-last.test.js (1 test) 5ms
   ✓ gives up right after the 3rd attempt: no wait after the last one 4ms
 ✓ src/ci/summary.test.js (11 tests) 5ms
   ✓ testHeadline (4)
     ✓ green: how many passed out of how many 1ms
     ✓ red: the number of failures comes first 0ms
     ✓ a single failure is enough to be red 0ms
     ✓ skipped tests are said out loud, not hidden in the total 0ms
   ✓ failedTests (2)
     ✓ one line per failed test: relative file, full name, first line of the error 0ms
     ✓ nothing failed → empty 0ms
   ✓ coverageTable (2)
     ✓ two decimals, the minimum, and a mark per metric 0ms
     ✓ exactly at the minimum passes; just under fails 0ms
   ✓ mergeReports (1)
     ✓ unit + web: the counts add up and every file is kept 0ms
   ✓ stepSummary (2)
     ✓ title, headline, failures, then coverage — separated by blank lines 0ms
     ✓ without coverage there is no table 0ms
 ✓ src/rules/waitlist.test.js (11 tests) 4ms
   ✓ joinWaitlist (7)
     ✓ puts the first student at position 1 2ms
     ✓ puts the next student behind the ones already waiting 0ms
     ✓ refuses a student who is already waiting 0ms
     ✓ refuses a fourth student: at most 3 wait for one slot 0ms
     ✓ refuses the student who already holds the slot 0ms
     ✓ says ALREADY_WAITING, not WAITLIST_FULL, to a student already in a full line 0ms
     ✓ never changes the queue it was given 0ms
   ✓ offerNext (2)
     ✓ offers the slot to the first student in line for 30 minutes 0ms
     ✓ offers nothing when nobody is waiting 0ms
   ✓ acceptOffer (2)
     ✓ accepts at 10:29, one minute before the offer expires 0ms
     ✓ refuses at 10:30: the offer has expired 0ms
 ✓ src/ci/gate.test.js (7 tests) 3ms
   ✓ decideMerge — the ci-ok gate (7)
     ✓ every required job succeeded → may merge 2ms
     ✓ a required job that is failure blocks the merge 0ms
     ✓ a required job that is cancelled blocks the merge 0ms
     ✓ a required job that is skipped blocks the merge 0ms
     ✓ a required job missing from needs blocks (someone deleted it from the workflow) 0ms
     ✓ every problem is listed, not only the first 0ms
     ✓ a job that is not required never blocks (report-only, e.g. quarantine) 0ms
 ✓ src/rules/busy.test.js (8 tests) 5ms
   ✓ mergeBusy (8)
     ✓ returns no blocks for a day without bookings 2ms
     ✓ keeps separate bookings apart, sorted by start 0ms
     ✓ merges overlapping bookings into one block 0ms
     ✓ merges touching (10:00 ends, 10:00 starts) bookings into one block 0ms
     ✓ merges one inside the other bookings into one block 0ms
     ✓ merges inside, listed first bookings into one block 0ms
     ✓ does not change the array it was given 0ms
     ✓ rejects a time that is not HH:MM 0ms
 ✓ src/ci/workflow.test.js (15 tests) 4ms
   ✓ .github/workflows/test.yml (15)
     ✓ R1 npm ci, never npm install 1ms
     ✓ R2 setup-node caches the npm downloads 0ms
     ✓ R3 integration tests get a healthy PostgreSQL service 0ms
     ✓ R4 Playwright browsers come with their system libraries 0ms
     ✓ R5 one gate job named exactly ci-ok 0ms
     ✓ R6 the gate runs even when a job it needs failed 0ms
     ✓ R7 every blocking job is required; report-only jobs never block 0ms
     ✓ R8 a red matrix leg makes the job red 0ms
     ✓ runs on pull requests and on pushes to main 0ms
     ✓ the unit job tests every Node version that package.json supports, and only those 0ms
     ✓ the integration job uses the same PostgreSQL major version as production (17) and waits for it 0ms
     ✓ e2e installs Chromium with its system libraries before running Playwright 0ms
     ✓ every test job uploads its reports, even when the tests are red 0ms
     ✓ the gate requires exactly unit, integration, e2e, mutation and report (lesson 11.4) 0ms
     ✓ the report job reads every report, runs even after a red job, and keeps the exit code through tee 0ms
 ✓ src/rules/clubFee.test.js (1 test) 3ms
   ✓ quoteClubFee (1)
     ✓ charges 1.5 times on a Sunday and the plain price on a Monday 2ms
 ✓ src/auth/login-guard.test.js (5 tests) 3ms
   ✓ createLoginGuard (BR-02: 5 failures → locked 15 minutes) (5)
     ✓ 4 failures do not lock 2ms
     ✓ the 5th failure locks 0ms
     ✓ still locked at 14:59.999, unlocked at exactly 15:00 0ms
     ✓ a successful login resets the counter 0ms
     ✓ locks only the account that failed 0ms
 ✓ src/notify/reminder.test.js (1 test) 3ms
   ✓ sends "Reminder: <lab> at <start> tomorrow" to the student 2ms
 ✓ src/api/myBookings.test.js (18 tests) 643ms
   ✓ GET /api/bookings (US-11) (2)
     ✓ 200: only my bookings, cancelled ones too, as in the contract (AC1) 141ms
     ✓ 401 without a token 6ms
   ✓ POST /api/bookings/:id/cancel (US-11) (16)
     ✓ 200 with the booking, now CANCELLED (AC2) 51ms
     ✓ Lite-3: at 07:00 (60 minutes before) → 200 CANCELLED (AC2) 86ms
     ✓ Lite-3: at 07:01 (59 minutes before) → 422 TOO_LATE_TO_CANCEL (AC2) 27ms
     ✓ binh (STUDENT) cancelling an’s booking → 404 (AC3) 39ms
     ✓ thay (LECTURER) cancelling an’s booking → 404 (AC3) 30ms
     ✓ boss (ADMIN) cancelling an’s booking → 200 (AC6) 32ms
     ✓ an admin may cancel inside the last hour (AC6) 27ms
     ✓ 409 ALREADY_CANCELLED the second time (AC4) 38ms
     ✓ id 999 → 404, never 500 22ms
     ✓ id abc → 404, never 500 17ms
     ✓ id 0 → 404, never 500 15ms
     ✓ id -1 → 404, never 500 15ms
     ✓ id 1.5 → 404, never 500 15ms
     ✓ id 2147483648 → 404, never 500 16ms
     ✓ 401 without a token, and the booking is untouched 23ms
     ✓ after cancelling, the same slot can be booked again: 201 (AC5) 41ms

 Test Files  32 passed (32)
      Tests  291 passed (291)
   Start at  11:53:49
   Duration  1.17s (tests 45%, import 31%, transform 15%, worker 10%)

    Isolate  32 workers spawned · ~105ms startup each (spawn + environment, per file)
             at least ~269ms faster with isolate: false — reuses workers across files instead of one per file

 % Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   92.83 |    84.86 |   94.44 |    93.8 |                   
 api               |   91.54 |    82.35 |      90 |   94.73 |                   
  auth.js          |     100 |      100 |     100 |     100 |                   
  myBookings.js    |     100 |      100 |     100 |     100 |                   
  schemas.js       |     100 |      100 |     100 |     100 |                   
  server.js        |      88 |       76 |   84.61 |    92.1 | 11,57-59          
 auth              |   92.85 |    85.71 |      80 |   92.85 |                   
  login-guard.js   |   92.85 |    85.71 |      80 |   92.85 | 5                 
 booking           |   97.14 |    91.66 |      96 |   98.11 |                   
  myBookings.js    |     100 |      100 |     100 |     100 |                   
  service.js       |   98.03 |    95.65 |     100 |     100 | 68                
  ...istService.js |   91.66 |    77.77 |   66.66 |      90 | 8                 
 ci                |   85.44 |    74.24 |   91.95 |   85.36 |                   
  gate.js          |     100 |      100 |     100 |     100 |                   
  policy.js        |      98 |    85.33 |   97.72 |     100 | ...29-31,43,69,77 
  quality.js       |       0 |        0 |       0 |       0 | 8-46              
  rtm.js           |     100 |    95.65 |     100 |     100 | 29-39             
  shard.js         |     100 |       95 |     100 |     100 | 32                
  summary.js       |     100 |    84.21 |     100 |     100 | 17-29             
 legacy            |     100 |      100 |     100 |     100 |                   
  club-prices.js   |     100 |      100 |     100 |     100 |                   
  clubFee.js       |     100 |      100 |     100 |     100 |                   
  monthlyReport.js |     100 |      100 |     100 |     100 |                   
 lib               |     100 |      100 |     100 |     100 |                   
  mailer.js        |     100 |      100 |     100 |     100 |                   
  retry.js         |     100 |      100 |     100 |     100 |                   
 notify            |     100 |      100 |     100 |     100 |                   
  notify.js        |     100 |      100 |     100 |     100 |                   
  reminder.js      |     100 |      100 |     100 |     100 |                   
 report            |     100 |      100 |     100 |     100 |                   
  monthly.js       |     100 |      100 |     100 |     100 |                   
 rules             |     100 |      100 |     100 |     100 |                   
  booking.js       |     100 |      100 |     100 |     100 |                   
  busy.js          |     100 |      100 |     100 |     100 |                   
  cancel.js        |     100 |      100 |     100 |     100 |                   
  checkin.js       |     100 |      100 |     100 |     100 |                   
  clubFee.js       |     100 |      100 |     100 |     100 |                   
  code.js          |     100 |      100 |     100 |     100 |                   
  days.js          |     100 |      100 |     100 |     100 |                   
  recurring.js     |     100 |      100 |     100 |     100 |                   
  time.js          |     100 |      100 |     100 |     100 |                   
  waitlist.js      |     100 |      100 |     100 |     100 |                   
-------------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 92.83% ( 609/656 )
Branches     : 84.86% ( 342/403 )
Functions    : 94.44% ( 187/198 )
Lines        : 93.8% ( 439/468 )
================================================================================
ERROR: Coverage for lines (93.8%) does not meet global threshold (97%)
ERROR: Coverage for functions (94.44%) does not meet global threshold (96%)
ERROR: Coverage for statements (92.83%) does not meet global threshold (97%)
ERROR: Coverage for branches (84.86%) does not meet global threshold (91%)`,
  '114-rtm-tu-dem': `$ node scripts/rtm.mjs | grep -E "^\\| (BR-06|Lite-1|Lite-2) "
| BR-06 | High | 8 | · | · | · | 1 | ✅ |
| Lite-1 | Low | 3 | · | · | · | · | ✅ |
| Lite-2 | Medium | 3 | · | · | · | · | ✅ |`,
  '114-th-do': `$ node scripts/thu-loi-lenh.mjs test-plan/requirements.json '"id": "Lite-1", "risk": "Low"' '"id": "Lite-1", "risk": "High"' -- node scripts/ci-report.mjs
planted in test-plan/requirements.json:  "id": "Lite-1", "risk": "Low"  →  "id": "Lite-1", "risk": "High"

## Quality report — LabFlow Lite 1.1 — My bookings and cancel (US-11)

### ❌ Do not merge

- traceability — Lite-1: High risk, tested only at the Unit layer

| Layer | Tests | Failed | |
|---|---:|---:|---|
| Unit + API (src/) | 298 | 0 | ✅ |
| UI components (web/) | 24 | 0 | ✅ |
| DB integration (PostgreSQL 17) | 19 | 0 | ✅ |
| End to end (Chromium) | 8 | 0 | ✅ |

| Coverage | Now | Minimum | |
|---|---:|---:|---|
| lines | 98.93% | 97% | ✅ |
| branches | 93.30% | 91% | ✅ |
| functions | 97.47% | 96% | ✅ |
| statements | 98.32% | 97% | ✅ |

**Mutation score:** 99.08% (minimum 95%)

### Traceability

| Requirement | Risk | Unit | API | DB | UI | E2E | |
|---|---|---:|---:|---:|---:|---:|---|
| BR-04 | High | 11 | 1 | 7 | · | 1 | ✅ |
| BR-05 | Medium | 12 | · | · | · | · | ✅ |
| BR-06 | High | 7 | 1 | · | · | 1 | ✅ |
| Lite-1 | High | 2 | · | · | · | · | ❌ |
| Lite-2 | Medium | 2 | 2 | · | · | · | ✅ |
| Lite-3 | High | 7 | 2 | · | · | · | ✅ |
| US-11 AC1 | High | 2 | 1 | 2 | 1 | 1 | ✅ |
| US-11 AC2 | High | 5 | 3 | 1 | 2 | 1 | ✅ |
| US-11 AC3 | High | 4 | 2 | · | · | · | ✅ |
| US-11 AC4 | Medium | 3 | 1 | 1 | 1 | · | ✅ |
| US-11 AC5 | High | 1 | 1 | 1 | · | 1 | ✅ |
| US-11 AC6 | Low | 2 | 2 | · | · | · | ✅ |
| BR-02 (out of scope) | High | 5 | · | · | · | · | — |
| BR-07 (out of scope) | Medium | 8 | · | · | · | · | — |
| BR-08 (out of scope) | Medium | 7 | · | · | · | · | — |
| BR-09 (out of scope) | Medium | · | · | · | · | · | — |
| BR-10 (out of scope) | Low | · | · | · | · | · | — |

**Gaps:**
- Lite-1: High risk, tested only at the Unit layer
::error title=report::traceability — Lite-1: High risk, tested only at the Unit layer`,
  '114-th-xanh': `$ npx vitest run src/ --reporter=json --outputFile=reports/unit.json > /dev/null; node scripts/thu-loi-lenh.mjs test-plan/requirements.json '"id": "Lite-1", "risk": "Low"' '"id": "Lite-1", "risk": "High"' -- node scripts/ci-report.mjs
planted in test-plan/requirements.json:  "id": "Lite-1", "risk": "Low"  →  "id": "Lite-1", "risk": "High"

## Quality report — LabFlow Lite 1.1 — My bookings and cancel (US-11)

### ✅ Every check passed

| Layer | Tests | Failed | |
|---|---:|---:|---|
| Unit + API (src/) | 299 | 0 | ✅ |
| UI components (web/) | 24 | 0 | ✅ |
| DB integration (PostgreSQL 17) | 19 | 0 | ✅ |
| End to end (Chromium) | 8 | 0 | ✅ |

| Coverage | Now | Minimum | |
|---|---:|---:|---|
| lines | 98.93% | 97% | ✅ |
| branches | 93.30% | 91% | ✅ |
| functions | 97.47% | 96% | ✅ |
| statements | 98.32% | 97% | ✅ |

**Mutation score:** 99.08% (minimum 95%)

### Traceability

| Requirement | Risk | Unit | API | DB | UI | E2E | |
|---|---|---:|---:|---:|---:|---:|---|
| BR-04 | High | 11 | 1 | 7 | · | 1 | ✅ |
| BR-05 | Medium | 12 | · | · | · | · | ✅ |
| BR-06 | High | 7 | 1 | · | · | 1 | ✅ |
| Lite-1 | High | 2 | 1 | · | · | · | ✅ |
| Lite-2 | Medium | 2 | 2 | · | · | · | ✅ |
| Lite-3 | High | 7 | 2 | · | · | · | ✅ |
| US-11 AC1 | High | 2 | 1 | 2 | 1 | 1 | ✅ |
| US-11 AC2 | High | 5 | 3 | 1 | 2 | 1 | ✅ |
| US-11 AC3 | High | 4 | 2 | · | · | · | ✅ |
| US-11 AC4 | Medium | 3 | 1 | 1 | 1 | · | ✅ |
| US-11 AC5 | High | 1 | 1 | 1 | · | 1 | ✅ |
| US-11 AC6 | Low | 2 | 2 | · | · | · | ✅ |
| BR-02 (out of scope) | High | 5 | · | · | · | · | — |
| BR-07 (out of scope) | Medium | 8 | · | · | · | · | — |
| BR-08 (out of scope) | Medium | 7 | · | · | · | · | — |
| BR-09 (out of scope) | Medium | · | · | · | · | · | — |
| BR-10 (out of scope) | Low | · | · | · | · | · | — |

Every in-scope requirement is traced to a passing test.`,
  '114-workflow-test': `$ npx vitest run src/ci/workflow.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ src/ci/workflow.test.js (15 tests) 5ms
   ✓ .github/workflows/test.yml (15)
     ✓ R1 npm ci, never npm install 1ms
     ✓ R2 setup-node caches the npm downloads 0ms
     ✓ R3 integration tests get a healthy PostgreSQL service 0ms
     ✓ R4 Playwright browsers come with their system libraries 0ms
     ✓ R5 one gate job named exactly ci-ok 0ms
     ✓ R6 the gate runs even when a job it needs failed 0ms
     ✓ R7 every blocking job is required; report-only jobs never block 0ms
     ✓ R8 a red matrix leg makes the job red 0ms
     ✓ runs on pull requests and on pushes to main 1ms
     ✓ the unit job tests every Node version that package.json supports, and only those 0ms
     ✓ the integration job uses the same PostgreSQL major version as production (17) and waits for it 0ms
     ✓ e2e installs Chromium with its system libraries before running Playwright 0ms
     ✓ every test job uploads its reports, even when the tests are red 0ms
     ✓ the gate requires exactly unit, integration, e2e, mutation and report (lesson 11.4) 0ms
     ✓ the report job reads every report, runs even after a red job, and keeps the exit code through tee 0ms

 Test Files  1 passed (1)
      Tests  15 passed (15)
   Start at  11:53:48
   Duration  165ms (import 65%, transform 26%, tests 6%, worker 3%)`,
  '115-cham-ref': `$ node scripts/cham-cuoi-khoa.mjs
  5/5   A. green on the correct code: unit + API
  5/5   A. green on the correct code: UI
  5/5   A. green on the correct code: DB
  5/5   A. green on the correct code: E2E
      ✔ killed by unit + API #1 admins are refused inside the last hour too (AC6)
      ✔ killed by unit + API #2 a lecturer can cancel anyone's booking (AC3)
      ✔ killed by unit + API #3 start read as UTC: cancelling stays open 7 hours too long (Lite-3)
      ✔ killed by unit + API #4 a cancelled slot stays blocked (AC5)
      ✔ killed by unit + API #5 two cancels at the same moment both succeed (AC4)
      ✔ killed by DB         #6 PostgreSQL still blocks a cancelled slot (AC5)
      ✔ killed by DB         #7 dates come back from PostgreSQL as JS Dates (AC1)
      ✔ killed by DB         #8 the cancel UPDATE is not atomic: both win (AC4)
      ✔ killed by unit + API #9 My bookings shows everyone’s bookings (AC1)
      ✔ killed by unit + API #10 too late answered as 409, not 422 (AC2)
      ✔ killed by UI         #11 other rows stay clickable during a cancel
      ✔ killed by E2E        #12 the screen calls a URL the API does not have
 36/36  B. bugs your tests catch — 12/12
  6/6   C. coverage thresholds (npm run test:cov)
  8/8   C. mutation score ≥ break (npm run test:mutation)
 10/10  D. traceability of US-11 and Lite-3 — all 7 traced
 10/10  E. test plan
 10/10  F. CI pipeline

Total: 100/100 — excellent`,
  '115-cham-yeu': `$ node scripts/cham-cuoi-khoa.mjs --from capstone/yeu
Graded: the deliverables of capstone/yeu (8 files)

  5/5   A. green on the correct code: unit + API
  5/5   A. green on the correct code: UI
  5/5   A. green on the correct code: DB
  5/5   A. green on the correct code: E2E
      ✘ SURVIVED           #1 admins are refused inside the last hour too (AC6)
      ✘ SURVIVED           #2 a lecturer can cancel anyone's booking (AC3)
      ✔ killed by unit + API #3 start read as UTC: cancelling stays open 7 hours too long (Lite-3)
      ✘ SURVIVED           #4 a cancelled slot stays blocked (AC5)
      ✘ SURVIVED           #5 two cancels at the same moment both succeed (AC4)
      ✘ SURVIVED           #6 PostgreSQL still blocks a cancelled slot (AC5)
      ✘ SURVIVED           #7 dates come back from PostgreSQL as JS Dates (AC1)
      ✘ SURVIVED           #8 the cancel UPDATE is not atomic: both win (AC4)
      ✘ SURVIVED           #9 My bookings shows everyone’s bookings (AC1)
      ✘ SURVIVED           #10 too late answered as 409, not 422 (AC2)
      ✘ SURVIVED           #11 other rows stay clickable during a cancel
      ✔ killed by E2E        #12 the screen calls a URL the API does not have
  6/36  B. bugs your tests catch — 2/12
  0/6   C. coverage thresholds (npm run test:cov)
  8/8   C. mutation score ≥ break (npm run test:mutation)
  0/10  D. traceability of US-11 and Lite-3 — Lite-3: High risk, tested only at the Unit layer; US-11 AC1: no passing test; US-11 AC2: no passing test; US-11 AC3: no passing test; US-11 AC4: no passing test; US-11 AC5: no passing test; US-11 AC6: no passing test
  4/10  E. test plan — missing: Entry criteria, Exit criteria, Traceability, Definition of done · High risks not named: BR-04, BR-06, Lite-3, US-11 AC1, US-11 AC2, US-11 AC3, US-11 AC5
  4/10  F. CI pipeline

Total: 42/100 — not yet: read the lines with fewer points`,
};
