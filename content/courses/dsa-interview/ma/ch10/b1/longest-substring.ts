// @java: LongestSubstring.java
// LC 3 — Longest Substring Without Repeating Characters: the problem of the "smooth" conversation in lesson 10.1.
// #region giai
function lengthOfLongestSubstring(s: string): number {
  const lastSeen = new Map<string, number>();   // character -> last index where it appeared
  let best = 0;
  let left = 0;                                  // window is s[left..right]
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    const prev = lastSeen.get(c);
    if (prev !== undefined && prev >= left) left = prev + 1;   // jump past the old copy
    lastSeen.set(c, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
// #endregion

for (const s of ['abcabcbb', 'bbbbb', 'pwwkew', '', 'abba', 'dvdf']) {
  console.log(`"${s}" -> ${lengthOfLongestSubstring(s)}`);
}
