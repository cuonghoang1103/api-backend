import { it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { bookLab } from '../src/booking/service.js';
import { createPgRepo } from '../src/booking/pgRepo.js';
import { openPool } from '../test/support/db.js';

let pool;
beforeAll(() => { pool = openPool(); });
beforeEach(() => pool.query('TRUNCATE bookings RESTART IDENTITY'));
afterAll(() => pool.end());
const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it('the Chapter 2 race, now without it.fails: one row in the table', async () => {
  const repo = createPgRepo(pool);
  await Promise.allSettled([bookLab(repo, input), bookLab(repo, input)]);
  const { rows } = await pool.query('SELECT count(*)::int AS n FROM bookings');
  expect(rows[0].n).toBe(1);
});

it('PostgreSQL refuses a time that does not exist: 25:00', async () => {
  await expect(createPgRepo(pool).insert({ ...input, end: '25:00', status: 'CONFIRMED', minutes: 120 }))
    .rejects.toMatchObject({ code: '22008' });
});
