// US-11 "My bookings" on a real PostgreSQL (Chapter 11). Three things only the real database can show:
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
});
