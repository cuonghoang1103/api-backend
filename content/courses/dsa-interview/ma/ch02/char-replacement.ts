// @java: CharReplacement.java
// LC 424 · Longest Repeating Character Replacement — window is valid while (length - count of its most frequent letter) <= k.

// #region giai
function characterReplacement(s: string, k: number): number {
  const cnt = new Array(26).fill(0);
  let l = 0, maxf = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    const c = s.charCodeAt(r) - 65;               // 'A'..'Z'
    cnt[c]++;
    maxf = Math.max(maxf, cnt[c]);                // most frequent letter seen in a window so far
    while (r - l + 1 - maxf > k) {                // letters to replace > k: shrink
      cnt[s.charCodeAt(l) - 65]--;
      l++;
    }
    best = Math.max(best, r - l + 1);
  }
  return best;
}
// #endregion

for (const [s, k] of [['ABAB', 2], ['AABABBA', 1], ['AAAA', 0], ['ABCDE', 1], ['BAAAB', 2]] as [string, number][]) {
  console.log(`characterReplacement(${JSON.stringify(s)}, ${k}) = ${characterReplacement(s, k)}`);
}
