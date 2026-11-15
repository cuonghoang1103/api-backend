// Same capacity, same requests, two eviction rules:
//   FIFO = evict the key INSERTED first      (what src/routes/gifs.routes.ts and src/services/work/projectCache.ts do)
//   LRU  = evict the key USED least recently  (what src/services/sachRieng/ielts.ts › anhTrangIelts does)
// Workload: 3 "hot" keys requested all the time, mixed with a stream of keys requested only once.

// #region mo-phong
function simulate(cap: number, reqs: string[], lru: boolean): number {
  const m = new Map<string, true>();
  let hits = 0;
  for (const k of reqs) {
    if (m.has(k)) {
      hits++;
      if (lru) { m.delete(k); m.set(k, true); }    // the ONLY difference: a hit refreshes the key
      continue;
    }
    m.set(k, true);
    if (m.size > cap) m.delete(m.keys().next().value!);
  }
  return hits;
}
// #endregion

const CAP = 6;
const reqs: string[] = [];
for (let i = 0; i < 3000; i++) reqs.push('hot' + (i % 3), 'once' + i); // hot0 once0 hot1 once1 hot2 once2 hot0 ...
console.log(`requests = ${reqs.length} (hot = ${reqs.length / 2}), capacity = ${CAP}`);
console.log(`FIFO hits = ${simulate(CAP, reqs, false)}`);
console.log(`LRU  hits = ${simulate(CAP, reqs, true)}`);
// #region quet
const warm = reqs.slice(0, 60);                                   // LRU is warm: all 3 hot keys are cached
const scan = Array.from({ length: CAP }, (_, i) => 'scan' + i);    // a one-off scan of CAP keys (crawler, report, export...)
const hot = ['hot0', 'hot1', 'hot2'];
const hotHits = (r: string[]) => simulate(CAP, [...r, ...hot], true) - simulate(CAP, r, true);
// #endregion
console.log(`hot keys right after warm-up:        LRU hits ${hotHits(warm)}/3`);
console.log(`hot keys right after a ${CAP}-key scan:   LRU hits ${hotHits([...warm, ...scan])}/3`);
