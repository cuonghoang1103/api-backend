import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { makeApi } from '../test/support/api.js';

describe('practice 5.2', () => {
  it('a lecturer on the admin list → 403', async () => {
    const { app, bearer } = makeApi();
    const res = await request(app).get('/api/admin/bookings').set('Authorization', await bearer('thay', 'LECTURER'));
    expect(res.status).toBe(403);
  });

  it.each([
    ['09:59:59', 404],   // still valid: no booking 1, so 404
    ['10:00:00', 401],   // exp reached: refused
  ])('a token issued at 09:00 for 1 hour, used at %s → %i', async (time, expected) => {
    let clock = new Date('2030-01-01T09:00:00Z');
    const { app, bearer } = makeApi({ now: () => clock });
    const auth = await bearer('an');
    clock = new Date('2030-01-01T' + time + 'Z');
    expect((await request(app).get('/api/bookings/1').set('Authorization', auth)).status).toBe(expected);
  });
});
