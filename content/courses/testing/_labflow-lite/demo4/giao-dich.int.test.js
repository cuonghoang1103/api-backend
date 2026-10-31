// Isolation 2: run each test inside a transaction and roll it back.
import { it, expect, beforeAll, beforeEach, afterEach, afterAll } from 'vitest';
import { bookLab } from '../src/booking/service.js';
import { createPgRepo } from '../src/booking/pgRepo.js';
import { openPool } from '../test/support/db.js';

let pool;
let client;
beforeAll(async () => {
  pool = openPool();
  await pool.query('TRUNCATE bookings RESTART IDENTITY'); // rows committed by other files are NOT undone by our rollbacks
});
beforeEach(async () => {
  client = await pool.connect();          // one connection for the whole test…
  await client.query('BEGIN');
});
afterEach(async () => {
  await client.query('ROLLBACK');         // …and nothing it wrote survives
  client.release();
});
afterAll(() => pool.end());
const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it.each(Array.from({ length: 20 }, (_, i) => i + 1))('booking %i of the same slot sees no earlier rows', async () => {
  await expect(bookLab(createPgRepo(client), input)).resolves.toMatchObject({ status: 'CONFIRMED' });
});
