// Booking rules asked through the API (practices of lessons 11.1 and 11.4): rules tested only at the Unit layer get an API test too.
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { makeApi, body } from '../../test/support/api.js';

describe('approval through the API', () => {
  it.each([
    { role: 'LECTURER', status: 'CONFIRMED', rule: 'Lite-2' },
    { role: 'ADMIN', status: 'CONFIRMED', rule: 'Lite-2' },
    { role: 'STUDENT', status: 'PENDING', rule: 'BR-06' },
  ])('$role books 40 seats → $status ($rule)', async ({ role, status }) => {
    const api = makeApi();
    const res = await request(api.app).post('/api/bookings').set('Authorization', await api.bearer('x', role)).send(body({ seats: 40 }));
    expect([res.status, res.body.status]).toEqual([201, status]);
  });
});

describe('opening hours and length through the API', () => {
  it('08:00–12:30 is too long: 422 TOO_LONG (Lite-1)', async () => {
    const api = makeApi();
    const res = await request(api.app).post('/api/bookings').set('Authorization', await api.bearer('an')).send(body({ start: '08:00', end: '12:30' }));
    expect([res.status, res.body.error.code]).toEqual([422, 'TOO_LONG']);
  });
});
