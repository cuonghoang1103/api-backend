import { it, expect, vi, beforeEach, afterEach } from 'vitest';
import { bookHard } from './kho/book-hard.js';
import { pool } from './kho/db.js';
import { sendMail } from './kho/smtp.js';

vi.mock('./kho/db.js', () => ({ pool: { query: vi.fn() } }));
vi.mock('./kho/smtp.js', () => ({ sendMail: vi.fn() }));
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-11-02T09:00:00+07:00'));
});
afterEach(() => vi.useRealTimers());

it('books BE-201 (two module mocks, a frozen clock, queries in order)', async () => {
  vi.mocked(pool.query)
    .mockResolvedValueOnce({ rows: [] })            // 1st call must be the overlap SELECT
    .mockResolvedValueOnce({ rows: [{ id: 7 }] });  // 2nd call must be the INSERT
  const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00', email: 'an@fpt.edu.vn' };
  await expect(bookHard(input)).resolves.toEqual({ id: 7, status: 'CONFIRMED' });
  expect(sendMail).toHaveBeenCalledWith('an@fpt.edu.vn', 'Booking confirmed');
});
