import { describe, it, expect } from 'vitest';
import { joinWaitlist } from './waitlist.js';

describe('joinWaitlist', () => {
  it('puts the first student at position 1', () => {
    expect(joinWaitlist([], { userId: 'an', holderId: 'binh' })).toEqual({
      ok: true, position: 1, queue: [{ userId: 'an' }],
    });
  });
});
