// Practice 10.1: leaveWaitlist, test-first. Step 2 — the same tests, now green.
import { describe, it, expect } from 'vitest';
import { leaveWaitlist } from './leave.js';

const line = (...ids) => ids.map((userId) => ({ userId }));

describe('leaveWaitlist', () => {
  it('removes the student and moves everyone behind them up', () => {
    expect(leaveWaitlist(line('an', 'chi', 'dung'), 'chi')).toEqual({ ok: true, queue: line('an', 'dung') });
  });

  it('refuses a student who is not waiting with NOT_WAITING', () => {
    expect(leaveWaitlist(line('an'), 'em')).toEqual({ ok: false, code: 'NOT_WAITING' });
  });

  it('never changes the queue it was given', () => {
    const queue = line('an', 'chi');
    leaveWaitlist(queue, 'an');
    expect(queue).toEqual(line('an', 'chi'));
  });
});
