import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { makeApi, body } from '../test/support/api.js';

describe('practice 5.1', () => {
  it('a 31-seat student booking is 201 PENDING, and GET via Location agrees', async () => {
    const { app, bearer } = makeApi();
    const auth = await bearer('an');
    const created = await request(app).post('/api/bookings').set('Authorization', auth).send(body({ seats: 31 }));
    expect(created.status).toBe(201);
    expect(created.body.status).toBe('PENDING');
    const read = await request(app).get(created.headers.location).set('Authorization', auth);
    expect(read.body).toEqual(created.body);
  });

  it('a second student booking the next slot gets id 2 and Location /api/bookings/2', async () => {
    const { app, bearer } = makeApi();
    await request(app).post('/api/bookings').set('Authorization', await bearer('an')).send(body());
    const res = await request(app).post('/api/bookings').set('Authorization', await bearer('binh')).send(body({ start: '10:00', end: '12:00' }));
    expect(res.status).toBe(201);
    expect(res.headers.location).toBe('/api/bookings/2');
  });
});
