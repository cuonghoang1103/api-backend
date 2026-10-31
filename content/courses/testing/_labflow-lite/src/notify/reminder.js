// Written the "quick" way: it builds its own mailer from environment variables at import time.
// Lesson 3.2 tests it with vi.mock; lesson 3.4 shows why the injected version is easier.
import { createHttpMailer } from '../lib/mailer.js';

const mailer = createHttpMailer({ baseUrl: process.env.MAIL_API_URL, apiKey: process.env.MAIL_API_KEY });

export async function sendReminder(booking) {
  return mailer.send({ to: booking.email, subject: 'Reminder: ' + booking.lab + ' at ' + booking.start + ' tomorrow' });
}
