// @java: Histogram.java
// LC 84 · Largest Rectangle in Histogram — increasing stack; a bar is "finished" when a lower bar arrives.

// #region giai
function largestRectangleArea(h: number[]): number {
  const st: number[] = [];                         // indices, heights increasing bottom -> top
  let best = 0;
  for (let i = 0; i <= h.length; i++) {
    const cur = i === h.length ? 0 : h[i];         // a sentinel bar of height 0 flushes the stack at the end
    while (st.length && cur < h[st[st.length - 1]]) {
      const height = h[st.pop()!];                 // this bar cannot extend to the right past i
      const left = st.length ? st[st.length - 1] : -1; // ... nor to the left past the new top
      best = Math.max(best, height * (i - left - 1));
    }
    st.push(i);
  }
  return best;
}
// #endregion

for (const h of [[2, 1, 5, 6, 2, 3], [2, 4], [6, 2, 5, 4, 5, 1, 6], [1, 1, 1, 1]]) {
  console.log(`${JSON.stringify(h)} -> ${largestRectangleArea(h)}`);
}
