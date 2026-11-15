// @java: DailyTemperatures.java
// LC 739 · Daily Temperatures — brute force O(n^2) vs monotonic stack O(n).

// #region brute
function dailyBrute(t: number[]): number[] {
  const ans = new Array(t.length).fill(0);
  for (let i = 0; i < t.length; i++) {
    for (let j = i + 1; j < t.length; j++) {
      if (t[j] > t[i]) { ans[i] = j - i; break; }  // first warmer day to the right
    }
  }
  return ans;
}
// #endregion

// #region mono
function dailyTemperatures(t: number[]): number[] {
  const ans = new Array(t.length).fill(0);
  const st: number[] = [];                         // INDICES of days still waiting; temps decrease bottom -> top
  for (let i = 0; i < t.length; i++) {
    while (st.length && t[i] > t[st[st.length - 1]]) {
      const j = st.pop()!;                         // day i is the first warmer day for day j
      ans[j] = i - j;
    }
    st.push(i);                                    // day i now waits for its own warmer day
  }
  return ans;                                      // whoever is left in the stack keeps 0
}
// #endregion

for (const t of [[73, 74, 75, 71, 69, 72, 76, 73], [30, 40, 50, 60], [60, 50, 40], [70]]) {
  console.log(`${JSON.stringify(t)} -> ${JSON.stringify(dailyTemperatures(t))}   brute = ${JSON.stringify(dailyBrute(t))}`);
}
