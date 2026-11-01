// BR-09 — waitlist for a taken slot. Built test-first in lesson 10.1; this folder is one step of it.
export function joinWaitlist(queue, { userId }) {
  return { ok: true, position: 1, queue: [{ userId }] }; // fake it: the simplest code that passes
}
