// @java: KhuTrung.java
// LC 90 · Subsets II and LC 40 · Combination Sum II — duplicates in the input, no duplicate answers.
// Rule: sort, then at ONE level of the tree never start two branches with the same value.

// #region subsets-dup
function subsetsWithDup(nums: number[]): number[][] {
  const a = [...nums].sort((x, y) => x - y);      // equal values become neighbours
  const res: number[][] = [];
  const path: number[] = [];
  function bt(start: number): void {
    res.push([...path]);
    for (let i = start; i < a.length; i++) {
      if (i > start && a[i] === a[i - 1]) continue; // same value already tried at THIS level
      path.push(a[i]);
      bt(i + 1);
      path.pop();
    }
  }
  bt(0);
  return res;
}
// #endregion

function subsetsNaive(nums: number[]): number[][] {
  const a = [...nums].sort((x, y) => x - y);
  const res: number[][] = [];
  const path: number[] = [];
  const bt = (start: number): void => {
    res.push([...path]);
    for (let i = start; i < a.length; i++) { path.push(a[i]); bt(i + 1); path.pop(); }
  };
  bt(0);
  return res;
}

// #region combo2
function combinationSum2(candidates: number[], target: number): number[][] {
  const a = [...candidates].sort((x, y) => x - y);
  const res: number[][] = [];
  const path: number[] = [];
  function bt(start: number, remain: number): void {
    if (remain === 0) { res.push([...path]); return; }
    for (let i = start; i < a.length; i++) {
      if (i > start && a[i] === a[i - 1]) continue; // skip a twin at the same level
      if (a[i] > remain) break;                     // sorted: nothing further can fit
      path.push(a[i]);
      bt(i + 1, remain - a[i]);                     // i + 1: each card used at most once
      path.pop();
    }
  }
  bt(0, target);
  return res;
}
// #endregion

// #region sai-i-gt-0
function subsetsWrongSkip(nums: number[]): number[][] {
  const a = [...nums].sort((x, y) => x - y);
  const res: number[][] = [];
  const path: number[] = [];
  const bt = (start: number): void => {
    res.push([...path]);
    for (let i = start; i < a.length; i++) {
      if (i > 0 && a[i] === a[i - 1]) continue;    // BUG: i > 0 also kills going DEEPER into a twin
      path.push(a[i]); bt(i + 1); path.pop();
    }
  };
  bt(0);
  return res;
}
// #endregion

console.log('naive  [1,2,2]: ' + JSON.stringify(subsetsNaive([1, 2, 2])));
console.log('dedup  [1,2,2]: ' + JSON.stringify(subsetsWithDup([1, 2, 2])));
console.log('i > 0  [1,2,2]: ' + JSON.stringify(subsetsWrongSkip([1, 2, 2])));
console.log('dedup  [4,4,4,1,4]: ' + JSON.stringify(subsetsWithDup([4, 4, 4, 1, 4])));
console.log('combinationSum2([10,1,2,7,6,1,5], 8) = ' + JSON.stringify(combinationSum2([10, 1, 2, 7, 6, 1, 5], 8)));
console.log('combinationSum2([2,5,2,1,2], 5)      = ' + JSON.stringify(combinationSum2([2, 5, 2, 1, 2], 5)));
