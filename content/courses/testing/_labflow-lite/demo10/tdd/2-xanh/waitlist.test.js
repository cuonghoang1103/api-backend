import { describe, it, expect } from 'vitest';
import { joinWaitlist } from './waitlist.js';

describe('joinWaitlist', () => {
  it('puts the first student at position 1', () => {
    expect(joinWaitlist([], { userId: 'an', holderId: 'binh' })).toEqual({
      ok: true, position: 1, queue: [{ userId: 'an' }],
    });
  });

  it('puts the next student behind the ones already waiting', () => {
    expect(joinWaitlist([{ userId: 'an' }], { userId: 'chi', holderId: 'binh' })).toEqual({
      ok: true, position: 2, queue: [{ userId: 'an' }, { userId: 'chi' }],
    });
  });
});
