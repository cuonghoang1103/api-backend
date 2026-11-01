// FAST: each test needs only the bookings it talks about, created through the real code.
import { it, expect, beforeEach } from 'vitest';
import { bookLab, createMemoryRepo } from '../../src/booking/service.js';

const at = (start, end, extra = {}) => ({ lab: 'BE-201', date: '2026-11-03', seats: 5, role: 'STUDENT', start, end, ...extra });
let repo;
beforeEach(async () => {
  repo = createMemoryRepo();
  await bookLab(repo, at('09:00', '10:00'));          // the one booking these tests are about
});

it('a taken slot refuses one more booking', async () => {
  await expect(bookLab(repo, at('09:00', '10:00'))).rejects.toMatchObject({ code: 'OVERLAP' });
});
it('another lab is still free', async () => {
  await expect(bookLab(repo, at('09:00', '10:00', { lab: 'BE-305' }))).resolves.toMatchObject({ id: 2 });
});
it('the next hour is still free', async () => {
  await expect(bookLab(repo, at('10:00', '11:00'))).resolves.toMatchObject({ status: 'CONFIRMED' });
});
it('list returns what was stored', async () => {
  await bookLab(repo, at('10:00', '11:00'));
  expect(await repo.list()).toHaveLength(2);
});
