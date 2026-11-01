import { describe, it, expect } from 'vitest';
import { joinWaitlist, offerNext } from './waitlist.js';

const join = (queue, userId) => joinWaitlist(queue, { userId, holderId: 'binh' });
const line = (...ids) => ids.map((userId) => ({ userId }));

describe('joinWaitlist', () => {
  it('puts the first student at position 1', () => {
    expect(join([], 'an')).toEqual({ ok: true, position: 1, queue: line('an') });
  });

  it('puts the next student behind the ones already waiting', () => {
    expect(join(line('an'), 'chi')).toEqual({ ok: true, position: 2, queue: line('an', 'chi') });
  });
  it('refuses a student who is already waiting', () => {
    expect(join(line('an', 'chi'), 'an')).toEqual({ ok: false, code: 'ALREADY_WAITING' });
  });

  it('refuses a fourth student: at most 3 wait for one slot', () => {
    expect(join(line('an', 'chi', 'dung'), 'em')).toEqual({ ok: false, code: 'WAITLIST_FULL' });
  });

  it('refuses the student who already holds the slot', () => {
    expect(joinWaitlist([], { userId: 'binh', holderId: 'binh' })).toEqual({ ok: false, code: 'IS_HOLDER' });
  });
});

describe('offerNext', () => {
  const freedAt = new Date('2026-11-16T10:00:00+07:00');

  it('offers the slot to the first student in line for 30 minutes', () => {
    expect(offerNext(line('an', 'chi'), freedAt)).toEqual({
      offer: { userId: 'an', expiresAt: new Date('2026-11-16T10:30:00+07:00') },
      queue: line('chi'),
    });
  });

  it('offers nothing when nobody is waiting', () => {
    expect(offerNext([], freedAt)).toEqual({ offer: null, queue: [] });
  });
});
