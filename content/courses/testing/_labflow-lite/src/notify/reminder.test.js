// Promoted from lesson 3.2 (demo3/vi-mock.test.js) in lesson 8.1.
import { it, expect, vi } from 'vitest';
import { sendReminder } from './reminder.js';

const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock('../lib/mailer.js', () => ({
  createHttpMailer: () => ({ send }),
}));

it('sends "Reminder: <lab> at <start> tomorrow" to the student', async () => {
  send.mockResolvedValue('msg-7');
  expect(await sendReminder({ email: 'an@fpt.edu.vn', lab: 'BE-201', start: '08:00' })).toBe('msg-7');
  expect(send).toHaveBeenCalledWith({ to: 'an@fpt.edu.vn', subject: 'Reminder: BE-201 at 08:00 tomorrow' });
});
