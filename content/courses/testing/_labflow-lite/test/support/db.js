// Helpers for integration tests.
import { inject } from 'vitest';
import pg from 'pg';

export function openPool() {
  return new pg.Pool({ connectionString: inject('databaseUrl'), max: 5 });
}

let n = 0;
// A valid booking with sensible defaults; each call gets its own lab so tests do not collide by accident.
export function makeBooking(overrides = {}) {
  n += 1;
  return { lab: 'LAB-' + n, date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00', ...overrides };
}
