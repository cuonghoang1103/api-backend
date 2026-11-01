// LF-301 (lesson 11.1): BR-05 says "at most 14 days ahead". The rule is a tested pure function — but does the API use it?
// This test asks the API. It is RED on purpose: it documents the defect found while building the traceability matrix.
import { it, expect } from 'vitest';
import request from 'supertest';
import { makeApi, body } from '../../test/support/api.js';

it('BR-05 at the API: a booking 30 days ahead is refused with 422', async () => {
  const api = makeApi({ now: () => new Date('2026-11-01T09:00:00+07:00') });
  const res = await request(api.app).post('/api/bookings').set('Authorization', await api.bearer('an')).send(body({ date: '2026-12-01' }));
  expect(res.status).toBe(422);
});
