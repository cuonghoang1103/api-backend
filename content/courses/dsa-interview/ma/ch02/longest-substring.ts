// @java: LongestSubstring.java
// LC 3 · Longest Substring Without Repeating Characters — brute force, window + Set, window + last-index map.

// #region brute
function lengthBrute(s: string): number {
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    const seen = new Set<string>();
    for (let j = i; j < s.length && !seen.has(s[j]); j++) {   // extend from every start until a repeat
      seen.add(s[j]);
      best = Math.max(best, j - i + 1);
    }
  }
  return best;
}
// #endregion

// #region set
function lengthOfLongestSubstring(s: string): number {
  const win = new Set<string>();      // characters currently inside s[l..r]
  let l = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    while (win.has(s[r])) {           // s[r] would repeat: shrink from the left until it no longer does
      win.delete(s[l]);
      l++;
    }
    win.add(s[r]);
    best = Math.max(best, r - l + 1); // the window is valid here, record it
  }
  return best;
}
// #endregion

// #region map
function lengthJump(s: string): number {
  const last = new Map<string, number>();   // character -> last index where it appeared
  let l = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    const p = last.get(s[r]);
    if (p !== undefined) l = Math.max(l, p + 1);   // jump past the old copy, but NEVER move l backwards
    last.set(s[r], r);
    best = Math.max(best, r - l + 1);
  }
  return best;
}
// #endregion

// #region sai
function lengthJumpBuggy(s: string): number {
  const last = new Map<string, number>();
  let l = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    const p = last.get(s[r]);
    if (p !== undefined) l = p + 1;                // BUG: an old copy left of l pulls l backwards
    last.set(s[r], r);
    best = Math.max(best, r - l + 1);
  }
  return best;
}
// #endregion

for (const s of ['abcabcbb', 'bbbbb', 'pwwkew', '', 'abba', 'tmmzuxt']) {
  console.log(`${JSON.stringify(s)}: set = ${lengthOfLongestSubstring(s)}, jump = ${lengthJump(s)}, brute = ${lengthBrute(s)}, jump without max = ${lengthJumpBuggy(s)}`);
}
