// Practice 8.1: the lines the coverage report showed as never run (server.js 54–56, login-guard.js 5).
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
});
