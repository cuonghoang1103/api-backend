// @java: CarPooling.java
// LC 1094 · Car Pooling — a sweep line whose coordinates are small (0..1000) ⇒ a difference array, no sort at all.

// #region giai
function carPooling(trips: number[][], capacity: number): boolean {
  const diff = new Array(1001).fill(0);          // diff[x] = change in passengers at kilometre x
  for (const [num, from, to] of trips) {
    diff[from] += num;                           // they get in at 'from'
    diff[to] -= num;                             // and are already out at 'to' (half-open [from, to))
  }
  let inCar = 0;
  for (let x = 0; x <= 1000; x++) {
    inCar += diff[x];                            // prefix sum = passengers on board after kilometre x
    if (inCar > capacity) return false;
  }
  return true;
}
// #endregion

const cases: [number[][], number][] = [
  [[[3, 1, 6], [2, 4, 8]], 4],
  [[[3, 1, 6], [2, 6, 8]], 4],
  [[[4, 2, 7], [3, 7, 9], [6, 3, 9]], 10],
  [[[9, 0, 1000]], 8],
];
for (const [t, c] of cases) console.log(`capacity ${c} trips ${JSON.stringify(t)} -> ${carPooling(t, c)}`);
