// Helpers shared by the web tests (Chapter 6).
import { screen } from '@testing-library/react';

export const ROW = { id: 1, lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00', seats: 20, status: 'CONFIRMED', minutes: 120 };

// Fill the booking form like a user. Pass '' to leave a field empty.
export async function fillBooking(user, { date = '2026-11-16', start = '08:00', end = '10:00', seats = '20' } = {}) {
  if (date) await user.type(screen.getByLabelText('Date'), date);
  if (start) await user.type(screen.getByLabelText('Start'), start);
  if (end) await user.type(screen.getByLabelText('End'), end);
  if (seats) await user.type(screen.getByRole('spinbutton', { name: 'Seats' }), seats);
}

// A promise you resolve later: keeps the screen in its "waiting" state for as long as the test wants.
export function deferred() {
  let resolve;
  const promise = new Promise((r) => { resolve = r; });
  return { promise, resolve };
}
