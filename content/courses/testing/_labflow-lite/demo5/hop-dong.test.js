import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { makeApi, body } from '../test/support/api.js';
import { contractErrors } from '../test/support/contract.js';

describe('every real response matches openapi.json', () => {
  it('POST /api/bookings: 201, 400, 401, 409, 422', async () => {
    const { app, bearer } = makeApi();
    const auth = await bearer('an');
    const post = (payload, header = auth) => request(app).post('/api/bookings').set('Authorization', header).send(payload);
    const responses = [
      await post(body()),                       // 201
      await post(body({ seats: 0 })),           // 400
      await post(body(), 'Bearer nope'),        // 401
      await post(body()),                       // 409
      await post(body({ start: '06:00' })),     // 422
    ];
    expect(responses.map((r) => r.status)).toEqual([201, 400, 401, 409, 422]);
    for (const res of responses) expect(contractErrors('post', '/api/bookings', res)).toEqual([]);
  });

  it('GET /api/bookings/{id} and GET /api/admin/bookings', async () => {
    const { app, bearer } = makeApi();
    await request(app).post('/api/bookings').set('Authorization', await bearer('an')).send(body());
    const one = await request(app).get('/api/bookings/1').set('Authorization', await bearer('an'));
    const notMine = await request(app).get('/api/bookings/1').set('Authorization', await bearer('binh'));
    const list = await request(app).get('/api/admin/bookings').set('Authorization', await bearer('boss', 'ADMIN'));
    const denied = await request(app).get('/api/admin/bookings').set('Authorization', await bearer('an'));
    expect(contractErrors('get', '/api/bookings/{id}', one)).toEqual([]);
    expect(contractErrors('get', '/api/bookings/{id}', notMine)).toEqual([]);
    expect(contractErrors('get', '/api/admin/bookings', list)).toEqual([]);
    expect(contractErrors('get', '/api/admin/bookings', denied)).toEqual([]);
  });
});
