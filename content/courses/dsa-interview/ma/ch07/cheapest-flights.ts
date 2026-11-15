// @java: CheapestFlights.java
// LC 787 · Cheapest Flights Within K Stops — Bellman-Ford limited to k + 1 rounds (at most k + 1 flights).

// #region dung
function findCheapestPrice(n: number, flights: number[][], src: number, dst: number, k: number): number {
  let cost = new Array<number>(n).fill(Infinity);
  cost[src] = 0;
  for (let round = 0; round <= k; round++) {            // round r allows paths of at most r + 1 flights
    const next = [...cost];                              // COPY: relax from last round's prices only
    for (const [u, v, p] of flights) {
      if (cost[u] !== Infinity && cost[u] + p < next[v]) next[v] = cost[u] + p;
    }
    cost = next;
  }
  return cost[dst] === Infinity ? -1 : cost[dst];
}
// #endregion

// #region sai
function findCheapestPriceNoCopy(n: number, flights: number[][], src: number, dst: number, k: number): number {
  const cost = new Array<number>(n).fill(Infinity);
  cost[src] = 0;
  for (let round = 0; round <= k; round++) {
    for (const [u, v, p] of flights) {
      if (cost[u] !== Infinity && cost[u] + p < cost[v]) cost[v] = cost[u] + p;   // may use a price set THIS round
    }
  }
  return cost[dst] === Infinity ? -1 : cost[dst];
}
// #endregion

const F1 = [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]];
const F2 = [[0, 1, 100], [1, 2, 100], [0, 2, 500]];
console.log('k=1:', findCheapestPrice(4, F1, 0, 3, 1), ' k=2:', findCheapestPrice(4, F1, 0, 3, 2));
console.log('k=1:', findCheapestPrice(3, F2, 0, 2, 1), ' k=0:', findCheapestPrice(3, F2, 0, 2, 0));
console.log('no copy, k=0:', findCheapestPriceNoCopy(3, F2, 0, 2, 0), ' (should be 500: one direct flight only)');
