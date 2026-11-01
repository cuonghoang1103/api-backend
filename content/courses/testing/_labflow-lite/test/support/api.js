// One fresh app per test: its own in-memory repository, its own auth with a test secret, an optional fixed clock.
import { createApp } from '../../src/api/server.js';
import { createAuth } from '../../src/api/auth.js';
import { createMemoryRepo } from '../../src/booking/service.js';

export const SECRET = 'test-secret-not-for-production';

export function makeApi({ now } = {}) {
  const repo = createMemoryRepo();
  const auth = createAuth({ secret: SECRET, now });
  const app = createApp({ repo, auth, now });   // the same clock for tokens and for cancelling (Chapter 11)
  const bearer = async (id, role = 'STUDENT') => 'Bearer ' + (await auth.sign({ id, role }));
  return { app, repo, auth, bearer };
}

export const body = (overrides = {}) => ({ lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00', seats: 20, ...overrides });
