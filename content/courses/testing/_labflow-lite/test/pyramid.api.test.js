import { it, expect } from 'vitest';
import request from 'supertest';
import { buildApp } from '../src/app.js';

it('api: POST /bookings at 06:30 answers 400 OUTSIDE_HOURS', async () => {
  const res = await request(buildApp())
    .post('/bookings')
    .send({ lab: 'BE-201', seats: 20, role: 'STUDENT', start: '06:30', end: '08:00' });
  expect(res.status).toBe(400);
  expect(res.body).toEqual({ error: 'OUTSIDE_HOURS' });
});
