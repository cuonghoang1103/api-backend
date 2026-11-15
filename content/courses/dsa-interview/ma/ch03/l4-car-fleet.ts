// @java: L4CarFleet.java
// LC 853 · Car Fleet — sort by position (closest to target first), then a monotonic stack of arrival times.

// #region giai
function carFleet(target: number, position: number[], speed: number[]): number {
  const cars = position.map((p, i) => [p, (target - p) / speed[i]] as [number, number]); // [position, time to target]
  cars.sort((a, b) => b[0] - a[0]);              // closest to the target first
  const st: number[] = [];                       // arrival time of each fleet, strictly increasing
  for (const [, t] of cars) {
    if (st.length && t <= st[st.length - 1]) continue;  // catches up with the fleet ahead => joins it
    st.push(t);                                  // slower than the fleet ahead => a new fleet
  }
  return st.length;
}
// #endregion

console.log(carFleet(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]));
console.log(carFleet(10, [3], [3]));
console.log(carFleet(100, [0, 2, 4], [4, 2, 1]));
console.log(carFleet(10, [6, 8], [3, 2]));
