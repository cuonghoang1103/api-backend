// @java: NguongBatch.java
// "What is the LARGEST batch size that does not run out of GPU memory?" — a threshold search where
// (1) one probe is expensive (start a training step, wait, see if it crashed) and (2) there is no known upper bound.
// The memory model is simulated (fixed overhead + per-sample cost) so the run is reproducible.
const GPU_MB = 24_576;                                    // a 24 GB card
let probes = 0;
const log: string[] = [];
function fits(batch: number): boolean {                    // pretend: launch one step with this batch size
  probes++;
  const usedMb = 1_830 + 42 * batch;                       // weights + optimizer state, then activations per sample
  const ok = usedMb <= GPU_MB;
  log.push(`${batch}${ok ? '' : '!'}`);
  return ok;
}
function firstTrue(lo: number, hi: number, ok: (i: number) => boolean): number {
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (ok(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}

// #region gallop
function largestBatch(): number {
  // Phase 1 — exponential (galloping) search: 1, 2, 4, 8, ... until the first OOM. Gives a range [lo, hi).
  let good = 1;
  if (!fits(good)) return 0;
  while (fits(good * 2)) good *= 2;                         // good fits, good * 2 does not
  // Phase 2 — the usual template on "does it OOM?" (F...F T...T); the largest batch that fits is first T - 1.
  return firstTrue(good + 1, good * 2, (b) => !fits(b)) - 1;
}
// #endregion

const best = largestBatch();
console.log(`largest batch that fits: ${best}  (uses ${1_830 + 42 * best} MB of ${GPU_MB}; ${best + 1} would need ${1_830 + 42 * (best + 1)} MB)`);
console.log(`probes: ${probes}   order tried (! = out of memory): ${log.join(' ')}`);
console.log(`a linear search 1, 2, 3, ... would launch ${best + 1} steps`);
