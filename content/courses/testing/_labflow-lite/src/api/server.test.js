import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { makeApi, body } from '../../test/support/api.js';

const as = async (api, id, role) => api.bearer(id, role);

describe('POST /api/bookings', () => {
  it('201 with Location and the public booking', async () => {
    const api = makeApi();
    const res = await request(api.app).post('/api/bookings').set('Authorization', await as(api, 'an')).send(body());
    expect(res.status).toBe(201);
    expect(res.headers.location).toBe('/api/bookings/1');
    expect(res.body).toEqual({ id: 1, lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00', seats: 20, status: 'CONFIRMED', minutes: 120 });
  });

  it('401 without a token', async () => {
    const api = makeApi();
    expect((await request(api.app).post('/api/bookings').send(body())).status).toBe(401);
  });

  it('400 VALIDATION for seats 0, and for a role in the body', async () => {
    const api = makeApi();
    const auth = await as(api, 'an');
    const zero = await request(api.app).post('/api/bookings').set('Authorization', auth).send(body({ seats: 0 }));
    const role = await request(api.app).post('/api/bookings').set('Authorization', auth).send(body({ role: 'ADMIN' }));
    expect([zero.status, role.status]).toEqual([400, 400]);
    expect(role.body.error.details).toContainEqual({ path: '', message: 'Unrecognized key: "role"' });
  });

  it('422 for a rule, 409 for a taken slot', async () => {
    const api = makeApi();
    const auth = await as(api, 'an');
    const rule = await request(api.app).post('/api/bookings').set('Authorization', auth).send(body({ start: '06:00' }));
    await request(api.app).post('/api/bookings').set('Authorization', auth).send(body());
    const taken = await request(api.app).post('/api/bookings').set('Authorization', auth).send(body());
    expect([rule.status, rule.body.error.code]).toEqual([422, 'OUTSIDE_HOURS']);
    expect([taken.status, taken.body.error.code]).toEqual([409, 'OVERLAP']);
  });
});

describe('who may read what', () => {
  it.each([
    ['the owner', 200, 'an', 'STUDENT'],
    ['another student', 404, 'binh', 'STUDENT'],
    ['a lecturer', 404, 'thay', 'LECTURER'],
    ['an admin', 200, 'boss', 'ADMIN'],
  ])('%s reading booking 1 → %i', async (_, expected, id, role) => {
    const api = makeApi();
    await request(api.app).post('/api/bookings').set('Authorization', await as(api, 'an')).send(body());
    expect((await request(api.app).get('/api/bookings/1').set('Authorization', await as(api, id, role))).status).toBe(expected);
  });

  it.each([['STUDENT', 403], ['LECTURER', 403], ['ADMIN', 200]])('%s on the admin list → %i', async (role, expected) => {
    const api = makeApi();
    expect((await request(api.app).get('/api/admin/bookings').set('Authorization', await as(api, 'x', role))).status).toBe(expected);
  });

  it('an expired token → 401 (clock fixed in 2030)', async () => {
    let clock = new Date('2030-01-01T09:00:00Z');
    const api = makeApi({ now: () => clock });
    const auth = await as(api, 'an');
    clock = new Date('2030-01-01T10:00:00Z');
    expect((await request(api.app).get('/api/admin/bookings').set('Authorization', auth)).status).toBe(401);
  });
});
