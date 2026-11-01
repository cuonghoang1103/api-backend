// Lesson 8.3: an in-memory repository that behaves like a real database under load —
// every lookup takes a different amount of time (0–40 ms on top of the usual 5 ms).
import { createMemoryRepo } from '../src/booking/service.js';

export function slowRepo() {
  const repo = createMemoryRepo();
  const jitter = () => new Promise((resolve) => setTimeout(resolve, Math.random() * 40));
  return { ...repo, async findOverlap(...args) { await jitter(); return repo.findOverlap(...args); } };
}
