// Lite-3: a booking can be cancelled until 60 minutes before it starts.
export const CANCEL_LIMIT_MINUTES = 60;

export function canCancel(startsAt, now = new Date()) {
  const minutesLeft = (startsAt.getTime() - now.getTime()) / 60000;
  return minutesLeft >= CANCEL_LIMIT_MINUTES;
}
