// @java: TlJump.java
// LC 55 Jump Game (greedy "farthest reach") and LC 45 Jump Game II (BFS levels without a queue).

// #region dp
// The DP version first (O(n^2)): ok[i] = can I reach the end starting from i?
function canJumpDP(nums: number[]): boolean {
  const n = nums.length;
  const ok = new Array<boolean>(n).fill(false);
  ok[n - 1] = true;
  for (let i = n - 2; i >= 0; i--)
    for (let j = i + 1; j <= Math.min(n - 1, i + nums[i]); j++) if (ok[j]) { ok[i] = true; break; }
  return ok[0];
}
// #endregion

// #region lc55
function canJump(nums: number[]): boolean {
  let far = 0;                                  // farthest index reachable so far
  for (let i = 0; i < nums.length; i++) {
    if (i > far) return false;                  // standing on a cell we can never reach
    far = Math.max(far, i + nums[i]);
    if (far >= nums.length - 1) return true;
  }
  return true;
}
// #endregion

// #region lc45
function jump(nums: number[]): number {
  let jumps = 0, end = 0, far = 0;              // [.., end] = cells reachable with `jumps` jumps
  for (let i = 0; i < nums.length - 1; i++) {   // NOT i < n: standing on the last cell needs no jump
    far = Math.max(far, i + nums[i]);
    if (i === end) { jumps++; end = far; }      // the current level is used up: jump once more
  }
  return jumps;
}
// #endregion

// #region sai
function jumpWrong(nums: number[]): number {
  let jumps = 0, end = 0, far = 0;
  for (let i = 0; i < nums.length; i++) {       // bug: also processes the last index
    far = Math.max(far, i + nums[i]);
    if (i === end) { jumps++; end = far; }
  }
  return jumps;
}
// #endregion

for (const a of [[2, 3, 1, 1, 4], [3, 2, 1, 0, 4], [0], [2, 0, 0], [1, 0, 1]])
  console.log(`canJump(${JSON.stringify(a)}) = ${canJump(a)}   DP = ${canJumpDP(a)}`);
for (const a of [[2, 3, 1, 1, 4], [2, 3, 0, 1, 4], [0], [1, 2], [1, 1, 1, 1]])
  console.log(`jump(${JSON.stringify(a)}) = ${jump(a)}   wrong loop (i < n) = ${jumpWrong(a)}`);

// Greedy vs DP on random arrays (same pseudo-random numbers as the Java file).
let seed = 7;
const rnd = (m: number) => { seed = (seed * 48271) % 2147483647; return seed % m; };
let bad = 0;
for (let t = 0; t < 2000; t++) {
  const a = Array.from({ length: 1 + rnd(9) }, () => rnd(4));
  if (canJump(a) !== canJumpDP(a)) bad++;
}
console.log(`random check canJump vs DP: 2000 arrays, ${bad} mismatches`);
