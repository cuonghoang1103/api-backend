import { it, expect, vi } from 'vitest';
import { sendReminder } from '../src/notify/reminder.js';

// vi.mock is hoisted to the top of the file, above the imports, so the factory runs first.
// Anything the factory uses must be created with vi.hoisted.
const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock('../src/lib/mailer.js', () => ({
  createHttpMailer: () => ({ send }),
}));

it('sends a reminder through the (mocked) mailer module', async () => {
  send.mockResolvedValue('msg-7');
  const id = await sendReminder({ email: 'an@fpt.edu.vn', lab: 'BE-201', start: '08:00' });
  expect(id).toBe('msg-7');
  expect(send).toHaveBeenCalledWith({ to: 'an@fpt.edu.vn', subject: 'Reminder: BE-201 at 08:00 tomorrow' });
});
