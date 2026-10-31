import { it, expect } from 'vitest';
import request from 'supertest';
import { checkSlot } from '../src/rules/booking.js';
import { buildApp } from '../src/app.js';

it('200 unit checks', () => {
  for (let i = 0; i < 200; i++) expect(checkSlot('06:30', '08:00').code).toBe('OUTSIDE_HOURS');
});

it('200 HTTP requests through Express', async () => {
  const app = buildApp();
  for (let i = 0; i < 200; i++) {
    const res = await request(app).post('/bookings')
      .send({ lab: 'BE-201', seats: 20, role: 'STUDENT', start: '06:30', end: '08:00' });
    expect(res.status).toBe(400);
  }
});
