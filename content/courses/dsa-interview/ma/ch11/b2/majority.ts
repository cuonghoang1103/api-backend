// @java: PvMajority.java
// LC 169 · Majority Element — three answers an interviewer expects to hear, in the order you would say them:
// count with a map O(n)/O(n) → sort and take the middle O(n log n) → Boyer–Moore voting O(n)/O(1).
// Follow-up: if a majority is NOT guaranteed, Boyer–Moore needs a second pass to verify its candidate.

// #region dem
function majorityCount(nums: number[]): number {
  const count = new Map<number, number>();
  for (const x of nums) {
    const c = (count.get(x) ?? 0) + 1;
    if (c > nums.length / 2) return x;        // stop as soon as someone passes n/2
    count.set(x, c);
  }
  throw new Error('no majority');              // unreachable when the input is guaranteed
}
// #endregion

// #region sap-xep
function majoritySort(nums: number[]): number {
  const a = [...nums].sort((x, y) => x - y);   // copy: do not mutate the caller's array
  return a[Math.floor(a.length / 2)];          // the majority always covers the middle index
}
// #endregion

// #region bau-chon
function majorityVote(nums: number[]): number {
  let candidate = 0;
  let count = 0;
  for (const x of nums) {
    if (count === 0) candidate = x;            // nobody is ahead: x becomes the new candidate
    count += x === candidate ? 1 : -1;         // a vote for, or a vote that cancels one
  }
  return candidate;                            // correct ONLY if a majority exists
}
// #endregion

// #region kiem-lai
function majorityOrNone(nums: number[]): number | null {
  const c = majorityVote(nums);
  let seen = 0;
  for (const x of nums) if (x === c) seen++;   // second pass: is the candidate really > n/2?
  return seen > nums.length / 2 ? c : null;
}
// #endregion

const cases: number[][] = [
  [3, 2, 3],
  [2, 2, 1, 1, 1, 2, 2],
  [7],
  [-1, -1, 5],
  [4, 5, 4, 5, 4, 5, 5],
  [1000000000, -1000000000, 1000000000],
];
for (const a of cases) {
  console.log(`${JSON.stringify(a)} -> count=${majorityCount(a)} sort=${majoritySort(a)} vote=${majorityVote(a)}`);
}
console.log('-- no majority guaranteed (follow-up) --');
for (const a of [[1, 2, 3], [1, 2, 1, 3], [2, 2, 1, 1], [5, 5, 1]]) {
  console.log(`${JSON.stringify(a)} -> raw candidate=${majorityVote(a)} verified=${majorityOrNone(a) ?? 'none'}`);
}
