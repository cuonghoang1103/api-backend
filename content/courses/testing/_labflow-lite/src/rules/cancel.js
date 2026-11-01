// Lite-3: a booking can be cancelled until 60 minutes before it starts.
export const CANCEL_LIMIT_MINUTES = 60;

export function canCancel(startsAt, now = new Date()) {
  const minutesLeft = (startsAt.getTime() - now.getTime()) / 60000;
  return minutesLeft >= CANCEL_LIMIT_MINUTES;
}

// Chapter 11 (US-11 "My bookings"): when does a booking start, and may this user cancel it now?
// A booking's date and start are Viet Nam wall-clock time (UTC+7), whatever the server's time zone.
export function startsAtVN(date, start) {
  return new Date(date + 'T' + start + ':00+07:00');
}

// booking: { userId, status, date, start } or null · user: { id, role } · now: a Date.
export function cancelDecision(booking, user, now) {
  const isAdmin = user.role === 'ADMIN';
  if (!booking || (booking.userId !== user.id && !isAdmin)) return { ok: false, code: 'NOT_FOUND' };
  if (booking.status === 'CANCELLED') return { ok: false, code: 'ALREADY_CANCELLED' };
  if (!isAdmin && !canCancel(startsAtVN(booking.date, booking.start), now)) return { ok: false, code: 'TOO_LATE_TO_CANCEL' };
  return { ok: true };
}
