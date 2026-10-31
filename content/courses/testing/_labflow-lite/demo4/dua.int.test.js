import { it, expect, beforeAll, afterAll } from 'vitest';
import { bookLab } from '../src/booking/service.js';
import { createPgRepo } from '../src/booking/pgRepo.js';
import { openPool } from '../test/support/db.js';

let pool;
beforeAll(async () => {
  pool = openPool();
  // open two connections now, so both bookings below really start at the same moment
  await Promise.all([pool.query('SELECT 1'), pool.query('SELECT 1')]);
  await pool.query('TRUNCATE bookings RESTART IDENTITY');
});
afterAll(() => pool.end());

it('two students book the same slot at the same moment: only one wins (real PostgreSQL)', async () => {
  const repo = createPgRepo(pool);
  const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };
  const results = await Promise.allSettled([bookLab(repo, input), bookLab(repo, input)]);
  expect(results.map((r) => r.status).sort()).toEqual(['fulfilled', 'rejected']);
  expect(results.find((r) => r.status === 'rejected').reason.code).toBe('OVERLAP');
});
