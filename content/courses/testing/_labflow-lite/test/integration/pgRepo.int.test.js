import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { bookLab } from '../../src/booking/service.js';
import { createPgRepo } from '../../src/booking/pgRepo.js';
import { openPool, makeBooking } from '../support/db.js';

let pool;
let repo;
beforeAll(() => { pool = openPool(); repo = createPgRepo(pool); });
beforeEach(() => pool.query('TRUNCATE bookings RESTART IDENTITY'));
afterAll(() => pool.end());
const row = (b) => ({ ...b, status: 'CONFIRMED', minutes: 120 });

describe('findOverlap — the SQL', () => {
  it.each([
    ['09:00', '11:00', 'BE-201', '2026-11-16', true],   // overlaps 08:00–10:00
    ['07:00', '08:30', 'BE-201', '2026-11-16', true],   // overlaps the start
    ['10:00', '12:00', 'BE-201', '2026-11-16', false],  // starts when the other ends
    ['07:00', '08:00', 'BE-201', '2026-11-16', false],  // ends when the other starts
    ['08:00', '10:00', 'BE-305', '2026-11-16', false],  // another lab
    ['08:00', '10:00', 'BE-201', '2026-11-17', false],  // another day
  ])('%s–%s in %s on %s overlaps 08:00–10:00 BE-201: %s', async (start, end, lab, date, expected) => {
    await repo.insert(row({ lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00', seats: 20, role: 'STUDENT' }));
    const found = await repo.findOverlap(lab, date, start, end);
    expect(found !== null).toBe(expected);
  });
});

describe('the database constraints', () => {
  it('accepts a back-to-back booking (the end minute is free)', async () => {
    const first = makeBooking({ lab: 'BE-201' });
    await repo.insert(row(first));
    await expect(repo.insert(row({ ...first, start: '10:00', end: '12:00' }))).resolves.toMatchObject({ id: 2 });
  });

  it('refuses an overlapping row even when findOverlap is skipped: OVERLAP caused by 23P01', async () => {
    const first = makeBooking({ lab: 'BE-201' });
    await repo.insert(row(first));
    await expect(repo.insert(row({ ...first, start: '09:00', end: '11:00' })))
      .rejects.toMatchObject({ code: 'OVERLAP', cause: { code: '23P01' } });
  });

  it('refuses 0 seats: 23514 check_violation', async () => {
    await expect(repo.insert(row(makeBooking({ seats: 0 })))).rejects.toMatchObject({ code: '23514' });
  });
});

describe('bookLab with PostgreSQL', () => {
  it('a clash found only by the database is still OVERLAP, not STORAGE_DOWN', async () => {
    const first = makeBooking({ lab: 'BE-201' });
    await bookLab(repo, first);
    const blindRepo = { ...repo, findOverlap: async () => null };   // pretend the check missed it
    await expect(bookLab(blindRepo, { ...first, start: '09:00', end: '11:00' })).rejects.toMatchObject({ code: 'OVERLAP' });
  });

  it('two students, one slot, same moment: one booking, one OVERLAP', async () => {
    const input = makeBooking({ lab: 'BE-201' });
    const results = await Promise.allSettled([bookLab(repo, input), bookLab(repo, input)]);
    expect(results.map((r) => r.status).sort()).toEqual(['fulfilled', 'rejected']);
    const { rows } = await pool.query('SELECT count(*)::int AS n FROM bookings');
    expect(rows[0].n).toBe(1);
  });
});
