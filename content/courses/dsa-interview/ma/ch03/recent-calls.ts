// @java: RecentCalls.java
// LC 933 · Number of Recent Calls — a queue of timestamps = a "sliding log" rate limiter.

// #region giai
class RecentCounter {
  private q: number[] = [];
  private head = 0;                                // front index; we never shift()
  ping(t: number): number {                        // t is strictly increasing
    this.q.push(t);
    while (this.q[this.head] < t - 3000) this.head++;  // drop calls older than 3000 ms
    return this.q.length - this.head;              // calls in [t-3000, t]
  }
}
// #endregion

// #region limiter
function makeLimiter(limit: number, windowMs: number) {
  const q: number[] = [];
  let head = 0;
  return (t: number): boolean => {                 // true = allowed
    while (head < q.length && q[head] <= t - windowMs) head++;
    if (q.length - head >= limit) return false;    // already `limit` requests in the last windowMs
    q.push(t);
    return true;
  };
}
// #endregion

const rc = new RecentCounter();
console.log('ping 1, 100, 3001, 3002 ->', JSON.stringify([1, 100, 3001, 3002].map((t) => rc.ping(t))));
const allow = makeLimiter(3, 1000);                // at most 3 requests per rolling second
console.log('limiter(3 per 1000 ms) at t = 0,100,200,300,999,1000,1101 ->', JSON.stringify([0, 100, 200, 300, 999, 1000, 1101].map(allow)));
