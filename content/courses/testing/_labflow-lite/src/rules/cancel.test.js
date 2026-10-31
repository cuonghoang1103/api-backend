import { describe, it, expect } from 'vitest';
import { canCancel } from './cancel.js';

const at = (clock) => new Date('2026-11-16T' + clock + ':00+07:00');

describe('canCancel (Lite-3: until 60 minutes before the start)', () => {
  it.each([
    ['07:00', true],  // 2 hours before
    ['08:00', true],  // exactly 60 minutes before — still allowed
    ['08:01', false], // 59 minutes before
    ['09:30', false], // after the start
  ])('at %s, a 09:00 booking can be cancelled → %s', (clock, expected) => {
    expect(canCancel(at('09:00'), at(clock))).toBe(expected);
  });
});
