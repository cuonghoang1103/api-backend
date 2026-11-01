// Mockist style, written against the FIRST version of cancelBooking (findById, then remove). Lesson 10.1.
import { describe, it, expect, vi } from 'vitest';
import { cancelBooking } from '../../src/booking/waitlistService.js';

const booking = { id: 7, lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00' };
const KEY = 'BE-201 2026-11-16 08:00-10:00';

describe('cancelBooking (mockist)', () => {
  it('removes the booking, updates the waitlist and mails the first student', async () => {
    const repo = { findById: vi.fn().mockResolvedValue(booking), remove: vi.fn().mockResolvedValue(undefined) };
    const waitlists = { get: vi.fn().mockReturnValue([{ userId: 'an@labflow.example' }]), set: vi.fn() };
    const mailer = { send: vi.fn().mockResolvedValue('msg-1') };

    await cancelBooking({ repo, waitlists, mailer, now: () => new Date('2026-11-16T07:00:00+07:00') }, 7);

    expect(repo.findById).toHaveBeenCalledWith(7);
    expect(repo.remove).toHaveBeenCalledWith(7);
    expect(waitlists.set).toHaveBeenCalledWith(KEY, []);
    expect(mailer.send).toHaveBeenCalledTimes(1);
  });
});
