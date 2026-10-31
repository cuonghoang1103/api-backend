// No cleanup between tests: the second test inherits the first test's row.
import { it, expect, beforeAll, afterAll } from 'vitest';
import { bookLab } from '../src/booking/service.js';
import { createPgRepo } from '../src/booking/pgRepo.js';
import { openPool } from '../test/support/db.js';

let pool;
beforeAll(() => { pool = openPool(); });
afterAll(() => pool.end());
const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it('A: a student books BE-201 at 08:00', async () => {
  await expect(bookLab(createPgRepo(pool), input)).resolves.toMatchObject({ status: 'CONFIRMED' });
});

it('B: a lecturer books BE-201 at 08:00 for 40 seats', async () => {
  await expect(bookLab(createPgRepo(pool), { ...input, role: 'LECTURER', seats: 40 })).resolves.toMatchObject({ status: 'CONFIRMED' });
});
