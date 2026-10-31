import { it, expect } from 'vitest';
import { bookLab, createMemoryRepo } from '../src/booking/service.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it.fails('two students book the same slot at the same moment: only one wins', async () => {
  const repo = createMemoryRepo();
  const results = await Promise.allSettled([bookLab(repo, input), bookLab(repo, input)]);
  const statuses = results.map((r) => r.status);
  expect(statuses.sort()).toEqual(['fulfilled', 'rejected']);
});
