// Classicist style (lesson 10.1): real repo and real waitlist Map; only the e-mail provider is replaced, by a fake.
import { describe, it, expect } from 'vitest';
import { bookLab, createMemoryRepo } from './service.js';
import { cancelBooking } from './waitlistService.js';
import { createFakeMailer } from '../../test/support/fakes.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };
const KEY = 'BE-201 2026-11-16 08:00-10:00';
const now = () => new Date('2026-11-16T07:00:00+07:00');

async function setup(queue = []) {
  const deps = { repo: createMemoryRepo(), waitlists: new Map([[KEY, queue]]), mailer: createFakeMailer(), now };
  const booking = await bookLab(deps.repo, input);
  return { deps, booking };
}

describe('cancelBooking', () => {
  it('deletes the booking and offers the slot to the first student waiting', async () => {
    const { deps, booking } = await setup([{ userId: 'an@labflow.example' }, { userId: 'chi@labflow.example' }]);

    const result = await cancelBooking(deps, booking.id);

    expect(result).toEqual({ cancelled: booking.id, offeredTo: 'an@labflow.example' });
    expect(await deps.repo.findById(booking.id)).toBeNull();
    expect(deps.waitlists.get(KEY)).toEqual([{ userId: 'chi@labflow.example' }]);
    expect(deps.mailer.outbox).toEqual([
      { to: 'an@labflow.example', subject: 'A seat is free: ' + KEY + ' (answer within 30 minutes)' },
    ]);
  });

  it('sends no e-mail when nobody is waiting', async () => {
    const { deps, booking } = await setup();
    await expect(cancelBooking(deps, booking.id)).resolves.toEqual({ cancelled: booking.id, offeredTo: null });
    expect(deps.mailer.outbox).toEqual([]);
  });

  it('refuses an unknown booking with NOT_FOUND', async () => {
    const { deps } = await setup([{ userId: 'an@labflow.example' }]);
    await expect(cancelBooking(deps, 99)).rejects.toMatchObject({ name: 'BookingError', code: 'NOT_FOUND' });
    expect(deps.mailer.outbox).toEqual([]);
  });
});
