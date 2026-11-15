// @java: GroupAnagrams.java
// LC 49 · Group Anagrams — the trick is choosing the KEY: two words belong together iff their keys are equal.

// #region sorted
function groupAnagrams(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();
  for (const w of strs) {
    const key = [...w].sort().join('');       // "eat" -> "aet"
    const g = groups.get(key);
    if (g) g.push(w); else groups.set(key, [w]);
  }
  return [...groups.values()];               // Map keeps insertion order
}
// #endregion

// #region count
function groupAnagramsCount(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();
  for (const w of strs) {
    const c = new Array(26).fill(0);
    for (const ch of w) c[ch.charCodeAt(0) - 97]++;
    const key = c.join('#');                  // "1#0#0#...": '#' keeps 1,11 apart from 11,1
    const g = groups.get(key);
    if (g) g.push(w); else groups.set(key, [w]);
  }
  return [...groups.values()];
}
// #endregion

const input = ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'];
console.log('sorted key :', JSON.stringify(groupAnagrams(input)));
console.log('count key  :', JSON.stringify(groupAnagramsCount(input)));
