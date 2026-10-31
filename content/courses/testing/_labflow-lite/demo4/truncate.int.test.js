// Isolation 1: empty the table before every test.
import { it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { bookLab } from '../src/booking/service.js';
import { createPgRepo } from '../src/booking/pgRepo.js';
import { openPool } from '../test/support/db.js';

let pool;
beforeAll(() => { pool = openPool(); });
beforeEach(() => pool.query('TRUNCATE bookings RESTART IDENTITY'));
afterAll(() => pool.end());
const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it.each(Array.from({ length: 20 }, (_, i) => i + 1))('booking %i of the same slot starts from an empty table', async () => {
  await expect(bookLab(createPgRepo(pool), input)).resolves.toMatchObject({ id: 1, status: 'CONFIRMED' });
});
