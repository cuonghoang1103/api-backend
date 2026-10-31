// Practice 3.4: the reminder rewritten so the mailer is passed in.
export function createReminder({ mailer }) {
  return (booking) => mailer.send({ to: booking.email, subject: 'Reminder: ' + booking.lab + ' at ' + booking.start + ' tomorrow' });
}
