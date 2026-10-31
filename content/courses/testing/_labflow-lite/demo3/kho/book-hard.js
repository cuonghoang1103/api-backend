// The same feature written "quickly": it reaches for the database, the mailer and the clock by itself.
import { pool } from './db.js';
import { sendMail } from './smtp.js';
import { checkSlot, needsApproval } from '../../src/rules/booking.js';

export async function bookHard(input) {
  const today = new Date().toISOString().slice(0, 10);
  if (input.date < today) throw new Error('PAST_DATE');
  const slot = checkSlot(input.start, input.end);
  if (!slot.ok) throw new Error(slot.code);
  const clash = await pool.query(
    'SELECT id FROM bookings WHERE lab = $1 AND date = $2 AND start_time < $4 AND $3 < end_time',
    [input.lab, input.date, input.start, input.end]);
  if (clash.rows.length > 0) throw new Error('OVERLAP');
  const status = needsApproval(input) ? 'PENDING' : 'CONFIRMED';
  const { rows } = await pool.query(
    'INSERT INTO bookings (lab, date, start_time, end_time, seats, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
    [input.lab, input.date, input.start, input.end, input.seats, status]);
  await sendMail(input.email, 'Booking ' + status.toLowerCase());
  return { id: rows[0].id, status };
}
