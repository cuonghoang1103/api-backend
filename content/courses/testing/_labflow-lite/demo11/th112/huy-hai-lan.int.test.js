// Practice 11.2: the 409 path of POST /api/bookings/:id/cancel, on PostgreSQL, checked against openapi.json.
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
});
