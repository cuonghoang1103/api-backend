// RED SOMETIMES — and this time the test is right: the app has a race.
import { it, expect } from 'vitest';
import { bookLab } from '../src/booking/service.js';
import { slowRepo } from './repo-cham.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it('two students book the same slot at once: exactly one wins', async () => {
  const repo = slowRepo();
  const results = await Promise.allSettled([bookLab(repo, input), bookLab(repo, input)]);
  expect(results.map((r) => r.status).sort()).toEqual(['fulfilled', 'rejected']);
});
