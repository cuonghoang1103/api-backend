import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { makeApi, body } from '../test/support/api.js';

const post = async (payload) => {
  const { app, bearer } = makeApi();
  return request(app).post('/api/bookings').set('Authorization', await bearer('an')).send(payload);
};

describe('practice 5.3', () => {
  it('201 seats → 400 on seats; 200 seats is accepted', async () => {
    expect((await post(body({ seats: 201 }))).body.error.details[0].path).toBe('seats');
    expect((await post(body({ seats: 200 }))).status).toBe(201);
  });

  it('a client cannot choose the status: unknown key → 400', async () => {
    const res = await post(body({ status: 'CONFIRMED', seats: 31 }));
    expect(res.status).toBe(400);
    expect(res.body.error.details).toContainEqual({ path: '', message: 'Unrecognized key: "status"' });
  });
});
