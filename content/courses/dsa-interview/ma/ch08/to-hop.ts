// @java: ToHop.java
// LC 77 · Combinations and LC 39 · Combination Sum — "order does not matter" means a start index.

// #region combine
function combine(n: number, k: number): number[][] {
  const res: number[][] = [];
  const path: number[] = [];
  function bt(start: number): void {
    if (path.length === k) { res.push([...path]); return; }
    const need = k - path.length;
    for (let x = start; x <= n - need + 1; x++) {  // leave room: we still need `need` numbers from x..n
      path.push(x);
      bt(x + 1);
      path.pop();
    }
  }
  bt(1);
  return res;
}
// #endregion

// #region combination-sum
function combinationSum(candidates: number[], target: number): number[][] {
  const a = [...candidates].sort((x, y) => x - y);  // sort so that "too big" means "everything after is too big"
  const res: number[][] = [];
  const path: number[] = [];
  function bt(start: number, remain: number): void {
    if (remain === 0) { res.push([...path]); return; }
    for (let i = start; i < a.length; i++) {
      if (a[i] > remain) break;                    // sorted ⇒ the rest is bigger: stop the whole loop
      path.push(a[i]);
      bt(i, remain - a[i]);                        // i, not i + 1: the same number may be reused
      path.pop();
    }
  }
  bt(0, target);
  return res;
}
// #endregion

console.log('combine(4, 2) = ' + JSON.stringify(combine(4, 2)));
console.log('combine(5, 3) has ' + combine(5, 3).length + ' combinations (C(5,3) = 10)');
console.log('combinationSum([2,3,6,7], 7) = ' + JSON.stringify(combinationSum([2, 3, 6, 7], 7)));
console.log('combinationSum([2,3,5], 8)   = ' + JSON.stringify(combinationSum([2, 3, 5], 8)));
console.log('combinationSum([2], 1)       = ' + JSON.stringify(combinationSum([2], 1)));
