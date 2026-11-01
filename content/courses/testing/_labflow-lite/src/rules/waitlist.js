// BR-09 — waitlist for a taken slot (Chapter 10, built test-first in lesson 10.1).
export const WAITLIST_MAX = 3;     // at most 3 students wait for one slot
export const OFFER_MINUTES = 30;   // a freed slot is held for the first in line for 30 minutes

const refuse = (code) => ({ ok: false, code });
const minutesLater = (date, minutes) => new Date(date.getTime() + minutes * 60 * 1000);

// queue: [{ userId }], oldest first. Never changes the queue it is given; returns a new one.
export function joinWaitlist(queue, { userId, holderId }) {
  if (userId === holderId) return refuse('IS_HOLDER');
  if (queue.some((w) => w.userId === userId)) return refuse('ALREADY_WAITING');
  if (queue.length >= WAITLIST_MAX) return refuse('WAITLIST_FULL');
  const next = [...queue, { userId }];
  return { ok: true, position: next.length, queue: next };
}

// The slot was freed at `now`: offer it to the first student in line.
export function offerNext(queue, now) {
  if (queue.length === 0) return { offer: null, queue: [] };
  const [first, ...rest] = queue;
  return { offer: { userId: first.userId, expiresAt: minutesLater(now, OFFER_MINUTES) }, queue: rest };
}

export function acceptOffer(offer, now) {
  return now < offer.expiresAt ? { ok: true } : refuse('OFFER_EXPIRED');
}
