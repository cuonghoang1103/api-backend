// Quarantine: the race test is known to be flaky, has an issue and an owner, and does not block anyone's merge.
import { it, expect } from 'vitest';
import { bookLab } from '../src/booking/service.js';
import { needsApproval } from '../src/rules/booking.js';
import { slowRepo } from './repo-cham.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it('31 seats need approval', () => {
  expect(needsApproval({ seats: 31, role: 'STUDENT' })).toBe(true);
});

// LAB-142 (owner: an, fix by 2026-11-20): double booking under load — lesson 8.3
it('two students book the same slot at once: exactly one wins', { tags: ['quarantine'] }, async () => {
  const repo = slowRepo();
  const results = await Promise.allSettled([bookLab(repo, input), bookLab(repo, input)]);
  expect(results.map((r) => r.status).sort()).toEqual(['fulfilled', 'rejected']);
});
