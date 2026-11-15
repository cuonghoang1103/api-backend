// @java: Subsets.java
// LC 78 · Subsets — the backtracking template, written two ways, with a call counter.

// #region khuon
function subsets(nums: number[]): number[][] {
  const res: number[][] = [];
  const path: number[] = [];               // the partial solution: what we have chosen so far
  function backtrack(start: number): void {
    res.push([...path]);                   // every node of this tree is an answer: record a COPY
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);                  // 1. choose
      backtrack(i + 1);                    // 2. explore (only elements AFTER i: no [2,1] after [1,2])
      path.pop();                          // 3. unchoose — put the state back exactly as it was
    }
  }
  backtrack(0);
  return res;
}
// #endregion

// #region chon-bo
function subsetsBinary(nums: number[]): number[][] {
  const res: number[][] = [];
  const path: number[] = [];
  function go(i: number): void {
    if (i === nums.length) { res.push([...path]); return; } // a leaf = one full decision
    path.push(nums[i]);                    // branch 1: take nums[i]
    go(i + 1);
    path.pop();
    go(i + 1);                             // branch 2: skip nums[i]
  }
  go(0);
  return res;
}
// #endregion

let calls = 0;
function subsetsCounted(nums: number[]): number {
  const path: number[] = [];
  let answers = 0;
  function backtrack(start: number): void {
    calls++;
    answers++;
    for (let i = start; i < nums.length; i++) { path.push(nums[i]); backtrack(i + 1); path.pop(); }
  }
  backtrack(0);
  return answers;
}

console.log('subsets([1,2,3])       = ' + JSON.stringify(subsets([1, 2, 3])));
console.log('subsetsBinary([1,2,3]) = ' + JSON.stringify(subsetsBinary([1, 2, 3])));
console.log('subsets([])            = ' + JSON.stringify(subsets([])));
for (const n of [1, 2, 3, 4, 10, 20]) {
  calls = 0;
  const a = subsetsCounted(Array.from({ length: n }, (_, i) => i));
  console.log('n = ' + n + ': answers = ' + a + ', calls = ' + calls + ', 2^n = ' + 2 ** n);
}
