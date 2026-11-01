// My bookings (Chapter 11, US-11): a student lists their own bookings and cancels one.
// The rule (who may cancel, until when) is a pure function in rules/cancel.js; this file only talks to the repository.
import { cancelDecision } from '../rules/cancel.js';

export const listMyBookings = (repo, userId) => repo.listByUser(userId);

// → { ok: true, booking } or { ok: false, code: NOT_FOUND | ALREADY_CANCELLED | TOO_LATE_TO_CANCEL }
export async function cancelMyBooking(repo, { id, user, now }) {
  const decision = cancelDecision(await repo.findById(id), user, now);
  if (!decision.ok) return decision;
  const booking = await repo.cancel(id);   // one atomic step: of two cancels at the same moment, only one wins
  return booking ? { ok: true, booking } : { ok: false, code: 'ALREADY_CANCELLED' };
}
