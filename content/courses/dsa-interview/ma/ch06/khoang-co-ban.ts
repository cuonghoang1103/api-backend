// @java: KhoangCoBan.java
// The one test every interval problem is built on — and why "touching" depends on the problem.

// #region overlap
// Half-open [start, end): a meeting 9–11 and one 11–13 do NOT clash (one ends as the other starts).
const overlapsHalfOpen = (a: number[], b: number[]) => a[0] < b[1] && b[0] < a[1];
// Closed [start, end]: both endpoints belong to the interval, so sharing an endpoint IS an overlap.
const overlapsClosed = (a: number[], b: number[]) => a[0] <= b[1] && b[0] <= a[1];
// #endregion

// #region canattend
// Can one person attend all meetings? (LC 252, Premium) — sort by start, compare neighbours only.
function canAttendMeetings(intervals: number[][]): boolean {
  const s = [...intervals].sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < s.length; i++) {
    if (s[i][0] < s[i - 1][1]) return false;   // next starts before the previous ends
  }
  return true;
}
// #endregion

const pairs: [number[], number[]][] = [[[9, 11], [11, 13]], [[9, 12], [10, 11]], [[9, 10], [11, 12]], [[13, 15], [9, 14]]];
for (const [a, b] of pairs) {
  console.log(`${JSON.stringify(a)} & ${JSON.stringify(b)}: half-open=${overlapsHalfOpen(a, b)} closed=${overlapsClosed(a, b)}`);
}
console.log(`canAttend [[9,10],[13,14],[10,12]] = ${canAttendMeetings([[9, 10], [13, 14], [10, 12]])}`);
console.log(`canAttend [[9,11],[13,14],[10,12]] = ${canAttendMeetings([[9, 11], [13, 14], [10, 12]])}`);
