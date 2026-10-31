import { it, expect } from 'vitest';
import { bookHard } from './kho/book-hard.js';

it('books BE-201 (no doubles at all)', async () => {
  const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00', email: 'an@fpt.edu.vn' };
  await expect(bookHard(input)).resolves.toMatchObject({ status: 'CONFIRMED' });
});
