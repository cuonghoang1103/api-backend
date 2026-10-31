import { it, expect } from 'vitest';
import { bookAndNotify } from '../src/notify/notify.js';
import { createMemoryRepo } from '../src/booking/service.js';
import { createFakeMailer } from '../test/support/fakes.js';

it('books BE-201 (dependencies passed in)', async () => {
  const mailer = createFakeMailer();
  const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00', email: 'an@fpt.edu.vn' };
  await expect(bookAndNotify({ repo: createMemoryRepo(), mailer }, input)).resolves.toMatchObject({ id: 1, status: 'CONFIRMED' });
  expect(mailer.outbox[0].to).toBe('an@fpt.edu.vn');
});
