// A test that only looks at the status code.
import { it, expect } from 'vitest';
import request from 'supertest';
import { makeApi, body } from '../test/support/api.js';

it('creating a booking works (status only)', async () => {
  const { app, bearer } = makeApi();
  const res = await request(app).post('/api/bookings').set('Authorization', await bearer('an')).send(body());
  expect(res.status).toBe(201);
});
