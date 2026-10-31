import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { makeApi, body } from '../test/support/api.js';
import { createAuth } from '../src/api/auth.js';

describe('authentication: who are you? → 401', () => {
  it.each([
    ['no Authorization header', undefined],
    ['not a Bearer token', 'Basic YW46cGFzcw=='],
    ['a random string', 'Bearer not-a-jwt'],
  ])('%s → 401', async (_, header) => {
    const { app } = makeApi();
    const req = request(app).get('/api/bookings/1');
    const res = header ? await req.set('Authorization', header) : await req;
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: { code: 'UNAUTHENTICATED' } });
  });

  it('a token signed with another secret → 401', async () => {
    const { app } = makeApi();
    const forged = await createAuth({ secret: 'attacker-secret' }).sign({ id: 'an', role: 'ADMIN' });
    const res = await request(app).get('/api/admin/bookings').set('Authorization', 'Bearer ' + forged);
    expect(res.status).toBe(401);
  });

  it('a token issued at 09:00 for 1 hour is refused at 10:01', async () => {
    let clock = new Date('2030-01-01T09:00:00Z');
    const { app, bearer } = makeApi({ now: () => clock });
    const auth = await bearer('an');
    expect((await request(app).get('/api/bookings/1').set('Authorization', auth)).status).toBe(404); // valid token, no booking
    clock = new Date('2030-01-01T10:01:00Z');
    expect((await request(app).get('/api/bookings/1').set('Authorization', auth)).status).toBe(401);
  });
});

describe('authorisation: are you allowed? → 403 / 404', () => {
  it('a student on the admin list → 403; an admin → 200', async () => {
    const { app, bearer } = makeApi();
    expect((await request(app).get('/api/admin/bookings').set('Authorization', await bearer('an'))).status).toBe(403);
    expect((await request(app).get('/api/admin/bookings').set('Authorization', await bearer('boss', 'ADMIN'))).status).toBe(200);
  });

  it("student B cannot read student A's booking — it looks missing (404)", async () => {
    const { app, bearer } = makeApi();
    await request(app).post('/api/bookings').set('Authorization', await bearer('an')).send(body());
    expect((await request(app).get('/api/bookings/1').set('Authorization', await bearer('an'))).status).toBe(200);
    expect((await request(app).get('/api/bookings/1').set('Authorization', await bearer('binh'))).status).toBe(404);
    expect((await request(app).get('/api/bookings/1').set('Authorization', await bearer('boss', 'ADMIN'))).status).toBe(200);
  });

  it('a student cannot make themselves ADMIN through the body', async () => {
    const { app, bearer } = makeApi();
    const res = await request(app).post('/api/bookings').set('Authorization', await bearer('an')).send(body({ role: 'ADMIN', seats: 60 }));
    expect(res.status).toBe(400);
    expect(res.body.error.details).toContainEqual({ path: '', message: 'Unrecognized key: "role"' });
  });
});
