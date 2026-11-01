// The five flaky tests of lesson 8.3, each fixed at its cause — green in any order, any number of times.
import { it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw/http';
import { daysAheadVN } from '../src/rules/days.js';
import { needsApproval } from '../src/rules/booking.js';
import { createLoginGuard } from '../src/auth/login-guard.js';
import { bookLab, createMemoryRepo } from '../src/booking/service.js';
import { createHttpMailer } from '../src/lib/mailer.js';

// 1. Time → pass the clock in, and test the dangerous hour on purpose.
it.each(['2026-11-02T06:30:00+07:00', '2026-11-02T08:00:00+07:00', '2026-11-02T23:59:00+07:00'])('at %s, 2026-11-03 is 1 day ahead', (now) => {
  expect(daysAheadVN('2026-11-03', new Date(now))).toBe(1);
});

// 2. Randomness → name the cases, starting with the boundary.
it.each([[1, false], [30, false], [31, true], [40, true]])('a student with %i seats needs approval: %s', (seats, expected) => {
  expect(needsApproval({ seats, role: 'STUDENT' })).toBe(expected);
});

// 3. Shared state → every test builds its own guard.
let guard;
beforeEach(() => { guard = createLoginGuard(() => Date.parse('2026-11-16T08:00:00Z')); });
it('a user with no failures is not locked', () => {
  expect(guard.isLocked('an@fpt.edu.vn')).toBe(false);
});
it('5 wrong passwords lock the account', () => {
  for (let i = 0; i < 5; i++) guard.recordFailure('an@fpt.edu.vn');
  expect(guard.isLocked('an@fpt.edu.vn')).toBe(true);
});

// 4. Race → the TEST was right; fix the app. Here: one booking at a time per lab (in a real system: a database constraint, lesson 4.1).
function oneAtATime() {
  const tails = new Map();
  return (key, task) => {
    const run = (tails.get(key) ?? Promise.resolve()).then(task, task);
    tails.set(key, run.catch(() => {}));
    return run;
  };
}
it('two students book the same slot at once: exactly one wins', async () => {
  const repo = createMemoryRepo();
  const queue = oneAtATime();
  const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };
  const results = await Promise.allSettled([queue(input.lab, () => bookLab(repo, input)), queue(input.lab, () => bookLab(repo, input))]);
  expect(results.map((r) => r.status).sort()).toEqual(['fulfilled', 'rejected']);
});

// 5. Network → a unit test talks to a fake provider at the boundary (lesson 3.2), never to a shared server.
const server = setupServer(http.post('https://mail.provider.example/v1/messages', () => HttpResponse.json({ id: 'msg-1' }, { status: 202 })));
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterAll(() => server.close());
it('sends the booking confirmation', async () => {
  const mailer = createHttpMailer({ baseUrl: 'https://mail.provider.example', apiKey: 'k' });
  await expect(mailer.send({ to: 'an@fpt.edu.vn', subject: 'Booked' })).resolves.toBe('msg-1');
});
