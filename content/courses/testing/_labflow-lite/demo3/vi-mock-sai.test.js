import { it, expect, vi } from 'vitest';
import { sendReminder } from '../src/notify/reminder.js';

const send = vi.fn();                    // a normal variable…
vi.mock('../src/lib/mailer.js', () => ({
  createHttpMailer: () => ({ send }),    // …used inside the hoisted factory
}));

it('sends a reminder', async () => {
  send.mockResolvedValue('msg-7');
  expect(await sendReminder({ email: 'an@fpt.edu.vn', lab: 'BE-201', start: '08:00' })).toBe('msg-7');
});
