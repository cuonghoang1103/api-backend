// "Faster": seed the 100 bookings ONCE for the whole file (beforeAll) — and see lesson 8.3 come back.
import { it, expect, beforeAll } from 'vitest';
import { bookLab, createMemoryRepo } from '../src/booking/service.js';
import { formatTime } from '../src/rules/time.js';

let repo;
beforeAll(async () => {
  repo = createMemoryRepo();
  for (let day = 1; day <= 10; day++) {
    for (let h = 8; h < 18; h++) {
      const date = '2026-11-' + String(day).padStart(2, '0');
      await bookLab(repo, { lab: 'BE-201', date, seats: 20, role: 'STUDENT', start: formatTime(h * 60), end: formatTime(h * 60 + 60) });
    }
  }
});

it('a full day refuses one more booking', async () => {
  await expect(bookLab(repo, { lab: 'BE-201', date: '2026-11-03', seats: 5, role: 'STUDENT', start: '09:00', end: '10:00' }))
    .rejects.toMatchObject({ code: 'OVERLAP' });
});
it('another lab is still free', async () => {
  await expect(bookLab(repo, { lab: 'BE-305', date: '2026-11-03', seats: 5, role: 'STUDENT', start: '09:00', end: '10:00' }))
    .resolves.toMatchObject({ id: 101 });
});
it('the evening is still free', async () => {
  await expect(bookLab(repo, { lab: 'BE-201', date: '2026-11-03', seats: 5, role: 'STUDENT', start: '18:00', end: '19:00' }))
    .resolves.toMatchObject({ status: 'CONFIRMED' });
});
it('the list has 100 bookings', async () => {
  expect(await repo.list()).toHaveLength(100);
});
