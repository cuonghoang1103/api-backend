// @java: RateLimiter.java
// Four rate limiters, same rule ("at most LIMIT requests per WINDOW ms"), fed the same request times.

interface Limiter { name: string; allow(t: number): boolean; }

// #region fixed
// Fixed window aligned to the clock: [0, 60000), [60000, 120000), …
class FixedClock implements Limiter {
  name = 'fixed window (clock-aligned)';
  private win = -1; private count = 0;
  constructor(private limit: number, private w: number) {}
  allow(t: number): boolean {
    const id = Math.floor(t / this.w);
    if (id !== this.win) { this.win = id; this.count = 0; }   // a new minute: the counter drops to 0
    this.count++;                                              // rejected hits count too
    return this.count <= this.limit;
  }
}
// Fixed window that opens at the key's FIRST hit — what rate-limit-redis does (SET … PX on the first hit, INCR after).
class FixedFirstHit implements Limiter {
  name = 'fixed window (from first hit)';
  private start = -Infinity; private count = 0;
  constructor(private limit: number, private w: number) {}
  allow(t: number): boolean {
    if (t - this.start >= this.w) { this.start = t; this.count = 0; }
    this.count++;
    return this.count <= this.limit;
  }
}
// #endregion

// #region log
// Sliding window LOG: keep the times of accepted requests; a head pointer drops the ones older than w.
class SlidingLog implements Limiter {
  name = 'sliding window log';
  private times: number[] = []; private head = 0;
  constructor(private limit: number, private w: number) {}
  allow(t: number): boolean {
    while (this.head < this.times.length && t - this.times[this.head] >= this.w) this.head++;  // left edge moves
    if (this.times.length - this.head >= this.limit) return false;
    this.times.push(t);                                                                          // right edge moves
    if (this.head > 1024) { this.times = this.times.slice(this.head); this.head = 0; }          // keep memory bounded
    return true;
  }
}
// #endregion

// #region counter
// Sliding window COUNTER: two fixed counters, the previous one weighted by how much of it is still inside the window.
class SlidingCounter implements Limiter {
  name = 'sliding window counter';
  private win = -1; private cur = 0; private prev = 0;
  constructor(private limit: number, private w: number) {}
  allow(t: number): boolean {
    const id = Math.floor(t / this.w);
    if (id !== this.win) { this.prev = id === this.win + 1 ? this.cur : 0; this.cur = 0; this.win = id; }
    const elapsed = t - id * this.w;
    // estimate = prev * (w - elapsed) / w + cur, compared in integers: estimate < limit  <=>  prev*(w-elapsed) + cur*w < limit*w
    if (this.prev * (this.w - elapsed) + this.cur * this.w >= this.limit * this.w) return false;
    this.cur++;
    return true;
  }
}
// #endregion

const LIMIT = 10, W = 60_000;
const make = (): Limiter[] => [new FixedClock(LIMIT, W), new FixedFirstHit(LIMIT, W), new SlidingLog(LIMIT, W), new SlidingCounter(LIMIT, W)];
function run(title: string, times: number[], from: number, to: number) {
  console.log(title);
  for (const lim of make()) {
    let ok = 0, inBurst = 0;
    for (const t of times) if (lim.allow(t)) { ok++; if (t >= from && t < to) inBurst++; }
    console.log(`  ${lim.name.padEnd(30)} accepted ${String(ok).padStart(2)} of ${times.length}, ${String(inBurst).padStart(2)} of them inside [${from}, ${to}) ms`);
  }
}
const range = (a: number, n: number, step: number) => Array.from({ length: n }, (_, i) => a + i * step);
console.log(`rule: at most ${LIMIT} requests per ${W} ms`);
run('A. normal user: one request every 7 s for 2 minutes', range(0, 18, 7000), 0, 120_000);
run('B. attacker bursts across the clock minute (10 at 59.90-59.99 s, 10 at 60.00-60.09 s)', [...range(59_900, 10, 10), ...range(60_000, 10, 10)], 59_900, 60_100);
run('C. attacker opens its own window at t=0, waits, then the same burst', [0, ...range(59_910, 9, 10), ...range(60_000, 10, 10)], 59_900, 60_100);
