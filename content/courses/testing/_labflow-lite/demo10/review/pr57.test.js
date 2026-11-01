// Pull request #57 "Add tests for the waitlist", AS SUBMITTED — lesson 10.3 reviews it. Every test here has a smell.
import { describe, it, expect, vi } from 'vitest';
import { bookLab, createMemoryRepo } from '../../src/booking/service.js';
import { cancelBooking } from '../../src/booking/waitlistService.js';
import { joinWaitlist } from '../../src/rules/waitlist.js';
import { createFakeMailer } from '../../test/support/fakes.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };
const KEY = 'BE-201 2026-11-16 08:00-10:00';

describe('waitlist', () => {
  it('should send mail', async () => {
    const mailer = { send: vi.fn().mockResolvedValue('msg-1') };
    await mailer.send({ to: 'an@labflow.example', subject: 'A seat is free' });
    expect(mailer.send).toHaveBeenCalled();
  });

  it('should work', async () => {
    const repo = createMemoryRepo();
    const booking = await bookLab(repo, input);
    const waitlists = new Map([[KEY, [{ userId: 'an@labflow.example' }, { userId: 'chi@labflow.example' }]]]);
    const mailer = createFakeMailer();
    const result = await cancelBooking({ repo, waitlists, mailer }, booking.id);
    expect({ booking, result, waitlists: [...waitlists], outbox: mailer.outbox }).toMatchSnapshot();
  });

  it('should return correct value', { retry: 3 }, () => {
    const student = () => 'student' + Math.floor(Math.random() * 10) + '@labflow.example';
    let queue = [];
    for (let i = 0; i < 3; i++) queue = joinWaitlist(queue, { userId: student(), holderId: 'binh@labflow.example' }).queue;
    expect(queue.length).toBe(3);
  });

  it('should handle edge case', async () => {
    const repo = createMemoryRepo();
    const booking = await bookLab(repo, input);
    const waitlists = new Map();
    const set = vi.spyOn(waitlists, 'set');
    const mailer = createFakeMailer();
    await cancelBooking({ repo, waitlists, mailer }, booking.id);
    expect(set).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledWith(KEY, []);
    expect(mailer.outbox.length).toBe(0);
  });
});
