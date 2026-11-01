// Pull request #57 AFTER review (lesson 10.3): every test names a behaviour, controls its data and checks only what a
// user of the code can see.
import { describe, it, expect } from 'vitest';
import { bookLab, createMemoryRepo } from '../../src/booking/service.js';
import { cancelBooking } from '../../src/booking/waitlistService.js';
import { joinWaitlist } from '../../src/rules/waitlist.js';
import { createFakeMailer } from '../../test/support/fakes.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };
const KEY = 'BE-201 2026-11-16 08:00-10:00';
const now = () => new Date('2026-11-16T07:00:00+07:00');
const line = (...names) => names.map((n) => ({ userId: n + '@labflow.example' }));

async function cancelWith(waitlists) {
  const repo = createMemoryRepo();
  const mailer = createFakeMailer();
  const booking = await bookLab(repo, input);
  const result = await cancelBooking({ repo, waitlists, mailer, now }, booking.id);
  return { result, outbox: mailer.outbox, booking };
}

describe('cancelBooking and the waitlist', () => {
  it('offers the freed slot by e-mail to the student who has waited longest', async () => {
    const waitlists = new Map([[KEY, line('an', 'chi')]]);
    const { result, outbox, booking } = await cancelWith(waitlists);

    expect(result).toEqual({ cancelled: booking.id, offeredTo: 'an@labflow.example' });
    expect(outbox).toEqual([{ to: 'an@labflow.example', subject: 'A seat is free: ' + KEY + ' (answer within 30 minutes)' }]);
    expect(waitlists.get(KEY)).toEqual(line('chi'));
  });

  it('sends no e-mail and leaves nobody waiting when the line was empty', async () => {
    const waitlists = new Map();
    const { result, outbox } = await cancelWith(waitlists);

    expect(result.offeredTo).toBeNull();
    expect(outbox).toEqual([]);
    expect(waitlists.get(KEY) ?? []).toEqual([]);
  });
});

describe('joinWaitlist', () => {
  it('lets three different students wait and refuses a fourth with WAITLIST_FULL', () => {
    let queue = [];
    for (const name of ['an', 'chi', 'dung']) queue = joinWaitlist(queue, { userId: name + '@labflow.example', holderId: 'binh@labflow.example' }).queue;
    expect(queue).toEqual(line('an', 'chi', 'dung'));
    expect(joinWaitlist(queue, { userId: 'em@labflow.example', holderId: 'binh@labflow.example' })).toEqual({ ok: false, code: 'WAITLIST_FULL' });
  });
});
