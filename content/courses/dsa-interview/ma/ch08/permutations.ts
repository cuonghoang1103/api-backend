// @java: Permutations.java
// LC 46 · Permutations — "which element goes in the next slot?" with a used[] array.

// #region perm
function permute(nums: number[]): number[][] {
  const res: number[][] = [];
  const path: number[] = [];
  const used = new Array<boolean>(nums.length).fill(false);
  function backtrack(): void {
    if (path.length === nums.length) { res.push([...path]); return; } // a leaf: all slots filled
    for (let i = 0; i < nums.length; i++) {   // every element is a candidate for this slot…
      if (used[i]) continue;                  // …except the ones already on the path
      used[i] = true; path.push(nums[i]);     // choose (two pieces of state!)
      backtrack();
      path.pop(); used[i] = false;            // unchoose BOTH, in reverse order
    }
  }
  backtrack();
  return res;
}
// #endregion

let nodes = 0;
function countNodes(n: number): number {
  const used = new Array<boolean>(n).fill(false);
  let leaves = 0;
  function bt(depth: number): void {
    nodes++;
    if (depth === n) { leaves++; return; }
    for (let i = 0; i < n; i++) if (!used[i]) { used[i] = true; bt(depth + 1); used[i] = false; }
  }
  bt(0);
  return leaves;
}

console.log('permute([1,2,3]) = ' + JSON.stringify(permute([1, 2, 3])));
console.log('permute([7])     = ' + JSON.stringify(permute([7])));
for (let n = 1; n <= 8; n++) {
  nodes = 0;
  const leaves = countNodes(n);
  console.log('n = ' + n + ': leaves (n!) = ' + leaves + ', nodes = ' + nodes + ', nodes / n! = ' + (nodes / leaves).toFixed(3));
}
