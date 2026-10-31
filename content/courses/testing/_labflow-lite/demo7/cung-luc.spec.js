import { test, expect } from '@playwright/test';
import { PASSWORD } from '../e2e/helpers.js';

// RED ON PURPOSE: the e2e server keeps bookings in memory, and that repository still has the
// check-then-insert race of Chapter 2. Two students send the same slot at the same moment.
test('RED ON PURPOSE — two students, one slot, the same moment', async ({ request }) => {
  const tokenOf = async (username) => (await (await request.post('/api/login', { data: { username, password: PASSWORD } })).json()).token;
  const [an, binh] = [await tokenOf('an'), await tokenOf('binh')];
  const slot = { lab: 'RC-701', date: '2026-11-18', start: '08:00', end: '10:00', seats: 20 };
  const send = (token) => request.post('/api/bookings', { headers: { Authorization: 'Bearer ' + token }, data: slot });
  const answers = await Promise.all([send(an), send(binh)]);
  expect(answers.map((r) => r.status()).sort()).toEqual([201, 409]);
});
