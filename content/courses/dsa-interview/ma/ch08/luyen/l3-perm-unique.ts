// @java: L3PermUnique.java
// LC 47 · Permutations II — duplicates in the input: sort, and use twins only in their original order.

// #region giai
function permuteUnique(nums: number[]): number[][] {
  const a = [...nums].sort((x, y) => x - y);
  const used = new Array<boolean>(a.length).fill(false);
  const res: number[][] = [];
  const path: number[] = [];
  function bt(): void {
    if (path.length === a.length) { res.push([...path]); return; }
    for (let i = 0; i < a.length; i++) {
      if (used[i]) continue;
      if (i > 0 && a[i] === a[i - 1] && !used[i - 1]) continue; // twin before me is free ⇒ this slot already tried it
      used[i] = true; path.push(a[i]);
      bt();
      path.pop(); used[i] = false;
    }
  }
  bt();
  return res;
}
// #endregion

console.log('[1,1,2]   -> ' + JSON.stringify(permuteUnique([1, 1, 2])));
console.log('[1,2,3]   -> ' + permuteUnique([1, 2, 3]).length + ' permutations');
console.log('[1,1,2,2] -> ' + permuteUnique([1, 1, 2, 2]).length + ' permutations (4!/(2!*2!) = 6)');
console.log('[2,2,2]   -> ' + JSON.stringify(permuteUnique([2, 2, 2])));
