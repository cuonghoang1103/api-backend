// Lab 10 — FIRST ATTEMPT (weak) at characterization: real clock, "greater than" instead of the real numbers.
import { it, expect } from 'vitest';
import { clubFee } from '../../src/legacy/clubFee.js';

it('calculates a fee', () => {
  expect(clubFee({ member: true }, 'BE-201', '2026-11-20', '08:00', '10:00', 30)).toBeGreaterThan(0);
});

it('a big event costs more', () => {
  const big = clubFee({ member: false }, 'BE-201', '2026-11-20', '08:00', '10:00', 60);
  const small = clubFee({ member: false }, 'BE-201', '2026-11-20', '08:00', '10:00', 20);
  expect(big).toBeGreaterThan(small);
});
