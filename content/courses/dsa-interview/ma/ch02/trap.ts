// @java: Trap.java
// LC 42 · Trapping Rain Water — prefix/suffix max arrays O(n) memory, then two pointers O(1) memory.

// #region mang
function trapArrays(h: number[]): number {
  const n = h.length;
  const leftMax = new Array(n).fill(0), rightMax = new Array(n).fill(0);
  for (let i = 0; i < n; i++) leftMax[i] = Math.max(h[i], i > 0 ? leftMax[i - 1] : 0);
  for (let i = n - 1; i >= 0; i--) rightMax[i] = Math.max(h[i], i < n - 1 ? rightMax[i + 1] : 0);
  let water = 0;
  for (let i = 0; i < n; i++) water += Math.min(leftMax[i], rightMax[i]) - h[i];
  return water;
}
// #endregion

// #region two
function trap(h: number[]): number {
  let l = 0, r = h.length - 1, leftMax = 0, rightMax = 0, water = 0;
  while (l < r) {
    if (h[l] < h[r]) {
      // a wall at least h[r] exists on the right, so the LEFT side decides the level at l
      leftMax = Math.max(leftMax, h[l]);
      water += leftMax - h[l];
      l++;
    } else {
      rightMax = Math.max(rightMax, h[r]);
      water += rightMax - h[r];
      r--;
    }
  }
  return water;
}
// #endregion

for (const h of [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1], [4, 2, 0, 3, 2, 5], [3, 2, 1], [5]]) {
  console.log(`trap(${JSON.stringify(h)}) = ${trap(h)}   arrays = ${trapArrays(h)}`);
}
