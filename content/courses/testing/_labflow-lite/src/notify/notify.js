// After a booking: tell the student it is confirmed, or ask an approver (BR-06 bookings are PENDING).
import { bookLab } from '../booking/service.js';

export const APPROVER = 'approvals@labflow.example';

// Pure: which e-mail a booking needs. No I/O, so it is tested without any double.
export function buildMail(booking, studentEmail) {
  const when = booking.lab + ' on ' + booking.date + ' at ' + booking.start;
  if (booking.status === 'CONFIRMED') return { to: studentEmail, subject: 'Booking confirmed: ' + when };
  return { to: APPROVER, subject: 'Approval needed: ' + booking.seats + ' seats, ' + when };
}

// A failed e-mail must not undo a saved booking: report it and carry on.
export async function bookAndNotify({ repo, mailer, log = console }, input) {
  const booking = await bookLab(repo, input);
  try {
    await mailer.send(buildMail(booking, input.email));
    return { ...booking, notified: true };
  } catch (err) {
    log.warn('mail failed for booking ' + booking.id + ': ' + err.message);
    return { ...booking, notified: false };
  }
}
