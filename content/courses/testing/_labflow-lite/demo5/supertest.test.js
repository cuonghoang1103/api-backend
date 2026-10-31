import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { makeApi, body } from '../test/support/api.js';

describe('POST /api/bookings — through real HTTP, without starting the server', () => {
  it('GET /api/health answers 200 JSON', async () => {
    const { app } = makeApi();
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('201 + Location, and the Location really serves the booking', async () => {
    const { app, bearer } = makeApi();
    const auth = await bearer('an');
    const res = await request(app).post('/api/bookings').set('Authorization', auth).send(body());
    expect(res.status).toBe(201);
    expect(res.headers.location).toBe('/api/bookings/1');
    expect(res.body).toEqual({ id: 1, lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00', seats: 20, status: 'CONFIRMED', minutes: 120 });
    const again = await request(app).get(res.headers.location).set('Authorization', auth);
    expect(again.body).toEqual(res.body);
  });

  it('a business-rule violation is 422 with the rule code', async () => {
    const { app, bearer } = makeApi();
    const res = await request(app).post('/api/bookings').set('Authorization', await bearer('an')).send(body({ start: '06:00' }));
    expect(res.status).toBe(422);
    expect(res.body).toEqual({ error: { code: 'OUTSIDE_HOURS' } });
  });

  it('the same slot twice is 409 OVERLAP', async () => {
    const { app, bearer } = makeApi();
    const auth = await bearer('an');
    await request(app).post('/api/bookings').set('Authorization', auth).send(body());
    const res = await request(app).post('/api/bookings').set('Authorization', auth).send(body());
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('OVERLAP');
  });
});
