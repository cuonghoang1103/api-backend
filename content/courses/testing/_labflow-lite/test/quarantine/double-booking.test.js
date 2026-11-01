// QUARANTINE (lesson 8.3 → 9.3): a known flaky test. It runs in its own CI job that reports but never blocks a merge.
// LAB-142 (owner: an, fix by 2026-11-20): two students can book the same slot under load — the bug is in the app.
import { it, expect } from 'vitest';
import { bookLab, createMemoryRepo } from '../../src/booking/service.js';

// Every lookup takes 0–40 ms on top of the usual work, like a busy database.
function slowRepo() {
  const repo = createMemoryRepo();
  const jitter = () => new Promise((resolve) => setTimeout(resolve, Math.random() * 40));
  return { ...repo, async findOverlap(...args) { await jitter(); return repo.findOverlap(...args); } };
}
const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it('two students book the same slot at once: exactly one wins', { tags: ['quarantine'] }, async () => {
  const repo = slowRepo();
  const results = await Promise.allSettled([bookLab(repo, input), bookLab(repo, input)]);
  expect(results.map((r) => r.status).sort()).toEqual(['fulfilled', 'rejected']);
});
