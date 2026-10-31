import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { makeApi, body } from '../test/support/api.js';

const post = async (payload) => {
  const { app, bearer } = makeApi();
  return request(app).post('/api/bookings').set('Authorization', await bearer('an')).send(payload);
};

describe('400 VALIDATION: the request itself is malformed', () => {
  const { lab, ...noLab } = body();
  it.each([
    ['lab missing', 'lab', noLab],
    ['seats as a string', 'seats', body({ seats: '20' })],
    ['seats 2.5', 'seats', body({ seats: 2.5 })],
    ['date 2026-13-01', 'date', body({ date: '2026-13-01' })],
    ['start "7:00"', 'start', body({ start: '7:00' })],
    ['end "24:00"', 'end', body({ end: '24:00' })],
  ])('%s → 400 on path "%s"', async (_, path, payload) => {
    const res = await post(payload);
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION');
    expect(res.body.error.details.map((d) => d.path)).toContain(path);
  });

  it('broken JSON → 400 BAD_JSON', async () => {
    const { app, bearer } = makeApi();
    const res = await request(app).post('/api/bookings').set('Authorization', await bearer('an'))
      .set('Content-Type', 'application/json').send('{"lab": "BE-201",');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: { code: 'BAD_JSON' } });
  });
});

describe('422: well-formed, but against a business rule', () => {
  it.each([
    ['08:15', '09:00', 'OFF_GRID'],
    ['10:00', '08:00', 'END_BEFORE_START'],
    ['08:00', '12:30', 'TOO_LONG'],
  ])('%s–%s → 422 %s', async (start, end, code) => {
    const res = await post(body({ start, end }));
    expect(res.status).toBe(422);
    expect(res.body).toEqual({ error: { code } });
  });
});
