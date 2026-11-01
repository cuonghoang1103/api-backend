// The PostgreSQL adapter for the repository port (Chapter 4; Chapter 11 adds findById, listByUser, cancel). Same methods as createMemoryRepo.
import { BookingError } from './service.js';

// Chapter 11: read rows back in the API's own shape. node-postgres turns a "date" column into a JS Date at LOCAL midnight
// and a "time" column into "08:00:00" — so format them in SQL, where the value is still exactly what was stored.
const COLUMNS = "id, lab, to_char(date, 'YYYY-MM-DD') AS date, to_char(start_time, 'HH24:MI') AS start, " +
  "to_char(end_time, 'HH24:MI') AS \"end\", seats, role, status, minutes, email, user_id AS \"userId\"";

export function createPgRepo(db) {   // db: a pg Pool or a single Client — anything with .query()
  return {
    async findOverlap(lab, date, start, end) {
      const { rows } = await db.query(
        'SELECT id FROM bookings WHERE lab = $1 AND date = $2 AND start_time < $4 AND $3 < end_time' +
        " AND status <> 'CANCELLED' LIMIT 1",   // a cancelled booking frees its slot (Chapter 11)
        [lab, date, start, end]);
      return rows[0] ?? null;
    },
    async insert(b) {
      try {
        const { rows } = await db.query(
          'INSERT INTO bookings (lab, date, start_time, end_time, seats, role, status, minutes, email, user_id) ' +
          'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
          [b.lab, b.date, b.start, b.end, b.seats, b.role, b.status, b.minutes, b.email ?? null, b.userId ?? null]);
        return { id: rows[0].id, ...b };
      } catch (err) {
        if (err.code === '23P01') throw new BookingError('OVERLAP', { cause: err }); // exclusion_violation
        throw err;
      }
    },
    async findById(id) {
      const { rows } = await db.query('SELECT ' + COLUMNS + ' FROM bookings WHERE id = $1', [id]);
      return rows[0] ?? null;
    },
    async listByUser(userId) {
      const { rows } = await db.query('SELECT ' + COLUMNS + ' FROM bookings WHERE user_id = $1 ORDER BY date, start_time', [userId]);
      return rows;
    },
    async list() {
      const { rows } = await db.query('SELECT ' + COLUMNS + ' FROM bookings ORDER BY date, start_time, id');
      return rows;
    },
    async cancel(id) {   // "AND status <> 'CANCELLED'" makes check-and-change ONE statement: two cancels at once, one wins
      const { rows } = await db.query(
        "UPDATE bookings SET status = 'CANCELLED' WHERE id = $1 AND status <> 'CANCELLED' RETURNING " + COLUMNS, [id]);
      return rows[0] ?? null;
    },
  };
}
