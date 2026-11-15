// @java: BayThamChieu.java
// The two classic backtracking bugs, run for real on subsets([1,2,3]).

// #region sai-tham-chieu
function subsetsWrongRef(nums: number[]): number[][] {
  const res: number[][] = [];
  const path: number[] = [];
  function backtrack(start: number): void {
    res.push(path);                        // BUG: pushes the SAME array object every time
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1);
      path.pop();
    }
  }
  backtrack(0);
  return res;
}
// #endregion

// #region quen-bo-chon
function subsetsNoUndo(nums: number[]): number[][] {
  const res: number[][] = [];
  const path: number[] = [];
  function backtrack(start: number): void {
    res.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1);
      // BUG: forgot path.pop() — the choice leaks into the sibling branches
    }
  }
  backtrack(0);
  return res;
}
// #endregion

// #region dung
function subsetsRight(nums: number[]): number[][] {
  const res: number[][] = [];
  const path: number[] = [];
  function backtrack(start: number): void {
    res.push([...path]);                   // a snapshot, frozen at this moment
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1);
      path.pop();                          // every push has exactly one pop on the way back
    }
  }
  backtrack(0);
  return res;
}
// #endregion

const wrong = subsetsWrongRef([1, 2, 3]);
console.log('pushed path itself : ' + JSON.stringify(wrong));
console.log('  same object?       ' + (wrong[0] === wrong[7]));
console.log('forgot path.pop()  : ' + JSON.stringify(subsetsNoUndo([1, 2, 3])));
console.log('correct            : ' + JSON.stringify(subsetsRight([1, 2, 3])));
