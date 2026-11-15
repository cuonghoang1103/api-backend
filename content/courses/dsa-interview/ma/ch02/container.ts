// @java: Container.java
// LC 11 · Container With Most Water — brute O(n^2) vs two pointers O(n): always move the SHORTER wall.

// #region brute
function maxAreaBrute(h: number[]): number {
  let best = 0;
  for (let i = 0; i < h.length; i++)
    for (let j = i + 1; j < h.length; j++)
      best = Math.max(best, Math.min(h[i], h[j]) * (j - i));
  return best;
}
// #endregion

// #region two
function maxArea(h: number[]): number {
  let l = 0, r = h.length - 1, best = 0;
  while (l < r) {
    const area = Math.min(h[l], h[r]) * (r - l);   // water is limited by the shorter wall
    best = Math.max(best, area);
    if (h[l] < h[r]) l++;   // the short wall l can never do better with a closer partner
    else r--;               // tie: moving either side is safe
  }
  return best;
}
// #endregion

for (const h of [[1, 8, 6, 2, 5, 4, 8, 3, 7], [1, 1], [4, 3, 2, 1, 4], [1, 2, 4, 3]]) {
  console.log(`maxArea(${JSON.stringify(h)}) = ${maxArea(h)}   brute = ${maxAreaBrute(h)}`);
}
