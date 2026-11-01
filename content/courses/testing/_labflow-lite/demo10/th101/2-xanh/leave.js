// Practice 10.1, step 2: the simplest code that passes all three tests.
export function leaveWaitlist(queue, userId) {
  if (!queue.some((w) => w.userId === userId)) return { ok: false, code: 'NOT_WAITING' };
  return { ok: true, queue: queue.filter((w) => w.userId !== userId) };
}
