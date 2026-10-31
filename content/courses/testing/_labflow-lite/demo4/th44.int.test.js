import { it, expect, beforeAll, beforeEach, afterEach, afterAll } from 'vitest';
import { bookLab } from '../src/booking/service.js';
import { createPgRepo } from '../src/booking/pgRepo.js';
import { openPool, makeBooking } from '../test/support/db.js';

let pool;
let client;
beforeAll(async () => { pool = openPool(); await pool.query('TRUNCATE bookings RESTART IDENTITY'); });
beforeEach(async () => { client = await pool.connect(); await client.query('BEGIN'); });
afterEach(async () => { await client.query('ROLLBACK'); client.release(); });
afterAll(() => pool.end());

it('a 31-seat student booking is stored as PENDING (checked with SQL)', async () => {
  const booking = await bookLab(createPgRepo(client), makeBooking({ seats: 31 }));
  const { rows } = await client.query('SELECT status, minutes FROM bookings WHERE id = $1', [booking.id]);
  expect(rows).toEqual([{ status: 'PENDING', minutes: 120 }]);
});

it('the next test starts with an empty table — the previous one was rolled back', async () => {
  const { rows } = await client.query('SELECT count(*)::int AS n FROM bookings');
  expect(rows[0].n).toBe(0);
});
