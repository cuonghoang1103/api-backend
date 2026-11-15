// @java: LuPartitionLabels.java
// LC 763 Partition Labels — greedy: a part can close only when it has passed the LAST occurrence of every letter in it.

// #region giai
function partitionLabels(s: string): number[] {
  const last = new Array(26).fill(-1);
  for (let i = 0; i < s.length; i++) last[s.charCodeAt(i) - 97] = i;   // pass 1: last position of each letter
  const sizes: number[] = [];
  let start = 0, end = 0;
  for (let i = 0; i < s.length; i++) {                                 // pass 2: stretch the current part
    end = Math.max(end, last[s.charCodeAt(i) - 97]);
    if (i === end) {                                                   // every letter inside ends here: cut
      sizes.push(end - start + 1);
      start = i + 1;
    }
  }
  return sizes;
}
// #endregion

for (const s of ['abacdcdefe', 'aaaa', 'abc', 'abca', 'caedbdedda']) console.log(`partitionLabels("${s}") = ${JSON.stringify(partitionLabels(s))}`);

// Brute force: try every set of cut positions (2^(n-1)), keep the valid one with the most parts.
function brute(s: string): number {
  const n = s.length;
  let best = 0;
  for (let mask = 0; mask < 1 << (n - 1); mask++) {
    const part = new Array(n).fill(0);
    for (let i = 1; i < n; i++) part[i] = part[i - 1] + ((mask >> (i - 1)) & 1);
    const owner = new Map<string, number>();
    let ok = true;
    for (let i = 0; i < n && ok; i++) {
      const o = owner.get(s[i]);
      if (o === undefined) owner.set(s[i], part[i]); else if (o !== part[i]) ok = false;
    }
    if (ok) best = Math.max(best, part[n - 1] + 1);
  }
  return best;
}
let seed = 20261115;
const rnd = (m: number) => { seed = (seed * 48271) % 2147483647; return seed % m; };
let bad = 0;
for (let t = 0; t < 1500; t++) {
  const s = Array.from({ length: 1 + rnd(11) }, () => 'abcdef'[rnd(6)]).join('');
  const g = partitionLabels(s);
  if (g.length !== brute(s) || g.reduce((a, b) => a + b, 0) !== s.length) bad++;
}
console.log(`random self-test vs 2^(n-1) brute force: 1500 strings, ${bad} mismatches`);
