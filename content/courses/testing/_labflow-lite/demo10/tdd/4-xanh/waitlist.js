// BR-09 — waitlist for a taken slot. Built test-first in lesson 10.1; this folder is one step of it.
export const WAITLIST_MAX = 3;

export function joinWaitlist(queue, { userId, holderId }) {
  if (userId === holderId) return { ok: false, code: 'IS_HOLDER' };
  if (queue.some((w) => w.userId === userId)) return { ok: false, code: 'ALREADY_WAITING' };
  if (queue.length >= WAITLIST_MAX) return { ok: false, code: 'WAITLIST_FULL' };
  const next = [...queue, { userId }];
  return { ok: true, position: next.length, queue: next };
}
