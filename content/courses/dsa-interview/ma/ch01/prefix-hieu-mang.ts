// @java: PrefixHieuMang.java
// Difference array: many "add v to every slot in [from, to)" updates, then one prefix pass.
// (1) how many students are in the lab at each hour; (2) LC 1109 Corporate Flight Bookings.

// #region phong
// bookings[i] = [enterHour, leaveHour): the student is in the lab from enterHour up to (not including) leaveHour.
function labOccupancy(bookings: number[][], hours: number): number[] {
  const diff = new Array(hours + 1).fill(0);
  for (const [enter, leave] of bookings) {
    diff[enter] += 1;      // one more person from this hour on
    diff[leave] -= 1;      // ...and one fewer from the hour they leave
  }
  const inLab = new Array(hours).fill(0);
  let running = 0;
  for (let h = 0; h < hours; h++) {
    running += diff[h];    // prefix sum of the differences = the actual count
    inLab[h] = running;
  }
  return inLab;
}
// #endregion

// #region lc1109
// bookings[i] = [first, last, seats], flights numbered 1..n, inclusive range.
function corpFlightBookings(bookings: number[][], n: number): number[] {
  const diff = new Array(n + 1).fill(0);
  for (const [first, last, seats] of bookings) {
    diff[first - 1] += seats;   // 1-based inclusive [first, last] -> 0-based half-open [first-1, last)
    diff[last] -= seats;
  }
  const ans = new Array(n).fill(0);
  let running = 0;
  for (let i = 0; i < n; i++) { running += diff[i]; ans[i] = running; }
  return ans;
}
// #endregion

// Lab opens at 7:00; hour index 0 = 7:00-8:00 ... 9 = 16:00-17:00.
const bookings = [[0, 3], [1, 4], [2, 6], [5, 9], [6, 10], [6, 8]];
const occ = labOccupancy(bookings, 10);
console.log('in lab per hour =', JSON.stringify(occ));
const peak = Math.max(...occ);
console.log('peak =', peak, 'at hour index', occ.indexOf(peak), '(' + (7 + occ.indexOf(peak)) + ':00)');
console.log('corpFlightBookings =', JSON.stringify(corpFlightBookings([[1, 2, 10], [2, 3, 20], [2, 5, 25]], 5)));
