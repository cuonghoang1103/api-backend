// The PostgreSQL adapter for the repository port (Chapter 4). Same two methods as createMemoryRepo.
import { BookingError } from './service.js';

export function createPgRepo(db) {   // db: a pg Pool or a single Client — anything with .query()
  return {
    async findOverlap(lab, date, start, end) {
      const { rows } = await db.query(
        'SELECT id FROM bookings WHERE lab = $1 AND date = $2 AND start_time < $4 AND $3 < end_time LIMIT 1',
        [lab, date, start, end]);
      return rows[0] ?? null;
    },
    async insert(b) {
      try {
        const { rows } = await db.query(
          'INSERT INTO bookings (lab, date, start_time, end_time, seats, role, status, minutes, email) ' +
          'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
          [b.lab, b.date, b.start, b.end, b.seats, b.role, b.status, b.minutes, b.email ?? null]);
        return { id: rows[0].id, ...b };
      } catch (err) {
        if (err.code === '23P01') throw new BookingError('OVERLAP', { cause: err }); // exclusion_violation
        throw err;
      }
    },
  };
}
