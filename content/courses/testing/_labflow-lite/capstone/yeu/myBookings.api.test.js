import { describe, it, expect } from 'vitest';
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
});
