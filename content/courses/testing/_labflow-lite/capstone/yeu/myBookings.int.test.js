import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { bookLab } from '../../src/booking/service.js';
import { createPgRepo } from '../../src/booking/pgRepo.js';
import { openPool } from '../support/db.js';

let pool;
let repo;
beforeAll(async () => { pool = openPool(); repo = createPgRepo(pool); await pool.query('TRUNCATE bookings RESTART IDENTITY'); });
afterAll(() => pool.end());

describe('pgRepo', () => {
  it('listByUser works', async () => {
    await bookLab(repo, { lab: 'BE-201', date: '2026-11-16', start: '09:00', end: '11:00', seats: 20, role: 'STUDENT', userId: 'an' });
    const mine = await repo.listByUser('an');
    expect(mine).toHaveLength(1);
    expect(mine[0]).toMatchObject({ lab: 'BE-201' });
  });
});
