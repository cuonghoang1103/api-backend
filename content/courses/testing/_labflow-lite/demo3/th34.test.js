import { describe, it, expect } from 'vitest';
import { buildMail, APPROVER } from '../src/notify/notify.js';
import { createReminder } from './reminder-di.js';
import { createFakeMailer } from '../test/support/fakes.js';

const base = { lab: 'BE-201', date: '2026-11-16', start: '08:00' };

describe('practice 3.4', () => {
  it.each([
    [{ ...base, status: 'CONFIRMED', seats: 20 }, 'an@fpt.edu.vn', 'Booking confirmed: BE-201 on 2026-11-16 at 08:00'],
    [{ ...base, status: 'PENDING', seats: 31 }, APPROVER, 'Approval needed: 31 seats, BE-201 on 2026-11-16 at 08:00'],
    [{ ...base, status: 'PENDING', seats: 60, start: '13:30' }, APPROVER, 'Approval needed: 60 seats, BE-201 on 2026-11-16 at 13:30'],
  ])('buildMail(%o) → %s', (booking, to, subject) => {
    expect(buildMail(booking, 'an@fpt.edu.vn')).toEqual({ to, subject });
  });

  it('the injected reminder needs no vi.mock', async () => {
    const mailer = createFakeMailer();
    await createReminder({ mailer })({ email: 'an@fpt.edu.vn', lab: 'BE-201', start: '08:00' });
    expect(mailer.outbox).toEqual([{ to: 'an@fpt.edu.vn', subject: 'Reminder: BE-201 at 08:00 tomorrow' }]);
  });
});
