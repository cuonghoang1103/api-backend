// @java: FindAnagrams.java
// LC 438 · Find All Anagrams in a String — fixed window of length |p| with 26 counts; compare in O(26) per step.

// #region giai
function findAnagrams(s: string, p: string): number[] {
  const m = p.length, res: number[] = [];
  if (m > s.length) return res;
  const need = new Array(26).fill(0), win = new Array(26).fill(0);
  for (const c of p) need[c.charCodeAt(0) - 97]++;
  const same = () => need.every((v, i) => v === win[i]);
  for (let r = 0; r < s.length; r++) {
    win[s.charCodeAt(r) - 97]++;                       // s[r] enters
    if (r >= m) win[s.charCodeAt(r - m) - 97]--;       // s[r - m] leaves: the window is s[r-m+1 .. r]
    if (r >= m - 1 && same()) res.push(r - m + 1);     // window start
  }
  return res;
}
// #endregion

for (const [s, p] of [['cbaebabacd', 'abc'], ['abab', 'ab'], ['a', 'ab'], ['aaaaa', 'aa']]) {
  console.log(`findAnagrams(${JSON.stringify(s)}, ${JSON.stringify(p)}) = ${JSON.stringify(findAnagrams(s, p))}`);
}
